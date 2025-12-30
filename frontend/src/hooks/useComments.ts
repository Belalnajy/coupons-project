import { useState, useCallback } from 'react';
import { postComment, updateComment, deleteComment } from '@/services/api';
import type { Comment } from '@/lib/types';

export function useComments(
  initialComments: Comment[],
  dealId: string | number
) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = useCallback(
    async (text: string, currentUser?: any) => {
      if (!text.trim()) return { success: false };

      setIsSubmitting(true);
      setError(null);
      try {
        const response = await postComment(dealId, text);
        // The interceptor unwraps the response, so 'response' is the comment object
        if (response && (response.id || response.success)) {
          const newCommentData = response.comment || response;

          if (newCommentData.status === 'pending') {
            // Don't add to list, maybe show a toast or alert
            return { success: true, status: 'pending' };
          }

          const newComment: Comment = {
            id: newCommentData.id,
            text: newCommentData.content || newCommentData.text || text,
            likes: 0,
            time: 'Just now',
            user: {
              name: currentUser?.username || currentUser?.name || 'You',
              avatar: currentUser?.avatar || currentUser?.avatarUrl,
            },
          };
          setComments((prev) => [newComment, ...prev]);
          return { success: true, status: 'approved' };
        }
      } catch (err) {
        setError('Failed to post comment. Please try again.');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
      return { success: false };
    },
    [dealId]
  );

  const editComment = useCallback(async (commentId: number, text: string) => {
    try {
      const response = await updateComment(commentId, text);
      if (response.success) {
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, text } : c))
        );
        return true;
      }
    } catch (err) {
      console.error('Failed to update comment:', err);
    }
    return false;
  }, []);

  const removeComment = useCallback(async (commentId: number) => {
    try {
      const response = await deleteComment(commentId);
      if (response.success) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        return true;
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
    return false;
  }, []);

  return {
    comments,
    isSubmitting,
    error,
    addComment,
    editComment,
    removeComment,
  };
}
