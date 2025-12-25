import apiClient from './client';
import { MOCK_DEALS } from '../mocks/deals.mock';
import { API_CONFIG, PAGINATION } from '@/lib/constants';
import type { Deal, PaginatedResponse, DealsQueryParams } from '@/lib/types';

// Helper to simulate API delay
const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetch deals with optional filtering, sorting, and pagination
 */
export async function getDeals(
  params: DealsQueryParams = {}
): Promise<PaginatedResponse<Deal>> {
  const {
    page = PAGINATION.DEFAULT_PAGE,
    limit = PAGINATION.DEALS_PER_PAGE,
    sort = 'popular',
    search = '',
  } = params;

  if (API_CONFIG.USE_MOCK_DATA) {
    await mockDelay(300);

    let filteredDeals = [...MOCK_DEALS];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredDeals = filteredDeals.filter(
        (deal) =>
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
        filteredDeals = filteredDeals.sort(
          (a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0)
        );
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
      limit,
    };
  }

  // Real API call (when backend is ready)
  const response = await apiClient.get<PaginatedResponse<Deal>>('/deals', {
    params: { page, limit, sort, search },
  });
  return response.data;
}

/**
 * Fetch a single deal by ID
 */
export async function getDealById(id: number): Promise<Deal | null> {
  if (API_CONFIG.USE_MOCK_DATA) {
    await mockDelay(200);
    return MOCK_DEALS.find((deal) => deal.id === id) || null;
  }

  const response = await apiClient.get<Deal>(`/deals/${id}`);
  return response.data;
}

/**
 * Create a new deal
 */
export async function createDeal(dealData: any): Promise<Deal> {
  if (API_CONFIG.USE_MOCK_DATA) {
    await mockDelay(500);
    const newDeal = {
      ...dealData,
      id: Math.floor(Math.random() * 1000) + 100,
      comments: 0,
      trending: false,
    };
    return newDeal;
  }

  const response = await apiClient.post<Deal>('/deals', dealData);
  return response.data;
}
