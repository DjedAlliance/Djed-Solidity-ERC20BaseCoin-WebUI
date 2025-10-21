import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TabNavigation = () => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const pathname = usePathname();

  const tabBase =
    'py-1 px-1 bg-black dark:bg-white group hover:bg-gradient-to-b hover:from-white hover:to-black hover:via-white hover:to-[70%] transition-[background,border-radius] duration-500 ease-in-out [will-change:background,border-radius] dark:hover:bg-gradient-to-b dark:hover:from-[#0f172a] dark:hover:to-white dark:hover:via-[#0f172a]';

  const linkBase =
    'rounded-xl px-3 py-1 block text-center tab-link ' +
    'transition-all duration-200 ease-out ' +
    'group-hover:outline group-hover:outline-4 group-hover:outline-white dark:group-hover:!outline-slate-900 ' + // Force dark mode outline
    'group-hover:transition-[background,color,border-radius] group-hover:duration-500 group-hover:delay-200 ease-in-out ' +
    'group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-orange-500 group-hover:text-white group-hover:rounded-2xl';

  const spacerBase =
    'bg-black dark:bg-white transition-[border-radius] ease-in-out duration-300';

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-1/3 mx-auto text-white dark:text-black">
      <div className="grid grid-cols-[0.4fr_0.8fr_0.8fr_0.8fr_0.4fr] gap-0 w-full">
        {/* Left Spacer */}
        <div
          className={`${spacerBase} rounded-l-3xl ${
            hoveredTab === 'dashboard'
              ? 'rounded-tr-2xl duration-500'
              : 'rounded-tr-none duration-200'
          }`}
        ></div>

        {/* Dashboard */}
        <div
          className={`${tabBase} ${
            hoveredTab === 'portfolio' ? 'rounded-tr-2xl duration-500' : 'rounded-tr-none duration-200'
          }`}
          onMouseEnter={() => setHoveredTab('dashboard')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <Link href="/dashboard" className={`${linkBase} ${isActive('/dashboard') ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl' : ''}`}>
            Dashboard
          </Link>
        </div>

        {/* Portfolio */}
        <div
          className={`${tabBase} ${
            hoveredTab === 'dashboard'
              ? 'rounded-tl-2xl duration-500'
              : hoveredTab === 'trade'
              ? 'rounded-tr-2xl duration-500'
              : 'rounded-tl-none rounded-tr-none duration-200'
          }`}
          onMouseEnter={() => setHoveredTab('portfolio')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <Link href="/portfolio" className={`${linkBase} group-hover:rounded-b-2xl ${isActive('/portfolio') ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl' : ''}`}>
            Portfolio
          </Link>
        </div>

        {/* Trade */}
        <div
          className={`${tabBase} ${
            hoveredTab === 'portfolio'
              ? 'rounded-tl-2xl duration-500'
              : 'rounded-tl-none duration-200'
          }`}
          onMouseEnter={() => setHoveredTab('trade')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <Link href="/trade" className={`${linkBase} group-hover:rounded-b-2xl ${isActive('/trade') ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-2xl' : ''}`}>
            Trade
          </Link>
        </div>

        {/* Right Spacer */}
        <div
          className={`${spacerBase} rounded-r-3xl ${
            hoveredTab === 'trade'
              ? 'rounded-tl-2xl duration-500'
              : 'rounded-tl-none duration-200'
          }`}
        ></div>
      </div>
    </div>
  );
};

export default TabNavigation;