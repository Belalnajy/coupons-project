import { apiClient } from './client';

export async function getAdminStats(): Promise<any> {
  const response = await apiClient.get('/admin/stats');
  return response.data;
}

export async function getAdminStores(params: any = {}): Promise<any> {
  const response = await apiClient.get('/admin/stores', { params });
  return response.data;
}

export async function getAdminStore(id: string): Promise<any> {
  const response = await apiClient.get(`/admin/stores/${id}`);
  return response.data;
}

export async function createStore(data: any): Promise<any> {
  const response = await apiClient.post('/admin/stores', data);
  return response.data;
}

export async function updateStore(id: string, data: any): Promise<any> {
  const response = await apiClient.put(`/admin/stores/${id}`, data);
  return response.data;
}

export async function toggleStore(id: string): Promise<any> {
  const response = await apiClient.put(`/admin/stores/${id}/toggle`);
  return response.data;
}

export async function deleteStore(id: string): Promise<any> {
  const response = await apiClient.delete(`/admin/stores/${id}`);
  return response.data;
}

export async function getAdminDeals(params: any = {}): Promise<any> {
  const response = await apiClient.get('/admin/deals', { params });
  return response.data;
}

export async function approveDeal(id: string): Promise<any> {
  const response = await apiClient.put(`/admin/deals/${id}/approve`);
  return response.data;
}

export async function rejectDeal(id: string, reason?: string): Promise<any> {
  const response = await apiClient.put(`/admin/deals/${id}/reject`, { reason });
  return response.data;
}

export async function toggleDeal(id: string): Promise<any> {
  const response = await apiClient.put(`/admin/deals/${id}/toggle`);
  return response.data;
}

export async function verifyDeal(id: string): Promise<any> {
  const response = await apiClient.put(`/admin/deals/${id}/verify`);
  return response.data;
}

export async function deleteDeal(id: string): Promise<any> {
  const response = await apiClient.delete(`/admin/deals/${id}`);
  return response.data;
}

export async function getAdminUsers(params: any = {}): Promise<any> {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
}

export async function toggleUserStatus(
  id: string,
  action: 'suspend' | 'activate'
): Promise<any> {
  const response = await apiClient.put(`/admin/users/${id}/${action}`);
  return response.data;
}

export async function getAdminComments(params: any = {}): Promise<any> {
  const response = await apiClient.get('/admin/comments', { params });
  return response.data;
}

export async function approveComment(id: string): Promise<any> {
  const response = await apiClient.put(`/admin/comments/${id}/approve`);
  return response.data;
}

export async function deleteComment(id: string): Promise<any> {
  const response = await apiClient.delete(`/admin/comments/${id}`);
  return response.data;
}

export async function getAdminBanners(params: any = {}): Promise<any> {
  const response = await apiClient.get('/admin/banners', { params });
  return response.data;
}

export async function getAdminBanner(id: string): Promise<any> {
  const response = await apiClient.get(`/admin/banners/${id}`);
  return response.data;
}

export async function getAdminUser(id: string): Promise<any> {
  const response = await apiClient.get(`/admin/users/${id}`);
  return response.data;
}

export async function createAdminUser(data: any): Promise<any> {
  const response = await apiClient.post('/admin/users', data);
  return response.data;
}

export async function updateAdminUser(id: string, data: any): Promise<any> {
  const response = await apiClient.put(`/admin/users/${id}`, data);
  return response.data;
}

export async function deleteAdminUser(id: string): Promise<any> {
  const response = await apiClient.delete(`/admin/users/${id}`);
  return response.data;
}

export async function createBanner(data: any): Promise<any> {
  const response = await apiClient.post('/admin/banners', data);
  return response.data;
}

export async function updateBanner(id: string, data: any): Promise<any> {
  const response = await apiClient.put(`/admin/banners/${id}`, data);
  return response.data;
}

export async function deleteBanner(id: string): Promise<any> {
  const response = await apiClient.delete(`/admin/banners/${id}`);
  return response.data;
}

export async function getAdminReports(params: any = {}): Promise<any> {
  const response = await apiClient.get('/admin/reports', { params });
  return response.data;
}

export async function reviewReport(
  id: string,
  data: { status: string; notes?: string }
): Promise<any> {
  const response = await apiClient.put(`/admin/reports/${id}/review`, data);
  return response.data;
}

export async function getAdminReport(id: string): Promise<any> {
  const response = await apiClient.get(`/admin/reports/${id}`);
  return response.data;
}

export async function deleteReportedContent(reportId: string): Promise<any> {
  // logic to be implemented on backend to handle content deletion via report
  // for now we can reuse the review endpoint with a specific status or add a new endpoint
  // assuming 'resolved' status implies handling content, or we can add specific action
  const response = await apiClient.put(`/admin/reports/${reportId}/review`, {
    status: 'resolved',
  });
  return response.data;
}

export async function getAdminSettings(): Promise<any> {
  const response = await apiClient.get('/admin/settings');
  return response.data;
}

export async function updateSetting(
  key: string,
  value: any,
  description?: string
): Promise<any> {
  const response = await apiClient.put(`/admin/settings/${key}`, {
    value,
    description,
  });
  return response.data;
}

export async function getVotingAnalytics(): Promise<any> {
  const response = await apiClient.get('/admin/voting/analytics');
  return response.data;
}

export async function freezeVoting(dealId: string): Promise<any> {
  const response = await apiClient.put(`/admin/voting/${dealId}/freeze`);
  return response.data;
}

export async function unfreezeVoting(dealId: string): Promise<any> {
  const response = await apiClient.put(`/admin/voting/${dealId}/unfreeze`);
  return response.data;
}
