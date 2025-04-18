"use client"

import React, { useState } from 'react';
import { usePlayerProfile } from '../contexts/player-profile-context';
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
        <div className="flex items-center gap-1">
          <span role="img" aria-label="peek">👁️</span>
          <div className="text-[#2196F3] text-xs font-bold">Peek</div>
          <div className="text-[#4B3418] font-bold">{profile.powerups.peek}</div>
        </div>
      </div>
      <div className="flex-1 bg-[#F9EED7]/80 rounded-lg p-1 border border-[#8C653C] text-center">
        <div className="flex items-center gap-1">
          <span role="img" aria-label="swap">🔄</span>
          <div className="text-[#2196F3] text-xs font-bold">Swap</div>
          <div className="text-[#4B3418] font-bold">{profile.powerups.swap}</div>
        </div>
      </div>
      <div className="flex-1 bg-[#F9EED7]/80 rounded-lg p-1 border border-[#8C653C] text-center">
        <div className="flex items-center gap-1">
          <span role="img" aria-label="steal">🫳</span>
          <div className="text-[#2196F3] text-xs font-bold">Steal</div>
          <div className="text-[#4B3418] font-bold">{profile.powerups.steal}</div>
        </div>
      </div>
      <div className="flex-1 bg-[#F9EED7]/80 rounded-lg p-1 border border-[#8C653C] text-center">
        <div className="flex items-center gap-1">
          <span role="img" aria-label="skip">⏭️</span>
          <div className="text-[#2196F3] text-xs font-bold">Skip</div>
          <div className="text-[#4B3418] font-bold">{profile.powerups.skip}</div>
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
        <div className="text-[#4B3418]">Loading profile...</div>
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
          <label htmlFor="difficulty" className="text-sm font-medium text-[#6B4D28]">
            Difficulty
          </label>
          <Select value={difficulty} onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)}>
            <SelectTrigger id="difficulty" className="bg-[#F9EED7] border-[#8C653C] text-[#4B3418]">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-[#F9EED7] border-[#8C653C]">
              <SelectItem value="easy" className="text-[#4B3418] focus:bg-[#F5DFB3]">
                Easy
              </SelectItem>
              <SelectItem value="medium" className="text-[#4B3418] focus:bg-[#F5DFB3]">
                Medium
              </SelectItem>
              <SelectItem value="hard" className="text-[#4B3418] focus:bg-[#F5DFB3]">
                Hard
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={() => onStartGame(difficulty)}
          className="bg-gradient-to-r from-[#B58853] to-[#9E7142] hover:from-[#A07647] hover:to-[#8C653C] text-white font-bold shadow-lg hover:shadow-xl transition-all mt-1 border border-[#8C653C]"
        >
          START GAME
        </Button>
        
        {/* Reset Profile Section */}
        <div className="mt-4 pt-4 border-t border-[#8C653C]">
          <Button
            onClick={() => setShowResetConfirm(true)}
            className="w-full bg-[#CC4B37] hover:bg-[#BC3B27] text-white font-bold shadow-lg hover:shadow-xl transition-all border border-[#8C653C]"
          >
            Reset Profile
          </Button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#F4E6CC] p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-[#4A2F1F] mb-4 text-center">
              Reset Profile?
            </h2>
            <p className="text-[#4A2F1F] mb-6 text-center">
              This will delete your current profile and all progress. You will need to create a new profile.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-[#8C653C] hover:bg-[#6B4D28] text-white font-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleReset}
                className="flex-1 bg-[#CC4B37] hover:bg-[#BC3B27] text-white font-bold"
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