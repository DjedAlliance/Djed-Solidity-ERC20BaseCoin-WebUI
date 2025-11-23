"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  isConnected: boolean;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ }) => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      icon: BarChart3,
      label: "Dashboard",
      isActive: pathname === "/dashboard"
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-[900px]:block hidden">
      {/* Glassy background with backdrop blur */}
      <div className="bg-black/10 dark:bg-black/10 backdrop-blur-xl border-t border-black/20 dark:border-gray-800/50">
        <div className="px-2">
          <div className="flex items-center justify-between w-full max-w-lg mx-auto">
            {/* Navigation items */}
            {navItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center py-1.5 px-1 rounded-lg transition-all duration-300 group relative flex-1",
                    item.isActive 
                      ? "bg-black/20 dark:bg-white/10 text-black dark:text-white" 
                      : "text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/5"
                  )}
                >
                  {/* Glowing effect for active item */}
                  {item.isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-orange-400/20 rounded-xl blur-sm" />
                  )}
                  
                  {/* Icon with enhanced styling */}
                  <div className="relative z-10">
                    <Icon 
                      size={16} 
                      className={cn(
                        "transition-all duration-300",
                        item.isActive ? "scale-110" : "group-hover:scale-105"
                      )}
                    />
                  </div>
                  
                  {/* Label */}
                  <span className={cn(
                    "text-xs font-medium mt-1 transition-all duration-300 text-center leading-tight",
                    item.isActive ? "text-black dark:text-white" : "text-black/70 dark:text-white/70 group-hover:text-black dark:group-hover:text-white"
                  )}>
                    {item.label}
                  </span>
                  
                  {/* Active indicator */}
                  {item.isActive && (
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black dark:bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
