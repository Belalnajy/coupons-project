import { apiClient } from './client';
import { API_CONFIG } from '@/lib/constants';

export async function getUserStats(): Promise<any> {
  if (API_CONFIG.USE_MOCK_DATA) {
    return {
      karma: 1240,
      level: 'gold',
      dealsCount: 28,
      commentsCount: 145,
      votesCount: 523,
      impactScore: 145,
    };
  }
  const response = await apiClient.get('/users/me/stats');
  return response.data;
}

export async function getMyDeals(
  params: { page?: number; limit?: number } = {}
): Promise<any> {
  if (API_CONFIG.USE_MOCK_DATA) {
    return { data: [], total: 0, page: 1, totalPages: 0, limit: 10 };
  }
  const response = await apiClient.get('/users/me/deals', { params });
  return response.data;
}

export async function getMyVotes(
  params: { page?: number; limit?: number } = {}
): Promise<any> {
  if (API_CONFIG.USE_MOCK_DATA) {
    return { data: [], total: 0, page: 1, totalPages: 0, limit: 10 };
  }
  const response = await apiClient.get('/users/me/votes', { params });
  return response.data;
}

export async function updateProfile(data: {
  username?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string;
}): Promise<any> {
  if (API_CONFIG.USE_MOCK_DATA) {
    return { success: true, user: { ...data } };
  }
  const response = await apiClient.put('/users/me', data);
  return response.data;
}
