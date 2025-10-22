'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  AlertCircle,
  RefreshCw
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
  AlertDescription
} from '@/components/ui';
import DJED_ABI from '@/utils/abi/Djed.json';
import COIN_ABI from '@/utils/abi/Coin.json';
import { DJED_ADDRESS, STABLE_COIN_ADDRESS, RESERVE_COIN_ADDRESS } from '@/utils/addresses';

export default function CreatePosition() {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedType, setSelectedType] = useState<'stable' | 'reserve'>('stable');

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleCreatePosition = async () => {
    if (!amount || !address) return;

    setIsCreating(true);
    try {
      const amountBN = parseUnits(amount, 18);
      
      if (selectedType === 'stable') {
        await writeContract({
          address: DJED_ADDRESS,
          abi: DJED_ABI,
          functionName: 'buyStableCoins',
          args: [amountBN, address],
        });
      } else {
        await writeContract({
          address: DJED_ADDRESS,
          abi: DJED_ABI,
          functionName: 'buyReserveCoins',
          args: [amountBN, address],
        });
      }
    } catch (error) {
      console.error('Error creating position:', error);
    } finally {
      setIsCreating(false);
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
              Please connect your wallet to create a new position
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Create New Position
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Start your journey with the Djed protocol by creating a new position. 
            Choose between StableCoins or ReserveCoins based on your strategy.
          </p>
        </div>

        {/* Position Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Position Type
            </CardTitle>
            <CardDescription>
              Choose the type of position you want to create
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedType === 'stable'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                onClick={() => setSelectedType('stable')}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                  <div>
                    <h3 className="font-semibold">StableCoins</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Stable value pegged to base currency
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedType === 'reserve'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
                onClick={() => setSelectedType('reserve')}
              >
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-6 w-6 text-blue-500" />
                  <div>
                    <h3 className="font-semibold">ReserveCoins</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Variable value based on protocol performance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Position Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Position Details
            </CardTitle>
            <CardDescription>
              Configure your position parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (ETH)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-lg"
              />
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Enter the amount of ETH you want to use for this position
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-semibold">Position Summary</h4>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Position Type:</span>
                  <span className="font-medium">
                    {selectedType === 'stable' ? 'StableCoins' : 'ReserveCoins'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Amount:</span>
                  <span className="font-medium">{amount || '0'} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Estimated Tokens:</span>
                  <span className="font-medium">
                    {amount ? (parseFloat(amount) * 1000).toFixed(2) : '0'} {selectedType === 'stable' ? 'SC' : 'RC'}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleCreatePosition}
              disabled={!amount || isCreating || isPending || isConfirming}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
              size="lg"
            >
              {isCreating || isPending || isConfirming ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Position
                </>
              )}
            </Button>

            {error && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Error creating position: {error.message}
                </AlertDescription>
              </Alert>
            )}

            {isConfirmed && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Position created successfully! Transaction hash: {hash}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
