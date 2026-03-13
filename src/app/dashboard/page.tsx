"use client";
import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import {
  TrendingUp,
  DollarSign,
  Shield,
  Activity,
  BarChart3,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  GlowCard,
} from "@/components/ui";
import DJED_ABI from "@/utils/abi/Djed.json";
import COIN_ABI from "@/utils/abi/Coin.json";
import ORACLE_ABI from "@/utils/abi/IOracle.json";
import { useChainId, useChains, useFeeData } from "wagmi";
import {
  getContractAddresses,
  isDeployedAddress,
  type ChainId,
} from "@/utils/addresses";
import { useEffect, useCallback, useMemo } from "react";
import UnsupportedNetwork from "@/components/UnsupportedNetwork";

export default function Dashboard() {
  const chainId = useChainId();
  const chains = useChains();
  const chain = chains.find((c) => c.id === chainId);
  const { data: feeData } = useFeeData();
  const contracts = useMemo(() => {
    try {
      return getContractAddresses(chainId as ChainId);
    } catch {
      return null;
    }
  }, [chainId]);

  const djed = contracts?.djed;
  const stableCoin = contracts?.stableCoin;
  const reserveCoin = contracts?.reserveCoin;
  const oracle = contracts?.oracle;

  // Read protocol data
  const { data: ratio, refetch: refetchRatio } = useReadContract({
    address: djed as `0x${string}` | undefined,
    chainId,
    abi: DJED_ABI,
    functionName: "ratio",
    query: {
      enabled: isDeployedAddress(djed),
    },
  });

  const { data: reserveAmount, refetch: refetchReserveAmount } =
    useReadContract({
      address: djed as `0x${string}` | undefined,
      chainId,
      query: {
        enabled: isDeployedAddress(djed),
      },
      abi: DJED_ABI,
      functionName: "R",
      args: [0n],
    });

  const { refetch: refetchLiabilities } = useReadContract({
    address: djed as `0x${string}` | undefined,
    chainId,
    query: {
      enabled: isDeployedAddress(djed),
    },
    abi: DJED_ABI,
    functionName: "L",
  });

  const { data: scPrice, refetch: refetchScPrice } = useReadContract({
    address: djed as `0x${string}` | undefined,
    chainId,
    query: {
      enabled: isDeployedAddress(djed),
    },
    abi: DJED_ABI,
    functionName: "scPrice",
    args: [0n],
  });

  const { data: rcTargetPrice, refetch: refetchRcTargetPrice } =
    useReadContract({
      address: djed as `0x${string}` | undefined,
      chainId,
      query: {
        enabled: isDeployedAddress(djed),
      },
      abi: DJED_ABI,
      functionName: "rcTargetPrice",
      args: [0n],
    });

  const { data: oraclePrice, refetch: refetchOraclePrice } = useReadContract({
    address: oracle as `0x${string}` | undefined,
    chainId,
    abi: ORACLE_ABI,
    functionName: "readData",
    query: {
      enabled: isDeployedAddress(oracle),
    },
  });

  const { data: fee, refetch: refetchFee } = useReadContract({
    address: djed as `0x${string}` | undefined,
    chainId,
    query: {
      enabled: isDeployedAddress(djed),
    },
    abi: DJED_ABI,
    functionName: "fee",
  });

  const { data: treasuryFee, refetch: refetchTreasuryFee } = useReadContract({
    address: djed as `0x${string}` | undefined,
    chainId,
    query: {
      enabled: isDeployedAddress(djed),
    },
    abi: DJED_ABI,
    functionName: "treasuryFee",
  });

  const { data: txLimit, refetch: refetchTxLimit } = useReadContract({
    address: djed as `0x${string}` | undefined,
    chainId,
    query: {
      enabled: isDeployedAddress(djed),
    },
    abi: DJED_ABI,
    functionName: "txLimit",
  });

  // Read system-wide token supplies
  const { data: stablecoinTotalSupply, refetch: refetchStablecoinTotalSupply } =
    useReadContract({
      address: stableCoin as `0x${string}` | undefined,
      chainId,
      abi: COIN_ABI,
      functionName: "totalSupply",
      query: {
        enabled: isDeployedAddress(stableCoin),
      },
    });

  const {
    data: reserveCoinTotalSupply,
    refetch: refetchReserveCoinTotalSupply,
  } = useReadContract({
    address: reserveCoin as `0x${string}` | undefined,
    chainId,
    abi: COIN_ABI,
    functionName: "totalSupply",
    query: {
      enabled: isDeployedAddress(reserveCoin),
    },
  });

  const { data: baseCoinAddress, refetch: refetchBaseCoinAddress } =
    useReadContract({
      address: djed as `0x${string}` | undefined,
      chainId,
      query: {
        enabled: isDeployedAddress(djed),
      },
      abi: DJED_ABI,
      functionName: "baseCoin",
    });

  const handleRefresh = useCallback(() => {
    refetchRatio();
    refetchReserveAmount();
    refetchLiabilities();
    refetchScPrice();
    refetchRcTargetPrice();
    refetchOraclePrice();
    refetchFee();
    refetchTreasuryFee();
    refetchTxLimit();
    refetchStablecoinTotalSupply();
    refetchReserveCoinTotalSupply();
    refetchBaseCoinAddress();
  }, [
    refetchRatio,
    refetchReserveAmount,
    refetchLiabilities,
    refetchScPrice,
    refetchRcTargetPrice,
    refetchOraclePrice,
    refetchFee,
    refetchTreasuryFee,
    refetchTxLimit,
    refetchStablecoinTotalSupply,
    refetchReserveCoinTotalSupply,
    refetchBaseCoinAddress,
  ]);
  useEffect(() => {
    handleRefresh();
  }, [chainId, handleRefresh]);

  const formatNumber = (value: bigint | undefined, decimals: number = 18) => {
    if (!value) return "0";
    return parseFloat(formatUnits(value, decimals)).toFixed(4);
  };

  const formatPrice = (value: bigint | undefined, decimals: number = 18) => {
    if (!value) return "$0.00";
    return `$${parseFloat(formatUnits(value, decimals)).toFixed(2)}`;
  };

  const formatPercentage = (value: bigint | undefined) => {
    if (!value) return "0%";
    // Assuming percentage is stored as basis points (e.g., 400 = 4%)
    return `${parseFloat(formatUnits(value, 2))}%`;
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return "Loading...";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const calculateLeverageRatio = (ratio: bigint | undefined) => {
    if (!ratio) {
      return "—";
    }
    const ratioPercent = parseFloat(formatUnits(ratio, 2));
    const denominator = ratioPercent - 1;
    if (denominator <= 0) {
      return "—";
    }
    return (1 / denominator).toFixed(2);
  };

  const getProtocolStatus = (ratio: bigint | undefined) => {
    if (!ratio) {
      return { label: "Unknown", color: "text-gray-500" };
    }

    // Convert ratio to numeric percentage (assuming it's stored as basis points)
    const ratioPercent = parseFloat(formatUnits(ratio, 2));

    if (ratioPercent >= 400) {
      return { label: "Healthy", color: "text-green-500" };
    } else if (ratioPercent >= 200) {
      return { label: "Caution", color: "text-yellow-500" };
    } else {
      return { label: "At Risk", color: "text-red-500" };
    }
  };
  const protocolStatus = getProtocolStatus(ratio as bigint | undefined);

  return (
    <>
      {!contracts ? (
        <UnsupportedNetwork />
      ) : (
        <div className="relative min-h-screen overflow-hidden">
          {/* Animated Background */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-background" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">
                  Monitor Djed Protocol system health and analytics
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Network Badge */}
                <div
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    chain?.testnet
                      ? "bg-yellow-500/20 text-yellow-600 border border-yellow-500/30"
                      : "bg-green-500/20 text-green-600 border border-green-500/30"
                  }`}
                >
                  {chain?.name ?? "Unknown Network"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Gas:{" "}
                  {feeData?.gasPrice
                    ? `${parseFloat(formatUnits(feeData.gasPrice, 9)).toFixed(2)} Gwei`
                    : feeData?.maxFeePerGas
                      ? `${parseFloat(
                          formatUnits(feeData.maxFeePerGas, 9),
                        ).toFixed(2)} Gwei`
                      : "Loading..."}
                </div>

                <Button onClick={handleRefresh} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Protocol Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <GlowCard>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Stablecoin Price
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPrice(scPrice as bigint | undefined)}
                  </div>
                  <p className="text-xs text-muted-foreground">Target: $1.00</p>
                </CardContent>
              </GlowCard>

              <GlowCard>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Reserve Ratio
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPercentage(ratio as bigint)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Protocol health indicator
                  </p>
                </CardContent>
              </GlowCard>

              <GlowCard>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Reserves
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(reserveAmount as bigint)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    BaseCoin reserves
                  </p>
                </CardContent>
              </GlowCard>

              <GlowCard>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Leverage Ratio
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {calculateLeverageRatio(ratio as bigint)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    1 / (Reserve Ratio - 1)
                  </p>
                </CardContent>
              </GlowCard>
            </div>

            {/* System Token Supply */}
            <GlowCard>
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
                      <span className="text-sm font-medium">
                        Stablecoins (SC)
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold">
                      {formatNumber(stablecoinTotalSupply as bigint)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total supply in circulation
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Leveraged Yield Coins (LYC)
                      </span>
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
                      <span className="text-sm font-medium">
                        BaseCoin Address
                      </span>
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
            </GlowCard>

            {/* System Actions */}
            <GlowCard>
              <CardHeader>
                <CardTitle>System Actions</CardTitle>
                <CardDescription>
                  Navigate to different sections of the Djed Protocol
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    variant="outline"
                  >
                    <Wallet className="h-6 w-6 text-blue-500" />
                    <span>View Portfolio</span>
                  </Button>
                  <Button
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    variant="outline"
                  >
                    <Activity className="h-6 w-6 text-green-500" />
                    <span>Start Trading</span>
                  </Button>
                  <Button
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    variant="outline"
                  >
                    <BarChart3 className="h-6 w-6 text-purple-500" />
                    <span>Analytics</span>
                  </Button>
                  <Button
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    variant="outline"
                  >
                    <Shield className="h-6 w-6 text-orange-500" />
                    <span>Protocol Info</span>
                  </Button>
                </div>
              </CardContent>
            </GlowCard>

            {/* Protocol Health & Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GlowCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Protocol Health
                  </CardTitle>
                  <CardDescription>Key metrics and indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Oracle Price</span>
                      <span className="text-sm">
                        {formatPrice(oraclePrice as bigint)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Leveraged Yield Coin Target Price
                      </span>
                      <span className="text-sm">
                        {formatPrice(rcTargetPrice as bigint)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Protocol Status
                      </span>
                      <span
                        className={`text-sm ${protocolStatus.color} font-medium`}
                      >
                        {protocolStatus.label}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </GlowCard>

              <GlowCard>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Advanced Analytics
                  </CardTitle>
                  <CardDescription>Detailed protocol metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Trading Fee</span>
                      <span className="text-sm">
                        {formatPercentage(fee as bigint)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Treasury Fee</span>
                      <span className="text-sm">
                        {formatPercentage(treasuryFee as bigint)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Transaction Limit
                      </span>
                      <span className="text-sm">
                        {formatNumber(txLimit as bigint)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </GlowCard>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
