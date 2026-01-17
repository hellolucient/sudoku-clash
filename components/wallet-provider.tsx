'use client';

import { useMemo, useEffect } from 'react';
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import {
  createDefaultAuthorizationCache,
  createDefaultChainSelector,
  createDefaultWalletNotFoundHandler,
  registerMwa,
} from '@solana-mobile/wallet-standard-mobile';

import '@solana/wallet-adapter-react-ui/styles.css';

function getOrigin() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://sudokuclash.com';
  }
  return window.location.origin;
}

interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const origin = getOrigin();
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet;
  
  // CRITICAL: Register Mobile Wallet Adapter for Android Chrome
  // This MUST be called in a non-SSR context (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if we're on Android Chrome
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isChrome = /Chrome/i.test(navigator.userAgent) && !/Edg|OPR|Samsung/i.test(navigator.userAgent);
    
    if (isAndroid && isChrome) {
      try {
        registerMwa({
          appIdentity: {
            name: 'Sudoku Clash',
            uri: origin,
            icon: '/placeholder-logo.png',
          },
          authorizationCache: createDefaultAuthorizationCache(),
          chains: ['solana:mainnet', 'solana:devnet'],
          chainSelector: createDefaultChainSelector(),
          onWalletNotFound: createDefaultWalletNotFoundHandler(),
        });
        console.log('Mobile Wallet Adapter registered for Android Chrome');
      } catch (error) {
        console.error('Failed to register Mobile Wallet Adapter:', error);
      }
    }
  }, [origin]);
  
  const endpoint = useMemo(() => {
    if (network === WalletAdapterNetwork.Mainnet) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    }
    return process.env.NEXT_PUBLIC_SOLANA_RPC_URL || clusterApiUrl(network);
  }, [network]);

  // Use empty array - Wallet Standard will automatically detect wallets like Phantom and Solflare
  // MWA registration makes mobile wallets available via Wallet Standard
  // Seeker wallet (Seed Vault) will be detected automatically
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}
