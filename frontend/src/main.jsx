import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import { WalletProvider } from './contexts/WalletContext'
import { MeshProvider } from '@meshsdk/react'
import "@meshsdk/react/styles.css";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <MeshProvider networkId={0}>
      {/* <WalletProvider> */}
        <App />
      {/* </WalletProvider> */}
    </MeshProvider>
  // </StrictMode>,
)
