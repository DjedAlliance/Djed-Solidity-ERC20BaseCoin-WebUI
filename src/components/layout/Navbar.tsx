"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from '@/components/ui/theme-toggle';
import TabNavigation from '@/components/ui/tab-navigation';
import WalletButton from '@/components/ui/walletButton';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 z-10">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Djed Protocol
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden lg:block">
            <TabNavigation />
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4 z-10">
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>

        {/* Mobile navigation fallback */}
        <div className="lg:hidden pb-3">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg font-medium text-slate-700 dark:text-slate-200 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/trade"
              className="px-3 py-1.5 rounded-lg font-medium text-slate-700 dark:text-slate-200 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              Trade
            </Link>
            <Link
              href="https://github.com/ankitkr104/Djed-Solidity-ERC20BaseCoin-WebUI#readme"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg font-medium text-slate-700 dark:text-slate-200 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
            >
              Docs
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;