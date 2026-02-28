import { mainnet, polygon, sepolia, base, bsc } from "wagmi/chains";
import { ethereumClassic } from "./chains/EthereumClassic";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { fallback, http } from "wagmi";

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID ?? "DEFAULT_PROJECT_ID";

let memoizedConfig: ReturnType<typeof getDefaultConfig> | null = null;

export const config = (() => {
  if (memoizedConfig) return memoizedConfig;

  memoizedConfig = getDefaultConfig({
    appName: "Fate Protocol",
    projectId: PROJECT_ID,

    chains: [mainnet, polygon, bsc, base, ethereumClassic, sepolia],

    transports: {
      [mainnet.id]: fallback([
        http(process.env.NEXT_PUBLIC_ETH_RPC),
        http("https://rpc.ankr.com/eth"),
        http("https://cloudflare-eth.com"),
      ]),

      [polygon.id]: fallback([
        http(process.env.NEXT_PUBLIC_POLYGON_RPC),
        http("https://polygon-rpc.com"),
      ]),

      [bsc.id]: fallback([
        http(process.env.NEXT_PUBLIC_BSC_RPC),
        http("https://bsc-dataseed.binance.org"),
      ]),

      [base.id]: fallback([
        http(process.env.NEXT_PUBLIC_BASE_RPC),
        http("https://mainnet.base.org"),
      ]),

      [ethereumClassic.id]: fallback([
        http(process.env.NEXT_PUBLIC_ETC_RPC),
        http("https://etc.rivet.link"),
      ]),

      [sepolia.id]: fallback([
        http(process.env.NEXT_PUBLIC_SEPOLIA_RPC),
        http("https://rpc.sepolia.org"),
      ]),
    },

    ssr: false,
  });

  return memoizedConfig;
})();
