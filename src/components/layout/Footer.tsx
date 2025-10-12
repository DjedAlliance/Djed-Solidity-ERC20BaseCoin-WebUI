"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, MessageCircle } from 'lucide-react';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/djedprotocol",
      icon: Twitter,
    },
    {
      name: "GitHub",
      href: "https://github.com/djedprotocol",
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/djedprotocol",
      icon: Linkedin,
    },
    {
      name: "Discord",
      href: "https://discord.gg/djedprotocol",
      icon: MessageCircle,
    },
  ];

  const footerLinks = [
    { name: "Documentation", href: "/docs" },
    { name: "Whitepaper", href: "/whitepaper" },
    { name: "Security", href: "/security" },
    { name: "Terms", href: "/terms" },
    { name: "Privacy", href: "/privacy" },
  ];

  return (
    <footer className={`relative overflow-hidden border-t border-slate-200/30 dark:border-slate-700/30 bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-900/70 backdrop-blur-2xl ${className}`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/10 to-orange-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-orange-300/5 to-orange-400/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                <div className="relative text-3xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent hover:from-orange-500 hover:via-orange-400 hover:to-orange-300 transition-all duration-300">
                  Djed Protocol
                </div>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md text-lg leading-relaxed">
              Next-generation algorithmic stablecoin protocol with advanced market-responsive mechanisms and user-centric design.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-4 rounded-2xl bg-gradient-to-br from-white/60 via-white/40 to-white/20 dark:from-slate-800/60 dark:via-slate-800/40 dark:to-slate-800/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 hover:border-orange-400/60 dark:hover:border-orange-400/60 transition-all duration-500 hover:scale-110 hover:rotate-3 hover:shadow-2xl hover:shadow-orange-500/20"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Animated background glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 via-orange-400/0 to-orange-300/0 group-hover:from-orange-500/10 group-hover:via-orange-400/10 group-hover:to-orange-300/10 transition-all duration-500" />
                  
                  {/* Icon with advanced hover effects */}
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="relative w-6 h-6 text-slate-600 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-all duration-500 group-hover:drop-shadow-lg" />
                  
                  {/* Subtle inner glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="col-span-1">
            <div className="relative group">
              <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent mb-6">
                Resources
              </h3>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 group-hover:w-full transition-all duration-500" />
            </div>
            <ul className="space-y-4">
              {footerLinks.map((link, index) => (
                <li key={link.name} className="group">
                  <Link
                    href={link.href}
                    className="relative flex items-center text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 text-sm font-medium group-hover:translate-x-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute -left-4 w-2 h-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="col-span-1">
            <div className="relative group">
              <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent mb-6">
                Support
              </h3>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 group-hover:w-full transition-all duration-500" />
            </div>
            <ul className="space-y-4">
              {[
                { name: "Contact Us", href: "/contact" },
                { name: "Help Center", href: "/help" },
                { name: "System Status", href: "/status" }
              ].map((link, index) => (
                <li key={link.name} className="group">
                  <Link
                    href={link.href}
                    className="relative flex items-center text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 text-sm font-medium group-hover:translate-x-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute -left-4 w-2 h-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gradient-to-r from-transparent via-slate-200/30 to-transparent dark:via-slate-700/30">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                © 2025 Djed Protocol. All rights reserved.
              </p>
              <div className="w-1 h-1 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full animate-pulse" />
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 group cursor-pointer">
                <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full animate-pulse" />
                <span className="text-slate-600 dark:text-slate-400 text-sm font-medium group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Built with ❤️ for DeFi
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-1 h-1 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                <div className="w-1 h-1 bg-orange-300 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}