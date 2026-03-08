"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import TabNavigation from "@/components/ui/tab-navigation";
import WalletButton from "@/components/ui/walletButton";

interface NavbarProps {
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const [mounted, setMounted] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-700",
        className,
      )}
    >
     >
       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Djed Protocol
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-center">
            <TabNavigation />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3 justify-end">
            {/* Hide theme toggle on very small screens */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>

            <WalletButton />

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-xl"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenu}
            >
              ☰
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu */}
      {mobileMenu && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <div className="flex flex-col items-center gap-4 py-4">
            <Link href="/explore" onClick={() => setMobileMenu(false)}>
              Explore
            </Link>

            <Link href="/create" onClick={() => setMobileMenu(false)}>
              Create
            </Link>

            <Link href="/dashboard" onClick={() => setMobileMenu(false)}>
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
