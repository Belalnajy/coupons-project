# Phase 2: Core Features (Week 3-4)

## 🎯 Objective

Implement the core business entities: Deals, Stores, Categories, Coupons, Comments, and Voting.

---

## 📋 Tasks

### 2.1 Categories Module

- [ ] Create `Category` entity

  ```typescript
  @Entity('categories')
  export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 100 })
    name: string;

    @Column({ unique: true, length: 100 })
    slug: string;

    @Column({ nullable: true })
    description: string;

    @Column({ name: 'sort_order', default: 0 })
    sortOrder: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }
  ```

- [x] Create `CategoriesController`
  - `GET /categories` - List all
  - `GET /categories/:slug` - Get by slug
- [x] Create `CategoriesService`
- [x] Seed initial categories (Electronics, Fashion, Home, Beauty, Travel, etc.)

### 2.2 Stores Module

- [x] Create `Store` entity
- [x] Create `StoresController`
  - `GET /stores` - List all (with pagination)
  - `GET /stores/:id` - Get by ID
  - `GET /stores/:id/deals` - Get deals from store
- [x] Create `StoresService`
- [x] Seed initial stores (Amazon, eBay, Noon, etc.)

### 2.3 Deals Module (Core)

- [x] Create `Deal` entity with all fields
- [x] Create `DealImage` entity
- [x] Create `DealsController`
  - `GET /deals` - List with filters
  - `GET /deals/:id` - Get single deal
  - `POST /deals` - Create deal (authenticated)
  - `PUT /deals/:id` - Update own deal
  - `DELETE /deals/:id` - Soft delete own deal
- [x] Create `DealsService`
  - `findAll(query)` - With pagination, sorting, filtering
  - `findOne(id)`
  - `create(userId, dto)`
  - `update(userId, id, dto)`
  - `remove(userId, id)`
- [x] Create DTOs:
  - `CreateDealDto`
  - `UpdateDealDto`
  - `DealQueryDto`
  - `DealResponseDto`

**DealQueryDto Example:**

```typescript
export class DealQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 12;

  @IsOptional()
  @IsEnum(['popular', 'newest', 'hottest', 'closing'])
  sort?: string = 'popular';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsUUID()
  store?: string;
}
```

**Sorting Logic:**

```typescript
switch (sort) {
  case 'newest':
    query.orderBy('deal.createdAt', 'DESC');
    break;
  case 'hottest':
    query.orderBy('deal.temperature', 'DESC');
    break;
  case 'closing':
    query.orderBy('deal.expiryDate', 'ASC');
    break;
  case 'popular':
  default:
    query.orderBy('deal.commentsCount', 'DESC');
}
```

### 2.4 Coupons Module

- [x] Create `Coupon` entity
- [x] Create `CouponsController`
  - `GET /coupons` - List with pagination
  - `GET /coupons/:id` - Get single
  - `POST /coupons/:id/use` - Track usage
- [x] Create `CouponsService`
- [x] Seed sample coupons

### 2.5 Comments Module

- [x] Create `Comment` entity
- [x] Create `CommentLike` entity (junction table)
- [x] Create `CommentsController`
  - `GET /deals/:id/comments` - Get deal comments
  - `POST /deals/:id/comments` - Add comment
  - `PUT /comments/:id` - Edit own comment
  - `DELETE /comments/:id` - Delete own comment
  - `POST /comments/:id/like` - Like comment
  - `DELETE /comments/:id/like` - Unlike comment
- [ ] Create `CommentsService`
- [ ] Implement ownership check for edit/delete

### 2.6 Votes Module

- [ ] Create `Vote` entity

  ```typescript
  @Entity('votes')
  @Unique(['userId', 'dealId'])
  export class Vote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @Column({ name: 'deal_id' })
    dealId: string;

    @Column({ type: 'enum', enum: VoteType })
    type: VoteType;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Deal)
    @JoinColumn({ name: 'deal_id' })
    deal: Deal;
  }
  ```

- [ ] Create `VotesController`
  - `POST /deals/:id/vote` - Cast vote
  - `DELETE /deals/:id/vote` - Remove vote
- [ ] Create `VotesService`
  - Implement vote change logic
  - Temperature update handled by DB trigger

**Vote Logic:**

