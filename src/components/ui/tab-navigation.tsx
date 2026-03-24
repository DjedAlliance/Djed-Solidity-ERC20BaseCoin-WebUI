'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TabNavigation = () => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const tabs = [
    { name: 'Explore', path: '/explore' },
    { name: 'Create', path: '/create' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const spacerBase = "bg-transparent h-full transition-all";

  return (
    <div className="w-full max-w-md mx-auto text-white dark:text-black">
      <div className="grid grid-cols-[0.4fr_0.8fr_0.8fr_0.8fr_0.4fr] gap-0 w-full rounded-3xl bg-slate-100 dark:bg-slate-800/50 p-1">
        {/* Left Spacer */}
        <div
          className={`${spacerBase} rounded-l-3xl ${
            hoveredTab === '/explore'
              ? 'rounded-tr-2xl duration-500'
              : 'rounded-tr-none duration-200'
          }`}
        ></div>

        {tabs.map((tab) => (
          <Link
            key={tab.path}
            href={tab.path}
            className="flex items-center justify-center relative px-2 py-2.5 rounded-xl font-semibold text-sm overflow-hidden group text-center"
            onMouseEnter={() => setHoveredTab(tab.path)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {/* Glassy background for active tab */}
            {isActive(tab.path) && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl shadow-lg shadow-orange-500/40">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-xl" />
              </div>
            )}

            {/* Glassy hover effect with shimmer */}
            {hoveredTab === tab.path && !isActive(tab.path) && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 to-orange-500/30 backdrop-blur-md rounded-xl transition-all duration-300" />
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
                  style={{
                    animation: 'shimmer 2s infinite',
                    transform: 'translateX(-100%)',
                  }}
                />
              </>
            )}

            {/* Text with gradient on active */}
            <span 
              className={`
                relative z-10 transition-all duration-300
                ${
                  isActive(tab.path)
                    ? 'text-white font-bold drop-shadow-lg'
                    : hoveredTab === tab.path
                    ? 'text-orange-500 dark:text-orange-400 font-bold'
                    : 'text-gray-600 dark:text-gray-400'
                }
              `}
              style={{
                textShadow: isActive(tab.path) ? '0 2px 10px rgba(251, 146, 60, 0.5)' : 'none',
              }}
            >
              {tab.name}
            </span>

            {/* Glow effect on hover */}
            {hoveredTab === tab.path && (
              <div 
                className="absolute inset-0 rounded-xl opacity-50 blur-xl"
                style={{
                  background: 'radial-gradient(circle, rgba(251, 146, 60, 0.4), transparent 70%)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
            )}
          </Link>
        ))}

        {/* Right Spacer */}
        <div
          className={`${spacerBase} rounded-r-3xl ${
            hoveredTab === '/dashboard'
              ? 'rounded-tl-2xl duration-500'
              : 'rounded-tl-none duration-200'
          }`}
        ></div>
      </div>
    </div>
  );
};

export default TabNavigation;
