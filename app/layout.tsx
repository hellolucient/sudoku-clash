import type { Metadata } from 'next'
import './globals.css'
import { PlayerProfileProvider } from '../contexts/player-profile-context'
import SoundManager from '@/components/sound-manager'

export const metadata: Metadata = {
  title: 'Sudoku Clash',
  description: 'A competitive twist on the classic Sudoku puzzle',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <PlayerProfileProvider>
          {children}
          <SoundManager />
        </PlayerProfileProvider>
      </body>
    </html>
  )
}
