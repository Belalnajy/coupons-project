import { apiClient } from './client';

export interface UploadResponse {
  url: string;
  public_id: string;
}

/**
 * Upload an image to Cloudinary via backend
 */
export async function uploadImage(
  file: File,
  folder: string = 'waferlee'
): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post<UploadResponse>(
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
