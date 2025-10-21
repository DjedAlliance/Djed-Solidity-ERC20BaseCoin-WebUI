'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Shield, 
  Activity,
  BarChart3,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Loading
} from '@/components/ui';
import DJED_ABI from '@/utils/abi/Djed.json';
import COIN_ABI from '@/utils/abi/Coin.json';
import ORACLE_ABI from '@/utils/abi/IOracle.json';
import { DJED_ADDRESS, STABLE_COIN_ADDRESS, RESERVE_COIN_ADDRESS, ORACLE_ADDRESS } from '@/utils/addresses';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);

  // Read protocol data
  const { data: ratio } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'ratio',
  });

  const { data: reserveAmount } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'R',
    args: [0n],
  });

  const { data: liabilities } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'L',
  });

  const { data: scPrice } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'scPrice',
    args: [0n],
  });

  const { data: rcTargetPrice } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'rcTargetPrice',
    args: [0n],
  });

  const { data: oraclePrice } = useReadContract({
    address: ORACLE_ADDRESS,
    abi: ORACLE_ABI,
    functionName: 'readData',
  });

  const { data: fee } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'fee',
  });

  const { data: treasuryFee } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'treasuryFee',
  });

  const { data: txLimit } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'txLimit',
  });

  // Read user balances
  const { data: stableCoinBalance } = useReadContract({
    address: STABLE_COIN_ADDRESS,
    abi: COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: reserveCoinBalance } = useReadContract({
    address: RESERVE_COIN_ADDRESS,
    abi: COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: baseCoinBalance } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'baseCoin',
  });

  const { data: userBaseCoinBalance } = useReadContract({
    address: baseCoinBalance,
    abi: COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const formatNumber = (value: bigint | undefined, decimals: number = 18) => {
    if (!value) return '0';
    return (Number(value) / Math.pow(10, decimals)).toFixed(4);
  };

  const formatPrice = (value: bigint | undefined, decimals: number = 18) => {
    if (!value) return '$0.00';
    return `$${(Number(value) / Math.pow(10, decimals)).toFixed(2)}`;
  };

  const formatPercentage = (value: bigint | undefined) => {
    if (!value) return '0%';
    return `${(Number(value) / 100).toFixed(2)}%`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your Djed Protocol portfolio and protocol health
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Protocol Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">StableCoin Price</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(scPrice)}</div>
            <p className="text-xs text-muted-foreground">
              Target: $1.00
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserve Ratio</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(ratio)}</div>
            <p className="text-xs text-muted-foreground">
              Protocol health indicator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reserves</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(reserveAmount)}</div>
            <p className="text-xs text-muted-foreground">
              BaseCoin reserves
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(liabilities)}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding StableCoins
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Portfolio */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Your Portfolio
            </CardTitle>
            <CardDescription>
              Your current holdings in the Djed Protocol
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">StableCoins (SC)</span>
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-2xl font-bold">
                  {formatNumber(stableCoinBalance)}
                </div>
                <div className="text-sm text-muted-foreground">
                  ≈ {formatPrice(stableCoinBalance)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">ReserveCoins (RC)</span>
                  <ArrowDownRight className="h-4 w-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">
                  {formatNumber(reserveCoinBalance)}
                </div>
                <div className="text-sm text-muted-foreground">
                  ≈ {formatPrice(rcTargetPrice && reserveCoinBalance ? 
                    (rcTargetPrice * reserveCoinBalance) / BigInt(Math.pow(10, 18)) : 0n)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">BaseCoins (BC)</span>
                  <Activity className="h-4 w-4 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">
                  {formatNumber(userBaseCoinBalance)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Available for trading
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common trading operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <ArrowUpRight className="h-6 w-6 text-green-500" />
              <span>Buy StableCoins</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <ArrowDownRight className="h-6 w-6 text-red-500" />
              <span>Sell StableCoins</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <TrendingUp className="h-6 w-6 text-blue-500" />
              <span>Buy ReserveCoins</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <TrendingDown className="h-6 w-6 text-orange-500" />
              <span>Sell ReserveCoins</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Protocol Health & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Protocol Health
            </CardTitle>
            <CardDescription>
              Key metrics and indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Oracle Price</span>
                <span className="text-sm">{formatPrice(oraclePrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ReserveCoin Target Price</span>
                <span className="text-sm">{formatPrice(rcTargetPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Protocol Status</span>
                <span className="text-sm text-green-500 font-medium">Healthy</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Advanced Analytics
            </CardTitle>
            <CardDescription>
              Detailed protocol metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Trading Fee</span>
                <span className="text-sm">{formatPercentage(fee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Treasury Fee</span>
                <span className="text-sm">{formatPercentage(treasuryFee)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transaction Limit</span>
                <span className="text-sm">{formatNumber(txLimit)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
