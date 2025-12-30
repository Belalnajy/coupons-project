import { API_CONFIG } from '@/lib/constants';
import apiClient from './client';

// Helper to simulate API delay
const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Post a new comment on a deal
 */
export async function postComment(
  dealId: string | number,
  text: string
): Promise<any> {
  if (API_CONFIG.USE_MOCK_DATA) {
    await mockDelay(400);
    return {
      success: true,
      comment: {
        id: Math.floor(Math.random() * 10000),
        text,
        user: { name: 'You', avatar: '/avatar-placeholder.png' },
        createdAt: new Date().toISOString(),
      },
    };
  }

  const response = await apiClient.post(`/deals/${dealId}/comments`, { text });
  return response.data;
}

/**
 * Update an existing comment
 */
export async function updateComment(
  commentId: string | number,
  text: string
): Promise<any> {
  if (API_CONFIG.USE_MOCK_DATA) {
    await mockDelay(300);
    return { success: true };
  }

  const response = await apiClient.put(`/comments/${commentId}`, { text });
  return response.data;
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string | number): Promise<any> {
  if (API_CONFIG.USE_MOCK_DATA) {
    await mockDelay(300);
    return { success: true };
  }

  const response = await apiClient.delete(`/comments/${commentId}`);
  return response.data;
}
