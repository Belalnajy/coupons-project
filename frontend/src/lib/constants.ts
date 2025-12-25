// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || '/api',
  TIMEOUT: 10000,
  USE_MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true' || true,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  DEALS_PER_PAGE: 12,
  COUPONS_PER_PAGE: 10,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DEALS: '/deals',
  COUPONS: '/coupons',
  REGISTER: '/register',
  SIGNIN: '/signin',
  LOGIN: '/login',
  HOW_IT_WORKS: '/how-it-works',
  SUBMIT_DEAL: '/submit-deal',
  CONTACT: '/contact',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  COOKIES: '/cookies',
  GUIDELINES: '/guidelines',
} as const;

// Sort Options
export const SORT_OPTIONS = {
  POPULAR: 'popular',
  NEWEST: 'newest',
  HOTTEST: 'hottest',
  CLOSING: 'closing',
} as const;

// Debounce Delay
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  DEFAULT: 500,
} as const;
