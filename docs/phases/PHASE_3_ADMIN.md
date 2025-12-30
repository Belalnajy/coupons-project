# Phase 3: Admin & Moderation (Week 5-6)

## 🎯 Objective

Build the admin panel APIs for content moderation, user management, and system settings.

---

## 📋 Tasks

### 3.1 Admin Module Setup

- [ ] Create `AdminModule` as a feature module
- [ ] Ensure all admin routes require `@Roles('admin')` or `@Roles('admin', 'moderator')`
- [ ] Create base admin controller structure

### 3.2 Admin Deals Management

- [ ] Create `AdminDealsController`
  - `GET /admin/deals` - List all deals (with status filter)
  - `GET /admin/deals/:id` - Get deal for review
  - `PUT /admin/deals/:id/approve` - Approve deal
  - `PUT /admin/deals/:id/reject` - Reject deal
  - `PUT /admin/deals/:id/toggle` - Enable/disable deal
  - `DELETE /admin/deals/:id` - Hard delete deal
  - `POST /admin/deals` - Create deal as admin

**Deal Approval Flow:**

```typescript
async approveDeal(dealId: string, adminId: string) {
  const deal = await this.dealRepo.findOne({ where: { id: dealId } });

  if (deal.status !== 'pending') {
    throw new BadRequestException('Deal is not pending');
  }

  deal.status = DealStatus.APPROVED;
  await this.dealRepo.save(deal);

  // Send notification to deal owner
  await this.notificationService.create({
    userId: deal.userId,
    title: 'Deal Approved! 🎉',
    message: `Your deal "${deal.title}" has been approved and is now live.`,
    type: 'success',
  });

  // Update user karma
  await this.userService.addKarma(deal.userId, 10);

  return deal;
}
```

### 3.3 Admin Users Management

- [ ] Create `AdminUsersController`
  - `GET /admin/users` - List all users (with status/role filter)
  - `GET /admin/users/:id` - Get user details
  - `POST /admin/users` - Create user
  - `PUT /admin/users/:id` - Update user
  - `PUT /admin/users/:id/suspend` - Suspend user
  - `PUT /admin/users/:id/activate` - Activate user
  - `DELETE /admin/users/:id` - Soft delete user

**User Status Change:**

```typescript
async suspendUser(userId: string, adminId: string) {
  const user = await this.userRepo.findOne({ where: { id: userId } });

  if (user.role === 'admin') {
    throw new ForbiddenException('Cannot suspend admin users');
  }

  user.status = UserStatus.SUSPENDED;
  await this.userRepo.save(user);

  // Optionally revoke all refresh tokens
  await this.refreshTokenRepo.delete({ userId });

  return user;
}
```

### 3.4 Admin Stores Management

- [ ] Create `AdminStoresController`
  - `GET /admin/stores` - List all stores
  - `POST /admin/stores` - Create store
  - `PUT /admin/stores/:id` - Update store
  - `PUT /admin/stores/:id/toggle` - Enable/disable store
  - `DELETE /admin/stores/:id` - Soft delete store

### 3.5 Admin Comments Moderation

- [ ] Create `AdminCommentsController`
  - `GET /admin/comments` - List all comments (with status filter)
  - `PUT /admin/comments/:id/approve` - Approve comment
  - `DELETE /admin/comments/:id` - Delete comment

### 3.6 Admin Voting Management

- [ ] Create `AdminVotingController`
  - `GET /admin/voting` - Voting analytics dashboard
  - `PUT /admin/voting/:dealId/freeze` - Freeze voting on deal
  - `PUT /admin/voting/:dealId/unfreeze` - Unfreeze voting

**Voting Analytics Response:**

```typescript
{
  totalVotes: 15432,
  hotVotes: 12500,
  coldVotes: 2932,
  hottestDeal: {
    id: 'uuid',
    title: 'PlayStation 5 Slim Console',
    temperature: 450
  },
  mostActiveDeals: [...],
  flaggedDeals: [...]  // Deals with suspicious voting patterns
}
```

### 3.7 Reports Module

- [ ] Create `Report` entity
- [ ] Create `ReportsController` (public)
  - `POST /reports` - Submit report
- [ ] Create `AdminReportsController`
  - `GET /admin/reports` - List all reports
  - `GET /admin/reports/:id` - Get report details
  - `PUT /admin/reports/:id/review` - Mark as reviewed

**Report Entity:**

```typescript
@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reporter_id' })
  reporterId: string;

  @Column({ type: 'enum', enum: ContentType, name: 'content_type' })
  contentType: ContentType;

  @Column({ name: 'content_id' })
  contentId: string;

  @Column()
  reason: string;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Column({ name: 'reviewed_by', nullable: true })
  reviewedBy: string;

  @Column({ name: 'reviewed_at', nullable: true })
  reviewedAt: Date;

  @Column({ nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
```

