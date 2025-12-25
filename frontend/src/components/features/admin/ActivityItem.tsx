import React from 'react';
import { FiClock, FiFileText, FiCheckCircle } from 'react-icons/fi';
import { cn } from '@/lib/utils';

export type ActivityType = 'submission' | 'approval' | 'rejection';

interface ActivityItemProps {
  type: ActivityType;
  title: string;
  user: string;
  description: string;
  timestamp: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  type,
  title,
  user,
  description,
  timestamp,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'submission':
        return FiFileText;
      case 'approval':
        return FiCheckCircle;
      default:
        return FiClock;
    }
  };

  const Icon = getIcon();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors px-4 -mx-4 rounded-xl group">
      <div
        className={cn(
          'p-2.5 rounded-xl border border-white/5 transition-colors',
          type === 'approval'
            ? 'bg-green-500/10 border-green-500/20'
            : 'bg-blue-500/10 border-blue-500/20'
        )}>
        <Icon
          className={cn(
            'w-5 h-5',
            type === 'approval' ? 'text-green-400' : 'text-blue-400'
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <h4 className="text-white font-bold text-sm tracking-tight group-hover:text-[#49b99f] transition-colors">
            {title}
          </h4>
          <span className="text-light-grey text-[11px] font-medium opacity-50 whitespace-nowrap ml-2">
            {timestamp}
          </span>
        </div>
        <p className="text-light-grey text-xs truncate opacity-70">
          <span className="font-bold text-white/80">{user}</span> •{' '}
          {description}
        </p>
      </div>
    </div>
  );
};
