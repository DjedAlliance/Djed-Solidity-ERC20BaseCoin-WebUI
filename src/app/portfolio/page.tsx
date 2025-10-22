'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  PieChart,
  BarChart3,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Shield,
  Zap
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Button,
  Separator,
  Progress
} from '@/components/ui';
import DJED_ABI from '@/utils/abi/Djed.json';
import COIN_ABI from '@/utils/abi/Coin.json';
import ORACLE_ABI from '@/utils/abi/IOracle.json';
import { DJED_ADDRESS, STABLE_COIN_ADDRESS, RESERVE_COIN_ADDRESS, ORACLE_ADDRESS } from '@/utils/addresses';

export default function Portfolio() {
  const { address, isConnected } = useAccount();
  const [refreshKey, setRefreshKey] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  // Read protocol data
  const { data: ratio, refetch: refetchRatio } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'ratio',
  });

  const { data: scPrice, refetch: refetchScPrice } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'scPrice',
    args: [0n],
  });

  const { data: rcTargetPrice, refetch: refetchRcTargetPrice } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'rcTargetPrice',
    args: [0n],
  });

  const { data: oraclePrice, refetch: refetchOraclePrice } = useReadContract({
    address: ORACLE_ADDRESS,
    abi: ORACLE_ABI,
    functionName: 'readData',
  });

  // Read user balances
  const { data: stableCoinBalance, refetch: refetchStableCoinBalance } = useReadContract({
    address: STABLE_COIN_ADDRESS,
    abi: COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: reserveCoinBalance, refetch: refetchReserveCoinBalance } = useReadContract({
    address: RESERVE_COIN_ADDRESS,
    abi: COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: baseCoinAddress, refetch: refetchBaseCoinAddress } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'baseCoin',
  });

  const { data: userBaseCoinBalance, refetch: refetchUserBaseCoinBalance } = useReadContract({
    address: baseCoinAddress,
    abi: COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Calculate total portfolio value
  useEffect(() => {
    if (stableCoinBalance && reserveCoinBalance && userBaseCoinBalance && scPrice && rcTargetPrice && oraclePrice) {
      const scValue = getAssetValue(stableCoinBalance, scPrice);
      const rcValue = getAssetValue(reserveCoinBalance, rcTargetPrice);
      const bcValue = getAssetValue(userBaseCoinBalance, oraclePrice);
      setTotalValue(scValue + rcValue + bcValue);
    }
  }, [stableCoinBalance, reserveCoinBalance, userBaseCoinBalance, scPrice, rcTargetPrice, oraclePrice]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    // Refetch all contract data
    refetchRatio();
    refetchScPrice();
    refetchRcTargetPrice();
    refetchOraclePrice();
    refetchStableCoinBalance();
    refetchReserveCoinBalance();
    refetchBaseCoinAddress();
    refetchUserBaseCoinBalance();
  };

  const formatNumber = (value: bigint | undefined, decimals: number = 18, precision = 4) => {
    if (!value) return '0';
    return Number(formatUnits(value, decimals)).toFixed(precision);
  };

  const formatPrice = (value: bigint | undefined, decimals: number = 18, precision = 2) => {
    if (!value) return '$0.00';
    return `$${Number(formatUnits(value, decimals)).toFixed(precision)}`;
  };

  const formatPercentage = (value: bigint | undefined) => {
    if (!value) return '0%';
    return `${(Number(value) / 100).toFixed(2)}%`;
  };

  const getAssetValue = (
    balance: bigint | undefined,
    price: bigint | undefined,
    balanceDecimals = 18,
    priceDecimals = 18
  ) => {
    if (!balance || !price) return 0;
    const b = Number(formatUnits(balance, balanceDecimals));
    const p = Number(formatUnits(price, priceDecimals));
    return b * p;
  };

  const getAssetPercentage = (assetValue: number) => {
    if (totalValue === 0) return 0;
    return (assetValue / totalValue) * 100;
  };

  if (!isConnected) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Wallet className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Wallet Not Connected</h2>
            <p className="text-muted-foreground text-center">
              Please connect your wallet to view your portfolio
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scValue = getAssetValue(stableCoinBalance, scPrice);
  const rcValue = getAssetValue(reserveCoinBalance, rcTargetPrice);
  const bcValue = getAssetValue(userBaseCoinBalance, oraclePrice);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">
            Your Djed Protocol holdings and performance
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Portfolio value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">StableCoins</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stableCoinBalance)}</div>
            <p className="text-xs text-muted-foreground">
              ${scValue.toFixed(2)} ({getAssetPercentage(scValue).toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ReserveCoins</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(reserveCoinBalance)}</div>
            <p className="text-xs text-muted-foreground">
              ${rcValue.toFixed(2)} ({getAssetPercentage(rcValue).toFixed(1)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">BaseCoins</CardTitle>
            <Zap className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(userBaseCoinBalance)}</div>
            <p className="text-xs text-muted-foreground">
              ${bcValue.toFixed(2)} ({getAssetPercentage(bcValue).toFixed(1)}%)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Asset Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Asset Allocation
            </CardTitle>
            <CardDescription>
              Distribution of your portfolio across different assets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium">StableCoins</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{getAssetPercentage(scValue).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">${scValue.toFixed(2)}</div>
                </div>
              </div>
              <Progress value={getAssetPercentage(scValue)} className="h-2" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm font-medium">ReserveCoins</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{getAssetPercentage(rcValue).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">${rcValue.toFixed(2)}</div>
                </div>
              </div>
              <Progress value={getAssetPercentage(rcValue)} className="h-2" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span className="text-sm font-medium">BaseCoins</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{getAssetPercentage(bcValue).toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground">${bcValue.toFixed(2)}</div>
                </div>
              </div>
              <Progress value={getAssetPercentage(bcValue)} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Asset Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Asset Details
            </CardTitle>
            <CardDescription>
              Detailed information about each asset
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">StableCoins</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{formatNumber(stableCoinBalance)} SC</div>
                  <div className="text-xs text-muted-foreground">{formatPrice(scPrice)} each</div>
                </div>
              </div>
              <Separator />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">ReserveCoins</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{formatNumber(reserveCoinBalance)} RC</div>
                  <div className="text-xs text-muted-foreground">{formatPrice(rcTargetPrice)} each</div>
                </div>
              </div>
              <Separator />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">BaseCoins</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{formatNumber(userBaseCoinBalance)} BC</div>
                  <div className="text-xs text-muted-foreground">{formatPrice(oraclePrice)} each</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common trading operations for your portfolio
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

      {/* Protocol Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Protocol Health
          </CardTitle>
          <CardDescription>
            Current state of the Djed Protocol
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{formatPercentage(ratio)}</div>
              <div className="text-sm text-muted-foreground">Reserve Ratio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatPrice(scPrice)}</div>
              <div className="text-sm text-muted-foreground">StableCoin Price</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{formatPrice(rcTargetPrice)}</div>
              <div className="text-sm text-muted-foreground">ReserveCoin Target</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
