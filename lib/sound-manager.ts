'use client'

class SoundManager {
  private static instance: SoundManager;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private isMuted = false;

  private constructor() {
    // Only initialize sounds in browser environment
    if (typeof window !== 'undefined') {
      this.loadSound('celebration', '/sounds/celebration.mp3');
      this.loadSound('slide', '/sounds/slide.mp3');
      this.loadSound('win', '/sounds/win.mp3');
    }
  }

  private loadSound(name: string, path: string) {
    if (typeof window === 'undefined') return;
    const audio = new window.Audio(path);
    audio.preload = 'auto';
    this.sounds[name] = audio;
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public playSound(name: string) {
    if (typeof window === 'undefined' || this.isMuted) return;
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }
}

export const soundManager = SoundManager.getInstance(); 