```typescript
async vote(userId: string, dealId: string, type: VoteType) {
  const existingVote = await this.voteRepo.findOne({
    where: { userId, dealId }
  });

  if (existingVote) {
    if (existingVote.type === type) {
      // Same vote - remove it
      await this.voteRepo.remove(existingVote);
      return { action: 'removed' };
    } else {
      // Different vote - update it
      existingVote.type = type;
      await this.voteRepo.save(existingVote);
      return { action: 'changed' };
    }
  }

  // New vote
  const vote = this.voteRepo.create({ userId, dealId, type });
  await this.voteRepo.save(vote);
  return { action: 'created' };
}
```

### 2.7 User Dashboard Endpoints

- [x] Add to `UsersController`:
  - [x] `GET /users/me/stats` - Get user statistics
  - [x] `GET /users/me/deals` - Get user's deals
  - [x] `GET /users/me/votes` - Get user's votes

**User Stats Response:**

```typescript
{
  karma: 1240,
  level: 'gold',
  dealsCount: 28,
  commentsCount: 145,
  votesCount: 523,
  impactScore: 145
}
```

---

## ✅ Acceptance Criteria

1. **Deals**: CRUD operations working with proper authorization
2. **Pagination**: All list endpoints support page/limit
3. **Filtering**: Deals filterable by category, store, search
4. **Sorting**: Deals sortable by newest, hottest, popular, closing
5. **Voting**: Hot/Cold votes update temperature correctly
6. **Comments**: Users can CRUD their own comments
7. **Likes**: Comment likes working

---

## 🧪 Testing Checklist

```bash
# List deals
curl http://localhost:3000/api/deals?page=1&limit=10&sort=hottest

# Get single deal
curl http://localhost:3000/api/deals/<deal_id>

# Create deal (authenticated)
curl -X POST http://localhost:3000/api/deals \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Deal",
    "description": "Amazing test deal",
    "store": "amazon",
    "dealPrice": "99.99",
    "dealUrl": "https://amazon.com/test"
  }'

# Vote on deal
curl -X POST http://localhost:3000/api/deals/<deal_id>/vote \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"type": "hot"}'

# Add comment
curl -X POST http://localhost:3000/api/deals/<deal_id>/comments \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"text": "Great deal!"}'
```

---

## 📁 Files to Create

```
backend/src/modules/
├── categories/
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── entities/
│       └── category.entity.ts
├── stores/
│   ├── stores.module.ts
│   ├── stores.controller.ts
│   ├── stores.service.ts
│   └── entities/
│       └── store.entity.ts
├── deals/
│   ├── deals.module.ts
│   ├── deals.controller.ts
│   ├── deals.service.ts
│   ├── entities/
│   │   ├── deal.entity.ts
│   │   └── deal-image.entity.ts
│   ├── dto/
│   │   ├── create-deal.dto.ts
│   │   ├── update-deal.dto.ts
│   │   ├── deal-query.dto.ts
│   │   └── deal-response.dto.ts
│   └── services/
│       └── temperature-calculator.service.ts
├── coupons/
│   ├── coupons.module.ts
│   ├── coupons.controller.ts
│   ├── coupons.service.ts
│   └── entities/
│       └── coupon.entity.ts
├── comments/
│   ├── comments.module.ts
│   ├── comments.controller.ts
│   ├── comments.service.ts
│   └── entities/
│       ├── comment.entity.ts
│       └── comment-like.entity.ts
└── votes/
    ├── votes.module.ts
    ├── votes.controller.ts
    ├── votes.service.ts
    └── entities/
        └── vote.entity.ts
```

---

## ⏱️ Time Estimate

| Task                     | Estimated Time         |
| ------------------------ | ---------------------- |
| Categories Module        | 2 hours                |
| Stores Module            | 3 hours                |
| Deals Module             | 8 hours                |
| Coupons Module           | 3 hours                |
| Comments Module          | 4 hours                |
| Votes Module             | 4 hours                |
| User Dashboard Endpoints | 2 hours                |
| Testing & Debugging      | 6 hours                |
| **Total**                | **~32 hours (4 days)** |

---

## 🚀 Next Phase

After completing Phase 2, proceed to [Phase 3: Admin & Moderation](./PHASE_3_ADMIN.md)
