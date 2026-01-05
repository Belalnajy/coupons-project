import { SettingsService } from '../settings/settings.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';
import {
  VerificationCode,
  VerificationType,
} from './entities/verification-code.entity';
import { MailService } from '../mail/mail.service';
import {
  RegisterDto,
  LoginDto,
  TokenResponseDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ResendVerificationDto,
} from './dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(VerificationCode)
    private readonly verificationCodeRepository: Repository<VerificationCode>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly settingsService: SettingsService,
    private readonly mailService: MailService,
    private readonly httpService: HttpService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; email: string }> {
    const publicRegistration = await this.settingsService.getBool(
      'public_registration',
      true,
    );

    if (!publicRegistration) {
      throw new ForbiddenException(
        'Public registration is currently closed. Please contact an administrator.',
      );
    }

    // Verify reCAPTCHA
    if (registerDto.recaptchaToken) {
      const isHuman = await this.verifyRecaptcha(registerDto.recaptchaToken);
      if (!isHuman) {
        throw new BadRequestException('reCAPTCHA verification failed');
      }
    }

    // Check if user exists in User table
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const existingUsername = await this.usersService.findByUsername(
      registerDto.username,
    );
    if (existingUsername) {
      throw new BadRequestException('Username already taken');
    }

    // Hash password now to store in payload
    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    try {
      await this.sendVerificationCode(registerDto.email, {
        username: registerDto.username,
        passwordHash,
      });
    } catch (error) {
      this.logger.error(
        `Registration email failed for ${registerDto.email}`,
        error,
      );
      return {
        message:
          'We could not send the verification email. Please try again or contact support.',
        email: registerDto.email,
      };
    }

    return {
      message: 'Registration initiated. Please verify your email.',
      email: registerDto.email,
    };
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      user,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Your account has been suspended');
    }

    // Optional: Check if email is verified
    // if (!user.emailVerified) {
    //   throw new UnauthorizedException('Please verify your email address');
    // }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return new TokenResponseDto(tokens.accessToken, tokens.refreshToken, user);
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    const { email, code } = verifyEmailDto;

    const validCode = await this.validateVerificationCode(
      email,
      code,
      VerificationType.EMAIL_VERIFICATION,
    );

    if (!validCode) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    let user = await this.usersService.findByEmail(email);

    if (user) {
      if (user.emailVerified) {
        return { message: 'Email already verified' };
      }
      // Update existing unverified user (if they existed before this refactor)
      await this.usersService.update(user.id, {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      } as any);
    } else {
      // Create user from pending registration data
      if (!validCode.payload || !validCode.payload.username) {
        throw new BadRequestException(
          'Registration data not found. Please register again.',
        );
      }

      const newUser = this.userRepository.create({
        email: validCode.email,
        username: validCode.payload.username,
        passwordHash: validCode.payload.passwordHash,
        emailVerified: true,
        emailVerifiedAt: new Date(),
      });
      await this.userRepository.save(newUser);
    }

    // Delete used code
    await this.verificationCodeRepository.remove(validCode);

    return { message: 'Email verified successfully and account created.' };
  }

  async resendVerification(
    dto: ResendVerificationDto,
  ): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (user) {
      if (user.emailVerified) {
        throw new BadRequestException('Email already verified');
      }
      await this.sendVerificationCode(dto.email);
    } else {
      // Look for pending registration
      const pendingCode = await this.verificationCodeRepository.findOne({
        where: {
          email: dto.email,
          type: VerificationType.EMAIL_VERIFICATION,
        },
        order: { createdAt: 'DESC' },
      });

      if (!pendingCode || !pendingCode.payload) {
        throw new NotFoundException('Registration not found');
      }

      await this.sendVerificationCode(dto.email, pendingCode.payload);
    }

    return { message: 'Verification code sent' };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);

    if (user) {
      const code = this.generateOtp();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 mins

      // Delete existing codes of this type
      await this.verificationCodeRepository.delete({
        email: dto.email,
        type: VerificationType.PASSWORD_RESET,
      });

      await this.verificationCodeRepository.save({
        email: dto.email,
        code,
        type: VerificationType.PASSWORD_RESET,
        expiresAt,
      });

      await this.mailService.sendPasswordResetEmail(dto.email, code);
    }

    // Always return success to prevent enumeration
    return {
      message:
        'If an account with that email exists, you will receive a password reset link.',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const validCode = await this.validateVerificationCode(
      dto.email,
      dto.code,
      VerificationType.PASSWORD_RESET,
    );

    if (!validCode) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersService.updatePassword(user.id, dto.newPassword);

    // Delete used code
    await this.verificationCodeRepository.remove(validCode);

    // Optional: Revoke all sessions
    // await this.refreshTokenRepository.delete({ userId: user.id });

    return { message: 'Password has been reset successfully' };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<TokenResponseDto> {
    const user = await this.usersService.findOne(userId);

    // Revoke the used refresh token
    await this.refreshTokenRepository.update(
      { userId, token: refreshToken },
      { revokedAt: new Date() },
    );

    // Generate new tokens
    const tokens = await this.generateTokens(user);

    return new TokenResponseDto(tokens.accessToken, tokens.refreshToken, user);
  }

  async logout(userId: string): Promise<{ message: string }> {
    // Revoke all refresh tokens for the user
    await this.refreshTokenRepository.update(
      { userId, revokedAt: IsNull() },
      { revokedAt: new Date() },
    );

    return { message: 'Logged out successfully' };
  }

  async validateRefreshToken(userId: string, token: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: {
        userId,
        token,
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
    });

    return !!refreshToken;
  }

  private async generateTokens(
    user: User,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET', 'your-secret-key'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'your-refresh-secret',
      ),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_EXPIRES_IN',
        '7d',
      ) as any,
    });

    // Store refresh token in database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.refreshTokenRepository.save({
      userId: user.id,
      token: refreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  private async sendVerificationCode(
    email: string,
    payload?: any,
  ): Promise<void> {
    const code = this.generateOtp();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 mins

    // Delete existing codes of this type for this email
    await this.verificationCodeRepository.delete({
      email,
      type: VerificationType.EMAIL_VERIFICATION,
    });

    await this.verificationCodeRepository.save({
      email,
      code,
      type: VerificationType.EMAIL_VERIFICATION,
      expiresAt,
      payload,
    });

    await this.mailService.sendVerificationEmail(email, code);
  }

  private async validateVerificationCode(
    email: string,
    code: string,
    type: VerificationType,
  ): Promise<VerificationCode | null> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: {
        email,
        code,
        type,
        expiresAt: MoreThan(new Date()),
      },
    });

    return verificationCode;
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async verifyRecaptcha(token: string): Promise<boolean> {
    const secret = this.configService.get<string>('RECAPTCHA_SECRET_KEY');
    if (!secret) {
      this.logger.warn(
        'RECAPTCHA_SECRET_KEY is not set. Skipping verification.',
      );
      return true;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
        ),
      );

      return response.data.success;
    } catch (error) {
      this.logger.error('reCAPTCHA verification failed', error);
      return false;
    }
  }
}
