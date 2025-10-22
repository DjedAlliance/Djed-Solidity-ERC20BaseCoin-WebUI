'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
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
  const { data: ratio, refetch: refetchRatio } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'ratio',
  });

  const { data: reserveAmount, refetch: refetchReserveAmount } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'R',
    args: [0n],
  });

  const { data: liabilities, refetch: refetchLiabilities } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'L',
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

  const { data: fee, refetch: refetchFee } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'fee',
  });

  const { data: treasuryFee, refetch: refetchTreasuryFee } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'treasuryFee',
  });

  const { data: txLimit, refetch: refetchTxLimit } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'txLimit',
  });

  // Read system-wide token supplies
  const { data: stableCoinTotalSupply, refetch: refetchStableCoinTotalSupply } = useReadContract({
    address: STABLE_COIN_ADDRESS,
    abi: COIN_ABI,
    functionName: 'totalSupply',
  });

  const { data: reserveCoinTotalSupply, refetch: refetchReserveCoinTotalSupply } = useReadContract({
    address: RESERVE_COIN_ADDRESS,
    abi: COIN_ABI,
    functionName: 'totalSupply',
  });

  const { data: baseCoinAddress, refetch: refetchBaseCoinAddress } = useReadContract({
    address: DJED_ADDRESS,
    abi: DJED_ABI,
    functionName: 'baseCoin',
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    // Refetch all contract data
    refetchRatio();
    refetchReserveAmount();
    refetchLiabilities();
    refetchScPrice();
    refetchRcTargetPrice();
    refetchOraclePrice();
    refetchFee();
    refetchTreasuryFee();
    refetchTxLimit();
    refetchStableCoinTotalSupply();
    refetchReserveCoinTotalSupply();
    refetchBaseCoinAddress();
  };

  const formatNumber = (value: bigint | undefined, decimals: number = 18) => {
    if (!value) return '0';
    return parseFloat(formatUnits(value, decimals)).toFixed(4);
  };

  const formatPrice = (value: bigint | undefined, decimals: number = 18) => {
    if (!value) return '$0.00';
    return `$${parseFloat(formatUnits(value, decimals)).toFixed(2)}`;
  };

  const formatPercentage = (value: bigint | undefined) => {
    if (!value) return '0%';
    // Assuming percentage is stored as basis points (e.g., 400 = 4%)
    return `${parseFloat(formatUnits(value, 2))}%`;
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return 'Loading...';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getProtocolStatus = (ratio: bigint | undefined) => {
    if (!ratio) {
      return { label: 'Unknown', color: 'text-gray-500' };
    }
    
    // Convert ratio to numeric percentage (assuming it's stored as basis points)
    const ratioPercent = parseFloat(formatUnits(ratio, 2));
    
    if (ratioPercent >= 400) {
      return { label: 'Healthy', color: 'text-green-500' };
    } else if (ratioPercent >= 200) {
      return { label: 'Caution', color: 'text-yellow-500' };
    } else {
      return { label: 'At Risk', color: 'text-red-500' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor Djed Protocol system health and analytics
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
            <div className="text-2xl font-bold">{formatPrice(scPrice as bigint)}</div>
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
            <div className="text-2xl font-bold">{formatPercentage(ratio as bigint)}</div>
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
            <div className="text-2xl font-bold">{formatNumber(reserveAmount as bigint)}</div>
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
            <div className="text-2xl font-bold">{formatNumber(liabilities as bigint)}</div>
            <p className="text-xs text-muted-foreground">
              Outstanding StableCoins
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Token Supply */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            System Token Supply
          </CardTitle>
          <CardDescription>
            Total supply of tokens in the Djed Protocol
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
                {formatNumber(stableCoinTotalSupply as bigint)}
              </div>
              <div className="text-sm text-muted-foreground">
                Total supply in circulation
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ReserveCoins (RC)</span>
                <ArrowDownRight className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">
                {formatNumber(reserveCoinTotalSupply as bigint)}
              </div>
              <div className="text-sm text-muted-foreground">
                Total supply in circulation
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">BaseCoin Address</span>
                <Activity className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-sm font-mono break-all">
                {formatAddress(baseCoinAddress as string)}
              </div>
              <div className="text-sm text-muted-foreground">
                Collateral asset contract
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Actions</CardTitle>
          <CardDescription>
            Navigate to different sections of the Djed Protocol
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <Wallet className="h-6 w-6 text-blue-500" />
              <span>View Portfolio</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <Activity className="h-6 w-6 text-green-500" />
              <span>Start Trading</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <BarChart3 className="h-6 w-6 text-purple-500" />
              <span>Analytics</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2" variant="outline">
              <Shield className="h-6 w-6 text-orange-500" />
              <span>Protocol Info</span>
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
                <span className="text-sm">{formatPrice(oraclePrice as bigint)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ReserveCoin Target Price</span>
                <span className="text-sm">{formatPrice(rcTargetPrice as bigint)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Protocol Status</span>
                <span className={`text-sm ${getProtocolStatus(ratio as bigint).color} font-medium`}>
                  {getProtocolStatus(ratio as bigint).label}
                </span>
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
                <span className="text-sm">{formatPercentage(fee as bigint)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Treasury Fee</span>
                <span className="text-sm">{formatPercentage(treasuryFee as bigint)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transaction Limit</span>
                <span className="text-sm">{formatNumber(txLimit as bigint)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
