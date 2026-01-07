import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FiMessageSquare, FiLock } from 'react-icons/fi';
import { CommentItem } from './CommentItem';
import { useComments } from '@/hooks/useComments';
import { useAuth } from '@/context/AuthContext';
import type { Comment } from '@/lib/types';

interface CommentSectionProps {
  comments: Comment[];
  dealId: string | number;
}

export function CommentSection({
  comments: initialComments,
  dealId,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { comments, addComment, editComment, removeComment, isSubmitting } =
    useComments(initialComments, dealId);

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) return;
    const result = await addComment(commentText, user);
    if (result.success) {
      setCommentText('');
      if (result.status === 'pending') {
        toast.success(
          'Your comment has been submitted for moderation and will appear once approved.',
          {
            icon: '🛡️',
            duration: 5000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }
        );
      } else {
        toast.success('Comment posted successfully!');
      }
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      </div>

      {/* Comment Input Area */}
      <div className="bg-grey rounded-lg p-4 space-y-4 border border-grey/50 relative overflow-hidden">
        {!isAuthenticated && (
          <div className="absolute inset-0 bg-darker-grey/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-4 text-center">
            <FiLock className="w-8 h-8 text-green mb-2" />
            <h3 className="font-bold text-lg">Join the conversation</h3>
            <p className="text-sm text-light-grey mb-4">
              Please sign in to share your thoughts about this deal
            </p>
            <Button
              className="bg-green hover:bg-green/90 font-bold"
              onClick={() => navigate('/signin')}>
              Sign In to Comment
            </Button>
          </div>
        )}
        <textarea
          className="w-full bg-darker-grey border-none rounded-md p-4 min-h-[100px] text-white resize-none outline-none focus:ring-1 focus:ring-green"
          placeholder="Share your thoughts about this deal..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={isSubmitting || !isAuthenticated}></textarea>
        <div className="flex justify-end">
          <Button
            className="bg-green hover:bg-green/90 gap-2 cursor-pointer disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSubmitting || !commentText.trim() || !isAuthenticated}>
            <FiMessageSquare /> {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onEdit={async (id, text) => {
              const result = await editComment(id, text);
              if (result.success && result.status === 'pending') {
                toast.success(
                  'Your edit has been submitted for moderation and the comment will reappear once approved.',
                  {
                    icon: '🛡️',
                    duration: 5000,
                  }
                );
              } else if (result.success) {
                toast.success('Comment updated successfully!');
              }
              return result;
            }}
            onDelete={removeComment}
          />
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 bg-grey rounded-lg border border-dashed border-grey/50">
            <p className="text-light-grey">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
