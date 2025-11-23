import Link from 'next/link';

const ExplorePage = () => {
  // Placeholder data for stablecoins
  const stablecoins = [
    {
      name: 'USD Stablecoin',
      peg: 'USD',
      backing: 'ETH',
      address: '0x123...',
      reserveCoinPrice: '1.25',
      baseCoin: { name: 'Ethereum', symbol: 'ETH', address: '0xabc...' },
      stableCoin: { name: 'USD Stablecoin', symbol: 'USDS', address: '0xdef...' },
      leveragedYieldCoin: { name: 'Leveraged Yield Coin', symbol: 'LYC', address: '0xghi...' },
    },
    {
      name: 'EUR Stablecoin',
      peg: 'EUR',
      backing: 'BTC',
      address: '0x456...',
      reserveCoinPrice: '0.98',
      baseCoin: { name: 'Bitcoin', symbol: 'BTC', address: '0xjkl...' },
      stableCoin: { name: 'EUR Stablecoin', symbol: 'EURS', address: '0xmno...' },
      leveragedYieldCoin: { name: 'Leveraged Yield Coin', symbol: 'LYC', address: '0xpqr...' },
    },
    // Add more stablecoins as needed
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Stablecoins</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stablecoins.map((coin, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-2">{coin.name}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Pegged to {coin.peg}, backed by {coin.backing}
            </p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 dark:text-gray-300">Leveraged Yield Coin Price:</span>
              <span className="font-semibold">{coin.reserveCoinPrice}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-2">Token Details</h3>
              <div className="space-y-2 text-sm">
                <div><strong>BaseCoin:</strong> {coin.baseCoin.name} ({coin.baseCoin.symbol}) - <a href={`https://etherscan.io/address/${coin.baseCoin.address}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{coin.baseCoin.address}</a></div>
                <div><strong>Stablecoin:</strong> {coin.stableCoin.name} ({coin.stableCoin.symbol}) - <a href={`https://etherscan.io/address/${coin.stableCoin.address}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{coin.stableCoin.address}</a></div>
                <div><strong>Leveraged Yield Coin:</strong> {coin.leveragedYieldCoin.name} ({coin.leveragedYieldCoin.symbol}) - <a href={`https://etherscan.io/address/${coin.leveragedYieldCoin.address}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{coin.leveragedYieldCoin.address}</a></div>
              </div>
            </div>
            <Link href={`/trade?address=${coin.address}`} className="text-blue-500 hover:underline mt-4 inline-block">
              Trade
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;