### 3.8 Banners Module

- [ ] Create `Banner` entity
- [ ] Create `BannersController` (public)
  - `GET /banners` - Get active banners by placement
- [ ] Create `AdminBannersController`
  - `GET /admin/banners` - List all banners
  - `POST /admin/banners` - Create banner
  - `PUT /admin/banners/:id` - Update banner
  - `DELETE /admin/banners/:id` - Delete banner

### 3.9 Settings Module

- [ ] Create `Setting` entity
- [ ] Create `AdminSettingsController`
  - `GET /admin/settings` - Get all settings
  - `PUT /admin/settings/:key` - Update setting

**Settings Structure:**

```typescript
// Key: 'general'
{
  dealsEnabled: true,
  couponsEnabled: true,
  maintenanceMode: false,
  platformName: 'Waferlee',
  contactEmail: 'admin@waferlee.com'
}

// Key: 'voting'
{
  hotDealThreshold: 100,
  voteCooldownHours: 24,
  whoCanVote: 'all'  // 'all' | 'verified' | 'elder'
}

// Key: 'registration'
{
  publicRegistration: true,
  autoApproveVerified: true
}
```

---

## ✅ Acceptance Criteria

1. **Deal Moderation**: Admins can approve/reject pending deals
2. **User Management**: Admins can create, edit, suspend users
3. **Store Management**: Full CRUD for stores
4. **Comment Moderation**: Approve pending, delete spam
5. **Voting Control**: Can freeze voting on flagged deals
6. **Reports**: Users can report, admins can review
7. **Banners**: Full CRUD with placement support
8. **Settings**: All platform settings configurable

---

## 🧪 Testing Checklist

```bash
# Get pending deals (admin only)
curl http://localhost:3000/api/admin/deals?status=pending \
  -H "Authorization: Bearer <admin_token>"

# Approve deal
curl -X PUT http://localhost:3000/api/admin/deals/<deal_id>/approve \
  -H "Authorization: Bearer <admin_token>"

# Suspend user
curl -X PUT http://localhost:3000/api/admin/users/<user_id>/suspend \
  -H "Authorization: Bearer <admin_token>"

# Submit report (any user)
curl -X POST http://localhost:3000/api/reports \
  -H "Authorization: Bearer <user_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "contentType": "deal",
    "contentId": "<deal_id>",
    "reason": "Suspicious link"
  }'

# Update settings
curl -X PUT http://localhost:3000/api/admin/settings/voting \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"hotDealThreshold": 150}'
```

---

## 📁 Files to Create

```
backend/src/modules/
├── admin/
│   ├── admin.module.ts
│   ├── controllers/
│   │   ├── admin-deals.controller.ts
│   │   ├── admin-users.controller.ts
│   │   ├── admin-stores.controller.ts
│   │   ├── admin-comments.controller.ts
│   │   ├── admin-voting.controller.ts
│   │   ├── admin-reports.controller.ts
│   │   ├── admin-banners.controller.ts
│   │   └── admin-settings.controller.ts
│   └── dto/
│       ├── approve-deal.dto.ts
│       ├── reject-deal.dto.ts
│       └── review-report.dto.ts
├── reports/
│   ├── reports.module.ts
│   ├── reports.controller.ts
│   ├── reports.service.ts
│   ├── entities/
│   │   └── report.entity.ts
│   └── dto/
│       ├── create-report.dto.ts
│       └── report-response.dto.ts
├── banners/
│   ├── banners.module.ts
│   ├── banners.controller.ts
│   ├── banners.service.ts
│   ├── entities/
│   │   └── banner.entity.ts
│   └── dto/
│       ├── create-banner.dto.ts
│       └── banner-response.dto.ts
└── settings/
    ├── settings.module.ts
    ├── settings.controller.ts
    ├── settings.service.ts
    └── entities/
        └── setting.entity.ts
```

---

## ⏱️ Time Estimate

| Task                | Estimated Time         |
| ------------------- | ---------------------- |
| Admin Module Setup  | 1 hour                 |
| Admin Deals         | 4 hours                |
| Admin Users         | 4 hours                |
| Admin Stores        | 2 hours                |
| Admin Comments      | 2 hours                |
| Admin Voting        | 3 hours                |
| Reports Module      | 4 hours                |
| Banners Module      | 3 hours                |
| Settings Module     | 3 hours                |
| Testing & Debugging | 6 hours                |
| **Total**           | **~32 hours (4 days)** |

---

## 🚀 Next Phase

After completing Phase 3, proceed to [Phase 4: Polish & Integration](./PHASE_4_POLISH.md)
