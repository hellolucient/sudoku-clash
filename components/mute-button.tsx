"use client"

import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from "lucide-react"

type MuteButtonProps = {
  isMuted: boolean
  onToggle: () => void
}

export default function MuteButton({ isMuted, onToggle }: MuteButtonProps) {
  return (
    <Button
      onClick={onToggle}
      variant="ghost"
      size="icon"
      className="bg-[#F9EED7]/90 hover:bg-[#F5BC41]/20 text-[#4B3418] rounded-full border border-[#8C653C] shadow-lg hover:shadow-xl transition-all"
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
    >
      {isMuted ? (
        <VolumeX className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </Button>
  )
} 