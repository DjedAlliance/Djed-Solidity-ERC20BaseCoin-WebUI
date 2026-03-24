import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/layout/Layout";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/themeProvider";

import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "@/utils/wagmiConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Djed Protocol",
  description:
    "Algorithmic stablecoin protocol. Mint and sell stablecoins with a user-friendly interface for the Djed algorithmic stablecoin system.",
  icons: {
    icon: "/next-icon.svg",
    shortcut: "/next-icon.svg",
    apple: "/next-icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieHeader = (await headers()).get('cookie');
  const initialState = cookieHeader ? cookieToInitialState(config, cookieHeader) : undefined;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('fate-protocol-theme') || 'system';
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var finalTheme = theme === 'system' ? systemTheme : theme;
                  
                  if (finalTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders initialState={initialState}>
          <Navbar />
          
          <main className="pt-16">
            {children}
          </main>
          
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
