"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from '@/components/ui/theme-toggle';
import TabNavigation from '@/components/ui/tab-navigation';
import WalletButton from '@/components/ui/walletButton';

interface NavbarProps {
  // Reserved for future use
}

const Navbar: React.FC<NavbarProps> = () => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (headerRef.current && mounted) {
      const isDark = theme === 'dark' || resolvedTheme === 'dark';
      const header = headerRef.current;
      
      // ULTRA TRANSPARENT - 15% opacity for extreme glassy effect!
      header.style.backgroundColor = isDark ? 'rgba(15, 23, 42, 0.15)' : 'rgba(255, 255, 255, 0.15)';
      // MAXIMUM BLUR for ultra frosted glass effect
      header.style.backdropFilter = 'blur(60px) saturate(250%) brightness(1.1)';
      (header.style as any).webkitBackdropFilter = 'blur(60px) saturate(250%) brightness(1.1)';
      // Remove border - using gradient div instead
      header.style.borderBottom = 'none';
      header.style.boxShadow = '0 8px 32px rgba(251, 146, 60, 0.3), 0 0 60px rgba(251, 146, 60, 0.15)';
      header.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    }
  }, [mounted, theme, resolvedTheme, scrolled]);

  if (!mounted) {
    return (
      <header 
        className="fixed top-0 left-0 right-0 z-50 h-16"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
      />
    );
  }

  const isDark = theme === 'dark' || resolvedTheme === 'dark';

  return (
    <header 
      ref={headerRef}
      className="fixed top-0 left-0 right-0"
      style={{
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      {/* Subtle color backdrop to enhance glass visibility */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: isDark 
            ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.08), rgba(249, 115, 22, 0.05), transparent)'
            : 'linear-gradient(135deg, rgba(251, 146, 60, 0.12), rgba(249, 115, 22, 0.08), transparent)',
          zIndex: 1,
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.4,
          background: isDark 
            ? 'linear-gradient(to bottom, rgba(30, 41, 59, 0.3), transparent)'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent)',
        }}
      />
      
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #FB923C, #F97316, #EA580C, #F97316, #FB923C, transparent)',
          opacity: 0.9,
          boxShadow: '0 0 15px rgba(251, 146, 60, 0.5)',
        }}
      />
      
      <div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ position: 'relative', zIndex: 10 }}
      >
        <div className="flex justify-between items-center h-16">
          
          <div className="flex-shrink-0 relative group">
            <Link href="/" className="flex items-center">
              <div style={{ position: 'relative' }}>
                <div 
                  className="text-2xl font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #F97316, #FB923C, #F97316)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  Djed Protocol
                </div>
                
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle, rgba(251, 146, 60, 0.4), transparent 70%)',
                    filter: 'blur(20px)',
                    transform: 'scale(1.5)',
                    zIndex: -1,
                  }}
                />
              </div>
            </Link>
          </div>

          <div className="hidden md:block">
            <TabNavigation />
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{
                  background: isDark 
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.05)',
                  backdropFilter: 'blur(10px)',
                  transform: 'scale(1.1)',
                  zIndex: -1,
                }}
              />
              <ThemeToggle />
            </div>
            
            <div className="relative group">
              <div 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15), rgba(249, 115, 22, 0.15))',
                  backdropFilter: 'blur(10px)',
                  transform: 'scale(1.05)',
                  filter: 'blur(8px)',
                  zIndex: -1,
                }}
              />
              <WalletButton />
            </div>
          </div>
        </div>
      </div>
      
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
          opacity: scrolled ? 0.3 : 0,
          transition: 'opacity 0.7s ease',
        }}
      />
    </header>
  );
};

export default Navbar;
