'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  children?: React.ReactNode;
}

export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.1,
  direction = 'up',
  children,
}: SplitTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return 'translateY(100%)';
      case 'down':
        return 'translateY(-100%)';
      case 'left':
        return 'translateX(100%)';
      case 'right':
        return 'translateX(-100%)';
      default:
        return 'translateY(100%)';
    }
  };

  const words = text.split(' ');

  return (
    <div ref={ref} className={cn('overflow-hidden', className)}>
      {children ? (
        <div
          className={cn(
            'transition-all duration-700 ease-out',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
          style={{ transitionDelay: `${delay}s` }}
        >
          {children}
        </div>
      ) : (
        <div className="flex flex-wrap">
          {words.map((word, index) => (
            <div
              key={index}
              className="inline-block mr-2 overflow-hidden"
            >
              <span
                className={cn(
                  'inline-block transition-all duration-700 ease-out',
                  isVisible ? 'translate-y-0 opacity-100' : 'opacity-0'
                )}
                style={{
                  transform: isVisible ? 'translateY(0)' : getTransform(),
                  transitionDelay: `${delay + index * stagger}s`,
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
