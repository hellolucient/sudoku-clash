"use client"

import React, { useState, useEffect } from 'react';
import { usePlayerProfile } from '../contexts/player-profile-context';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { deletePlayerProfile } from '@/lib/player-storage';

type ProfileManagementProps = {
  onStartGame: (difficulty: "easy" | "medium" | "hard") => void;
}

/**
 * Component for creating a new player profile
 */
const ProfileCreationForm: React.FC = () => {
  const { createProfile } = usePlayerProfile();
  const { publicKey, connected, wallet, connect, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const [playerName, setPlayerName] = useState('');
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // When wallet connects, create profile automatically
  useEffect(() => {
    if (connected && publicKey && isConnectingWallet) {
      // Generate a name from the wallet public key (shortened)
      const shortAddress = `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`;
      const walletName = `Wallet ${shortAddress}`;
      createProfile(walletName, publicKey.toString());
      setIsConnectingWallet(false);
      setConnectionError(null);
    }
  }, [connected, publicKey, isConnectingWallet, createProfile]);
  
  // Reset connecting state when connection attempt ends (success or failure)
  useEffect(() => {
    if (!connecting && isConnectingWallet && !connected) {
      // Connection attempt finished but didn't connect
      // This handles the case where user rejected or connection failed
      // Small delay to allow wallet adapter to process
      const timer = setTimeout(() => {
        setIsConnectingWallet(false);
        // Connection was attempted but didn't succeed - user likely rejected
        setConnectionError('Connection was cancelled. You can try again or enter your name instead.');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [connecting, isConnectingWallet, connected]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim().length > 0) {
      createProfile(playerName.trim());
    }
  };
  
  const handleSignInWithWallet = async () => {
    setIsConnectingWallet(true);
    setConnectionError(null);
    try {
      if (connected && publicKey) {
        // Already connected, create profile
        const shortAddress = `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`;
        const walletName = `Wallet ${shortAddress}`;
        createProfile(walletName, publicKey.toString());
        setIsConnectingWallet(false);
      } else {
        // Open wallet modal - it will handle the connection
        // The useEffect hooks will detect success/failure
        setVisible(true);
      }
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      // Check if it's a user rejection
      if (error?.code === 4001 || error?.message?.includes('rejected') || error?.message?.includes('User rejected')) {
        setConnectionError('Connection was cancelled. You can try again or enter your name instead.');
      } else {
        setConnectionError('Failed to connect wallet. Please try again or enter your name instead.');
      }
      setIsConnectingWallet(false);
    }
  };
  
  // Check if Seeker wallet (Seed Vault) is available
  const isSeekerWallet = wallet?.name?.includes('Seeker') || wallet?.name?.includes('Seed Vault');
  const walletButtonText = isSeekerWallet 
    ? 'Sign in with Seeker Wallet' 
    : 'Sign in with Wallet';
  
  return (
    <div className="flex flex-col gap-2 p-4 md:p-6 rounded-xl bg-[#1a1a2e] shadow-xl border-2 border-[#14F195]/30">
      <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Welcome to Sudoku Clash!</h2>
      <p className="text-[#14F195] mb-4">Please enter your name or sign in with your wallet to get started.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="bg-[#0D1117] border-[#14F195]/30 text-white placeholder:text-[#14F195]/50"
          maxLength={20}
        />
        
        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 border-t border-[#14F195]/30"></div>
          <span className="text-[#14F195] text-sm">or</span>
          <div className="flex-1 border-t border-[#14F195]/30"></div>
        </div>
        
        <Button
          type="button"
          onClick={handleSignInWithWallet}
          disabled={connecting || isConnectingWallet}
          className="bg-gradient-to-r from-[#14F195] to-[#00D4AA] hover:from-[#12E085] hover:to-[#00C49A] text-[#0D1117] font-bold shadow-lg hover:shadow-xl transition-all"
        >
          {connecting || isConnectingWallet ? 'Connecting...' : walletButtonText}
        </Button>
        
        {connectionError && (
          <div className="mt-2 p-2 bg-[#FF6B6B]/20 border border-[#FF6B6B]/40 rounded text-[#FF6B6B] text-sm">
            {connectionError}
          </div>
        )}
        
        {playerName.trim().length > 0 && (
          <Button
            type="submit"
            className="bg-gradient-to-r from-[#9945FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold shadow-lg hover:shadow-xl transition-all mt-2"
          >
            Start Playing
          </Button>
        )}
      </form>
    </div>
  );
};

/**
 * Component for displaying a player profile summary
 */
const ProfileSummary: React.FC = () => {
  const { profile } = usePlayerProfile();
  
  if (!profile) return null;
  
  return (
    <div className="bg-[#1a1a2e] rounded-lg p-2 border border-[#14F195]/30 mb-2">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-white font-bold">{profile.name}</span>
          <span className="ml-2 px-2 py-0.5 bg-[#14F195] text-[#0D1117] text-xs font-bold rounded-full">
            Level {profile.level}
          </span>
        </div>
        <div className="text-xs text-[#14F195]">
          XP: {profile.experience}/{profile.experienceToNextLevel}
        </div>
      </div>
    </div>
  );
};

/**
 * Component for displaying available power-ups
 */
const PowerupDisplay: React.FC = () => {
  const { profile } = usePlayerProfile();
  
  if (!profile) return null;
  
  return (
    <div className="flex gap-2 mt-1">
      <div className="flex-1 bg-[#1a1a2e] rounded-lg p-1 border border-[#14F195]/30 text-center">
        <div className="flex items-center gap-1 justify-center">
          <span role="img" aria-label="peek">👁️</span>
          <div className="text-[#14F195] text-xs font-bold">Peek</div>
          <div className="text-white font-bold">{profile.powerups.peek}</div>
        </div>
      </div>
      <div className="flex-1 bg-[#1a1a2e] rounded-lg p-1 border border-[#14F195]/30 text-center">
        <div className="flex items-center gap-1 justify-center">
          <span role="img" aria-label="swap">🔄</span>
          <div className="text-[#14F195] text-xs font-bold">Swap</div>
          <div className="text-white font-bold">{profile.powerups.swap}</div>
        </div>
      </div>
      <div className="flex-1 bg-[#1a1a2e] rounded-lg p-1 border border-[#14F195]/30 text-center">
        <div className="flex items-center gap-1 justify-center">
          <span role="img" aria-label="steal">💸</span>
          <div className="text-[#14F195] text-xs font-bold">Steal</div>
          <div className="text-white font-bold">{profile.powerups.steal}</div>
        </div>
      </div>
      <div className="flex-1 bg-[#1a1a2e] rounded-lg p-1 border border-[#14F195]/30 text-center">
        <div className="flex items-center gap-1 justify-center">
          <span role="img" aria-label="skip">⏩</span>
          <div className="text-[#14F195] text-xs font-bold">Skip</div>
          <div className="text-white font-bold">{profile.powerups.skip}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main profile management component that handles new user creation and profile display
 */
export default function ProfileManagement({ onStartGame }: ProfileManagementProps) {
  const { profile, isLoading } = usePlayerProfile();
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }
  
  // If no profile exists, show creation form
  if (!profile) {
    return <ProfileCreationForm />;
  }
  
  const handleReset = () => {
    deletePlayerProfile();
    window.location.reload(); // Reload to show profile creation
  };
  
  // Show profile summary
  return (
    <div>
      <ProfileSummary />
      <PowerupDisplay />
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="difficulty" className="text-sm font-medium text-[#14F195]">
            Difficulty
          </label>
          <Select value={difficulty} onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)}>
            <SelectTrigger id="difficulty" className="bg-[#0D1117] border-[#14F195]/30 text-white">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-[#14F195]/30">
              <SelectItem value="easy" className="text-white focus:bg-[#252547]">
                Easy
              </SelectItem>
              <SelectItem value="medium" className="text-white focus:bg-[#252547]">
                Medium
              </SelectItem>
              <SelectItem value="hard" className="text-white focus:bg-[#252547]">
                Hard
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => onStartGame(difficulty)}
          className="bg-gradient-to-r from-[#9945FF] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white font-bold shadow-lg hover:shadow-xl transition-all mt-1"
        >
          START GAME
        </Button>
        
        {/* Reset Profile Section */}
        <div className="mt-4 pt-4 border-t border-[#14F195]/30">
          <Button
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-[#1a1a2e] hover:bg-[#252547] text-[#FF6B6B] hover:text-[#FF8888] font-bold shadow-lg hover:shadow-xl transition-all border border-[#FF6B6B]/40 hover:border-[#FF6B6B]/60"
          >
            Reset Profile
          </Button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-2xl max-w-md w-full mx-4 border border-[#14F195]/30">
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              Reset Profile?
            </h2>
            <p className="text-[#14F195] mb-6 text-center">
              This will delete your current profile and all progress. You will need to create a new profile.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-[#1a1a2e] hover:bg-[#252547] text-white font-bold border border-[#14F195]/30"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReset}
                className="flex-1 bg-[#1a1a2e] hover:bg-[#252547] text-[#FF6B6B] hover:text-[#FF8888] font-bold border border-[#FF6B6B]/40 hover:border-[#FF6B6B]/60"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 