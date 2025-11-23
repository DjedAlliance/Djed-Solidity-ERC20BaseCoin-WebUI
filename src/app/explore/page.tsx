'use client';

import Link from 'next/link';
import { DollarSign, ExternalLink, ArrowRight } from 'lucide-react';
import { ScrollReveal, GradientText, InteractiveCard, MagneticButton } from '@/components/ui';

const ExplorePage = () => {
  // Placeholder data for stablecoins
  const stablecoins = [
    {
      name: 'USD Stablecoin',
      peg: 'USD',
      backing: 'ETH',
      address: '0x123...',
      reserveCoinPrice: '1.25',
      tvl: 1250000,
      volume: 45000,
      baseCoin: { name: 'Ethereum', symbol: 'ETH', address: '0xabc...' },
      stableCoin: { name: 'USD Stablecoin', symbol: 'USDS', address: '0xdef...' },
      leveragedYieldCoin: { name: 'Leveraged Yield Coin', symbol: 'LYC', address: '0xghi...' },
    },
    {
      name: 'EUR Stablecoin',
      peg: 'EUR',
      backing: 'BTC',
      address: '0x456...',
      reserveCoinPrice: '0.98',
      tvl: 850000,
      volume: 23000,
      baseCoin: { name: 'Bitcoin', symbol: 'BTC', address: '0xjkl...' },
      stableCoin: { name: 'EUR Stablecoin', symbol: 'EURS', address: '0xmno...' },
      leveragedYieldCoin: { name: 'Leveraged Yield Coin', symbol: 'LYC', address: '0xpqr...' },
    },
    // Add more stablecoins as needed
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore the <GradientText className="from-orange-600 to-orange-500">Ecosystem</GradientText>
            </h1>
            <p className="text-xl text-secondary max-w-2xl mx-auto">
              Discover stablecoins launched on the Djed Protocol and dive into a decentralized financial future.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stablecoins.map((coin, index) => (
            <ScrollReveal key={index} delay={0.1 * index}>
              <InteractiveCard className="h-full flex flex-col">
                <div className="p-6 flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{coin.name}</h2>
                      <p className="text-sm text-secondary">Backed by {coin.backing}</p>
                    </div>
                    <div className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">{coin.peg}</div>
                  </div>

                  <div className="space-y-4 my-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary">Total Value Locked</span>
                      <span className="font-semibold text-foreground">${(coin.tvl / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary">24h Volume</span>
                      <span className="font-semibold text-foreground">${coin.volume.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-secondary">LYC Price</span>
                      <span className="font-semibold text-foreground flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {coin.reserveCoinPrice}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <h3 className="font-semibold text-foreground">Token Details</h3>
                    {[coin.baseCoin, coin.stableCoin, coin.leveragedYieldCoin].map((token) => (
                      <div key={token.address} className="flex items-center justify-between">
                        <span className="text-secondary">{token.name} ({token.symbol})</span>
                        <a href={`https://etherscan.io/address/${token.address}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 pb-6 mt-auto">
                  <Link href={`/trade?address=${coin.address}`} passHref>
                    <MagneticButton className="gradient-button w-full flex items-center justify-center gap-2">
                      Trade Now
                      <ArrowRight className="w-4 h-4" />
                    </MagneticButton>
                  </Link>
                </div>
              </InteractiveCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;