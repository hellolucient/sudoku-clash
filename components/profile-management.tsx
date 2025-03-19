"use client"

import React, { useState } from 'react';
import { usePlayerProfile } from '../contexts/player-profile-context';
import { Button } from './ui/button';
import { Input } from './ui/input';

/**
 * Component for creating a new player profile
 */
const ProfileCreationForm: React.FC = () => {
  const { createProfile } = usePlayerProfile();
  const [playerName, setPlayerName] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim().length > 0) {
      createProfile(playerName.trim());
    }
  };
  
  return (
    <div className="flex flex-col gap-2 p-4 md:p-6 rounded-xl kraft-paper shadow-xl border-2 border-[#8C653C]">
      <h2 className="text-xl md:text-2xl font-bold text-[#4B3418] mb-2">Welcome to Sudoku Clash!</h2>
      <p className="text-[#6B4D28] mb-4">Please enter your name to get started.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="text"
          placeholder="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="bg-[#F9EED7] border-[#8C653C] text-[#4B3418]"
          required
          maxLength={20}
        />
        
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#B58853] to-[#9E7142] hover:from-[#A07647] hover:to-[#8C653C] text-white font-bold shadow-lg hover:shadow-xl transition-all mt-2 border border-[#8C653C]"
        >
          Start Playing
        </Button>
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
    <div className="bg-[#F9EED7]/90 rounded-xl p-2 border border-[#8C653C] mb-2">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[#4B3418] font-bold">{profile.name}</span>
          <span className="ml-2 px-2 py-0.5 bg-[#F5BC41] text-[#4B3418] text-xs font-bold rounded-full">
            Level {profile.level}
          </span>
        </div>
        <div className="text-xs text-[#6B4D28]">
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
      <div className="flex-1 bg-[#F9EED7]/80 rounded-lg p-1 border border-[#8C653C] text-center">
        <div className="text-[#F37B60] text-xs font-bold">Peek</div>
        <div className="text-[#4B3418] font-bold">{profile.powerups.peek}</div>
      </div>
      <div className="flex-1 bg-[#F9EED7]/80 rounded-lg p-1 border border-[#8C653C] text-center">
        <div className="text-[#4CAF50] text-xs font-bold">Swap</div>
        <div className="text-[#4B3418] font-bold">{profile.powerups.swap}</div>
      </div>
      <div className="flex-1 bg-[#F9EED7]/80 rounded-lg p-1 border border-[#8C653C] text-center">
        <div className="text-[#2196F3] text-xs font-bold">Hint</div>
        <div className="text-[#4B3418] font-bold">{profile.powerups.hint}</div>
      </div>
      <div className="flex-1 bg-[#F9EED7]/80 rounded-lg p-1 border border-[#8C653C] text-center">
        <div className="text-[#FFC107] text-xs font-bold">Safe</div>
        <div className="text-[#4B3418] font-bold">{profile.powerups.safePlay}</div>
      </div>
    </div>
  );
};

/**
 * Main profile management component that handles new user creation and profile display
 */
export default function ProfileManagement() {
  const { profile, isLoading } = usePlayerProfile();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-[#4B3418]">Loading profile...</div>
      </div>
    );
  }
  
  // If no profile exists, show creation form
  if (!profile) {
    return <ProfileCreationForm />;
  }
  
  // Show profile summary
  return (
    <div>
      <ProfileSummary />
      <PowerupDisplay />
    </div>
  );
} 