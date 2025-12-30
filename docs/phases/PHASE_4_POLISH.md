# Phase 4: Polish & Integration (Week 7-8)

## 🎯 Objective

Complete the remaining features, add email services, file uploads, optimize performance, and finalize for production.

---

## 📋 Tasks

### 4.1 Notifications Module

- [ ] Create `Notification` entity
- [ ] Create `NotificationsController`
  - `GET /users/me/notifications` - Get user notifications
  - `PUT /users/me/notifications/:id/read` - Mark as read
  - `PUT /users/me/notifications/read-all` - Mark all as read
  - `DELETE /users/me/notifications/:id` - Delete notification
- [ ] Create `NotificationsService`
- [ ] Implement notification triggers throughout the app

**Notification Triggers:**

```typescript
// In DealsService - when deal approved
await this.notificationService.create({
  userId: deal.userId,
  title: 'Deal Approved! 🎉',
  message: `Your deal "${deal.title}" is now live.`,
  type: 'success',
});

// In DealsService - when deal rejected
await this.notificationService.create({
  userId: deal.userId,
  title: 'Deal Rejected',
  message: `Your deal "${deal.title}" was rejected. Reason: ${reason}`,
  type: 'error',
});

// In CommentsService - when new comment on user's deal
await this.notificationService.create({
  userId: deal.userId,
  title: 'New Comment',
  message: `${commenter.username} commented on your deal`,
  type: 'message',
});
```

### 4.2 Email Service

- [ ] Install email dependencies
  ```bash
  npm install @nestjs-modules/mailer nodemailer
  npm install -D @types/nodemailer
  ```
- [ ] Configure email provider (SendGrid/Mailgun/SMTP)
- [ ] Create email templates:
  - [ ] Email verification
  - [ ] Password reset
  - [ ] Welcome email
  - [ ] Deal approved notification
  - [ ] Deal rejected notification
- [ ] Create `MailService`

**Email Config:**

```typescript
// mail.config.ts
MailerModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    transport: {
      host: configService.get('MAIL_HOST'),
      port: configService.get('MAIL_PORT'),
      auth: {
        user: configService.get('MAIL_USER'),
        pass: configService.get('MAIL_PASS'),
      },
    },
    defaults: {
      from: '"Waferlee" <noreply@waferlee.com>',
    },
    template: {
      dir: join(__dirname, '../templates'),
      adapter: new HandlebarsAdapter(),
    },
  }),
  inject: [ConfigService],
});
```

### 4.3 Email Verification Flow

- [ ] Generate verification token on registration
- [ ] Send verification email
- [ ] Create `GET /auth/verify-email/:token` endpoint
- [ ] Update user `email_verified` field on success

### 4.4 Password Reset Flow

- [ ] Create `POST /auth/forgot-password` endpoint
- [ ] Generate reset token (expires in 1 hour)
- [ ] Send reset email with link
- [ ] Create `POST /auth/reset-password` endpoint
- [ ] Validate token and update password

### 4.5 File Upload

- [ ] Install multer
  ```bash
  npm install @nestjs/platform-express multer
  npm install -D @types/multer
  ```
- [ ] Configure file storage (local or S3/Cloudinary)
- [ ] Create `UploadController`
  - `POST /upload/image` - Upload deal/banner image
  - `POST /upload/avatar` - Upload user avatar
- [ ] Add file validation (size, type)
- [ ] Integrate with Deals module for image uploads

**Upload Config:**

```typescript
@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(new BadRequestException('Only image files allowed'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    })
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/images/${file.filename}` };
  }
}
```

### 4.6 Rate Limiting

- [ ] Install throttler
  ```bash
  npm install @nestjs/throttler
  ```
- [ ] Configure global rate limits
- [ ] Apply stricter limits to auth endpoints

**Throttler Config:**

```typescript
// app.module.ts
ThrottlerModule.forRoot({
  ttl: 60,        // Time window (seconds)
  limit: 100,     // Max requests per window
}),

// For auth endpoints
@Throttle(5, 60)  // 5 requests per 60 seconds
@Post('login')
async login() { ... }
```

### 4.7 API Documentation

- [ ] Complete Swagger documentation for all endpoints
- [ ] Add request/response examples
- [ ] Add authentication to Swagger UI
- [ ] Add API tags for grouping

**Swagger Setup:**

```typescript
// main.ts
const config = new DocumentBuilder()
  .setTitle('Waferlee API')
  .setDescription('Deals & Coupons Platform API')
  .setVersion('1.0')
  .addBearerAuth()
  .addTag('auth', 'Authentication endpoints')
  .addTag('deals', 'Deals management')
  .addTag('coupons', 'Coupons management')
  .addTag('admin', 'Admin endpoints')
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```

### 4.8 Error Handling

- [ ] Create global exception filter
- [ ] Standardize error response format
- [ ] Add request logging

**Standard Error Response:**

```typescript
{
  statusCode: 400,
  message: "Validation failed",
  errors: [
    { field: "email", message: "Invalid email format" }
  ],
  timestamp: "2025-12-25T15:00:00.000Z",
  path: "/api/auth/register"
}
```

### 4.9 Performance Optimization

- [ ] Add response caching for public endpoints
- [ ] Optimize database queries (eager loading)
- [ ] Add database query logging (for debugging)
- [ ] Implement cursor-based pagination for large datasets

### 4.10 Testing

- [ ] Write unit tests for services
- [ ] Write E2E tests for critical flows:
  - [ ] Auth flow (register → verify → login)
  - [ ] Deal submission flow
  - [ ] Voting flow
  - [ ] Admin moderation flow
- [ ] Set up test database

**E2E Test Example:**

```typescript
describe('AuthController (e2e)', () => {
  it('/auth/register (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!',
      })
      .expect(201);

    expect(response.body.user.email).toBe('test@example.com');
  });
});
```

### 4.11 Production Preparation

- [ ] Set up production environment variables
- [ ] Configure CORS properly
- [ ] Add helmet for security headers
- [ ] Set up health check endpoint
- [ ] Create Dockerfile
- [ ] Create docker-compose for production

**Environment Variables (.env.production):**

```env
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/waferlee

