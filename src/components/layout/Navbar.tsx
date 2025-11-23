"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { ThemeToggle } from '@/components/ui/theme-toggle';
import TabNavigation from '@/components/ui/tab-navigation';
import WalletButton from '@/components/ui/walletButton';

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const {  } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [ ] = useState(false);
  const [ ] = useState('/');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;



  return (
    <header className={cn("fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Djed Protocol
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <TabNavigation 
          />

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;