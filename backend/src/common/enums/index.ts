export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum UserLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export enum DealStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum DealType {
  ONLINE = 'online',
  INSTORE = 'instore',
  BOTH = 'both',
}

export enum VoteType {
  HOT = 'hot',
  COLD = 'cold',
}

export enum CommentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
}

export enum StoreStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled',
}

export enum BannerStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  EXPIRED = 'expired',
}

export enum BannerPlacement {
  HOME_TOP = 'home_top',
  SIDEBAR = 'sidebar',
  CATEGORY_PAGE = 'category_page',
  DEALS_TOP = 'deals_top',
}

export enum ReportStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved',
}

export enum ReportContentType {
  DEAL = 'deal',
  COMMENT = 'comment',
  USER = 'user',
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  MESSAGE = 'message',
}
