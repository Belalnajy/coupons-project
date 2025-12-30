import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole, UserStatus } from '../../../common/enums';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}

export class AdminUpdateUserDto extends UpdateUserDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}

export class UserResponseDto {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  level: string;
  karma: number;
  avatar: string;
  bio: string;
  emailVerified: boolean;
  createdAt: Date;

  constructor(user: any) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.role = user.role;
    this.status = user.status;
    this.level = user.level;
    this.karma = user.karma;
    this.avatar = user.avatar || user.avatarUrl;
    this.bio = user.bio;
    this.emailVerified = user.emailVerified;
    this.createdAt = user.createdAt;
  }
}

export class PublicUserDto {
  id: string;
  username: string;
  avatar: string;
  level: string;
  karma: number;

  constructor(user: any) {
    this.id = user.id;
    this.username = user.username;
    this.avatar = user.avatar || user.avatarUrl;
    this.level = user.level;
    this.karma = user.karma;
  }
}
