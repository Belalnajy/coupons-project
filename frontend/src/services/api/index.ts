import { apiClient } from './client';

export { getDeals, getDealById, voteDeal, getVoteStatus } from './deals.api';
export { getCoupons, getCouponById } from './coupons.api';
export { postComment, updateComment, deleteComment } from './comments.api';
export { getUserStats, getMyDeals, getMyVotes } from './users.api';
export { getBanners } from './banners.api';
export { getCategories } from './categories.api';
export { getStores } from './stores.api';
export async function createReport(data: {
  contentType: string;
  contentId: string;
  reason: string;
}): Promise<any> {
  const response = await apiClient.post('/reports', data);
  return response.data;
}
export { apiClient };
