import React, { useState } from 'react';
import Link from 'next/link';

const TabNavigation = () => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const tabBase =
    'py-1 px-1 bg-transparent group transition-[border-radius] duration-500 ease-in-out [will-change:border-radius]';

  const linkBase =
    'rounded-xl px-6 py-2 block text-center tab-link text-slate-700 dark:text-slate-200 font-medium border border-transparent ' +
    'transition-all duration-300 ease-out ' +
    'group-hover:rounded-2xl group-hover:text-orange-800 dark:group-hover:text-white group-hover:backdrop-blur-md ' +
    'group-hover:bg-gradient-to-r group-hover:from-orange-200/60 group-hover:to-orange-100/50 dark:group-hover:from-orange-500/30 dark:group-hover:to-orange-400/20 ' +
    'group-hover:border-orange-300/70 dark:group-hover:border-orange-400/40 ' +
    'group-hover:shadow-[0_8px_26px_rgba(251,146,60,0.35)]';

  const spacerBase =
    'bg-transparent transition-[border-radius] ease-in-out duration-300';

  return (
    <div className="w-auto">
      <div className="grid grid-cols-[0.2fr_0.5fr_0.5fr_0.5fr_0.2fr] gap-0 w-full">
        {/* Left Spacer */}
        <div
          className={`${spacerBase} rounded-l-3xl ${
            hoveredTab === 'home'
              ? 'rounded-tr-2xl duration-500'
              : 'rounded-tr-none duration-200'
          }`}
        ></div>

        {/* Home */}
        <div
          className={`${tabBase} ${
            hoveredTab === 'trade' ? 'rounded-tr-2xl duration-500' : 'rounded-tr-none duration-200'
          }`}
          onMouseEnter={() => setHoveredTab('home')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <Link href="/" className={linkBase}>
            Home
          </Link>
        </div>

        {/* Trade */}
        <div
          className={`${tabBase} ${
            hoveredTab === 'home'
              ? 'rounded-tl-2xl duration-500'
              : hoveredTab === 'docs'
              ? 'rounded-tr-2xl duration-500'
              : 'rounded-tl-none rounded-tr-none duration-200'
          }`}
          onMouseEnter={() => setHoveredTab('trade')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <Link href="/trade" className={`${linkBase} group-hover:rounded-b-2xl`}>
            Trade
          </Link>
        </div>

        {/* Docs */}
        <div
          className={`${tabBase} ${
            hoveredTab === 'trade'
              ? 'rounded-tl-2xl duration-500'
              : 'rounded-tl-none duration-200'
          }`}
          onMouseEnter={() => setHoveredTab('docs')}
          onMouseLeave={() => setHoveredTab(null)}
        >
          <Link
            href="https://github.com/ankitkr104/Djed-Solidity-ERC20BaseCoin-WebUI#readme"
            target="_blank"
            rel="noreferrer"
            className={`${linkBase} group-hover:rounded-b-2xl`}
          >
            Docs
          </Link>
        </div>

        {/* Right Spacer */}
        <div
          className={`${spacerBase} rounded-r-3xl ${
            hoveredTab === 'docs'
              ? 'rounded-tl-2xl duration-500'
              : 'rounded-tl-none duration-200'
          }`}
        ></div>
      </div>
    </div>
  );
};

export default TabNavigation;