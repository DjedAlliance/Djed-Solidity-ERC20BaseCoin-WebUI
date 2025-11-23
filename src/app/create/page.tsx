'use client';

import { useState } from 'react';

const CreateStablecoinPage = () => {
  const [stablecoinName, setStablecoinName] = useState('');
  const [peg, setPeg] = useState('USD');
  const [backingToken, setBackingToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      stablecoinName,
      peg,
      backingToken,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create a New Stablecoin</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="stablecoinName" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Stablecoin Name
          </label>
          <input
            type="text"
            id="stablecoinName"
            value={stablecoinName}
            onChange={(e) => setStablecoinName(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="peg" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Peg
          </label>
          <select
            id="peg"
            value={peg}
            onChange={(e) => setPeg(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="JPY">JPY</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="backingToken" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
            Backing ERC20 Token Address
          </label>
          <input
            type="text"
            id="backingToken"
            value={backingToken}
            onChange={(e) => setBackingToken(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Create Stablecoin
        </button>
      </form>
    </div>
  );
};

export default CreateStablecoinPage;
