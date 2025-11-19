import React, { useContext, useState } from 'react';
import { WalletContext } from '../contexts/WalletContext';
import { recordDonation } from '../services/donationsApi';

export default function DonateButton({ toAddress = 'addr_test1_...', defaultAmount = '1.0' }) {
  const { connected, address, connect, createAndSubmitDonationTx } = useContext(WalletContext);
  const [amount, setAmount] = useState(defaultAmount);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleDonate = async () => {
    try {
      setStatus(null);

      if (!connected) {
        await connect();
      }

      setLoading(true);

      // Submit transaction via wallet
      const tx = await createAndSubmitDonationTx({
        toAddress,
        amount,
        message
      });

      // Record to backend
      await recordDonation({
        txHash: tx.txHash,
        from: tx.from,
        to: tx.to,
        amount: tx.amount,
        message
      });

      setStatus({
        ok: true,
        txHash: tx.txHash,
        message: 'Thank you for your donation! ☕'
      });

      // Reset form
      setAmount(defaultAmount);
      setMessage('');
    } catch (err) {
      console.error('Donation error:', err);
      setStatus({
        ok: false,
        error: err.message || 'Donation failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
      <h3 className="font-bold mb-3 text-amber-900">☕ Buy me a coffee</h3>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (ADA)
          </label>
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            placeholder="Leave a message..."
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
            rows="2"
          />
        </div>

        <button
          onClick={handleDonate}
          disabled={loading}
          className={`w-full py-2 rounded font-medium transition ${
            loading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-amber-500 text-white hover:bg-amber-600'
          }`}
        >
          {loading ? 'Processing…' : 'Donate / Buy me a coffee'}
        </button>
      </div>

      {status && status.ok && (
        <div className="mt-3 p-2 bg-green-100 border border-green-400 rounded text-green-800 text-sm">
          <strong>✓ {status.message}</strong>
          <div className="text-xs mt-1">
            Tx: <code>{status.txHash.slice(0, 16)}...</code>
          </div>
        </div>
      )}

      {status && !status.ok && (
        <div className="mt-3 p-2 bg-red-100 border border-red-400 rounded text-red-800 text-sm">
          <strong>✗ Error:</strong> {status.error}
        </div>
      )}
    </div>
  );
}