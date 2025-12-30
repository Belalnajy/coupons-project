import { SettingsService } from '../settings/settings.service';
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { RegisterDto, LoginDto, TokenResponseDto } from './dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    private readonly settingsService: SettingsService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ message: string; user: any }> {
    const publicRegistration = await this.settingsService.getBool(
      'public_registration',
      true,
    );

    if (!publicRegistration) {
      throw new ForbiddenException(
        'Public registration is currently closed. Please contact an administrator.',
      );
    }

    const user = await this.usersService.create({
      username: registerDto.username,
      email: registerDto.email,
      password: registerDto.password,
    });

    // TODO: Send verification email

    return {
      message: 'Registration successful. Please verify your email.',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
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

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return new TokenResponseDto(tokens.accessToken, tokens.refreshToken, user);
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

  // TODO: Implement password reset
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      // TODO: Generate reset token and send email
    }

    // Always return success to prevent email enumeration
    return {
      message:
        'If an account with that email exists, you will receive a password reset link.',
    };
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    // TODO: Implement password reset logic
    throw new BadRequestException('Password reset not implemented yet');
  }
}
