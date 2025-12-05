{/*Okay ramo mag pa explain sa AI kung gi unsa ni diri nga file nya ayaw lang sad pag pataka og refactor sa code kung mahimo
// useBlockchain.jsx = custom React hook ni siya nga nag handle sa blockchain transactions gamit ang Mesh SDK
// PA EXPLAIN LANG SA AI KUNG NAAY GIKA LIBGAN MGA AGAWN NYA PALIHUG LANG OG SA IKA PILANG HIGAYON DI MAG PATAKA OG PUSH OR REFACTOR 
*/}

import { useState, useEffect } from 'react';
import { useWallet } from '@meshsdk/react';
import { Transaction } from '@meshsdk/core';


export const useBlockchain = () => {
  const { wallet, connected, address, connecting, error } = useWallet();
  const [blockChainStatus, setBlockChainStatus] = useState('');

  useEffect(() => {
    if (error) console.error("Wallet Connection Error:", error);
    if (connecting) console.log("Wallet is trying to connect...");
  }, [error, connecting]);

  const syncBlockChain = async (action, noteTitle, noteId) => {
    if (!connected) {
      console.log("Wallet is not connected");
      return;
    }

    try {
      setBlockChainStatus(`Syncing ${action} to Blockchain`);
      const tx = new Transaction({ initiator: wallet });

      tx.sendLovelace(address, "1500000");
      tx.setMetadata(674, {
        app: 'BeanNotes',
        action: action,
        id: noteId,
        title: noteTitle.substring(0, 50)
      });

      const unsignedTx = await tx.build();
      const signedTx = await wallet.signTx(unsignedTx);
      const txHash = await wallet.submitTx(signedTx);

      console.log(`Blockchain Sync Success: ${txHash}`);
      setBlockChainStatus(`✓ Synced on-chain!`);
      
      setTimeout(() => setBlockChainStatus(''), 3000);
    } catch (error) {
      console.error('Sync Failed: ', error);
      setBlockChainStatus('Sync Failed see console');
    }
  };

  return { blockChainStatus, syncBlockChain };
};
