import { useState, useCallback } from 'react';
import { postComment, updateComment, deleteComment } from '@/services/api';
import type { Comment } from '@/lib/types';

export function useComments(initialComments: Comment[], dealId: number) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addComment = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setIsSubmitting(true);
      setError(null);
      try {
        const response = await postComment(dealId, text);
        if (response && response.success) {
          setComments((prev) => [response.comment, ...prev]);
          return true;
        }
      } catch (err) {
        setError('Failed to post comment. Please try again.');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
      return false;
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
