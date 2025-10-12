'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from './animated-counter';

interface StatsCardProps {
  icon: ReactNode;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
}

export function StatsCard({
  icon,
  value,
  label,
  prefix = '',
  suffix = '',
  decimals = 0,
  trend = 'neutral',
  trendValue,
  className,
}: StatsCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-orange-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const getTrendBgColor = () => {
    switch (trend) {
      case 'up':
        return 'bg-orange-500/10 border-orange-500/20';
      case 'down':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-surface-elevated/80 to-surface/60 backdrop-blur-xl p-8 transition-all duration-500',
        'hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:scale-105',
        'before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100',
        className
      )}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-orange-400/5 to-orange-300/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 blur-xl" />
      
      <div className="relative z-10 space-y-6">
        {/* Header with icon and trend */}
        <div className="flex items-center justify-between">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 via-orange-400/20 to-orange-300/20 text-orange-400 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-orange-500/25">
            {icon}
          </div>
          {trendValue && (
            <div className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300',
              getTrendBgColor(),
              getTrendColor()
            )}>
              <span className="text-sm">
                {trend === 'up' && '↗'}
                {trend === 'down' && '↘'}
                {trend === 'neutral' && '→'}
              </span>
              {trendValue}
            </div>
          )}
        </div>

        {/* Value and label */}
        <div className="space-y-2">
          <div className="text-4xl font-black" style={{ color: 'var(--text)' }}>
            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
              duration={2000}
            />
          </div>
          <p className="text-sm font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
        </div>

        {/* Decorative line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </div>
    </div>
  );
}
