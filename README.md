# Djed Protocol Web UI

**Djed Protocol** is an algorithmic stablecoin protocol that maintains price stability through a dual-coin system. This repository contains the modern web interface built with Next.js, React, and TypeScript for interacting with the Djed smart contracts.

## What is Djed?

Djed is a stablecoin protocol that uses a dual-coin system to maintain price stability:

- **StableCoin (SC)**: The stablecoin that maintains a peg to a target price (e.g., $1 USD)
- **ReserveCoin (RC)**: The reserve asset that backs the stablecoin and absorbs price volatility
- **BaseCoin (BC)**: The underlying asset (e.g., ETH) used for trading and reserves

## Key Features

- **Algorithmic Stability**: Maintains price stability through automated market mechanisms
- **Over-Collateralized**: Reserve coins provide backing for stablecoins
- **Oracle Integration**: Uses external price feeds for accurate market data
- **Decentralized**: No single point of failure, fully transparent smart contracts
- **Multi-Chain Support**: Deployed across multiple blockchain networks
- **Modern Web Interface**: Built with Next.js, React, and TypeScript

## Protocol Mechanics

### Trading Operations

1. **Buy StableCoins**: Exchange BaseCoins for StableCoins at the current price
2. **Sell StableCoins**: Exchange StableCoins back to BaseCoins
3. **Buy ReserveCoins**: Purchase ReserveCoins to participate in protocol governance
4. **Sell ReserveCoins**: Sell ReserveCoins back to BaseCoins

### Reserve Management

- **Reserve Ratio**: Maintains a minimum and maximum reserve ratio for stability
- **Dynamic Pricing**: Prices adjust based on supply, demand, and reserve levels
- **Fee Structure**: Trading fees support protocol operations and treasury
- **Oracle Integration**: Real-time price feeds ensure accurate valuations

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Web3**: Wagmi, Viem, RainbowKit
- **UI Components**: Radix UI, Lucide React
- **Charts**: Recharts, TradingView Widget
- **Smart Contracts**: Solidity ^0.8.0

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/djed-webui.git
   cd djed-webui
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables in `.env.local`:
   ```env
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_DJED_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS=0x...
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Smart Contracts

The protocol consists of several smart contracts:

- **Djed.sol**: Main protocol contract handling stablecoin operations
- **Coin.sol**: ERC20 token implementation for StableCoin and ReserveCoin
- **IOracle.sol**: Interface for price oracle integration

### Contract Functions

#### Trading Functions
- `buyStableCoins()`: Purchase stablecoins with basecoins
- `sellStableCoins()`: Sell stablecoins for basecoins
- `buyReserveCoins()`: Purchase reserve coins
- `sellReserveCoins()`: Sell reserve coins
- `sellBothCoins()`: Sell both stablecoins and reserve coins

#### View Functions
- `scPrice()`: Get current stablecoin price
- `rcTargetPrice()`: Get target reserve coin price
- `ratio()`: Get current reserve ratio
- `R()`: Get current reserve amount
- `L()`: Get current liabilities

## Usage Examples

### Connecting Wallet

The interface supports multiple wallet connections through RainbowKit:

1. Click the "Connect Wallet" button
2. Select your preferred wallet (MetaMask, WalletConnect, etc.)
3. Approve the connection in your wallet

### Trading StableCoins

1. **Buy StableCoins**:
   - Enter the amount of BaseCoins you want to spend
   - Review the estimated StableCoins you'll receive
   - Click "Buy StableCoins" and confirm the transaction

2. **Sell StableCoins**:
   - Enter the amount of StableCoins you want to sell
   - Review the estimated BaseCoins you'll receive
   - Click "Sell StableCoins" and confirm the transaction

### Monitoring Protocol Health

The dashboard displays real-time metrics:
- Total Value Locked (TVL)
- Reserve Ratio
- StableCoin Price
- Daily Transaction Volume
- Protocol Fees

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [/src/app/docs/page.tsx](src/app/docs/page.tsx) — local docs route at `/docs`
- **Discord**: [Discord invite]
- **Twitter**: [@DjedProtocol]
- **Issues**: [GitHub Issues](https://github.com/your-username/djed-webui/issues)

## Roadmap

- [ ] Multi-chain deployment
- [ ] Advanced trading features
- [ ] Mobile app
- [ ] Governance interface
- [ ] Analytics dashboard
- [ ] API integration

