"use client"

import { PlayerProfile } from '../types/player-profile';

const STORAGE_KEY = 'sudoku-clash-player';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Generate a unique ID for new player profiles
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Save player profile to localStorage
 */
export const savePlayerProfile = (profile: PlayerProfile): void => {
  if (!isBrowser) return;
  
  // Convert Date objects to strings for storage
  const serializedProfile = {
    ...profile,
    createdAt: profile.createdAt.toISOString(),
    lastPlayedAt: profile.lastPlayedAt.toISOString(),
    achievements: Object.entries(profile.achievements).reduce((acc, [key, achievement]) => {
      return {
        ...acc,
        [key]: {
          ...achievement,
          unlockedAt: achievement.unlockedAt ? achievement.unlockedAt.toISOString() : undefined
        }
      };
    }, {})
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializedProfile));
};

/**
 * Load player profile from localStorage
 */
export const loadPlayerProfile = (): PlayerProfile | null => {
  if (!isBrowser) return null;
  
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return null;
  
  try {
    const parsed = JSON.parse(saved);
    
    // Convert string dates back to Date objects
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      lastPlayedAt: new Date(parsed.lastPlayedAt),
      achievements: Object.entries(parsed.achievements).reduce((acc, [key, achievement]) => {
        const typedAchievement = achievement as any;
        return {
          ...acc,
          [key]: {
            ...typedAchievement,
            unlockedAt: typedAchievement.unlockedAt ? new Date(typedAchievement.unlockedAt) : undefined
          }
        };
      }, {})
    } as PlayerProfile;
  } catch (e) {
    console.error('Failed to parse player profile', e);
    return null;
  }
};

/**
 * Create a new player profile with default values
 */
export const createNewProfile = (name: string): PlayerProfile => {
  const now = new Date();
  
  return {
    id: generateUniqueId(),
    name,
    createdAt: now,
    lastPlayedAt: now,
    stats: {
      gamesPlayed: 0,
      gamesWon: 0,
      gamesLost: 0,
      totalScore: 0,
      highScore: 0,
      fastestGameTime: null,
      longestWinStreak: 0,
      currentWinStreak: 0,
    },
    level: 1,
    experience: 0,
    experienceToNextLevel: 100, // Define your XP progression curve
    powerups: {
      peek: 3,     // Start with 3 of each basic powerup
      swap: 3,
      hint: 3,
      safePlay: 3,
    },
    preferences: {
      theme: 'default',
      soundEnabled: true,
      musicEnabled: true,
      difficulty: 'medium',
    },
    achievements: {
      // Initial achievement definitions
      firstGame: { unlocked: false },
      firstWin: { unlocked: false },
      perfectGame: { unlocked: false },
      fiveGamesPlayed: { unlocked: false, progress: 0, total: 5 },
      tenGamesWon: { unlocked: false, progress: 0, total: 10 },
      highScorer: { unlocked: false, progress: 0, total: 500 },
      // Add more as needed
    }
  };
};

/**
 * Delete the player profile from localStorage
 */
export const deletePlayerProfile = (): void => {
  if (!isBrowser) return;
  localStorage.removeItem(STORAGE_KEY);
}; 