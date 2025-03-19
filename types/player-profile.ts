/**
 * PlayerProfile type definition
 * Stores all player-related data, stats, and preferences
 */

export type PlayerProfile = {
  // Basic info
  id: string;                // Unique identifier for the player
  name: string;              // Player's chosen name
  createdAt: Date;           // When the profile was created
  lastPlayedAt: Date;        // Last time they played
  
  // Game statistics
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    totalScore: number;
    highScore: number;
    fastestGameTime: number | null; // in seconds
    longestWinStreak: number;
    currentWinStreak: number;
  };
  
  // Progression
  level: number;             // Player level
  experience: number;        // XP points
  experienceToNextLevel: number;
  
  // Features/unlocks
  powerups: {
    peek: number;            // How many of each powerup they have
    swap: number;
    hint: number;
    safePlay: number;
    // Add more as we implement them
  };
  
  // Preferences
  preferences: {
    theme: string;           // UI theme preference
    soundEnabled: boolean;
    musicEnabled: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  
  // Achievements
  achievements: {
    [key: string]: {
      unlocked: boolean;
      unlockedAt?: Date;
      progress?: number;
      total?: number;
    }
  };
}

/**
 * Game result used for updating player stats
 */
export type GameResult = {
  won: boolean;
  score: number;
  timeInSeconds: number;
  difficulty: 'easy' | 'medium' | 'hard';
} 