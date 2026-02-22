/**
 * Transaction helper utilities for Djed protocol smart contract interactions.
 * Provides functions for fee calculations, amount validations, and transaction formatting.
 * @module utils/transactionHelpers
 */

import { parseUnits, formatUnits } from 'viem';

/**
 * Validates if an Ethereum address is properly formatted.
 * @param {string} address - The address to validate
 * @returns {boolean} True if address is valid, false otherwise
 */
export const isValidAddress = (address: string): boolean => {
  if (!address) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Validates if an amount string can be parsed as a valid number.
 * @param {string} amount - The amount to validate
 * @param {number} decimals - Token decimals for validation
 * @returns {boolean} True if amount is valid, false otherwise
 */
export const isValidAmount = (amount: string, decimals: number = 18): boolean => {
  if (!amount || amount === '0' || isNaN(Number(amount))) return false;
  try {
    parseUnits(amount, decimals);
    return true;
  } catch {
    return false;
  }
};

/**
 * Formats a bigint balance to a human-readable number string with thousands separator.
 * @param {bigint} balance - The balance in wei/smallest unit
 * @param {number} decimals - Token decimals (default 18)
 * @param {number} decimalPlaces - Decimal places to display (default 2)
 * @returns {string} Formatted balance string
 */
export const formatBalance = (
  balance: bigint | undefined,
  decimals: number = 18,
  decimalPlaces: number = 2
): string => {
  if (!balance) return '0';
  const formatted = formatUnits(balance, decimals);
  return parseFloat(formatted).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPlaces,
  });
};

/**
 * Formats a price value with appropriate decimal places and currency symbol.
 * @param {bigint} price - The price in wei
 * @param {number} decimals - Token decimals (default 18)
 * @returns {string} Formatted price with $ symbol
 */
export const formatPrice = (price: bigint | undefined): string => {
  if (!price) return '$0.00';
  const formatted = formatUnits(price, 18);
  const value = parseFloat(formatted);
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })}`;
};

/**
 * Formats a percentage value for display.
 * @param {bigint} percentage - The percentage in basis points (100 = 1%)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (percentage: bigint | undefined): string => {
  if (!percentage) return '0%';
  const value = Number(percentage) / 100;
  return `${value.toFixed(2)}%`;
};

/**
 * Calculates fee amount from a base amount and fee percentage.
 * @param {bigint} amount - The base amount
 * @param {bigint} feePercentage - The fee percentage in basis points
 * @returns {bigint} The calculated fee amount
 */
export const calculateFee = (amount: bigint, feePercentage: bigint): bigint => {
  return (amount * feePercentage) / BigInt(10000);
};

/**
 * Validates transaction parameters before execution.
 * @param {Object} params - Transaction parameters to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateTransactionParams = (params: {
  amount?: string;
  receiver?: string;
  fromAddress?: string;
  allowance?: bigint;
  balance?: bigint;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!params.amount || !isValidAmount(params.amount)) {
    errors.push('Invalid amount');
  }

  if (params.receiver && !isValidAddress(params.receiver)) {
    errors.push('Invalid receiver address');
  }

  if (params.fromAddress && !isValidAddress(params.fromAddress)) {
    errors.push('Invalid from address');
  }

  if (params.allowance !== undefined && params.balance !== undefined) {
    const amountBig = parseUnits(params.amount || '0', 18);
    if (params.balance < amountBig) {
      errors.push('Insufficient balance');
    }
    if (params.allowance < amountBig) {
      errors.push('Insufficient allowance');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Converts a decimal amount string to bigint with specified decimals.
 * @param {string} amount - The amount as a string
 * @param {number} decimals - Token decimals (default 18)
 * @returns {bigint | null} The amount as bigint or null if invalid
 */
export const parseAmount = (amount: string, decimals: number = 18): bigint | null => {
  try {
    if (!isValidAmount(amount, decimals)) return null;
    return parseUnits(amount, decimals);
  } catch {
    return null;
  }
};
