import apiClient from './client';

export async function getStores() {
  const response = await apiClient.get('/stores');
  return response.data;
}
