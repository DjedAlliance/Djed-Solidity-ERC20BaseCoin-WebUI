"use client"

import { useEffect, useState } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from "wagmi"
import { parseUnits } from "viem"
import { Button } from "@/components/ui/button"
import { MagneticButton, GlowCard } from "@/components/ui"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wallet, CheckCircle, Zap } from "lucide-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { StableCoinFactoryABI } from "@/utils/abi/StableCoinFactory"
import { StableCoinFactories, ZERO_ADDRESS } from "@/utils/addresses"
import { toast } from "sonner"

import { Toaster } from "@/components/ui/sonner"

interface ReactorConfig {
  stablecoinName: string
  baseAssetName: string
  baseAssetSymbol: string
  peggedAssetName: string
  peggedAssetSymbol: string
  baseToken: string
  oracleAddress: string
  priceId: string
  treasury: string
  criticalReserveRatio: string
}

export default function CreatePage() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [config, setConfig] = useState<ReactorConfig>({
    stablecoinName: "",
    baseAssetName: "",
    baseAssetSymbol: "",
    peggedAssetName: "",
    peggedAssetSymbol: "",
    baseToken: "",
    oracleAddress: "",
    priceId: "",
    treasury: address || "",
    criticalReserveRatio: "400",
  })

  // Contract interaction
  const { data: hash, isPending: isDeploying, writeContractAsync } = useWriteContract()


  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const updateConfig = (field: keyof ReactorConfig, value: string | number) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const [hasSetDefaultTreasury, setHasSetDefaultTreasury] = useState(false)

  useEffect(() => {
    if (isConnected && address && config.treasury === "" && !hasSetDefaultTreasury) {
      setConfig((prev) => ({ ...prev, treasury: address }))
      setHasSetDefaultTreasury(true)
    }
  }, [isConnected, address, config.treasury, hasSetDefaultTreasury])

  const isFormValid = () => {
    return config.stablecoinName &&
           config.baseAssetName &&
           config.baseAssetSymbol &&
           config.peggedAssetName && 
           config.peggedAssetSymbol && 
           config.baseToken && 
           config.oracleAddress &&
           config.treasury &&
           config.priceId &&
           config.criticalReserveRatio
  }

  const handleDeploy = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!writeContractAsync) {
      toast.error("Contract write function not available")
      return
    }

    if (!isFormValid()) {
      toast.error("Please fill in all required fields")
      return
    }

    const factoryAddress = StableCoinFactories[chainId as keyof typeof StableCoinFactories]

    if (!factoryAddress || factoryAddress === ZERO_ADDRESS) {
      toast.error("Unsupported network. Please switch to a supported network.")
      return
    }

    const stablecoinName = config.stablecoinName.trim()
    if (!stablecoinName) {
      toast.error("Stablecoin name cannot be empty")
      return
    }

    const baseAssetName = config.baseAssetName.trim()
    if (!baseAssetName) {
      toast.error("Base asset name cannot be empty")
      return
    }

    const baseAssetSymbol = config.baseAssetSymbol.trim()
    if (!baseAssetSymbol) {
      toast.error("Base asset symbol cannot be empty")
      return
    }

    const peggedAssetName = config.peggedAssetName.trim()
    if (!peggedAssetName) {
      toast.error("Stable token name cannot be empty")
      return
    }

    const peggedAssetSymbol = config.peggedAssetSymbol.trim()
    if (!peggedAssetSymbol) {
      toast.error("Stable token symbol cannot be empty")
      return
    }

    const baseToken = config.baseToken.trim()
    if (!/^0x[0-9a-fA-F]{40}$/.test(baseToken)) {
      toast.error("Base token must be a 20-byte checksum address")
      return
    }

    const oracleAddress = config.oracleAddress.trim()
    if (!/^0x[0-9a-fA-F]{40}$/.test(oracleAddress)) {
      toast.error("Oracle address must be a 20-byte checksum address")
      return
    }

    const trimmedPriceId = config.priceId.trim()
    if (!/^0x[0-9a-fA-F]{64}$/.test(trimmedPriceId)) {
      toast.error("Price feed ID must be a 32-byte hex value")
      return
    }

    const treasuryAddress = config.treasury.trim()
    if (!/^0x[0-9a-fA-F]{40}$/.test(treasuryAddress)) {
      toast.error("Treasury address must be a 20-byte checksum address")
      return
    }

    const ratioValue = Number(config.criticalReserveRatio)
    if (Number.isNaN(ratioValue) || ratioValue < 100) {
      toast.error("Critical reserve ratio must be at least 100%")
      return
    }

    const criticalReserveRatioWad = parseUnits((ratioValue / 100).toString(), 18)
    if (criticalReserveRatioWad < parseUnits("1", 18)) {
      toast.error("Critical reserve ratio must be at least 100%")
      return
    }

    const account = address as `0x${string}`

    try {
      await writeContractAsync({
        account,
        address: factoryAddress,
        abi: StableCoinFactoryABI,
        functionName: 'deployReactor',
        args: [
          stablecoinName,
          baseAssetName,
          baseAssetSymbol,
          peggedAssetName,
          peggedAssetSymbol,
          baseToken as `0x${string}`,
          oracleAddress as `0x${string}`,
          trimmedPriceId as `0x${string}`,
          "Reserve Coin",
          "RC",
          treasuryAddress as `0x${string}`,
          BigInt(5000000000000000), // 0.5% fission fee (0.005e18)
          BigInt(5000000000000000), // 0.5% fusion fee (0.005e18)
          criticalReserveRatioWad
        ]
      })
    } catch (error) {
      console.error("Deployment error:", error)
      toast.error("Failed to deploy reactor")
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Toaster />
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-surface to-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="flex min-h-screen items-center justify-center px-4 py-16">
        <div className="w-full max-w-3xl mx-auto">
          <GlowCard>
            <div className="relative overflow-hidden rounded-3xl bg-surface-elevated/80 backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-border px-8 py-6">
                <div className="flex items-center gap-4">
                  <Zap className="w-5 h-5 text-primary" />
                  <h2 className="text-lg uppercase tracking-widest text-primary dark:text-foreground">
                    Create a New Stablecoin
                  </h2>
                </div>
              </div>
              
              <div className="grid gap-10 p-8">
  
                {!isConnected && (
                  <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-surface p-4 text-secondary">
                    <Wallet className="h-5 w-5" />
                    <span className="text-sm font-semibold">
                      Connect your wallet to authorize deployment.
                    </span>
                  </div>
                )}
  
                <div className="grid gap-8">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Stablecoin Name</Label>
                    <Input
                      placeholder="e.g., Digital Dollar"
                      value={config.stablecoinName}
                      onChange={(e) => updateConfig("stablecoinName", e.target.value)}
                    />
                  </div>
  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Base Asset Name</Label>
                      <Input
                        placeholder="e.g., Bitcoin Reserve"
                        value={config.baseAssetName}
                        onChange={(e) => updateConfig("baseAssetName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Base Asset Symbol</Label>
                      <Input
                        placeholder="e.g., BTC"
                        value={config.baseAssetSymbol}
                        onChange={(e) => updateConfig("baseAssetSymbol", e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>
  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Base Token (Collateral)</Label>
                    <Input
                      placeholder="Enter the ERC20 token address"
                      value={config.baseToken}
                      onChange={(e) => updateConfig("baseToken", e.target.value)}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Oracle Address</Label>
                    <Input
                      placeholder="Enter the oracle contract address"
                      value={config.oracleAddress}
                      onChange={(e) => updateConfig("oracleAddress", e.target.value)}
                    />
                  </div>
  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Critical Reserve Ratio (%)</Label>
                      <Input
                        type="number"
                        min={100}
                        step={1}
                        placeholder="e.g., 400"
                        value={config.criticalReserveRatio}
                        onChange={(e) => updateConfig("criticalReserveRatio", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Price Feed ID</Label>
                      <Input
                        value={config.priceId}
                        placeholder="Enter the 32-byte price feed ID"
                        onChange={(e) => updateConfig("priceId", e.target.value)}
                      />
                    </div>
                  </div>
  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-primary">Stable Token</p>
                      <Input
                        placeholder="e.g., Digital Dollar"
                        value={config.peggedAssetName}
                        onChange={(e) => updateConfig("peggedAssetName", e.target.value)}
                      />
                      <Input
                        placeholder="e.g., DUSD"
                        value={config.peggedAssetSymbol}
                        onChange={(e) => updateConfig("peggedAssetSymbol", e.target.value.toUpperCase())}
                      />
                    </div>
                  </div>
  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Treasury (Fee Recipient)</Label>
                    <Input
                      placeholder="Enter the treasury address"
                      value={config.treasury}
                      onChange={(e) => updateConfig("treasury", e.target.value)}
                    />
                  </div>
                </div>
  
                <div className="space-y-4">
                  <ConnectButton.Custom>
                    {({ account, chain, openConnectModal, openChainModal, mounted }) => {
                      const ready = mounted
                      const connected = ready && account && chain
  
                      if (!ready) {
                        return (
                          <MagneticButton className="w-full" disabled>
                            Loading Wallet...
                          </MagneticButton>
                        )
                      }
  
                      if (!connected) {
                        return (
                          <MagneticButton className="w-full" onClick={openConnectModal}>
                            Connect Wallet
                          </MagneticButton>
                        )
                      }
  
                      if (chain?.unsupported) {
                        return (
                          <Button
                            variant="destructive"
                            className="w-full"
                            onClick={openChainModal}
                          >
                            Unsupported Network
                          </Button>
                        )
                      }
  
                      return (
                        <Button
                          className="gradient-button w-full"
                          onClick={handleDeploy}
                          disabled={!isFormValid() || isDeploying || isConfirming}
                        >
                          {isDeploying
                            ? "Deploying..."
                            : isConfirming
                            ? "Confirming..."
                            : "Deploy Reactor"}
                        </Button>
                      )
                    }}
                  </ConnectButton.Custom>

                {isSuccess && (
                  <div className="rounded-lg border border-success/30 bg-success/10 p-4 text-success">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5" />
                      <div>
                        <div className="font-semibold">Reactor Deployed Successfully</div>
                        <a
                          href={`YOUR_EXPLORER_URL/${hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block text-xs text-success/80 hover:underline"
                        >
                          Transaction Hash: {hash}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
            </div>
            </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  )
}