# JWT
JWT_SECRET=<strong-secret>
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=<strong-refresh-secret>
JWT_REFRESH_EXPIRES_IN=7d

# Email
MAIL_HOST=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USER=apikey
MAIL_PASS=<sendgrid-api-key>

# Frontend URL (for CORS)
FRONTEND_URL=https://waferlee.com

# File Storage
UPLOAD_PATH=./uploads
# Or for S3:
# AWS_S3_BUCKET=waferlee-uploads
# AWS_ACCESS_KEY_ID=xxx
# AWS_SECRET_ACCESS_KEY=xxx
```

### 4.12 Frontend Integration

- [ ] Update frontend API services to use real endpoints
- [ ] Remove mock data flags
- [ ] Test all user flows end-to-end
- [ ] Fix any integration issues

---

## ✅ Acceptance Criteria

1. **Notifications**: User receives notifications for key events
2. **Email**: Verification and password reset working
3. **Uploads**: Deal images upload and display correctly
4. **Rate Limiting**: Auth endpoints protected
5. **Documentation**: Swagger shows all endpoints
6. **Tests**: 80%+ coverage on critical paths
7. **Production**: App runs in Docker with all configs

---

## 🧪 Testing Checklist

```bash
# Test email verification
# 1. Register user
# 2. Check email for verification link
# 3. Click link
# 4. Verify user can now login

# Test password reset
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Upload image
curl -X POST http://localhost:3000/api/upload/image \
  -H "Authorization: Bearer <token>" \
  -F "file=@/path/to/image.jpg"

# Check rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
done
# Should get 429 Too Many Requests after 5 attempts

# Run tests
npm run test
npm run test:e2e
npm run test:cov
```

---

## 📁 Files to Create

```
backend/
├── src/
│   ├── modules/
│   │   ├── notifications/
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   └── entities/
│   │   │       └── notification.entity.ts
│   │   ├── mail/
│   │   │   ├── mail.module.ts
│   │   │   ├── mail.service.ts
│   │   │   └── templates/
│   │   │       ├── verification.hbs
│   │   │       ├── password-reset.hbs
│   │   │       └── welcome.hbs
│   │   └── upload/
│   │       ├── upload.module.ts
│   │       └── upload.controller.ts
│   └── common/
│       ├── filters/
│       │   └── all-exceptions.filter.ts
│       └── interceptors/
│           └── logging.interceptor.ts
├── test/
│   ├── auth.e2e-spec.ts
│   ├── deals.e2e-spec.ts
│   └── admin.e2e-spec.ts
├── Dockerfile
├── docker-compose.yml
└── docker-compose.prod.yml
```

---

## ⏱️ Time Estimate

| Task                     | Estimated Time         |
| ------------------------ | ---------------------- |
| Notifications Module     | 3 hours                |
| Email Service            | 4 hours                |
| Email Verification       | 2 hours                |
| Password Reset           | 2 hours                |
| File Upload              | 4 hours                |
| Rate Limiting            | 1 hour                 |
| API Documentation        | 3 hours                |
| Error Handling           | 2 hours                |
| Performance Optimization | 3 hours                |
| Testing                  | 8 hours                |
| Production Preparation   | 4 hours                |
| Frontend Integration     | 4 hours                |
| **Total**                | **~40 hours (5 days)** |

---

## 🎉 Completion Checklist

After Phase 4, verify:

- [ ] User can register → receive email → verify → login
- [ ] User can reset password via email
- [ ] User can submit deal with images
- [ ] Admin can approve/reject deals
- [ ] User receives notifications
- [ ] All API endpoints documented in Swagger
- [ ] Tests pass with good coverage
- [ ] App runs in Docker
- [ ] Frontend fully integrated with backend
- [ ] No mock data in production

---

## 🚀 Ready for Production!

Congratulations! After completing all 4 phases, the Waferlee backend is production-ready.

**Post-Launch Tasks:**

- Set up monitoring (Sentry, New Relic)
- Configure CDN for static assets
- Set up database backups
- Configure CI/CD pipeline
- Set up staging environment
