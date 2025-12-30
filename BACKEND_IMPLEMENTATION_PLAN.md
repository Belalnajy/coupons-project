# Backend Development Analysis & Implementation Plan

## Executive Summary

This document provides a comprehensive analysis of the **Waferlee** deals/coupons platform frontend, extracting all requirements needed to build a production-ready backend with PostgreSQL and REST APIs.

---

## 1️⃣ Frontend Analysis Summary

### 1.1 Identified Entities

| Entity           | Description                                        | Relationships                                                         |
| ---------------- | -------------------------------------------------- | --------------------------------------------------------------------- |
| **User**         | Platform users with roles (user, admin, moderator) | Has many: Deals, Comments, Votes, Notifications                       |
| **Deal**         | User-submitted product deals                       | Belongs to: User, Store, Category; Has many: Comments, Votes, Reports |
| **Coupon**       | Discount codes with expiry                         | Belongs to: Store                                                     |
| **Comment**      | User comments on deals                             | Belongs to: User, Deal; Has many: Likes                               |
| **Vote**         | Hot/Cold voting on deals                           | Belongs to: User, Deal                                                |
| **Store**        | Retailer/merchant entities                         | Has many: Deals, Coupons                                              |
| **Category**     | Deal categories                                    | Has many: Deals                                                       |
| **Banner**       | Marketing/promotional banners                      | Self-contained                                                        |
| **Report**       | Flagged content reports                            | Belongs to: User (reporter); References: Deal/Comment                 |
| **Notification** | User notifications                                 | Belongs to: User                                                      |
| **Settings**     | System configuration                               | Single config entity                                                  |

### 1.2 User Roles & Permissions

