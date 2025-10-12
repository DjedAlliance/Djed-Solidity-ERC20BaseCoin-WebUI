'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  TrendingUp, 
  DollarSign,
  Lock,
  Globe,
  BarChart3,
  CheckCircle,
  Activity,
  Layers,
  Eye
} from 'lucide-react';
import { 
  ScrollReveal, 
  GradientText, 
  FloatingElement, 
  InteractiveCard, 
  StatsCard,
  MagneticButton
} from '@/components/ui';
import LiquidEther from '@/components/LiquidEther';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16">
        {/* LiquidEther Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <LiquidEther
            colors={['#F97316', '#FB923C', '#FDBA74']}
            mouseForce={40}
            cursorSize={200}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={false}
            autoSpeed={0}
            autoIntensity={0}
            takeoverDuration={0}
            autoResumeDelay={999999}
            autoRampDuration={0}
            className="w-full h-full pointer-events-auto"
          />
        </div>
        
        <div className="container mx-auto max-w-7xl relative" style={{ zIndex: 10 }}>
          <div className="text-center space-y-8">
            {/* Badge */}
            <ScrollReveal delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated border border-border text-sm text-secondary">
                <Activity className="w-4 h-4 text-success" />
                <span>Live on Multiple Chains</span>
              </div>
            </ScrollReveal>

            {/* Main Heading */}
            <ScrollReveal delay={0.2}>
              <h1 className="text-xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="block mb-2 text-foreground">A Stable Digital</span>
                <GradientText className="block from-orange-600 to-orange-500 text-8xl">
                  Currency for a
                </GradientText>
                <span className="block mt-2 text-foreground">Changing World</span>
              </h1>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal delay={0.4}>
              <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto leading-relaxed">
                Experience algorithmic stability with transparent, decentralized stablecoin technology. Built for reliability, designed for trust.
              </p>
            </ScrollReveal>

            {/* CTA Buttons */}
            <ScrollReveal delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <MagneticButton className="gradient-button text-lg px-8 py-4 flex items-center gap-2">
                  Start Trading
                  <ArrowRight className="w-5 h-5" />
                </MagneticButton>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Built on <GradientText className="from-orange-600 to-orange-500">Transparency</GradientText>
              </h2>
              <p className="text-xl text-secondary max-w-2xl mx-auto">
                Every aspect of our protocol is designed with security, reliability, and user trust at its core.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Audited Smart Contracts',
                description: 'Multiple independent security audits ensure your funds are protected.'
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: 'Full Transparency',
                description: 'Open-source code and real-time reserve verification on-chain.'
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: 'Decentralized Oracle',
                description: 'Reliable price feeds from multiple trusted oracle networks.'
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Instant Settlement',
                description: 'Fast transactions with minimal slippage and competitive fees.'
              }
            ].map((feature, index) => (
              <ScrollReveal key={index} delay={0.1 * index}>
                <InteractiveCard className="h-full">
                  <div className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-secondary leading-relaxed">{feature.description}</p>
                  </div>
                </InteractiveCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 px-4 bg-surface/50">
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Simple, <GradientText className="from-orange-600 to-orange-500">Powerful</GradientText> Protocol
              </h2>
              <p className="text-xl text-secondary max-w-2xl mx-auto">
                Our algorithmic approach maintains stability through intelligent market mechanisms.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <TrendingUp className="w-8 h-8" />,
                title: 'Market-Responsive',
                description: 'Dynamic supply adjustments based on real-time market conditions and oracle data.',
                features: ['Real-time monitoring', 'Automated rebalancing', 'Risk management']
              },
              {
                step: '02',
                icon: <Layers className="w-8 h-8" />,
                title: 'Reserve-Backed',
                description: 'Over-collateralized reserves ensure stability and maintain the peg at all times.',
                features: ['Multi-asset backing', 'Transparent reserves', 'Ratio monitoring']
              },
              {
                step: '03',
                icon: <BarChart3 className="w-8 h-8" />,
                title: 'User-Controlled',
                description: 'Trade freely with instant settlement and competitive rates in a decentralized environment.',
                features: ['No intermediaries', 'Fast transactions', 'Low fees']
              }
            ].map((item, index) => (
              <ScrollReveal key={index} delay={0.2 * index} direction="up">
                <InteractiveCard className="h-full">
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-black dark:text-white">
                        {item.icon}
                      </div>
                      <span className="text-5xl font-bold text-border">{item.step}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-secondary leading-relaxed mb-4">{item.description}</p>
                      <ul className="space-y-2">
                        {item.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-secondary">
                            <CheckCircle className="w-4 h-4 text-success" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </InteractiveCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Protocol Stats Section */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Protocol <GradientText className="from-orange-600 to-orange-500">Metrics</GradientText>
              </h2>
              <p className="text-xl text-secondary max-w-2xl mx-auto">
                Real-time data from our decentralized stablecoin ecosystem.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ScrollReveal delay={0.1}>
              <StatsCard
                icon={<Globe className="w-6 h-6" />}
                value={1250000}
                label="Total Value Locked"
                prefix="$"
                suffix="M"
                decimals={1}
                trend="up"
                trendValue="+12.5%"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <StatsCard
                icon={<Activity className="w-6 h-6" />}
                value={45000}
                label="Daily Transactions"
                suffix=""
                trend="up"
                trendValue="+8.2%"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <StatsCard
                icon={<DollarSign className="w-6 h-6" />}
                value={0.15}
                label="Trading Fee"
                suffix="%"
                decimals={2}
                trend="neutral"
              />
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <StatsCard
                icon={<TrendingUp className="w-6 h-6" />}
                value={99.99}
                label="Price Stability"
                suffix="%"
                decimals={2}
                trend="neutral"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-orange-500/10 via-orange-400/10 to-orange-300/10 backdrop-blur-xl p-12 md:p-16 text-center">
              {/* Background blur shapes */}
              <div className="absolute top-0 left-1/4 w-32 h-32 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-orange-500/5 to-orange-400/5 rounded-3xl" />
              
              <FloatingElement speed={4} range={15}>
                <div className="relative z-10 space-y-6">
                  <h2 className="text-3xl md:text-5xl font-bold">
                    Ready to Experience <GradientText className="from-orange-600 to-orange-500">Stability</GradientText> ?
                  </h2>
                  <p className="text-xl text-secondary max-w-2xl mx-auto">
                    Join thousands of users who trust our algorithmic stablecoin protocol.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <MagneticButton className="gradient-button text-lg px-8 py-4 flex items-center gap-2">
                      Launch App
                      <ArrowRight className="w-5 h-5" />
                    </MagneticButton>
                    <button className="px-8 py-4 rounded-xl border border-white/30 hover:bg-white/10 transition-all duration-300 text-lg font-semibold backdrop-blur-sm">
                      View Documentation
                    </button>
                  </div>
                </div>
              </FloatingElement>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}