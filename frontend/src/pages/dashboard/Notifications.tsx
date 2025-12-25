import { Card, CardContent } from '@/components/ui/card';
import {
  FiBell,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiInfo,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'message';
  date: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: 'Deal Approved! 🎉',
    message:
      'Your deal "Apple MacBook Air M2" has been approved and is now live.',
    type: 'success',
    date: '2025-12-24T10:30:00',
    read: false,
  },
  {
    id: 2,
    title: 'Deal Rejected',
    message: 'Your deal "Expired Coupon 2024" was rejected: Deal is expired.',
    type: 'error',
    date: '2025-12-23T15:45:00',
    read: true,
  },
  {
    id: 3,
    title: 'New Comment',
    message:
      'Someone commented on your post: "Great deal, thanks for sharing!"',
    type: 'message',
    date: '2025-12-22T09:20:00',
    read: true,
  },
];

const ICON_MAP = {
  success: <FiCheckCircle className="text-green w-5 h-5" />,
  error: <FiXCircle className="text-red-500 w-5 h-5" />,
  info: <FiInfo className="text-blue-500 w-5 h-5" />,
  message: <FiMessageSquare className="text-purple-500 w-5 h-5" />,
};

export default function Notifications() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-light-grey">
            Stay updated with your latest activity.
          </p>
        </div>
        <button className="text-sm text-green hover:underline cursor-pointer">
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <Card
            key={notif.id}
            className={cn(
              'bg-grey border-none text-white transition-all hover:translate-x-1',
              !notif.read && 'border-l-4 border-green bg-grey/80'
            )}>
            <CardContent className="p-4 flex gap-4">
              <div className="mt-1 shrink-0">{ICON_MAP[notif.type]}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3
                    className={cn(
                      'font-semibold',
                      !notif.read ? 'text-white' : 'text-gray-300'
                    )}>
                    {notif.title}
                  </h3>
                  <span className="text-xs text-light-grey">
                    {new Date(notif.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-light-grey leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {MOCK_NOTIFICATIONS.length === 0 && (
        <div className="bg-grey rounded-xl p-12 text-center text-light-grey border border-dashed border-white/10">
          <FiBell className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-xl font-medium mb-1">All caught up!</p>
          <p>No new notifications at the moment.</p>
        </div>
      )}
    </div>
  );
}
