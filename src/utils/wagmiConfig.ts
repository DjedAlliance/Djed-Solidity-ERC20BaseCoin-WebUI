import { mainnet, polygon, sepolia, base, bsc } from "wagmi/chains";
import { ethereumClassic } from "./chains/EthereumClassic";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { fallback, http } from "wagmi";

// WalletConnect Cloud explicitly severs websocket connections for invalid project IDs, causing the "Connection Inturrupted" React crash.
// We provide a public viable fallback ID so dev testing doesn't fail on WebSocket initialization.
const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID && process.env.NEXT_PUBLIC_PROJECT_ID !== "DEFAULT_PROJECT_ID"
  ? process.env.NEXT_PUBLIC_PROJECT_ID 
  : "21fef48091f12692cad574a6f7753643";

let memoizedConfig: ReturnType<typeof getDefaultConfig> | null = null;

export const config = (() => {
  if (memoizedConfig) return memoizedConfig;

  memoizedConfig = getDefaultConfig({
    appName: "Djed Protocol",
    projectId: PROJECT_ID,

    chains: [mainnet, polygon, bsc, base, ethereumClassic, sepolia],

    transports: {
      [mainnet.id]: fallback(
        [
          process.env.NEXT_PUBLIC_ETH_RPC,
          "https://rpc.ankr.com/eth",
          "https://cloudflare-eth.com",
        ]
          .filter(Boolean)
          .map((url) => http(url as string)),
      ),

      [polygon.id]: fallback(
        [process.env.NEXT_PUBLIC_POLYGON_RPC, "https://polygon-rpc.com"]
          .filter(Boolean)
          .map((url) => http(url as string)),
      ),

      [bsc.id]: fallback(
        [process.env.NEXT_PUBLIC_BSC_RPC, "https://bsc-dataseed.binance.org"]
          .filter(Boolean)
          .map((url) => http(url as string)),
      ),

      [base.id]: fallback(
        [process.env.NEXT_PUBLIC_BASE_RPC, "https://mainnet.base.org"]
          .filter(Boolean)
          .map((url) => http(url as string)),
      ),

      [ethereumClassic.id]: fallback(
        [process.env.NEXT_PUBLIC_ETC_RPC, "https://etc.rivet.link"]
          .filter(Boolean)
          .map((url) => http(url as string)),
      ),

      [sepolia.id]: fallback(
        [process.env.NEXT_PUBLIC_SEPOLIA_RPC, "https://rpc.sepolia.org"]
          .filter(Boolean)
          .map((url) => http(url as string)),
      ),
    },

    // Enabling SSR structurally pairs with the `isMounted` checks protecting the components
    ssr: true,
  });

  return memoizedConfig;
})();
