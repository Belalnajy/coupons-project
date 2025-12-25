import apiClient from './client';
import { MOCK_COUPONS } from '../mocks/coupons.mock';
import { API_CONFIG, PAGINATION } from '@/lib/constants';
import type {
  Coupon,
  PaginatedResponse,
  CouponsQueryParams,
} from '@/lib/types';

// Helper to simulate API delay
const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch coupons with optional filtering and pagination
 */
export async function getCoupons(
  params: CouponsQueryParams = {}
): Promise<PaginatedResponse<Coupon>> {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.COUPONS_PER_PAGE,
    search = '',
  } = params;

  if (API_CONFIG.USE_MOCK_DATA) {
    await mockDelay(200);

    let filteredCoupons = [...MOCK_COUPONS];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCoupons = filteredCoupons.filter(
        (coupon) =>
          coupon.title.toLowerCase().includes(searchLower) ||
          coupon.store.toLowerCase().includes(searchLower) ||
          coupon.code.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const total = filteredCoupons.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedCoupons = filteredCoupons.slice(
      startIndex,
      startIndex + limit
    );

    return {
      data: paginatedCoupons,
      total,
      page,
      totalPages,
      limit,
    };
  }

  // Real API call (when backend is ready)
  const response = await apiClient.get<PaginatedResponse<Coupon>>('/coupons', {
    params: { page, limit, search },
  });
  return response.data;
}

/**
 * Fetch a single coupon by ID
 */
export async function getCouponById(id: number): Promise<Coupon | null> {
  if (API_CONFIG.USE_MOCK_DATA) {
    await mockDelay(200);
    return MOCK_COUPONS.find((coupon) => coupon.id === id) || null;
  }

  const response = await apiClient.get<Coupon>(`/coupons/${id}`);
  return response.data;
}
