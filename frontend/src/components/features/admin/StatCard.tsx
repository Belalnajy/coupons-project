import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  trend: number;
  icon: React.ElementType;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  trend,
  icon: Icon,
}) => {
  const isPositive = trend >= 0;

  return (
    <div className="bg-[#2c2c2c] p-6 rounded-2xl border border-white/5 shadow-xl transition-all duration-300 hover:border-[#49b99f]/30 hover:shadow-[#49b99f]/5">
      <div className="flex justify-between items-start mb-4">
        <div className="bg-[#1a1a1a] p-3 rounded-xl border border-white/5">
          <Icon className="w-6 h-6 text-[#49b99f]" />
        </div>
        <div
          className={cn(
            'flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg',
            isPositive
              ? 'text-green-400 bg-green-400/10'
              : 'text-red-400 bg-red-400/10'
          )}>
          {isPositive ? (
            <FiTrendingUp className="w-3 h-3" />
          ) : (
            <FiTrendingDown className="w-3 h-3" />
          )}
          <span>
            {isPositive ? '+' : ''}
            {trend}%
          </span>
        </div>
      </div>

      <div>
        <p className="text-light-grey text-sm font-medium mb-1 uppercase tracking-wider opacity-60">
          {label}
        </p>
        <h3 className="text-3xl font-black text-white tracking-tight">
          {value.toLocaleString()}
        </h3>
      </div>
    </div>
  );
};
