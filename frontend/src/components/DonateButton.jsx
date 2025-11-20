// src/components/DonateButton.jsx
import { useState } from 'react';
import { Coffee, Wallet, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useWallet } from '@meshsdk/react';
import { Transaction } from '@meshsdk/core';

// === ADA ↔ LOVELACE CONVERSION CONSTANTS & HELPERS ===
const LOVELACE_PER_ADA = 1_000_000;

// Convert ADA to lovelace
const adaToLovelace = (ada) => {
  return Math.floor(ada * LOVELACE_PER_ADA).toString();
};

// Format ADA for display (removes trailing zeros)
const formatAda = (ada) => {
  return parseFloat(ada).toString();
};

const DonateButton = () => {
  // Use Mesh SDK's built-in wallet hook directly (NO custom WalletContext)
  const { wallet, connected, connect } = useWallet();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'

  // Your donation recipient address (replace with your actual preprod testnet address)
  const DONATION_ADDRESS = import.meta.env.VITE_DONATION_ADDRESS || 
    'addr_test1qz...your_preprod_address_here';
  
  // Donation amount in ADA (this is what users see)
  const DONATION_AMOUNT_ADA = 2;
  
  // Convert to lovelace for blockchain transaction
  const DONATION_AMOUNT_LOVELACE = adaToLovelace(DONATION_AMOUNT_ADA);

  // Display alert for 5 seconds
  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Handle wallet connection using Mesh SDK
  const handleConnectWallet = async () => {
    try {
      await connect('lace'); // Connect to Lace wallet
      showAlertMessage('Wallet connected successfully!');
    } catch (error) {
      console.error('Wallet connection error:', error);
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
      console.log('To:', DONATION_ADDRESS);
      console.log(`Amount: ${formatAda(DONATION_AMOUNT_ADA)} ADA (${DONATION_AMOUNT_LOVELACE} lovelace)`);

      // Build transaction using Mesh SDK directly
      const tx = new Transaction({ initiator: wallet });
      
      // Add output: send lovelace to donation address (blockchain uses lovelace)
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

      // Show success message with ADA amount (user-friendly display)
      showAlertMessage(
        `Thank you for your ${formatAda(DONATION_AMOUNT_ADA)} ADA donation! Tx: ${txHash.substring(0, 16)}...`,
        'success'
      );

      // Optional: Log full transaction details with both ADA and lovelace
      console.log('Full tx hash:', txHash);
      console.log(`Amount sent: ${formatAda(DONATION_AMOUNT_ADA)} ADA (${DONATION_AMOUNT_LOVELACE} lovelace)`);
      console.log(`View on CardanoScan: https://preprod.cardanoscan.io/transaction/${txHash}`);

    } catch (error) {
      console.error('Donation failed:', error);
      
      // User-friendly error messages
      let errorMsg = 'Transaction failed. Please try again.';
      if (error.message?.includes('insufficient')) {
        errorMsg = `Insufficient funds. You need at least ${formatAda(DONATION_AMOUNT_ADA)} ADA plus transaction fees.`;
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

      {/* Donate button - displays ADA amount */}
      <button
        onClick={handleDonate}
        disabled={isProcessing}
        className="group relative px-6 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center space-x-3 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          opacity: isProcessing ? 0.7 : 1,
          cursor: isProcessing ? 'not-allowed' : 'pointer'
        }}
      >
        {/* Animated background on hover */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
        
        {/* Button content - all amounts displayed in ADA */}
        <div className="relative flex items-center space-x-3 text-white">
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : connected ? (
            <>
              <Coffee className="w-5 h-5" />
              <span>Buy Me a Coffee ({formatAda(DONATION_AMOUNT_ADA)} ADA)</span>
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet to Donate</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default DonateButton;

// === REFACTOR NOTES ===
// ✅ Removed WalletContext completely
// ✅ Using Mesh SDK's useWallet() hook directly
// ✅ No middleman/wrapper causing double initialization
// ✅ ADA ↔ lovelace conversion maintained
// ✅ All UI displays ADA, blockchain sends lovelace
// ✅ No unused variables (ESLint clean)
// ✅ Compatible with Vite + vite-plugin-node-polyfills