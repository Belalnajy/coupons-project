// Shared types for API responses

export interface Deal {
  id: number;
  title: string;
  store: string;
  price: string;
  originalPrice: string;
  discount: string;
  comments: number;
  timePosted: string;
  timeLeft: string;
  verified: boolean;
  trending: boolean;
  storeIcon?: string; // Store icon identifier (e.g., "amazon", "ebay")
}

export interface Coupon {
  id: number;
  title: string;
  store: string;
  code: string;
  badge: string;
  expiresIn: string;
  usedTimes: string;
  storeIcon?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface DealsQueryParams {
  page?: number;
  limit?: number;
  sort?: 'popular' | 'newest' | 'hottest' | 'closing';
  search?: string;
  category?: string;
}

export interface CouponsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
