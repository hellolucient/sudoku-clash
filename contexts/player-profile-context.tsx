"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PlayerProfile, GameResult } from '../types/player-profile';
import { loadPlayerProfile, savePlayerProfile, createNewProfile } from '../lib/player-storage';
import LevelUpCelebration from '../components/level-up-celebration';
import { playSound } from '@/lib/game-utils';

interface PlayerProfileContextType {
  profile: PlayerProfile | null;
  isLoading: boolean;
  createProfile: (name: string) => void;
  updateProfile: (updates: Partial<PlayerProfile>) => void;
  updateStats: (gameResult: GameResult) => void;
  addExperience: (amount: number) => void;
  usePowerup: (type: keyof PlayerProfile['powerups']) => boolean;
  addPowerup: (type: keyof PlayerProfile['powerups'], amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
}

/**
 * Calculate XP needed for the next level
 * This creates a progressive curve where each level requires more XP
 */
const calculateNextLevelXP = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

const PlayerProfileContext = createContext<PlayerProfileContextType | undefined>(undefined);

export const PlayerProfileProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(1);

  // Load profile on initial mount
  useEffect(() => {
    const loadedProfile = loadPlayerProfile();
    
    // Ensure all power-ups are properly initialized
    if (loadedProfile && (!loadedProfile.powerups.steal || !loadedProfile.powerups.skip)) {
      loadedProfile.powerups = {
        peek: loadedProfile.powerups.peek || 3,
        swap: loadedProfile.powerups.swap || 3,
        steal: 3,
        skip: 3
      };
    }
    
    setProfile(loadedProfile);
    setIsLoading(false);
  }, []);

  // Save profile whenever it changes
  useEffect(() => {
    if (profile) {
      savePlayerProfile(profile);
    }
  }, [profile]);

  const createProfile = (name: string) => {
    const newProfile = createNewProfile(name);
    setProfile(newProfile);
  };

  const updateProfile = (updates: Partial<PlayerProfile>) => {
    if (!profile) return;
    setProfile({ ...profile, ...updates });
  };

  /**
   * Update player stats based on game results
   */
  const updateStats = (gameResult: GameResult) => {
    if (!profile) return;
    
    const now = new Date();
    const { won, score, timeInSeconds, difficulty } = gameResult;
    
    // Calculate win streak
    const currentWinStreak = won ? profile.stats.currentWinStreak + 1 : 0;
    const longestWinStreak = Math.max(currentWinStreak, profile.stats.longestWinStreak);
    
    // Calculate fastest game time
    const fastestGameTime = profile.stats.fastestGameTime === null || 
      (timeInSeconds < profile.stats.fastestGameTime && won) 
      ? timeInSeconds 
      : profile.stats.fastestGameTime;
    
    // Calculate high score
    const highScore = Math.max(score, profile.stats.highScore);
    
    // Update stats
    const updatedStats = {
      ...profile.stats,
      gamesPlayed: profile.stats.gamesPlayed + 1,
      gamesWon: won ? profile.stats.gamesWon + 1 : profile.stats.gamesWon,
      gamesLost: won ? profile.stats.gamesLost : profile.stats.gamesLost + 1,
      totalScore: profile.stats.totalScore + score,
      highScore,
      fastestGameTime,
      longestWinStreak,
      currentWinStreak,
    };
    
    // Update achievements
    const achievements = { ...profile.achievements };
    
    // Check for first game achievement
    if (!achievements.firstGame.unlocked) {
      achievements.firstGame = { unlocked: true, unlockedAt: now };
    }
    
    // Check for first win achievement
    if (won && !achievements.firstWin.unlocked) {
      achievements.firstWin = { unlocked: true, unlockedAt: now };
    }
    
    // Update games played progress
    if (achievements.fiveGamesPlayed && !achievements.fiveGamesPlayed.unlocked) {
      const progress = Math.min(updatedStats.gamesPlayed, 5);
      achievements.fiveGamesPlayed = { 
        ...achievements.fiveGamesPlayed,
        progress,
        unlocked: progress >= 5,
        unlockedAt: progress >= 5 ? now : undefined
      };
    }
    
    // Update games won progress
    if (achievements.tenGamesWon && !achievements.tenGamesWon.unlocked) {
      const progress = Math.min(updatedStats.gamesWon, 10);
      achievements.tenGamesWon = { 
        ...achievements.tenGamesWon,
        progress,
        unlocked: progress >= 10,
        unlockedAt: progress >= 10 ? now : undefined
      };
    }
    
    // Update high score progress
    if (achievements.highScorer && !achievements.highScorer.unlocked) {
      const progress = Math.min(updatedStats.highScore, 500);
      achievements.highScorer = { 
        ...achievements.highScorer,
        progress,
        unlocked: progress >= 500,
        unlockedAt: progress >= 500 ? now : undefined
      };
    }
    
    // Calculate XP earned based on game outcome and difficulty
    let xpEarned = 0;
    
    if (won) {
      // Base XP for winning
      xpEarned += 15;
      
      // Difficulty bonus for winner
      if (difficulty === 'medium') {
        xpEarned += 5;
      } else if (difficulty === 'hard') {
        xpEarned += 10;
      }
    } else {
      // Base XP for losing
      xpEarned += 5;
      
      // Difficulty bonus for loser
      if (difficulty === 'medium') {
        xpEarned += 2;
      } else if (difficulty === 'hard') {
        xpEarned += 5;
      }
    }
    
    // Update the profile
    setProfile({
      ...profile,
      stats: updatedStats,
      lastPlayedAt: now,
      achievements,
      experience: profile.experience + xpEarned
    });
    
    // Check if player leveled up
    checkForLevelUp();
  };

