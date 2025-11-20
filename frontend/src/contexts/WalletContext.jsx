// import React, { createContext, useState } from 'react';

// export const WalletContext = createContext();

// export const WalletProvider = ({ children }) => {
//   const [connected, setConnected] = useState(false);
//   const [address, setAddress] = useState(null);

//   const connect = async () => {
//     try {
//       const api = await window.cardano.lace.enable();
//       const addrs = await api.getUsedAddresses();
//       setAddress(addrs[0]);
//       setConnected(true);
//       return api;
//     } catch (err) {
//       alert('Wallet connection failed');
//       throw err;
//     }
//   };

//   const submitDonation = async (toAddr, amount, message) => {
//     try {
//       const { Transaction } = await import('@meshsdk/core');
//       const api = await window.cardano.lace.enable();
      
//       const tx = new Transaction({ initiator: api })
//         .sendLovelace(toAddr, (parseFloat(amount) * 1000000).toString());
      
//       const unsignedTx = await tx.build();
//       const signedTx = await api.signTx(unsignedTx, false);
//       const txHash = await api.submitTx(signedTx);
      
//       return { txHash, from: address, to: toAddr, amount };
//     } catch (err) {
//       alert('Transaction failed: ' + err.message);
//       throw err;
//     }
//   };

//   return (
//     <WalletContext.Provider value={{ connected, address, connect, submitDonation }}>
//       {children}
//     </WalletContext.Provider>
//   );
// };