```
┌─────────────────────────────────────────────────────────────┐
│                    ROLE HIERARCHY                           │
├─────────────────────────────────────────────────────────────┤
│  ADMIN                                                      │
│  ├── All permissions                                        │
│  ├── Manage users, stores, settings                         │
│  ├── Approve/reject deals                                   │
│  ├── Moderate comments                                      │
│  └── Content management (banners)                           │
│                                                             │
│  MODERATOR                                                  │
│  ├── Approve/reject deals                                   │
│  ├── Moderate comments                                      │
│  └── Review reports                                         │
│                                                             │
│  USER                                                       │
│  ├── Submit deals                                           │
│  ├── Post comments                                          │
│  ├── Vote on deals (hot/cold)                              │
│  ├── Edit own profile                                       │
│  └── Report content                                         │
│                                                             │
│  GUEST (Unauthenticated)                                    │
│  ├── View deals & coupons                                   │
│  ├── Search/filter content                                  │
│  └── Register/Login                                         │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Forms & User Actions Identified

| Form/Action         | Location                 | Fields                                                                                                                          | Backend Action             |
| ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| **Register**        | `/register`              | username, email, password, confirmPassword, terms                                                                               | `POST /auth/register`      |
| **Sign In**         | `/signin`                | email, password                                                                                                                 | `POST /auth/login`         |
| **Submit Deal**     | `/dashboard/submit-deal` | title, description, store, originalPrice, dealPrice, dealUrl, category, couponCode, expiryDate, deliveryAvailable, type, images | `POST /deals`              |
| **Admin Deal Form** | `/admin/deals/new`       | Same as Submit Deal                                                                                                             | `POST /admin/deals`        |
| **Edit User**       | `/admin/users/edit/:id`  | username, email, role, status, password                                                                                         | `PUT /admin/users/:id`     |
| **Edit Store**      | `/admin/stores/edit/:id` | name, websiteUrl, status, description, category, logoUrl                                                                        | `PUT /admin/stores/:id`    |
| **Banner Form**     | `/admin/content/*`       | title, imageUrl, link, placement, status, expiryDate                                                                            | `POST/PUT /admin/banners`  |
| **User Profile**    | `/dashboard/profile`     | username, email, bio, avatar                                                                                                    | `PUT /users/profile`       |
| **Post Comment**    | Deal Details             | text                                                                                                                            | `POST /deals/:id/comments` |
| **Vote**            | Deal Details             | type (hot/cold)                                                                                                                 | `POST /deals/:id/vote`     |
| **Report**          | Various                  | content, reason                                                                                                                 | `POST /reports`            |

### 1.4 Dynamic Data Sources

| Component                 | Data Source                  | API Endpoint                  |
| ------------------------- | ---------------------------- | ----------------------------- |
| Home Page - Deals Grid    | Paginated deals              | `GET /deals`                  |
| Home Page - Coupons       | Paginated coupons            | `GET /coupons`                |
| Deal Details              | Single deal + comments       | `GET /deals/:id`              |
| User Dashboard - Overview | User stats                   | `GET /users/me/stats`         |
| User Dashboard - My Deals | User's submitted deals       | `GET /users/me/deals`         |
| User Dashboard - Votes    | User's vote history          | `GET /users/me/votes`         |
| Admin - Deals Management  | All deals with status filter | `GET /admin/deals`            |
| Admin - Users             | All users                    | `GET /admin/users`            |
| Admin - Stores            | All stores                   | `GET /admin/stores`           |
| Admin - Voting            | Voting analytics             | `GET /admin/voting/analytics` |
| Admin - Reports           | All reports                  | `GET /admin/reports`          |
| Admin - Comments          | All comments for moderation  | `GET /admin/comments`         |

---

## 2️⃣ ERD (Entity Relationship Diagram)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                    DATABASE SCHEMA                                      │
└────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────────┐
                                    │     USERS        │
                                    ├──────────────────┤
                    ┌───────────────│ id (PK)          │───────────────┐
                    │               │ username         │               │
                    │               │ email            │               │
                    │               │ password_hash    │               │
                    │               │ role             │               │
                    │               │ status           │               │
                    │               │ level            │               │
                    │               │ karma            │               │
                    │               │ avatar_url       │               │
                    │               │ bio              │               │
                    │               │ email_verified   │               │
                    │               │ created_at       │               │
                    │               │ updated_at       │               │
                    │               │ deleted_at       │               │
                    │               └──────────────────┘               │
                    │                        │                         │
         ┌──────────┴──────────┐            │            ┌────────────┴──────────┐
         │                     │            │            │                       │
         ▼                     ▼            ▼            ▼                       ▼
┌──────────────────┐  ┌──────────────────┐  │   ┌──────────────────┐   ┌──────────────────┐
│      DEALS       │  │     COMMENTS     │  │   │      VOTES       │   │  NOTIFICATIONS   │
├──────────────────┤  ├──────────────────┤  │   ├──────────────────┤   ├──────────────────┤
│ id (PK)          │  │ id (PK)          │  │   │ id (PK)          │   │ id (PK)          │
│ user_id (FK)────►│  │ user_id (FK)─────┘   │ user_id (FK)─────┘   │ user_id (FK)─────┘
│ store_id (FK)    │  │ deal_id (FK)─────────│ deal_id (FK)     │   │ title            │
│ category_id (FK) │◄─│ text             │   │ type (hot/cold)  │   │ message          │
│ title            │  │ status           │   │ created_at       │   │ type             │
│ description      │  │ likes            │   └──────────────────┘   │ read             │
│ original_price   │  │ created_at       │                          │ created_at       │
│ deal_price       │  │ updated_at       │                          └──────────────────┘
│ discount_percent │  │ deleted_at       │
│ deal_url         │  └──────────────────┘
│ coupon_code      │
│ expiry_date      │          ┌──────────────────┐
│ deal_type        │          │     REPORTS      │
│ delivery_avail   │          ├──────────────────┤
│ status           │◄─────────│ id (PK)          │
│ is_enabled       │          │ reporter_id (FK) │───► Users
│ is_verified      │          │ content_type     │
│ trending         │          │ content_id (FK)──┘
│ hot_votes        │          │ reason           │
│ cold_votes       │          │ status           │
│ temperature      │          │ created_at       │
│ created_at       │          └──────────────────┘
│ updated_at       │
│ deleted_at       │
└──────────────────┘
         │
         │
         ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│     STORES       │         │   CATEGORIES     │         │     BANNERS      │
├──────────────────┤         ├──────────────────┤         ├──────────────────┤
│ id (PK)          │         │ id (PK)          │         │ id (PK)          │
│ name             │         │ name             │         │ title            │
│ website_url      │         │ slug             │         │ image_url        │
│ logo_url         │         │ description      │         │ link             │
│ description      │         │ created_at       │         │ placement        │
│ category         │         └──────────────────┘         │ status           │
│ status           │                                      │ expiry_date      │
│ deals_count      │                                      │ impressions      │
│ created_at       │                                      │ created_at       │
│ updated_at       │                                      │ updated_at       │
│ deleted_at       │                                      └──────────────────┘
└──────────────────┘
         │
         ▼
┌──────────────────┐         ┌──────────────────┐
│     COUPONS      │         │     SETTINGS     │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │         │ id (PK)          │
│ store_id (FK)────┘         │ key              │
│ title            │         │ value (JSONB)    │
│ code             │         │ updated_at       │
│ badge            │         │ updated_by (FK)  │
│ expires_in       │         └──────────────────┘
│ used_times       │
│ created_at       │
│ updated_at       │
│ deleted_at       │
└──────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ MANY-TO-MANY RELATIONSHIPS (Junction Tables)                                             │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                          │
│  ┌─────────────────────────┐   ┌─────────────────────────┐                              │
│  │    DEAL_IMAGES          │   │    COMMENT_LIKES        │                              │
│  ├─────────────────────────┤   ├─────────────────────────┤                              │
│  │ id (PK)                 │   │ id (PK)                 │                              │
│  │ deal_id (FK)            │   │ comment_id (FK)         │                              │
│  │ image_url               │   │ user_id (FK)            │                              │
│  │ sort_order              │   │ created_at              │                              │
│  │ created_at              │   └─────────────────────────┘                              │
│  └─────────────────────────┘                                                            │
│                                                                                          │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3️⃣ Database Schema (PostgreSQL)

```sql
-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending');
CREATE TYPE user_level AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE deal_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE deal_type AS ENUM ('online', 'instore', 'both');
CREATE TYPE comment_status AS ENUM ('pending', 'approved');
CREATE TYPE vote_type AS ENUM ('hot', 'cold');
CREATE TYPE store_status AS ENUM ('active', 'disabled');
CREATE TYPE banner_status AS ENUM ('active', 'draft', 'expired');
CREATE TYPE banner_placement AS ENUM ('home_top', 'sidebar', 'category_page', 'deals_top');
CREATE TYPE report_status AS ENUM ('pending', 'reviewed', 'resolved');
CREATE TYPE report_content_type AS ENUM ('deal', 'comment', 'user');
CREATE TYPE notification_type AS ENUM ('success', 'error', 'info', 'message');

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user' NOT NULL,
    status user_status DEFAULT 'active' NOT NULL,
    level user_level DEFAULT 'bronze' NOT NULL,
    karma INTEGER DEFAULT 0 NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status ON users(status) WHERE deleted_at IS NULL;

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================
-- STORES TABLE
-- ============================================
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    website_url VARCHAR(500) NOT NULL,
    logo_url VARCHAR(500),
    description TEXT,
    category VARCHAR(100) DEFAULT 'General',
    status store_status DEFAULT 'active' NOT NULL,
    deals_count INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_stores_name ON stores(name) WHERE deleted_at IS NULL;
CREATE INDEX idx_stores_status ON stores(status) WHERE deleted_at IS NULL;

-- ============================================
-- DEALS TABLE
-- ============================================
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    original_price DECIMAL(10, 2),
    deal_price DECIMAL(10, 2) NOT NULL,
    discount_percent INTEGER,
    deal_url VARCHAR(1000) NOT NULL,
    coupon_code VARCHAR(100),
    expiry_date TIMESTAMPTZ,
    deal_type deal_type DEFAULT 'online' NOT NULL,
    delivery_available BOOLEAN DEFAULT FALSE,
    status deal_status DEFAULT 'pending' NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    trending BOOLEAN DEFAULT FALSE,
    hot_votes INTEGER DEFAULT 0 NOT NULL,
    cold_votes INTEGER DEFAULT 0 NOT NULL,
    temperature INTEGER DEFAULT 0 NOT NULL,
    comments_count INTEGER DEFAULT 0 NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    voting_enabled BOOLEAN DEFAULT TRUE,
    voting_flagged BOOLEAN DEFAULT FALSE,
    decay_factor DECIMAL(3, 2) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_deals_user ON deals(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_store ON deals(store_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_category ON deals(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_status ON deals(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_temperature ON deals(temperature DESC) WHERE deleted_at IS NULL AND status = 'approved';
CREATE INDEX idx_deals_created ON deals(created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_trending ON deals(trending) WHERE deleted_at IS NULL AND trending = TRUE;

-- ============================================
-- DEAL IMAGES TABLE
-- ============================================
CREATE TABLE deal_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    image_url VARCHAR(1000) NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_deal_images_deal ON deal_images(deal_id);

-- ============================================
-- COUPONS TABLE
-- ============================================
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
    title VARCHAR(300) NOT NULL,
    code VARCHAR(100) NOT NULL,
    badge VARCHAR(50),
    expires_at TIMESTAMPTZ,
    used_times INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_coupons_store ON coupons(store_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_coupons_code ON coupons(code) WHERE deleted_at IS NULL;

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    status comment_status DEFAULT 'approved' NOT NULL,
    likes INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_comments_deal ON comments(deal_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_user ON comments(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_status ON comments(status) WHERE deleted_at IS NULL;

-- ============================================
-- COMMENT LIKES TABLE (Junction)
-- ============================================
CREATE TABLE comment_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(comment_id, user_id)
);

CREATE INDEX idx_comment_likes_comment ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user ON comment_likes(user_id);

-- ============================================
-- VOTES TABLE
-- ============================================
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    type vote_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, deal_id)
);

CREATE INDEX idx_votes_deal ON votes(deal_id);
CREATE INDEX idx_votes_user ON votes(user_id);
CREATE INDEX idx_votes_type ON votes(type);

-- ============================================
-- BANNERS TABLE
-- ============================================
CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    image_url VARCHAR(1000) NOT NULL,
    link VARCHAR(1000),
    placement banner_placement NOT NULL,
    status banner_status DEFAULT 'draft' NOT NULL,
    expiry_date TIMESTAMPTZ,
    impressions INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_banners_placement ON banners(placement);
CREATE INDEX idx_banners_status ON banners(status);

-- ============================================
-- REPORTS TABLE
-- ============================================
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_type report_content_type NOT NULL,
    content_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status report_status DEFAULT 'pending' NOT NULL,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_content ON reports(content_type, content_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read) WHERE read = FALSE;

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_by UUID REFERENCES users(id)
);

-- Default settings insert
INSERT INTO settings (key, value) VALUES
('general', '{"dealsEnabled": true, "couponsEnabled": true, "maintenanceMode": false, "platformName": "Waferlee", "contactEmail": "admin@waferlee.com"}'),
('voting', '{"hotDealThreshold": 100, "voteCooldownHours": 24, "whoCanVote": "all"}'),
('registration', '{"publicRegistration": true, "autoApproveVerified": true}'),
('social', '{"facebook": "", "twitter": "", "linkedin": ""}');

-- ============================================
-- REFRESH TOKENS TABLE (for JWT auth)
-- ============================================
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update deal temperature after vote
CREATE OR REPLACE FUNCTION update_deal_temperature()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE deals
    SET
        hot_votes = (SELECT COUNT(*) FROM votes WHERE deal_id = COALESCE(NEW.deal_id, OLD.deal_id) AND type = 'hot'),
        cold_votes = (SELECT COUNT(*) FROM votes WHERE deal_id = COALESCE(NEW.deal_id, OLD.deal_id) AND type = 'cold'),
        temperature = (
            SELECT COALESCE(SUM(CASE WHEN type = 'hot' THEN 1 ELSE -1 END), 0)
            FROM votes WHERE deal_id = COALESCE(NEW.deal_id, OLD.deal_id)
        )
    WHERE id = COALESCE(NEW.deal_id, OLD.deal_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_deal_temperature
AFTER INSERT OR UPDATE OR DELETE ON votes
FOR EACH ROW EXECUTE FUNCTION update_deal_temperature();

-- Update deal comments count
CREATE OR REPLACE FUNCTION update_deal_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE deals
    SET comments_count = (
        SELECT COUNT(*) FROM comments
        WHERE deal_id = COALESCE(NEW.deal_id, OLD.deal_id)
        AND deleted_at IS NULL
    )
    WHERE id = COALESCE(NEW.deal_id, OLD.deal_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comments_count
AFTER INSERT OR UPDATE OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_deal_comments_count();

-- Update store deals count
CREATE OR REPLACE FUNCTION update_store_deals_count()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.store_id IS NOT NULL THEN
        UPDATE stores
        SET deals_count = (
            SELECT COUNT(*) FROM deals
            WHERE store_id = NEW.store_id AND deleted_at IS NULL
        )
        WHERE id = NEW.store_id;
    END IF;
    IF OLD.store_id IS NOT NULL AND OLD.store_id != COALESCE(NEW.store_id, OLD.store_id) THEN
        UPDATE stores
        SET deals_count = (
            SELECT COUNT(*) FROM deals
            WHERE store_id = OLD.store_id AND deleted_at IS NULL
        )
        WHERE id = OLD.store_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_store_deals_count
AFTER INSERT OR UPDATE OR DELETE ON deals
FOR EACH ROW EXECUTE FUNCTION update_store_deals_count();
```

---

## 4️⃣ Backend Requirements (REST API)

### 4.1 Authentication Endpoints

| Method | Endpoint                        | Description            | Auth   |
| ------ | ------------------------------- | ---------------------- | ------ |
| `POST` | `/api/auth/register`            | User registration      | Public |
| `POST` | `/api/auth/login`               | User login             | Public |
| `POST` | `/api/auth/refresh`             | Refresh access token   | Public |
| `POST` | `/api/auth/logout`              | Logout (revoke tokens) | User   |
| `POST` | `/api/auth/forgot-password`     | Request password reset | Public |
| `POST` | `/api/auth/reset-password`      | Reset password         | Public |
| `GET`  | `/api/auth/verify-email/:token` | Verify email           | Public |

**Request/Response Examples:**

```json
// POST /api/auth/register
// Request:
{
  "username": "DealsHunter",
  "email": "user@example.com",
  "password": "SecurePass123"
}
// Response (201):
{
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": "uuid",
    "username": "DealsHunter",
    "email": "user@example.com"
  }
}

// POST /api/auth/login
// Request:
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
// Response (200):
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "username": "DealsHunter",
    "email": "user@example.com",
    "role": "user",
    "avatar": "/avatar.png"
  }
}
```

---

### 4.2 Deals Endpoints

| Method   | Endpoint                  | Description                      | Auth         |
| -------- | ------------------------- | -------------------------------- | ------------ |
| `GET`    | `/api/deals`              | List deals (paginated, filtered) | Public       |
| `GET`    | `/api/deals/:id`          | Get deal details                 | Public       |
| `POST`   | `/api/deals`              | Create deal (user submission)    | User         |
| `PUT`    | `/api/deals/:id`          | Update own deal                  | User (owner) |
| `DELETE` | `/api/deals/:id`          | Soft delete own deal             | User (owner) |
| `POST`   | `/api/deals/:id/vote`     | Vote on deal                     | User         |
| `DELETE` | `/api/deals/:id/vote`     | Remove vote                      | User         |
| `GET`    | `/api/deals/:id/comments` | Get deal comments                | Public       |
| `POST`   | `/api/deals/:id/comments` | Add comment                      | User         |

**Query Parameters for `GET /api/deals`:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)
- `sort` (string): `popular`, `newest`, `hottest`, `closing`
- `search` (string): Search term
- `category` (string): Category slug
- `store` (string): Store ID

**Request/Response Examples:**

```json
// POST /api/deals
// Request:
{
  "title": "Samsung Galaxy S24 Ultra - 50% Off",
  "description": "Amazing deal on the latest Samsung flagship...",
  "store": "amazon",
  "originalPrice": "1199.99",
  "dealPrice": "599.99",
  "dealUrl": "https://amazon.com/...",
  "category": "electronics",
  "couponCode": "SUMMER50",
  "expiryDate": "2025-01-15T23:59:59Z",
  "deliveryAvailable": true,
  "type": "online"
}
// Response (201):
{
  "id": "uuid",
  "title": "Samsung Galaxy S24 Ultra - 50% Off",
  "status": "pending",
  "message": "Deal submitted for review"
}

// POST /api/deals/:id/vote
// Request:
{
  "type": "hot"
}
// Response (200):
{
  "hotVotes": 145,
  "coldVotes": 12,
  "temperature": 133,
  "userVote": "hot"
}
```

---

### 4.3 Coupons Endpoints

| Method | Endpoint               | Description              | Auth   |
| ------ | ---------------------- | ------------------------ | ------ |
| `GET`  | `/api/coupons`         | List coupons (paginated) | Public |
| `GET`  | `/api/coupons/:id`     | Get coupon details       | Public |
| `POST` | `/api/coupons/:id/use` | Track coupon usage       | Public |

---

### 4.4 Comments Endpoints

| Method   | Endpoint                 | Description        | Auth         |
| -------- | ------------------------ | ------------------ | ------------ |
| `PUT`    | `/api/comments/:id`      | Update own comment | User (owner) |
| `DELETE` | `/api/comments/:id`      | Delete own comment | User (owner) |
| `POST`   | `/api/comments/:id/like` | Like a comment     | User         |
| `DELETE` | `/api/comments/:id/like` | Unlike a comment   | User         |

---

### 4.5 User Endpoints

| Method | Endpoint                           | Description              | Auth |
| ------ | ---------------------------------- | ------------------------ | ---- |
| `GET`  | `/api/users/me`                    | Get current user profile | User |
| `PUT`  | `/api/users/me`                    | Update profile           | User |
| `PUT`  | `/api/users/me/password`           | Change password          | User |
| `PUT`  | `/api/users/me/avatar`             | Update avatar            | User |
| `GET`  | `/api/users/me/stats`              | Get user statistics      | User |
| `GET`  | `/api/users/me/deals`              | Get user's deals         | User |
| `GET`  | `/api/users/me/votes`              | Get user's vote history  | User |
| `GET`  | `/api/users/me/notifications`      | Get notifications        | User |
| `PUT`  | `/api/users/me/notifications/read` | Mark all as read         | User |

---

### 4.6 Stores Endpoints

| Method | Endpoint                | Description          | Auth   |
| ------ | ----------------------- | -------------------- | ------ |
| `GET`  | `/api/stores`           | List stores          | Public |
| `GET`  | `/api/stores/:id`       | Get store details    | Public |
| `GET`  | `/api/stores/:id/deals` | Get deals from store | Public |

---

### 4.7 Reports Endpoints

| Method | Endpoint       | Description     | Auth |
| ------ | -------------- | --------------- | ---- |
| `POST` | `/api/reports` | Submit a report | User |

```json
// POST /api/reports
// Request:
{
  "contentType": "deal",
  "contentId": "uuid-of-deal",
  "reason": "Suspicious link / Potential scam"
}
```

---

### 4.8 Admin Endpoints

| Method       | Endpoint                          | Description                 | Auth      |
| ------------ | --------------------------------- | --------------------------- | --------- |
| **Deals**    |                                   |                             |
| `GET`        | `/api/admin/deals`                | List all deals with filters | Admin/Mod |
| `GET`        | `/api/admin/deals/:id`            | Get deal for review         | Admin/Mod |
| `PUT`        | `/api/admin/deals/:id/approve`    | Approve deal                | Admin/Mod |
| `PUT`        | `/api/admin/deals/:id/reject`     | Reject deal                 | Admin/Mod |
| `PUT`        | `/api/admin/deals/:id/toggle`     | Enable/disable deal         | Admin/Mod |
| `DELETE`     | `/api/admin/deals/:id`            | Delete deal                 | Admin     |
| `POST`       | `/api/admin/deals`                | Create deal (admin)         | Admin     |
| **Voting**   |                                   |                             |
| `GET`        | `/api/admin/voting`               | Voting analytics            | Admin     |
| `PUT`        | `/api/admin/voting/:id/freeze`    | Freeze/unfreeze voting      | Admin     |
| **Users**    |                                   |                             |
| `GET`        | `/api/admin/users`                | List all users              | Admin     |
| `GET`        | `/api/admin/users/:id`            | Get user details            | Admin     |
| `POST`       | `/api/admin/users`                | Create user                 | Admin     |
| `PUT`        | `/api/admin/users/:id`            | Update user                 | Admin     |
| `PUT`        | `/api/admin/users/:id/suspend`    | Suspend user                | Admin     |
| `PUT`        | `/api/admin/users/:id/activate`   | Activate user               | Admin     |
| `DELETE`     | `/api/admin/users/:id`            | Delete user                 | Admin     |
| **Stores**   |                                   |                             |
| `GET`        | `/api/admin/stores`               | List all stores             | Admin     |
| `POST`       | `/api/admin/stores`               | Create store                | Admin     |
| `PUT`        | `/api/admin/stores/:id`           | Update store                | Admin     |
| `PUT`        | `/api/admin/stores/:id/toggle`    | Enable/disable store        | Admin     |
| `DELETE`     | `/api/admin/stores/:id`           | Delete store                | Admin     |
| **Comments** |                                   |                             |
| `GET`        | `/api/admin/comments`             | List all comments           | Admin/Mod |
| `PUT`        | `/api/admin/comments/:id/approve` | Approve comment             | Admin/Mod |
| `DELETE`     | `/api/admin/comments/:id`         | Delete comment              | Admin/Mod |
| **Reports**  |                                   |                             |
| `GET`        | `/api/admin/reports`              | List all reports            | Admin/Mod |
| `GET`        | `/api/admin/reports/:id`          | Get report details          | Admin/Mod |
| `PUT`        | `/api/admin/reports/:id/review`   | Mark as reviewed            | Admin/Mod |
| **Banners**  |                                   |                             |
| `GET`        | `/api/admin/banners`              | List all banners            | Admin     |
| `POST`       | `/api/admin/banners`              | Create banner               | Admin     |
| `PUT`        | `/api/admin/banners/:id`          | Update banner               | Admin     |
| `DELETE`     | `/api/admin/banners/:id`          | Delete banner               | Admin     |
| **Settings** |                                   |                             |
| `GET`        | `/api/admin/settings`             | Get all settings            | Admin     |
| `PUT`        | `/api/admin/settings/:key`        | Update setting              | Admin     |

---

## 5️⃣ Business Logic & Rules

### 5.1 Deal Status Transitions

```
┌─────────────┐     Admin/Mod      ┌─────────────┐
│   PENDING   │ ─────approve()────►│  APPROVED   │
│             │                    │             │
│  (default)  │                    │ (visible to │
│             │                    │   public)   │
└─────────────┘                    └─────────────┘
       │                                  │
       │ Admin/Mod                        │ Admin
       │ reject()                         │ disable()
       ▼                                  ▼
┌─────────────┐                    ┌─────────────┐
│  REJECTED   │                    │  DISABLED   │
│             │                    │ is_enabled  │
│ (hidden)    │                    │  = false    │
└─────────────┘                    └─────────────┘
```

### 5.2 Voting Logic

```typescript
// Temperature Calculation
temperature = (hot_votes - cold_votes) * decay_factor;

// Decay Factor (reduces over time)
decay_factor = max(0.5, 1.0 - days_since_post * 0.01);

// "Hot" Badge Threshold (configurable)
isHot = temperature >= settings.hotDealThreshold; // default: 100

// Vote Cooldown
// Users cannot change their vote on the same deal within voteCooldownHours

// Who Can Vote (configurable)
// - "all": Any registered user
// - "verified": Only email-verified users
// - "elder": Only users with level >= 'silver'
```

### 5.3 User Level Progression

```typescript
// Karma-based level progression
function getUserLevel(karma: number): UserLevel {
  if (karma >= 5000) return 'platinum';
  if (karma >= 1000) return 'gold';
  if (karma >= 200) return 'silver';
  return 'bronze';
}

// Karma earning rules
// +10: Deal approved
// +1: Comment posted
// +1: Vote received on own deal
// +5: Deal reaches "Hot" status
// -5: Deal rejected
// -10: User receives warning
```

### 5.4 Comment Moderation

- Comments posted by Bronze users -> `status = 'pending'`
- Comments posted by Silver+ users -> `status = 'approved'` (if `autoApproveVerified` is true)
- Admin can approve pending comments
- Deleted comments are soft-deleted

### 5.5 Notification Triggers

| Event                     | Notification Type | Recipient  |
| ------------------------- | ----------------- | ---------- |
| Deal approved             | success           | Deal owner |
| Deal rejected             | error             | Deal owner |
| New comment on owned deal | message           | Deal owner |
| Report reviewed           | info              | Reporter   |

---

## 6️⃣ Integration Plan

### 6.1 Frontend-Backend Mapping

| Frontend Screen        | Component           | API Endpoints                                                                 | Error Handling                       |
| ---------------------- | ------------------- | ----------------------------------------------------------------------------- | ------------------------------------ |
| **Home**               | `Home.tsx`          | `GET /deals?limit=8&sort=hottest`, `GET /coupons?limit=10`                    | Show skeleton, then fallback message |
| **Deals List**         | `Deals.tsx`         | `GET /deals?page=X&sort=Y&search=Z`                                           | Pagination error, empty state        |
| **Deal Details**       | `DealsDetails.tsx`  | `GET /deals/:id`, `POST /deals/:id/vote`, `GET /deals/:id/comments`           | 404 Not Found, vote conflict         |
| **Register**           | `Register.tsx`      | `POST /auth/register`                                                         | Validation errors (409 duplicate)    |
| **Sign In**            | `Signin.tsx`        | `POST /auth/login`                                                            | 401 Unauthorized                     |
| **Submit Deal**        | `SubmitDeal.tsx`    | `POST /deals`                                                                 | Validation errors, 401               |
| **Dashboard Overview** | `Overview.tsx`      | `GET /users/me/stats`                                                         | Auth redirect                        |
| **My Deals**           | `MyDeals.tsx`       | `GET /users/me/deals`                                                         | Empty state                          |
| **My Votes**           | `Votes.tsx`         | `GET /users/me/votes`                                                         | Empty state                          |
| **Notifications**      | `Notifications.tsx` | `GET /users/me/notifications`                                                 | Empty state                          |
| **Profile**            | `UserProfile.tsx`   | `GET /users/me`, `PUT /users/me`                                              | Validation errors                    |
| **Admin Deals**        | `AdminDeals.tsx`    | `GET /admin/deals`, `PUT /admin/deals/:id/approve`, `DELETE /admin/deals/:id` | 403 Forbidden                        |
| **Admin Users**        | `AdminUsers.tsx`    | `GET /admin/users`, `PUT /admin/users/:id/suspend`                            | 403 Forbidden                        |
| **Admin Stores**       | `AdminStores.tsx`   | `GET /admin/stores`, `POST /admin/stores`                                     | Validation errors                    |
| **Admin Voting**       | `AdminVoting.tsx`   | `GET /admin/voting`, `PUT /admin/voting/:id/freeze`                           | 403 Forbidden                        |
| **Admin Reports**      | `AdminReports.tsx`  | `GET /admin/reports`, `PUT /admin/reports/:id/review`                         | 403 Forbidden                        |
| **Admin Comments**     | `AdminComments.tsx` | `GET /admin/comments`, `PUT /admin/comments/:id/approve`                      | 403 Forbidden                        |
| **Admin Content**      | `AdminContent.tsx`  | `GET /admin/banners`, `POST /admin/banners`                                   | Validation errors                    |
| **Admin Settings**     | `AdminSettings.tsx` | `GET /admin/settings`, `PUT /admin/settings/:key`                             | 403 Forbidden                        |

### 6.2 Missing/Ambiguous Frontend Requirements

> [!WARNING]
> The following items need clarification or additional frontend work:

1. **Image Upload**: Deal submission has image upload UI but no actual upload logic implemented
2. **Password Reset**: "Forgot Password" link exists but no corresponding page
3. **Email Verification**: No UI for email verification flow
4. **Category Management**: Admin panel doesn't have category CRUD (only in deal form)
5. **Coupon Management**: No admin CRUD for coupons currently
6. **Search in Coupons**: No search input in coupons page
7. **Share Functionality**: Social share buttons are placeholders
8. **Expiry Date Display**: Needs backend calculation for "Expires in X hours"

---

## 7️⃣ Backend Architecture Recommendation

### 7.1 Technology Stack

```
Backend Framework:    Node.js + NestJS (TypeScript)
Database:            PostgreSQL 15+
ORM:                 Prisma or TypeORM
Authentication:      JWT (access + refresh tokens)
Password Hashing:    bcrypt
Validation:          class-validator + class-transformer
File Upload:         Multer + S3/Cloudinary
Email:               Nodemailer + SendGrid/Mailgun
Cache:               Redis (optional, for rate limiting)
Documentation:       Swagger/OpenAPI
Testing:             Jest + Supertest
```

### 7.2 Folder Structure

```
backend/
├── src/
│   ├── main.ts                         # Application entry point
│   ├── app.module.ts                   # Root module
│   │
│   ├── config/                         # Configuration
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── env.validation.ts
│   │
│   ├── common/                         # Shared utilities
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── utils/
│   │       ├── pagination.ts
│   │       └── slug.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── jwt-refresh.strategy.ts
│   │   │   ├── dto/
│   │   │   │   ├── register.dto.ts
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── token-response.dto.ts
│   │   │   └── guards/
│   │   │       └── local-auth.guard.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.module.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.repository.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       ├── update-user.dto.ts
│   │   │       └── user-response.dto.ts
│   │   │
│   │   ├── deals/
│   │   │   ├── deals.module.ts
│   │   │   ├── deals.controller.ts
│   │   │   ├── deals.service.ts
│   │   │   ├── deals.repository.ts
│   │   │   ├── entities/
│   │   │   │   ├── deal.entity.ts
│   │   │   │   └── deal-image.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-deal.dto.ts
│   │   │   │   ├── update-deal.dto.ts
│   │   │   │   ├── deal-query.dto.ts
│   │   │   │   └── deal-response.dto.ts
│   │   │   └── services/
│   │   │       └── temperature-calculator.service.ts
│   │   │
│   │   ├── coupons/
│   │   │   ├── coupons.module.ts
│   │   │   ├── coupons.controller.ts
│   │   │   ├── coupons.service.ts
│   │   │   ├── entities/
│   │   │   │   └── coupon.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── comments/
│   │   │   ├── comments.module.ts
│   │   │   ├── comments.controller.ts
│   │   │   ├── comments.service.ts
│   │   │   ├── entities/
│   │   │   │   ├── comment.entity.ts
│   │   │   │   └── comment-like.entity.ts
│   │   │   └── dto/
│   │   │
│   │   ├── votes/
│   │   │   ├── votes.module.ts
│   │   │   ├── votes.controller.ts
│   │   │   ├── votes.service.ts
│   │   │   └── entities/
│   │   │       └── vote.entity.ts
│   │   │
│   │   ├── stores/
│   │   │   ├── stores.module.ts
│   │   │   ├── stores.controller.ts
│   │   │   ├── stores.service.ts
│   │   │   └── entities/
│   │   │
│   │   ├── categories/
│   │   │   ├── categories.module.ts
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   └── entities/
│   │   │
│   │   ├── banners/
│   │   │   ├── banners.module.ts
│   │   │   ├── banners.controller.ts
│   │   │   ├── banners.service.ts
│   │   │   └── entities/
│   │   │
│   │   ├── reports/
│   │   │   ├── reports.module.ts
│   │   │   ├── reports.controller.ts
│   │   │   ├── reports.service.ts
│   │   │   └── entities/
│   │   │
│   │   ├── notifications/
│   │   │   ├── notifications.module.ts
│   │   │   ├── notifications.controller.ts
│   │   │   ├── notifications.service.ts
│   │   │   └── entities/
│   │   │
│   │   ├── settings/
│   │   │   ├── settings.module.ts
│   │   │   ├── settings.controller.ts
│   │   │   ├── settings.service.ts
│   │   │   └── entities/
│   │   │
│   │   └── admin/
│   │       ├── admin.module.ts
│   │       ├── admin-deals.controller.ts
│   │       ├── admin-users.controller.ts
│   │       ├── admin-stores.controller.ts
│   │       ├── admin-comments.controller.ts
│   │       ├── admin-reports.controller.ts
│   │       ├── admin-banners.controller.ts
│   │       ├── admin-settings.controller.ts
│   │       └── admin-voting.controller.ts
│   │
│   └── database/
│       ├── migrations/
│       ├── seeds/
│       │   └── seed.ts
│       └── prisma/
│           └── schema.prisma
│
├── test/
│   ├── auth.e2e-spec.ts
│   ├── deals.e2e-spec.ts
│   └── admin.e2e-spec.ts
│
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package.json
└── tsconfig.json
```

### 7.3 Key Middleware

1. **JWT Authentication Guard**: Validates access tokens
2. **Roles Guard**: Enforces role-based access (`@Roles('admin')`)
3. **Rate Limiter**: Prevents abuse (especially on auth and voting)
4. **Request Logger**: Logs all API requests
5. **Validation Pipe**: Validates DTOs using class-validator
6. **Transform Interceptor**: Standardizes response format

---

## 8️⃣ Final Deliverables

### 8.1 Integration Checklist

- [ ] **Authentication**

  - [ ] User registration with email validation
  - [ ] User login with JWT
  - [ ] Token refresh mechanism
  - [ ] Password reset flow
  - [ ] Email verification

- [ ] **Deals**

  - [ ] List deals with pagination, sorting, filtering
  - [ ] Deal detail page data
  - [ ] Deal submission (user)
  - [ ] Deal CRUD (admin)
  - [ ] Deal approval workflow
  - [ ] Deal enable/disable toggle

- [ ] **Voting**

  - [ ] Hot/Cold vote on deals
  - [ ] Vote count and temperature calculation
  - [ ] Vote change/removal
  - [ ] Voting freeze (admin)

- [ ] **Comments**

  - [ ] Post comment on deal
  - [ ] Edit/delete own comments
  - [ ] Like comments
  - [ ] Comment moderation (admin)

- [ ] **Coupons**

  - [ ] List coupons
  - [ ] Coupon usage tracking

- [ ] **User Dashboard**

  - [ ] User profile CRUD
  - [ ] User statistics
  - [ ] User's deal history
  - [ ] User's vote history
  - [ ] Notifications

- [ ] **Admin**
  - [ ] User management CRUD
  - [ ] Store management CRUD
  - [ ] Banner management CRUD
  - [ ] Report review
  - [ ] Settings configuration

### 8.2 Backend Development Roadmap

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Foundation (Week 1-2)                                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ☐ Project setup (NestJS, PostgreSQL, Prisma)                                        │
│ ☐ Database schema implementation                                                    │
│ ☐ Authentication module (register, login, JWT)                                      │
│ ☐ User module (profile, basic CRUD)                                                 │
│ ☐ Role-based access control                                                         │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: Core Features (Week 3-4)                                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ☐ Deals module (CRUD, pagination, filtering)                                        │
│ ☐ Stores module                                                                     │
│ ☐ Categories module                                                                 │
│ ☐ Coupons module                                                                    │
│ ☐ Comments module                                                                   │
│ ☐ Voting module with temperature calculation                                        │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: Admin & Moderation (Week 5-6)                                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ☐ Admin deals management (approve/reject)                                           │
│ ☐ Admin users management                                                            │
│ ☐ Admin stores management                                                           │
│ ☐ Admin comments moderation                                                         │
│ ☐ Admin voting analytics & freeze                                                   │
│ ☐ Reports module                                                                    │
│ ☐ Banners module                                                                    │
│ ☐ Settings module                                                                   │
└─────────────────────────────────────────────────────────────────────────────────────┘
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4: Polish & Integration (Week 7-8)                                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ☐ Notifications system                                                              │
│ ☐ Email service (verification, password reset)                                      │
│ ☐ File upload (deal images)                                                         │
│ ☐ API documentation (Swagger)                                                       │
│ ☐ Error handling & validation refinement                                            │
│ ☐ Rate limiting                                                                     │
│ ☐ End-to-end testing                                                                │
│ ☐ Performance optimization                                                          │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Verification Plan

### Automated Tests

- Unit tests for all services
- Integration tests for API endpoints
- E2E tests for critical user flows (auth, deal submission, voting)

### Manual Verification

- Test all API endpoints with Postman/Insomnia
- Connect frontend to backend and verify:
  - Authentication flow
  - Deal submission workflow
  - Voting functionality
  - Admin panel operations
- Verify database triggers work correctly

---

> [!IMPORTANT]
> After this analysis, you have everything needed to start backend development immediately and integrate with the frontend without missing any requirement.
