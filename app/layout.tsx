import type { Metadata, Viewport } from 'next'
import './globals.css'
import { PlayerProfileProvider } from '../contexts/player-profile-context'
import SoundManager from '@/components/sound-manager'

export const metadata: Metadata = {
  title: 'Sudoku Clash',
  description: 'A competitive twist on the classic Sudoku puzzle',
  generator: 'v0.dev',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sudoku Clash',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F5BC41',
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
