"use client";

import { Button } from "@/components/ui/button";
import { useSwitchChain } from "wagmi";
import { DJED_SUPPORTED_CHAINS } from "@/utils/supportedChains";

export default function UnsupportedNetwork() {
  const { switchChain } = useSwitchChain();

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
      <h2 className="text-2xl font-bold text-red-500">
        Unsupported Network
      </h2>

      <p className="text-muted-foreground">
        Please switch to a supported network to use Djed Protocol.
      </p>

      <div className="flex gap-3">
        {DJED_SUPPORTED_CHAINS.map((id) => (
          <Button key={id} onClick={() => switchChain({ chainId: id })}>
            Switch to {id}
          </Button>
        ))}
      </div>
    </div>
  );
}