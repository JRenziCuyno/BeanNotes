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
  // We use the connected wallet's own address as the recipient for the simulation
  const { wallet, connected, address } = useWallet();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // 'success' or 'error'
  
  // Donation amount in ADA
  const DONATION_AMOUNT_ADA = 2;
  const DONATION_AMOUNT_LOVELACE = adaToLovelace(DONATION_AMOUNT_ADA);

  // Display alert for 5 seconds
  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleDonate = async () => {
    // CHECK: If not connected, prompt user to use the main wallet button
    if (!connected) {
      showAlertMessage('Please connect your wallet at the top first!', 'error');
      return;
    }
    
    // CHECK: If connected but address hasn't loaded yet
    if (!address) {
      showAlertMessage('Wallet loading... please wait a moment.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      if (!wallet) {
        throw new Error('Wallet not initialized');
      }

      // SIMULATION: We set the recipient to be YOU (the connected user)
      const recipientAddress = address;

      console.log('Building Simulation Transaction...');
      console.log('From (You):', address);
      console.log('To (You - Self Transaction):', recipientAddress);

      const tx = new Transaction({ initiator: wallet });
      
      try {
        // Send lovelace to your own address
        tx.sendLovelace(recipientAddress, DONATION_AMOUNT_LOVELACE);
      } catch (addrError) {
         console.error("Address Error:", addrError);
         throw new Error("Invalid Address format.");
      }

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      console.log(`Simulation sent with hash ${txHash}`);

      showAlertMessage(
        `Simulation Successful! Sent ${formatAda(DONATION_AMOUNT_ADA)} ADA to yourself.`,
        'success'
      );

    } catch (error) {
      console.error('Donation failed:', error);
      
      let errorMsg = 'Transaction failed. Please try again.';
      const errorString = typeof error === 'string' ? error : JSON.stringify(error);

      if (errorString.includes('insufficient') || error.message?.includes('insufficient')) {
        errorMsg = `Insufficient funds. You need at least ${formatAda(DONATION_AMOUNT_ADA)} ADA + fees.`;
      } else if (errorString.includes('reject') || errorString.includes('cancel')) {
        errorMsg = 'Transaction was cancelled.';
      } else if (error.message) {
        errorMsg = `Error: ${error.message}`;
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
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative flex items-center space-x-3 text-white">
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              {/* Icons change based on state, but button always attempts donate now */}
              {connected ? <Coffee className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
              
              <span>
                {connected 
                  ? `Simulate Donate (${formatAda(DONATION_AMOUNT_ADA)} ADA)` 
                  : 'Connect Wallet to Simulate'}
              </span>
            </>
          )}
        </div>
      </button>
    </div>
  );
};

export default DonateButton;