// src/components/DonateButton.jsx
import { useContext, useState } from 'react';
import { Coffee, Wallet, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { WalletContext } from '../contexts/WalletContext';
import { Transaction } from '@meshsdk/core';

const DonateButton = () => {
  const { connected, wallet, address, loading: walletLoading, connectWallet } = useContext(WalletContext);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'

  // Your donation recipient address (replace with your actual preprod testnet address)
  const DONATION_ADDRESS = import.meta.env.VITE_DONATION_ADDRESS || 
    'addr_test1qz...your_preprod_address_here';
  
  // Donation amount in ADA (converted to lovelace: 1 ADA = 1,000,000 lovelace)
  const DONATION_AMOUNT_ADA = 2;
  const DONATION_AMOUNT_LOVELACE = (DONATION_AMOUNT_ADA * 1_000_000).toString();

  // Display alert for 5 seconds
  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      showAlertMessage('Wallet connected successfully!');
    } catch (error) {
      showAlertMessage(error.message || 'Failed to connect wallet', 'error');
    }
  };

  // Build and submit donation transaction
  const handleDonate = async () => {
    // Connect wallet first if not connected
    if (!connected) {
      await handleConnectWallet();
      return;
    }

    setIsProcessing(true);
    try {
      // Validate wallet instance
      if (!wallet) {
        throw new Error('Wallet not initialized');
      }

      console.log('Building transaction...');
      console.log('From:', address);
      console.log('To:', DONATION_ADDRESS);
      console.log('Amount:', DONATION_AMOUNT_LOVELACE, 'lovelace');

      // Build transaction using Mesh SDK
      const tx = new Transaction({ initiator: wallet });
      
      // Add output: send ADA to donation address
      tx.sendLovelace(DONATION_ADDRESS, DONATION_AMOUNT_LOVELACE);

      // Build the unsigned transaction
      const unsignedTx = await tx.build();
      console.log('Transaction built successfully');

      // Sign the transaction
      const signedTx = await wallet.signTx(unsignedTx);
      console.log('Transaction signed successfully');

      // Submit the signed transaction
      const txHash = await wallet.submitTx(signedTx);
      console.log('Transaction submitted:', txHash);

      // Show success message with transaction hash
      showAlertMessage(
        `Thank you for your donation! Transaction: ${txHash.substring(0, 16)}...`,
        'success'
      );

      // Optional: Log full transaction details
      console.log('Full tx hash:', txHash);
      console.log(`View on CardanoScan: https://preprod.cardanoscan.io/transaction/${txHash}`);

    } catch (error) {
      console.error('Donation failed:', error);
      
      // User-friendly error messages
      let errorMsg = 'Transaction failed. Please try again.';
      if (error.message?.includes('insufficient')) {
        errorMsg = 'Insufficient funds in wallet. Please add more ADA.';
      } else if (error.message?.includes('reject') || error.message?.includes('cancel')) {
        errorMsg = 'Transaction was cancelled.';
      } else if (error.info) {
        errorMsg = `Transaction failed: ${error.info}`;
      }
      
      showAlertMessage(errorMsg, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative">
      {/* Alert notification */}
      {showAlert && (
        <div 
          className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 animate-slide-in ${
            alertType === 'success' ? 'bg-green-100 border-2 border-green-400' : 'bg-red-100 border-2 border-red-400'
          }`}
          style={{ minWidth: '320px' }}
        >
          {alertType === 'success' ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
          <span className={`font-medium ${alertType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {alertMessage}
          </span>
        </div>
      )}

      {/* Donate button */}
      <button
        onClick={handleDonate}
        disabled={walletLoading || isProcessing}
        className="group relative px-6 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-3 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          opacity: (walletLoading || isProcessing) ? 0.7 : 1,
          cursor: (walletLoading || isProcessing) ? 'not-allowed' : 'pointer'
        }}
      >
        {/* Animated background on hover */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        
        {/* Button content */}
        <div className="relative flex items-center space-x-3 text-white">
          {walletLoading || isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{isProcessing ? 'Processing...' : 'Connecting...'}</span>
            </>
          ) : connected ? (
            <>
              <Coffee className="w-5 h-5" />
              <span>Buy Me a Coffee ({DONATION_AMOUNT_ADA} ADA)</span>
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet to Donate</span>
            </>
          )}
        </div>
      </button>

      {/* Wallet connection status (optional, for debugging) */}
      {connected && address && (
        <p className="text-xs mt-2 text-gray-600 truncate" style={{ maxWidth: '300px' }}>
          Connected: {address.substring(0, 20)}...
        </p>
      )}
    </div>
  );
};

export default DonateButton;

// Key changes:
// 1. Properly uses WalletContext with useContext hook
// 2. Connects wallet automatically if not connected before donation
// 3. Shows loading states for both wallet connection and transaction
// 4. Builds transaction using Mesh SDK Transaction class
// 5. Handles errors with user-friendly messages
// 6. Displays success alert with transaction hash
// 7. Compatible with Lace wallet on preprod testnet
// 8. Uses environment variables (VITE_DONATION_ADDRESS)
// 9. Converts ADA to lovelace properly (1 ADA = 1,000,000 lovelace)