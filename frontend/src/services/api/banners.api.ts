import { apiClient } from './client';

export async function getBanners(params: any = {}): Promise<any> {
  const response = await apiClient.get('/banners', { params });
  return response.data;
}
