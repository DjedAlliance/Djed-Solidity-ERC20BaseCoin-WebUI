"use client";

import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Djed Protocol Documentation</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-6">
        Welcome to the docs. This section covers setup, usage, and architecture for the WebUI and smart contracts.
      </p>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Links</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <Link href="/create" className="text-orange-600 dark:text-orange-400 hover:underline">
              Create Stablecoin
            </Link>
          </li>
          <li>
            <Link href="/trade" className="text-orange-600 dark:text-orange-400 hover:underline">
              Trade
            </Link>
          </li>
          <li>
            <Link href="/explore" className="text-orange-600 dark:text-orange-400 hover:underline">
              Explore Tokens
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Local Development</h2>
        <ol className="list-decimal pl-6 space-y-2 text-slate-700 dark:text-slate-300">
          <li>Install dependencies: <code>npm install</code></li>
          <li>Start dev server: <code>npm run dev</code></li>
          <li>Open <span className="font-mono">http://localhost:3000/docs</span> to view this page.</li>
        </ol>
      </div>

      <div className="mt-10 p-4 rounded-xl border border-white/20 dark:border-slate-700/30 bg-white/50 dark:bg-slate-900/40 backdrop-blur">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Looking for more? Extend these docs or link your external documentation site here.
        </p>
      </div>
    </div>
  );
}
