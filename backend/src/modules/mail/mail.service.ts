import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<string>('MAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const host = this.configService.get<string>('MAIL_HOST');
    const port = this.configService.get<number>('MAIL_PORT');
    this.logger.log(
      `Mail service initialized with host: ${host}, port: ${port}`,
    );
  }

  async sendVerificationEmail(email: string, code: string): Promise<void> {
    const from = `Waferlee <${this.configService.get<string>('MAIL_FROM')}>`;
    const subject = 'Verify your email address - Waferlee';
    const text = `Your verification code is: ${code}. This code will expire in 15 minutes.`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to Waferlee!</h2>
        <p>Your verification code is: <strong style="font-size: 24px; color: #d4af37;">${code}</strong></p>
        <p>Please enter this code on the verification page to activate your account.</p>
        <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to: email,
        subject,
        text,
        html,
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, code: string): Promise<void> {
    const from = `Waferlee <${this.configService.get<string>('MAIL_FROM')}>`;
    const subject = 'Reset your password - Waferlee';
    const text = `Your password reset code is: ${code}. This code will expire in 15 minutes.`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Your password reset code is: <strong style="font-size: 24px; color: #d4af37;">${code}</strong></p>
        <p>Use this code to reset your password. If you didn't request this, please ignore this email.</p>
        <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to: email,
        subject,
        text,
        html,
      });
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}`,
        error,
      );
      throw error;
    }
  }
}
