import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { createReport } from '@/services/api';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'deal' | 'comment' | 'user' | 'store';
  contentId: string;
}

export function ReportModal({
  isOpen,
  onClose,
  contentType,
  contentId,
}: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasons = [
    'Spam',
    'Inappropriate Content',
    'Harassment',
    'Misinformation',
    'Scam/Fraud',
    'Other',
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error('Please select a reason');
      return;
    }

    setIsSubmitting(true);
    try {
      await createReport({
        contentType,
        contentId,
        reason: description ? `${reason}: ${description}` : reason,
      });
      toast.success('Report submitted successfully');
      onClose();
      setReason('');
      setDescription('');
    } catch (error) {
      console.error('Failed to submit report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-[#2c2c2c] border border-white/5 rounded-xl shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div>
            <h2 className="text-xl font-bold text-white">
              Report{' '}
              {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
            </h2>
            <p className="text-sm text-light-grey mt-1">
              Help us keep the community safe.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-light-grey hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium text-white">
              Reason
            </label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-white/10 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-green-500">
              <option value="" disabled>
                Select a reason
              </option>
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-white">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide more details..."
              className="w-full bg-[#1a1a1a] border border-white/10 text-white rounded-md px-3 py-2 min-h-[100px] focus:outline-none focus:ring-1 focus:ring-green-500 placeholder:text-light-grey/50"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-white hover:bg-white/10 hover:text-white">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600 text-white border-0">
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
