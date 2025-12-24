import axios from 'axios';
import type { Deal, Coupon, PaginatedResponse, DealsQueryParams, CouponsQueryParams } from './types';

// API base URL - will use environment variable when backend is ready
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// =============================================================================
// MOCK DATA - Remove this section when backend is ready
// =============================================================================

const MOCK_DEALS: Deal[] = [
  {
    id: 1,
    title: "Samsung Galaxy S24 Ultra - 50% Off Limited Time Deal",
    store: "Amazon",
    price: "£599",
    originalPrice: "£1199",
    discount: "-50%",
    comments: 42,
    timePosted: "2h ago",
    timeLeft: "2d 4h",
    verified: true,
    trending: true,
    storeIcon: "amazon"
  },
  {
    id: 2,
    title: "Sony WH-1000XM5 Wireless Headphones",
    store: "Amazon",
    price: "£259",
    originalPrice: "£379",
    discount: "-32%",
    comments: 28,
    timePosted: "5h ago",
    timeLeft: "1d 19h",
    verified: true,
    trending: false,
    storeIcon: "amazon"
  },
  {
    id: 3,
    title: "Apple MacBook Air M3 - Student Discount",
    store: "Amazon",
    price: "£899",
    originalPrice: "£1099",
    discount: "-18%",
    comments: 15,
    timePosted: "1d ago",
    timeLeft: "3d 7h",
    verified: false,
    trending: false,
    storeIcon: "amazon"
  },
  {
    id: 4,
    title: "Nintendo Switch OLED Bundle",
    store: "Amazon",
    price: "£299",
    originalPrice: "£349",
    discount: "-14%",
    comments: 67,
    timePosted: "3h ago",
    timeLeft: "12h",
    verified: true,
    trending: true,
    storeIcon: "amazon"
  },
  {
    id: 5,
    title: "Dyson V15 Detect Cordless Vacuum",
    store: "Amazon",
    price: "£499",
    originalPrice: "£699",
    discount: "-29%",
    comments: 34,
    timePosted: "6h ago",
    timeLeft: "2d 1h",
    verified: true,
    trending: false,
    storeIcon: "amazon"
  },
  {
    id: 6,
    title: "LG C3 55\" OLED TV",
    store: "Amazon",
    price: "£1099",
    originalPrice: "£1499",
    discount: "-27%",
    comments: 89,
    timePosted: "4h ago",
    timeLeft: "5d 3h",
    verified: true,
    trending: true,
    storeIcon: "amazon"
  },
];

const MOCK_COUPONS: Coupon[] = [
  {
    id: 1,
    title: "Extra 20% Off Electronics",
    store: "Amazon",
    code: "SAVE20",
    badge: "20% OFF",
    expiresIn: "3 days",
    usedTimes: "156 times",
    storeIcon: "amazon"
  },
  {
    id: 2,
    title: "Free Delivery on Orders Over £25",
    store: "Amazon",
    code: "FREESHIP",
    badge: "Free shipping",
    expiresIn: "7 days",
    usedTimes: "98 times",
    storeIcon: "amazon"
  },
  {
    id: 3,
    title: "£10 Off Your First Order",
    store: "Amazon",
    code: "WELCOME10",
    badge: "£10 OFF",
    expiresIn: "14 days",
    usedTimes: "234 times",
    storeIcon: "amazon"
  },
  {
    id: 4,
    title: "15% Off Fashion Items",
    store: "Amazon",
    code: "STYLE15",
    badge: "15% OFF",
    expiresIn: "5 days",
    usedTimes: "67 times",
    storeIcon: "amazon"
  },
];

// Flag to enable/disable mock mode
// Set to false when backend is ready
const USE_MOCK_DATA = true;

// Helper to simulate API delay
const mockDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// =============================================================================
// API FUNCTIONS
// =============================================================================

/**
 * Fetch deals with optional filtering, sorting, and pagination
 */
export async function getDeals(params: DealsQueryParams = {}): Promise<PaginatedResponse<Deal>> {
  const { page = 1, limit = 12, sort = 'popular', search = '' } = params;

  if (USE_MOCK_DATA) {
    await mockDelay(300);
    
    let filteredDeals = [...MOCK_DEALS];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDeals = filteredDeals.filter(deal => 
        deal.title.toLowerCase().includes(searchLower) ||
        deal.store.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    switch (sort) {
      case 'newest':
        // Mock: reverse order to simulate newest first
        filteredDeals = filteredDeals.reverse();
        break;
      case 'hottest':
        filteredDeals = filteredDeals.sort((a, b) => b.comments - a.comments);
        break;
      case 'closing':
        // Mock: sort by trending (as proxy for urgency)
        filteredDeals = filteredDeals.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
      case 'popular':
      default:
        filteredDeals = filteredDeals.sort((a, b) => b.comments - a.comments);
    }
    
    // Apply pagination
    const total = filteredDeals.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedDeals = filteredDeals.slice(startIndex, startIndex + limit);
    
    return {
      data: paginatedDeals,
      total,
      page,
      totalPages,
      limit
    };
  }

  // Real API call (when backend is ready)
  const response = await apiClient.get<PaginatedResponse<Deal>>('/deals', {
    params: { page, limit, sort, search }
  });
  return response.data;
}

/**
 * Fetch coupons with optional filtering and pagination
 */
export async function getCoupons(params: CouponsQueryParams = {}): Promise<PaginatedResponse<Coupon>> {
  const { page = 1, limit = 10, search = '' } = params;

  if (USE_MOCK_DATA) {
    await mockDelay(200);
    
    let filteredCoupons = [...MOCK_COUPONS];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCoupons = filteredCoupons.filter(coupon => 
        coupon.title.toLowerCase().includes(searchLower) ||
        coupon.store.toLowerCase().includes(searchLower) ||
        coupon.code.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply pagination
    const total = filteredCoupons.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + limit);
    
    return {
      data: paginatedCoupons,
      total,
      page,
      totalPages,
      limit
    };
  }

  // Real API call (when backend is ready)
  const response = await apiClient.get<PaginatedResponse<Coupon>>('/coupons', {
    params: { page, limit, search }
  });
  return response.data;
}

/**
 * Fetch a single deal by ID
 */
export async function getDealById(id: number): Promise<Deal | null> {
  if (USE_MOCK_DATA) {
    await mockDelay(200);
    return MOCK_DEALS.find(deal => deal.id === id) || null;
  }

  const response = await apiClient.get<Deal>(`/deals/${id}`);
  return response.data;
}

/**
 * Fetch a single coupon by ID
 */
export async function getCouponById(id: number): Promise<Coupon | null> {
  if (USE_MOCK_DATA) {
    await mockDelay(200);
    return MOCK_COUPONS.find(coupon => coupon.id === id) || null;
  }

  const response = await apiClient.get<Coupon>(`/coupons/${id}`);
  return response.data;
}
