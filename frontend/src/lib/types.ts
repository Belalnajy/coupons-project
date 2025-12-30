// Shared types for API responses

export interface Deal {
  id: string | number;
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
  storeIcon?: string;
  description?: string;
  whatsIncluded?: string[];
  howToGet?: string;
  category?: string;
  user?: {
    name: string;
    avatar?: string;
    badge?: string;
  };
  votes?: {
    up: number;
    down: number;
    temperature: number;
  };
  images?: string[];
  commentsList?: Comment[];
  isVotingFrozen?: boolean;
}

export interface Comment {
  id: string | number;
  user: {
    id: string;
    name: string;
    avatar?: string;
    badge?: string;
  };
  text: string;
  likes: number;
  time: string;
}

export interface Coupon {
  id: string | number;
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
  store?: string;
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  isVerified?: boolean;
  isExpiringSoon?: boolean;
  freeDelivery?: boolean;
}

export interface CouponsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}
