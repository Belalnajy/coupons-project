import { apiClient } from './client';

export async function getPublicSettings(): Promise<any[]> {
  const response = await apiClient.get('/settings/public');
  return response.data;
}

export async function uploadImage(
  file: File,
  folder: string = 'waferlee'
): Promise<{ url: string; public_id: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post(
    `/upload/image?folder=${folder}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
}
