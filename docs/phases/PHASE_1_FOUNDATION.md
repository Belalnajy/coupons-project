# Phase 1: Foundation (Week 1-2)

## 🎯 Objective

Set up the backend infrastructure, database, and authentication system.

---

## 📋 Tasks

### 1.1 Project Setup

- [ ] Initialize NestJS project
  ```bash
  npx @nestjs/cli new backend
  cd backend
  ```
- [ ] Install core dependencies
  ```bash
  npm install @nestjs/config @nestjs/typeorm typeorm pg
  npm install @nestjs/passport passport passport-jwt passport-local
  npm install @nestjs/jwt bcrypt class-validator class-transformer
  npm install -D @types/passport-jwt @types/passport-local @types/bcrypt
  ```
- [ ] Configure environment variables (.env)
- [ ] Set up Docker Compose for PostgreSQL

### 1.2 Database Setup

- [ ] Create PostgreSQL database
- [ ] Run the complete SQL schema from implementation plan
- [ ] Verify all tables, indexes, and triggers are created
- [ ] Test database connection from NestJS

### 1.3 Project Structure

Create the following folder structure:

```
backend/src/
├── config/
├── common/
│   ├── decorators/
│   ├── guards/
│   ├── filters/
│   ├── interceptors/
│   └── pipes/
├── modules/
│   ├── auth/
│   └── users/
└── database/
```

### 1.4 Common Module

- [ ] Create `roles.decorator.ts`
- [ ] Create `current-user.decorator.ts`
- [ ] Create `public.decorator.ts`
- [ ] Create `jwt-auth.guard.ts`
- [ ] Create `roles.guard.ts`
- [ ] Create `http-exception.filter.ts`
- [ ] Create `transform.interceptor.ts`
- [ ] Create `validation.pipe.ts`

### 1.5 Users Module

- [ ] Create `User` entity matching database schema

  ```typescript
  // entities/user.entity.ts
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 50 })
    username: string;

    @Column({ unique: true, length: 255 })
    email: string;

    @Column({ name: 'password_hash' })
    passwordHash: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Column({ type: 'enum', enum: UserLevel, default: UserLevel.BRONZE })
    level: UserLevel;

    @Column({ default: 0 })
    karma: number;

    @Column({ name: 'avatar_url', nullable: true })
    avatarUrl: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ name: 'email_verified', default: false })
    emailVerified: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;
  }
  ```

- [ ] Create `UsersService` with basic CRUD
- [ ] Create `UsersRepository`
- [ ] Create DTOs:
  - `CreateUserDto`
  - `UpdateUserDto`
  - `UserResponseDto`

### 1.6 Auth Module

- [ ] Create `AuthController`
  - `POST /auth/register`
  - `POST /auth/login`
  - `POST /auth/refresh`
  - `POST /auth/logout`
- [ ] Create `AuthService`
  - `register(dto)`
  - `login(dto)`
  - `validateUser(email, password)`
  - `refreshTokens(refreshToken)`
  - `logout(userId)`
- [ ] Create JWT Strategy
- [ ] Create Refresh Token Strategy
- [ ] Create Local Strategy (for login)
- [ ] Create DTOs:
  - `RegisterDto`
  - `LoginDto`
  - `TokenResponseDto`
- [ ] Create `RefreshToken` entity
- [ ] Implement password hashing with bcrypt

### 1.7 API Documentation

- [ ] Install Swagger
  ```bash
  npm install @nestjs/swagger swagger-ui-express
  ```
- [ ] Configure Swagger in `main.ts`
- [ ] Add API decorators to auth endpoints

---

## ✅ Acceptance Criteria

1. **Database**: PostgreSQL running with all tables created
2. **Auth**: User can register and login
3. **JWT**: Access token (15min) + Refresh token (7d) working
4. **Guards**: Protected routes require valid JWT
5. **Roles**: Role decorator working (`@Roles('admin')`)
6. **Docs**: Swagger UI accessible at `/api/docs`

---

## 🧪 Testing Checklist

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"Test123!"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Access protected route
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <access_token>"

# Refresh token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refresh_token>"}'
```

---

## 📁 Files to Create

```
backend/src/
├── app.module.ts
├── main.ts
├── config/
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── env.validation.ts
├── common/
│   ├── decorators/
│   │   ├── roles.decorator.ts
│   │   ├── current-user.decorator.ts
│   │   └── public.decorator.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── interceptors/
│   │   └── transform.interceptor.ts
│   └── enums/
│       ├── user-role.enum.ts
│       ├── user-status.enum.ts
│       └── user-level.enum.ts
├── modules/
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── jwt-refresh.strategy.ts
│   │   │   └── local.strategy.ts
│   │   ├── guards/
│   │   │   └── local-auth.guard.ts
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   ├── login.dto.ts
│   │   │   └── token-response.dto.ts
│   │   └── entities/
│   │       └── refresh-token.entity.ts
│   └── users/
│       ├── users.module.ts
│       ├── users.controller.ts
│       ├── users.service.ts
│       ├── users.repository.ts
│       ├── entities/
│       │   └── user.entity.ts
│       └── dto/
│           ├── create-user.dto.ts
│           ├── update-user.dto.ts
│           └── user-response.dto.ts
└── database/
    └── schema.sql
```

---

## ⏱️ Time Estimate

| Task                | Estimated Time         |
| ------------------- | ---------------------- |
| Project Setup       | 2 hours                |
| Database Setup      | 2 hours                |
| Project Structure   | 1 hour                 |
| Common Module       | 3 hours                |
| Users Module        | 4 hours                |
| Auth Module         | 8 hours                |
| Testing & Debugging | 4 hours                |
| **Total**           | **~24 hours (3 days)** |

---

## 🚀 Next Phase

After completing Phase 1, proceed to [Phase 2: Core Features](./PHASE_2_CORE_FEATURES.md)
