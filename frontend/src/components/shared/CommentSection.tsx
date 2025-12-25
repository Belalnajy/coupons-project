import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FiMessageSquare } from "react-icons/fi";
import { CommentItem } from "./CommentItem";
import { useComments } from "@/hooks/useComments";
import type { Comment } from "@/lib/types";

interface CommentSectionProps {
  comments: Comment[];
  dealId: number;
}

export function CommentSection({ comments: initialComments, dealId }: CommentSectionProps) {
  const [commentText, setCommentText] = useState("");
  const { comments, addComment, editComment, removeComment, isSubmitting } = useComments(initialComments, dealId);

  const handleSubmit = async () => {
    const success = await addComment(commentText);
    if (success) {
      setCommentText("");
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
      
      {/* Comment Input Area */}
      <div className="bg-grey rounded-lg p-4 space-y-4 border border-grey/50">
        <textarea 
          className="w-full bg-darker-grey border-none rounded-md p-4 min-h-[100px] text-white resize-none outline-none focus:ring-1 focus:ring-green"
          placeholder="Share your thoughts about this deal..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          disabled={isSubmitting}
        ></textarea>
        <div className="flex justify-end">
          <Button 
            className="bg-green hover:bg-green/90 gap-2 cursor-pointer disabled:opacity-50"
            onClick={handleSubmit}
            disabled={isSubmitting || !commentText.trim()}
          >
            <FiMessageSquare /> {isSubmitting ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </div>

      {/* Comment List */}
      <div className="space-y-4">
        {comments.map(comment => (
          <CommentItem 
            key={comment.id} 
            comment={comment} 
            onEdit={editComment}
            onDelete={removeComment}
          />
        ))}
        
        {comments.length === 0 && (
          <div className="text-center py-8 bg-grey rounded-lg border border-dashed border-grey/50">
            <p className="text-light-grey">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
