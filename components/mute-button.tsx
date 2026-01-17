"use client"

import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Music2 } from "lucide-react"

type MuteButtonProps = {
  isMuted: boolean
  onToggle: () => void
  type?: "sound" | "music"
}

export default function MuteButton({ isMuted, onToggle, type = "sound" }: MuteButtonProps) {
  const isMusic = type === "music"
  
  return (
    <Button
      onClick={onToggle}
      variant="ghost"
      size="icon"
      className="bg-[#1a1a2e] hover:bg-[#252547] text-[#14F195] rounded-full border border-[#14F195]/30 shadow-lg hover:shadow-xl transition-all w-8 h-8"
      aria-label={isMuted 
        ? (isMusic ? "Unmute music" : "Unmute sound") 
        : (isMusic ? "Mute music" : "Mute sound")
      }
      title={isMuted 
        ? (isMusic ? "Unmute music" : "Unmute sound effects") 
        : (isMusic ? "Mute music" : "Mute sound effects")
      }
    >
      {isMusic ? (
        isMuted ? (
          <Music2 className="h-4 w-4 opacity-50" />
        ) : (
          <Music2 className="h-4 w-4" />
        )
      ) : (
        isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )
      )}
    </Button>
  )
} 