  /**
   * Check if player has enough XP to level up
   */
  const checkForLevelUp = () => {
    if (!profile) return;
    
    let { level, experience, experienceToNextLevel } = profile;
    let powerups = { ...profile.powerups };
    let shouldUpdate = false;
    
    // While player has enough XP to level up (including equal to)
    while (experience >= experienceToNextLevel) {
      shouldUpdate = true;
      // Level up
      level += 1;
      // Calculate excess XP to carry over
      experience = experience - experienceToNextLevel;
      // Set new XP threshold for next level
      experienceToNextLevel = calculateNextLevelXP(level);
      
      // Award powerups for leveling up
      powerups.peek += 1;
      powerups.swap += 1;
      powerups.steal += 1;
      powerups.skip += 1;

      // Show level up celebration
      setNewLevel(level);
      setShowLevelUp(true);
    }
    
    // Only update if there was a level up
    if (shouldUpdate) {
      setProfile({
        ...profile,
        level,
        experience,
        experienceToNextLevel,
        powerups
      });
    }
  };

  /**
   * Add experience points to the player
   */
  const addExperience = (amount: number) => {
    if (!profile) return;
    
    const newExperience = profile.experience + amount;
    
    // First update the experience
    setProfile({
      ...profile,
      experience: newExperience
    });
    
    // Then check for level up with the new experience value
    checkForLevelUp();
  };

  /**
   * Use a powerup if the player has one available
   * Returns true if successful, false if not enough powerups
   */
  const usePowerup = (type: keyof PlayerProfile['powerups']): boolean => {
    if (!profile) return false;
    
    const count = profile.powerups[type];
    
    if (count <= 0) return false;
    
    // Update powerups
    const powerups = { ...profile.powerups };
    powerups[type] -= 1;
    
    setProfile({
      ...profile,
      powerups
    });
    
    return true;
  };

  /**
   * Add powerups to the player's inventory
   */
  const addPowerup = (type: keyof PlayerProfile['powerups'], amount: number) => {
    if (!profile) return;
    
    const powerups = { ...profile.powerups };
    powerups[type] += amount;
    
    setProfile({
      ...profile,
      powerups
    });
  };

  /**
   * Unlock an achievement
   */
  const unlockAchievement = (achievementId: string) => {
    if (!profile || !profile.achievements[achievementId]) return;
    
    if (profile.achievements[achievementId].unlocked) return;
    
    const achievements = { ...profile.achievements };
    achievements[achievementId] = {
      ...achievements[achievementId],
      unlocked: true,
      unlockedAt: new Date()
    };
    
    setProfile({
      ...profile,
      achievements
    });
    
    // Award XP for unlocking an achievement
    addExperience(50);
  };

  /**
   * Update progress on an achievement
   */
  const updateAchievementProgress = (achievementId: string, progress: number) => {
    if (!profile || !profile.achievements[achievementId]) return;
    
    if (profile.achievements[achievementId].unlocked) return;
    
    const achievements = { ...profile.achievements };
    const achievement = achievements[achievementId];
    const total = achievement.total || 1;
    
    achievements[achievementId] = {
      ...achievement,
      progress,
      unlocked: progress >= total,
      unlockedAt: progress >= total ? new Date() : undefined
    };
    
    setProfile({
      ...profile,
      achievements
    });
    
    // If achievement was unlocked, award XP
    if (progress >= total) {
      addExperience(50);
    }
  };

  const value = {
    profile,
    isLoading,
    createProfile,
    updateProfile,
    updateStats,
    addExperience,
    usePowerup,
    addPowerup,
    unlockAchievement,
    updateAchievementProgress
  };

  return (
    <PlayerProfileContext.Provider
      value={{
        profile,
        isLoading,
        createProfile,
        updateProfile,
        updateStats,
        addExperience,
        usePowerup,
        addPowerup,
        unlockAchievement,
        updateAchievementProgress
      }}
    >
      {children}
      <LevelUpCelebration
        isVisible={showLevelUp}
        newLevel={newLevel}
        onClose={() => setShowLevelUp(false)}
      />
    </PlayerProfileContext.Provider>
  );
};

/**
 * Hook for using the player profile context
 */
export const usePlayerProfile = () => {
  const context = useContext(PlayerProfileContext);
  if (context === undefined) {
    throw new Error('usePlayerProfile must be used within a PlayerProfileProvider');
  }
  return context;
}; 