/* eslint-disable */
// @ts-nocheck
'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import {
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Separator,
  Alert,
  AlertDescription,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui';
import DJED_ABI from '@/utils/abi/Djed.json';
import COIN_ABI from '@/utils/abi/Coin.json';
import { DJED_ADDRESS, STABLE_COIN_ADDRESS, RESERVE_COIN_ADDRESS } from '@/utils/addresses';

type TradeType = 'buy-stable' | 'sell-stable' | 'buy-reserve' | 'sell-reserve' | 'sell-both';

function TradePage() {
  const searchParams = useSearchParams();
  const contractAddress = searchParams.get('address') || DJED_ADDRESS;
  const { address, isConnected } = useAccount();
  const [tradeType, setTradeType] = useState<TradeType>('buy-stable');
  const [amount, setAmount] = useState('');
  const [amountRC, setAmountRC] = useState(''); // For sell-both
  const [receiver, setReceiver] = useState('');
  const [feeUI, setFeeUI] = useState('0');
  const [ui, setUI] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimatedAmount, setEstimatedAmount] = useState('0');

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  
  // Separate state for approval transaction
  const [approvalHash, setApprovalHash] = useState<`0x${string}` | undefined>();
  const { isLoading: isApprovalConfirming, isSuccess: isApprovalConfirmed } = useWaitForTransactionReceipt({ 
    hash: approvalHash 
  });



  // Read contract data
  const { data: baseCoinAddress } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DJED_ABI,
    functionName: 'baseCoin',
  });

  const { data: baseCoinBalance } = useReadContract({
    address: baseCoinAddress as `0x${string}`,
    abi: COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: baseCoinAllowance } = useReadContract({
    address: baseCoinAddress as `0x${string}`,
    abi: COIN_ABI,
    functionName: 'allowance',
    args: address && contractAddress ? [address, contractAddress] : undefined,
  });

  const { data: stableCoinBalance } = useReadContract({
    address: STABLE_COIN_ADDRESS,
    abi: COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: stableCoinAllowance } = useReadContract({
    address: STABLE_COIN_ADDRESS,
    abi: COIN_ABI,
    functionName: 'allowance',
    args: address && contractAddress ? [address, contractAddress] : undefined,
  });

  const { data: reserveCoinBalance } = useReadContract({
    address: RESERVE_COIN_ADDRESS,
    abi: COIN_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  const { data: reserveCoinAllowance } = useReadContract({
    address: RESERVE_COIN_ADDRESS,
    abi: COIN_ABI,
    functionName: 'allowance',
    args: address && contractAddress ? [address, contractAddress] : undefined,
  });

  const { data: scPrice } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DJED_ABI,
    functionName: 'scPrice',
    args: [BigInt(0)],
  });

  const { data: rcTargetPrice } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DJED_ABI,
    functionName: 'rcTargetPrice',
    args: [BigInt(0)],
  });

  const { data: fee } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DJED_ABI,
    functionName: 'fee',
  });

  const { data: treasuryFee } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DJED_ABI,
    functionName: 'treasuryFee',
  });

  const { data: txLimit } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: DJED_ABI,
    functionName: 'txLimit',
  });

  // Calculate estimated amounts
  useEffect(() => {
    if (amount && scPrice) {
      setIsCalculating(true);
      try {
        const amountBN = parseUnits(amount, 18);
        const priceBN = scPrice as bigint;
        
        // Constants for BigInt arithmetic
        const DECIMALS = 10n ** 18n; // 18 decimal places
        const OUTPUT_DECIMALS = 10n ** 6n; // 6 decimal places for output
        
        let estimatedScaled: bigint;
        
        if (tradeType === 'buy-stable' || tradeType === 'buy-reserve') {
          // For buying: amount * DECIMALS / price = tokens received
          // This gives us the result in 18-decimal precision
          estimatedScaled = (amountBN * DECIMALS) / priceBN;
        } else if (tradeType === 'sell-stable') {
          // For selling stablecoins: amount * price / DECIMALS = basecoins received
          estimatedScaled = (amountBN * priceBN) / DECIMALS;
        } else if (tradeType === 'sell-reserve') {
          // For selling Leveraged Yield Coins: amount * target price / DECIMALS = basecoins received
          const targetPrice = rcTargetPrice as bigint;
          estimatedScaled = (amountBN * targetPrice) / DECIMALS;
        } else {
          estimatedScaled = 0n;
        }
        
        // Convert to 6-decimal precision for display
        const scaledForOutput = (estimatedScaled * OUTPUT_DECIMALS) / DECIMALS;
        const integerPart = scaledForOutput / OUTPUT_DECIMALS;
        const fractionalPart = scaledForOutput % OUTPUT_DECIMALS;
        
        // Format with 6 decimal places
        const fractionalStr = fractionalPart.toString().padStart(6, '0').slice(0, 6);
        const estimated = `${integerPart.toString()}.${fractionalStr}`;
        
        setEstimatedAmount(estimated);
      } catch (error) {
        console.error('Error calculating estimated amount:', error);
        setEstimatedAmount('0');
      } finally {
        setIsCalculating(false);
      }
    } else {
      setEstimatedAmount('0');
    }
  }, [amount, scPrice, rcTargetPrice, tradeType]);

  // Set default receiver to user's address
  useEffect(() => {
    if (address && !receiver) {
      setReceiver(address);
    }
  }, [address, receiver]);

  const executeTrade = useCallback(async () => {
    if (!amount || !receiver || !address) return;

    try {
      const amountBN = parseUnits(amount, 18);
      const amountRCBN = amountRC ? parseUnits(amountRC, 18) : 0n;
      
      // Safely parse feeUI to BigInt, defaulting to 0n for invalid input
      const safeParseBigInt = (value: string): bigint => {
        const trimmed = value.trim();
        if (!trimmed || trimmed === '') return 0n;
        
        // Check if the string contains only digits (and optional leading minus)
        if (!/^-?\d+$/.test(trimmed)) return 0n;
        
        try {
          return BigInt(trimmed);
        } catch {
          return 0n;
        }
      };
      
      const feeUIBn = safeParseBigInt(feeUI);
      const uiAddress = ui || address;

      console.log('Executing trade:', {
        tradeType,
        amount: amountBN.toString(),
        receiver,
        feeUI: feeUIBn.toString(),
        uiAddress,
        baseCoinAddress
      });

      switch (tradeType) {
        case 'buy-stable':
          writeContract({
            address: contractAddress as `0x${string}`,
            abi: DJED_ABI,
            functionName: 'buyStablecoins',
            args: [receiver, feeUIBn, uiAddress, amountBN],
            gas: BigInt(8000000), // 8M gas limit - reduced from 15M
          });
          break;
        case 'sell-stable':
          writeContract({
            address: contractAddress as `0x${string}`,
            abi: DJED_ABI,
            functionName: 'sellStablecoins',
            args: [amountBN, receiver, feeUIBn, uiAddress],
          });
          break;
        case 'buy-reserve':
          writeContract({
            address: contractAddress as `0x${string}`,
            abi: DJED_ABI,
            functionName: 'buyReserveCoins',
            args: [receiver, feeUIBn, uiAddress, amountBN],
            gas: BigInt(8000000), // 8M gas limit - reduced from 15M
          });
          break;
        case 'sell-reserve':
          writeContract({
            address: contractAddress as `0x${string}`,
            abi: DJED_ABI,
            functionName: 'sellReserveCoins',
            args: [amountBN, receiver, feeUIBn, uiAddress],
          });
          break;
        case 'sell-both':
          writeContract({
            address: contractAddress as `0x${string}`,
            abi: DJED_ABI,
            functionName: 'sellBothCoins',
            args: [amountBN, amountRCBN, receiver, feeUIBn, uiAddress],
          });
          break;
      }
    } catch (err) {
      console.error('Error executing trade:', err);
    }
  }, [amount, receiver, address, tradeType, amountRC, feeUI, ui, baseCoinAddress, writeContract, contractAddress]);

  // Auto-retry trade after successful approval
  useEffect(() => {
    if (isApprovalConfirmed && approvalHash) {
      // Clear the approval hash and execute the trade
      setApprovalHash(undefined);
      executeTrade();
    }
  }, [isApprovalConfirmed, approvalHash, executeTrade]);

  const formatNumber = (value: bigint | undefined, decimals: number = 18) => {
    if (!value) return '0';
    return (Number(value) / Math.pow(10, decimals)).toFixed(4);
  };

  const formatPrice = (value: bigint | undefined, decimals: number = 18) => {
    if (!value) return '$0.00';
    return `$${(Number(value) / Math.pow(10, decimals)).toFixed(4)}`;
  };

  const formatPercentage = (value: bigint | undefined) => {
    if (!value) return '0%';
    // Assuming percentage is stored as basis points (e.g., 400 = 4%)
    return `${parseFloat(formatUnits(value, 2))}%`;
  };

  const handleTrade = async () => {
    if (!amount || !receiver || !address) return;

    // Check if approval is needed for buy operations (BaseCoin approval)
    if ((tradeType === 'buy-stable' || tradeType === 'buy-reserve') && baseCoinAddress) {
      const amountBN = parseUnits(amount, 18);
      const currentAllowance = (baseCoinAllowance as bigint) ?? 0n;
      
      if (currentAllowance < amountBN) {
        // First approve the Djed contract to spend BaseCoins
        const approvalTxHash = await writeContract({
          address: baseCoinAddress as `0x${string}`,
          abi: COIN_ABI,
          functionName: 'approve',
          args: [contractAddress, amountBN],
          gas: BigInt(100000), // 100K gas for approve
        });
        
        setApprovalHash(approvalTxHash as `0x${string}` | undefined);
        // Wait for approval confirmation before proceeding
        return; // Exit here, the actual trade will be triggered after approval
      }
    }

    // Check if approval is needed for sell operations (Stablecoin/Leveraged Yield Coin approval)
    if (tradeType === 'sell-stable' && STABLE_COIN_ADDRESS) {
      const amountBN = parseUnits(amount, 18);
      const currentAllowance = (stableCoinAllowance as bigint) ?? 0n;
      
      if (currentAllowance < amountBN) {
        // First approve the Djed contract to spend Stablecoins
        const approvalTxHash = await writeContract({
          address: STABLE_COIN_ADDRESS as `0x${string}`,
          abi: COIN_ABI,
          functionName: 'approve',
          args: [contractAddress, amountBN],
          gas: BigInt(100000), // 100K gas for approve
        });
        
        setApprovalHash(approvalTxHash as `0x${string}` | undefined);
        return; // Exit here, the actual trade will be triggered after approval
      }
    }

    if (tradeType === 'sell-reserve' && RESERVE_COIN_ADDRESS) {
      const amountBN = parseUnits(amount, 18);
      const currentAllowance = (reserveCoinAllowance as bigint) ?? 0n;
      
      if (currentAllowance < amountBN) {
        // First approve the Djed contract to spend Leveraged Yield Coins
        const approvalTxHash = await writeContract({
          address: RESERVE_COIN_ADDRESS as `0x${string}`,
          abi: COIN_ABI,
          functionName: 'approve',
          args: [contractAddress, amountBN],
          gas: BigInt(100000), // 100K gas for approve
        });
        
        setApprovalHash(approvalTxHash as `0x${string}` | undefined);
        return; // Exit here, the actual trade will be triggered after approval
      }
    }

    if (tradeType === 'sell-both' && STABLE_COIN_ADDRESS && RESERVE_COIN_ADDRESS) {
      const amountBN = parseUnits(amount, 18);
      const amountRCBN = amountRC ? parseUnits(amountRC, 18) : 0n;
      const stableAllowance = (stableCoinAllowance as bigint) ?? 0n;
      const reserveAllowance = (reserveCoinAllowance as bigint) ?? 0n;
      
      // Check Stablecoin approval
      if (stableAllowance < amountBN) {
        const approvalTxHash = await writeContract({
          address: STABLE_COIN_ADDRESS as `0x${string}`,
          abi: COIN_ABI,
          functionName: 'approve',
          args: [contractAddress, amountBN],
          gas: BigInt(100000),
        });
        
        setApprovalHash(approvalTxHash as `0x${string}` | undefined);
        return;
      }
      
      // Check Leveraged Yield Coin approval
      if (reserveAllowance < amountRCBN) {
        const approvalTxHash = await writeContract({
          address: RESERVE_COIN_ADDRESS as `0x${string}`,
          abi: COIN_ABI,
          functionName: 'approve',
          args: [contractAddress, amountRCBN],
          gas: BigInt(100000),
        });
        
        setApprovalHash(approvalTxHash as `0x${string}` | undefined);
        return;
      }
    }

    // For operations that don't need approval or when approval is not needed, execute trade directly
    await executeTrade();
  };

  const getTradeIcon = () => {
    switch (tradeType) {
      case 'buy-stable':
      case 'buy-reserve':
        return <ArrowUpRight className="h-8 w-8 text-green-500" />;
      case 'sell-stable':
      case 'sell-reserve':
      case 'sell-both':
        return <ArrowDownRight className="h-8 w-8 text-red-500" />;
      default:
        return <DollarSign className="h-8 w-8 text-blue-500" />;
    }
  };

  const getTradeTitle = () => {
    switch (tradeType) {
      case 'buy-stable':
        return 'Mint Stablecoins';
      case 'sell-stable':
        return 'Redeem Stablecoins';
      case 'buy-reserve':
        return 'Mint Leveraged Yield Coins';
      case 'sell-reserve':
        return 'Redeem Leveraged Yield Coins';
      case 'sell-both':
        return 'Redeem Both Coins';
      default:
        return 'Trade';
    }
  };

  const getTradeDescription = () => {
    switch (tradeType) {
      case 'buy-stable':
        return 'Exchange your BaseCoins for Stablecoins at the current market price.';
      case 'sell-stable':
        return 'Exchange your Stablecoins back to BaseCoins at the current market price.';
      case 'buy-reserve':
        return 'Exchange your BaseCoins for Leveraged Yield Coins at the current market price.';
      case 'sell-reserve':
        return 'Exchange your Leveraged Yield Coins back to BaseCoins at the current market price.';
      case 'sell-both':
        return 'Exchange both your Stablecoins and Leveraged Yield Coins back to BaseCoins.';
      default:
        return 'Trade your tokens on the Djed protocol.';
    }
  };

  const getAmountLabel = () => {
    switch (tradeType) {
      case 'buy-stable':
      case 'buy-reserve':
        return 'Amount (BaseCoins)';
      case 'sell-stable':
        return 'Amount (Stablecoins)';
      case 'sell-reserve':
        return 'Amount (Leveraged Yield Coins)';
      case 'sell-both':
        return 'Amount (Stablecoins)';
      default:
        return 'Amount';
    }
  };

  const getBalance = () => {
    switch (tradeType) {
      case 'buy-stable':
      case 'buy-reserve':
        return baseCoinBalance;
      case 'sell-stable':
        return stableCoinBalance;
      case 'sell-reserve':
        return reserveCoinBalance;
      case 'sell-both':
        return stableCoinBalance;
      default:
        return BigInt(0);
    }
  };

  const getBalanceLabel = () => {
    switch (tradeType) {
      case 'buy-stable':
      case 'buy-reserve':
        return 'BC';
      case 'sell-stable':
        return 'SC';
      case 'sell-reserve':
        return 'RC';
      case 'sell-both':
        return 'SC';
      default:
        return '';
    }
  };

  const getOutputTokenLabel = () => {
    switch (tradeType) {
      case 'buy-stable':
        return 'SC';
      case 'buy-reserve':
        return 'RC';
      case 'sell-stable':
      case 'sell-reserve':
      case 'sell-both':
        return 'BC';
      default:
        return '';
    }
  };

  const getEstimatedLabel = () => {
    switch (tradeType) {
      case 'buy-stable':
        return 'Estimated SC to receive';
      case 'sell-stable':
        return 'Estimated BC to receive';
      case 'buy-reserve':
        return 'Estimated RC to receive';
      case 'sell-reserve':
        return 'Estimated BC to receive';
      case 'sell-both':
        return 'Estimated BC to receive';
      default:
        return 'Estimated amount';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Wallet Not Connected
            </CardTitle>
            <CardDescription>
              Please connect your wallet to start trading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You need to connect your wallet to interact with the Djed protocol.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{getTradeTitle()}</h1>
          <p className="text-muted-foreground">{getTradeDescription()}</p>
        </div>
        <div className="flex items-center gap-2">
          {getTradeIcon()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trading Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Trading Form
              </CardTitle>
              <CardDescription>
                Select your trading operation and enter the details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trade Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="trade-type">Trade Type</Label>
                <Select value={tradeType} onValueChange={(value) => setTradeType(value as TradeType)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trade type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy-stable">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        Mint Stablecoins
                      </div>
                    </SelectItem>
                    <SelectItem value="sell-stable">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                        Redeem Stablecoins
                      </div>
                    </SelectItem>
                    <SelectItem value="buy-reserve">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-blue-500" />
                        Mint Leveraged Yield Coins
                      </div>
                    </SelectItem>
                    <SelectItem value="sell-reserve">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-orange-500" />
                        Redeem Leveraged Yield Coins
                      </div>
                    </SelectItem>
                    <SelectItem value="sell-both">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-4 w-4 text-purple-500" />
                        Redeem Both Coins
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">{getAmountLabel()}</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.000001"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Balance: {formatNumber(getBalance() as bigint | undefined)} {getBalanceLabel()}</span>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setAmount(formatNumber(getBalance() as bigint))}
                  >
                    Max
                  </Button>
                </div>
              </div>

              {/* Approval Status for Mint Operations */}
              {(tradeType === 'buy-stable' || tradeType === 'buy-reserve') && baseCoinAddress && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">BaseCoin Allowance:</span>
                    <span className="font-medium">
                      {formatNumber(baseCoinAllowance as bigint)} / {formatNumber(amount ? parseUnits(amount, 18) : 0n)} needed
                    </span>
                  </div>
                  {baseCoinAllowance && amount && baseCoinAllowance < parseUnits(amount, 18) && (
                    <div className="mt-2 text-xs text-orange-500">
                      ⚠️ Approval required - transaction will include approval step
                    </div>
                  )}
                </div>
              )}

              {/* Approval Status for Redeem Operations */}
              {tradeType === 'sell-stable' && STABLE_COIN_ADDRESS && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stablecoin Allowance:</span>
                    <span className="font-medium">
                      {formatNumber(stableCoinAllowance as bigint)} / {formatNumber(amount ? parseUnits(amount, 18) : 0n)} needed
                    </span>
                  </div>
                  {stableCoinAllowance && amount && stableCoinAllowance < parseUnits(amount, 18) && (
                    <div className="mt-2 text-xs text-orange-500">
                      ⚠️ Approval required - transaction will include approval step
                    </div>
                  )}
                </div>
              )}

              {tradeType === 'sell-reserve' && RESERVE_COIN_ADDRESS && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Leveraged Yield Coin Allowance:</span>
                    <span className="font-medium">
                      {formatNumber(reserveCoinAllowance as bigint)} / {formatNumber(amount ? parseUnits(amount, 18) : 0n)} needed
                    </span>
                  </div>
                  {reserveCoinAllowance && amount && reserveCoinAllowance < parseUnits(amount, 18) && (
                    <div className="mt-2 text-xs text-orange-500">
                      ⚠️ Approval required - transaction will include approval step
                    </div>
                  )}
                </div>
              )}

              {tradeType === 'sell-both' && STABLE_COIN_ADDRESS && RESERVE_COIN_ADDRESS && (
                <div className="p-3 bg-muted rounded-lg space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stablecoin Allowance:</span>
                    <span className="font-medium">
                      {formatNumber(stableCoinAllowance as bigint)} / {formatNumber(amount ? parseUnits(amount, 18) : 0n)} needed
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Leveraged Yield Coin Allowance:</span>
                    <span className="font-medium">
                      {formatNumber(reserveCoinAllowance as bigint)} / {formatNumber(amountRC ? parseUnits(amountRC, 18) : 0n)} needed
                    </span>
                  </div>
                  {((stableCoinAllowance && amount && stableCoinAllowance < parseUnits(amount, 18)) ||
                    (reserveCoinAllowance && amountRC && reserveCoinAllowance < parseUnits(amountRC, 18))) && (
                    <div className="mt-2 text-xs text-orange-500">
                      ⚠️ Approval required - transaction will include approval step
                    </div>
                  )}
                </div>
              )}

              {/* Leveraged Yield Coin Amount (for sell-both) */}
              {tradeType === 'sell-both' && (
                <div className="space-y-2">
                  <Label htmlFor="amountRC">Amount (Leveraged Yield Coins)</Label>
                  <Input
                    id="amountRC"
                    type="number"
                    placeholder="0.0"
                    value={amountRC}
                    onChange={(e) => setAmountRC(e.target.value)}
                    step="0.000001"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Balance: {formatNumber(reserveCoinBalance as bigint)} RC</span>
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setAmountRC(formatNumber(reserveCoinBalance as bigint))}
                    >
                      Max
                    </Button>
                  </div>
                </div>
              )}

              {/* Receiver Address */}
              <div className="space-y-2">
                <Label htmlFor="receiver">Receiver Address</Label>
                <Input
                  id="receiver"
                  placeholder="0x..."
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Address that will receive the tokens
                </p>
              </div>

              {/* Optional Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feeUI">Fee UI (Optional)</Label>
                  <Input
                    id="feeUI"
                    type="number"
                    placeholder="0"
                    value={feeUI}
                    onChange={(e) => setFeeUI(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ui">UI Address (Optional)</Label>
                  <Input
                    id="ui"
                    placeholder="0x..."
                    value={ui}
                    onChange={(e) => setUI(e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              {/* Trade Summary */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Current Price:</span>
                  <span className="text-sm">{formatPrice(scPrice as bigint)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{getEstimatedLabel()}:</span>
                  <div className="flex items-center gap-2">
                    {isCalculating && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span className="text-sm font-semibold">{estimatedAmount} {getOutputTokenLabel()}</span>
                  </div>
                </div>
              </div>

              {/* Trade Button */}
              <Button
                onClick={handleTrade}
                disabled={!amount || isPending || isConfirming || isApprovalConfirming}
                className="w-full"
                size="lg"
              >
                {isPending || isConfirming ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    {isPending ? 'Processing...' : 'Confirming...'}
                  </>
                ) : isApprovalConfirming ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Execute Trade
                  </>
                )}
              </Button>

              {/* Error/Success Messages */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error.message}
                    {error.message.includes('gas limit too high') && (
                      <div className="mt-2 text-sm">
                        <strong>Note:</strong> This contract function requires more gas than the network allows.
                        This is a contract-level limitation, not a frontend issue.
                        Consider using a different network or contacting the contract developers.
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}

              {isConfirmed && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Trade executed successfully! Transaction confirmed.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Market Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Market Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Stablecoin Price</span>
                  <span className="text-sm font-medium">{formatPrice(scPrice as bigint)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Leveraged Yield Coin Target</span>
                  <span className="text-sm font-medium">{formatPrice(rcTargetPrice as bigint)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Your Balance</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatNumber(baseCoinBalance as bigint)} BC</div>
                    <div className="text-sm font-medium">{formatNumber(stableCoinBalance as bigint)} SC</div>
                    <div className="text-sm font-medium">{formatNumber(reserveCoinBalance as bigint)} RC</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fees & Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Trading Fee</span>
                <span className="text-sm font-medium">{formatPercentage(fee as bigint)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Treasury Fee</span>
                <span className="text-sm font-medium">{formatPercentage(treasuryFee as bigint)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transaction Limit</span>
                <span className="text-sm font-medium">{formatNumber(txLimit as bigint)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How it works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <p>Stablecoins maintain a stable value pegged to $1.00</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p>Leveraged Yield Coins provide backing for price stability</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <p>Prices are determined by algorithmic mechanisms</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function Trade() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TradePage />
    </Suspense>
  );
}
