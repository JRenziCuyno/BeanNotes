import React, { createContext, useState, useEffect } from 'react';

/*
  WalletContext scaffold for Cardano Preprod testnet.
  
  TODO (for Lace integration team):
  1. Replace placeholders with Lace SDK or window.cardano CIP-30 calls
  2. Use Preprod network (network ID: 0)
  3. Build transactions with cardano-serialization-lib
  4. Attach metadata: { app: 'BeanNotes', purpose: 'donation', message }
  5. Submit via Lace and capture txHash
*/

const NETWORK = 'preprod'; // Cardano Preprod testnet

export const WalletContext = createContext({
  connected: false,
  address: null,
  balance: null,
  connect: async () => {},
  disconnect: () => {},
  createAndSubmitDonationTx: async () => {}
});

export const WalletProvider = ({ children }) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [walletApi, setWalletApi] = useState(null);

  useEffect(() => {
    // Optional: Auto-detect Lace wallet on page load
    // TODO: Check for window.cardano?.lace and show connection prompt
  }, []);

  const connect = async () => {
    try {
      // TODO: Implement Lace/CIP-30 connection
      // Example:
      // if (!window.cardano?.lace) throw new Error('Lace wallet not installed');
      // const api = await window.cardano.lace.enable();
      // const usedAddresses = await api.getUsedAddresses();
      // const addr = usedAddresses[0];
      // setAddress(addr);
      // setWalletApi(api);
      
      setConnected(true);
      setAddress('addr_test1_PLACEHOLDER_PREPROD');
      return true;
    } catch (err) {
      console.error('Wallet connection failed:', err);
      throw err;
    }
  };

  const disconnect = () => {
    // Wallets don't support programmatic disconnect; clear UI state only
    setConnected(false);
    setAddress(null);
    setBalance(null);
    setWalletApi(null);
  };

  const createAndSubmitDonationTx = async ({ toAddress, amount, message }) => {
    if (!walletApi || !connected) {
      throw new Error('Wallet not connected');
    }

    try {
      // TODO: Build real Cardano transaction
      // Steps:
      // 1. Get UTxOs from wallet
      // 2. Build transaction with:
      //    - Output to toAddress with amount lovelace
      //    - Metadata: { app: 'BeanNotes', purpose: 'donation', message, network: 'preprod' }
      //    - Change address (wallet handles this)
      // 3. Sign with wallet.signTx()
      // 4. Submit with wallet.submitTx()
      // 5. Return { txHash, from: senderAddress, to: toAddress, amount }

      // Placeholder simulation (remove after Lace implementation):
      await new Promise((r) => setTimeout(r, 700));
      return {
        txHash: `TX_PREPROD_${Date.now()}_SIMULATED`,
        from: address,
        to: toAddress,
        amount
      };
    } catch (err) {
      console.error('Transaction failed:', err);
      throw err;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connected,
        address,
        balance,
        connect,
        disconnect,
        createAndSubmitDonationTx
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};