import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import type { Comment } from '@/lib/types';

interface CommentItemProps {
  comment: Comment;
  onEdit: (id: string | number, text: string) => Promise<boolean>;
  onDelete: (id: string | number) => Promise<boolean>;
}

export function CommentItem({ comment, onEdit, onDelete }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();

  // Check if current user can modify this comment (owner or admin)
  const canModify =
    user && (user.id === comment.user.id || user.role === 'admin');

  const badgeColor =
    comment.user.badge?.toLowerCase() === 'gold' ? 'bg-gold' : 'bg-silver';

  const handleUpdate = async () => {
    if (!editText.trim() || editText === comment.text) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    const success = await onEdit(comment.id, editText);
    if (success) {
      setIsEditing(false);
    }
    setIsUpdating(false);
  };

  return (
    <div className="bg-grey rounded-lg p-4 border border-grey/50 hover:border-grey/80 transition-colors group">
      <div className="flex items-start gap-4">
        {/* User Avatar Placeholder */}
        <div className="w-10 h-10 rounded-full bg-green flex items-center justify-center font-bold text-lg shrink-0">
          {comment.user.name.substring(0, 2).toUpperCase()}
        </div>

        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold truncate">{comment.user.name}</span>
              {comment.user.badge && (
                <Badge
                  className={`${badgeColor} text-[10px] py-0 px-2 h-5 text-black border-none`}>
                  {comment.user.badge}
                </Badge>
              )}
              <span className="text-xs text-light-grey">• {comment.time}</span>
            </div>

            {/* Action Menu (Visible on hover for owner or admin) */}
            {!isEditing && canModify && (
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 hover:bg-darker-grey rounded-md text-light-grey hover:text-white cursor-pointer transition-colors"
                  title="Edit">
                  <FiEdit2 className="w-3.5 h-3.5" />
                </button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      className="p-1.5 hover:bg-red/20 rounded-md text-light-grey hover:text-red transition-colors cursor-pointer"
                      title="Delete">
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-grey border-grey/50 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                      <AlertDialogDescription className="text-light-grey">
                        Are you sure you want to delete this comment? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent border-grey text-white cursor-pointer">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(comment.id)}
                        className="bg-red hover:bg-red/90 text-white border-none cursor-pointer">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3 pt-1">
              <textarea
                className="w-full bg-darker-grey border border-green/30 rounded-md p-3 text-sm text-white resize-none outline-none focus:ring-1 focus:ring-green"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs text-light-grey hover:text-white"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.text);
                  }}
                  disabled={isUpdating}>
                  <FiX className="mr-1" /> Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs bg-green hover:bg-green/90"
                  onClick={handleUpdate}
                  disabled={isUpdating || !editText.trim()}>
                  <FiCheck className="mr-1" />{' '}
                  {isUpdating ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-light-grey leading-relaxed wrap-break-word">
              {comment.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
