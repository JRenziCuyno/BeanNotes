import React, { useContext, useState } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { recordDonation } from '../services/donationsApi';

export default function DonateButton() {
  const { connected, address, connect, submitDonation } = useContext(WalletContext);
  const [amount, setAmount] = useState('1');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDonate = async () => {
    try {
      setLoading(true);
      
      if (!connected) await connect();
      
      const tx = await submitDonation('addr_test1_...RECEIVER_ADDRESS...', amount, message);
      
      await recordDonation({
        txHash: tx.txHash,
        from: tx.from,
        to: tx.to,
        amount: tx.amount,
        message
      });

      alert('✓ Donation successful! Tx: ' + tx.txHash.slice(0, 16) + '...');
      setAmount('1');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-amber-50 rounded border border-amber-200">
      <h3 className="font-bold mb-3">☕ Buy me a coffee</h3>
      
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount (ADA)"
        className="w-full border p-2 mb-2 rounded"
        disabled={loading}
      />
      
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message (optional)"
        className="w-full border p-2 mb-2 rounded"
        disabled={loading}
      />
      
      <button
        onClick={handleDonate}
        disabled={loading}
        className="w-full bg-amber-500 text-white p-2 rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Donate'}
      </button>
      
      {connected && <p className="text-xs mt-2 text-gray-600">Connected: {address?.slice(0, 20)}...</p>}
    </div>
  );
}