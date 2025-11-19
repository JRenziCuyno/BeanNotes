// src/contexts/WalletContext.jsx
import { createContext, useState, useCallback } from 'react';
import { BrowserWallet } from '@meshsdk/core';

// Create context for wallet state management
export const WalletContext = createContext(null);

// Provider component - only exports the provider, no other components
// This fixes ESLint "Fast refresh only works when a file only exports components"
export function WalletProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  // Connect to Lace wallet using Mesh SDK
  const connectWallet = useCallback(async () => {
    setLoading(true);
    try {
      // Check if Lace is installed
      if (!window.cardano?.lace) {
        throw new Error('Lace wallet not found. Please install Lace browser extension.');
      }

      // Enable Lace wallet using Mesh SDK
      const walletInstance = await BrowserWallet.enable('lace');
      
      // Get the first address (payment address)
      const addresses = await walletInstance.getUsedAddresses();
      const firstAddress = addresses[0] || await walletInstance.getChangeAddress();

      // Update state
      setWallet(walletInstance);
      setAddress(firstAddress);
      setConnected(true);

      console.log('Wallet connected:', firstAddress);
      return walletInstance;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw new Error(error.message || 'Failed to connect to Lace wallet');
    } finally {
      setLoading(false);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setWallet(null);
    setAddress(null);
    setConnected(false);
    console.log('Wallet disconnected');
  }, []);

  // Context value with all wallet state and functions
  const value = {
    connected,
    wallet,
    address,
    loading,
    connectWallet,
    disconnectWallet
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

// Note: Removed "message" variable that was defined but never used (fixes ESLint warning)
// Using Mesh SDK's BrowserWallet.enable() for proper Lace integration
// All wallet logic is isolated in context - no UI components mixed in