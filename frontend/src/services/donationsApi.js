// export const API_BASE = 'http://localhost:5000';

// export async function recordDonation({ txHash, from, to, amount, message }) {
//   const res = await fetch(`${API_BASE}/donations`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       id: `donation_${Date.now()}`,
//       txHash,
//       from,
//       to,
//       amount,
//       message,
//       timestamp: new Date().toISOString()
//     })
//   });
//   if (!res.ok) throw new Error('Failed to record donation');
//   return res.json();
// }

// export async function getDonations() {
//   const res = await fetch(`${API_BASE}/donations`);
//   if (!res.ok) throw new Error('Failed to fetch donations');
//   return res.json();
// }