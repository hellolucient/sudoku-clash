import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle manifest.json requests
  if (request.nextUrl.pathname === '/manifest.json') {
    const manifest = {
      name: "Sudoku Clash",
      short_name: "Sudoku Clash",
      description: "A competitive twist on the classic Sudoku puzzle",
      start_url: "/",
      display: "standalone",
      display_override: ["standalone", "minimal-ui"],
      background_color: "#E6D7C3",
      theme_color: "#F5BC41",
      orientation: "portrait",
      scope: "/",
      icons: [
        {
          src: "/placeholder-logo.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any"
        },
        {
          src: "/placeholder-logo.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable"
        }
      ],
      categories: ["games", "puzzle"],
      screenshots: []
    }
    
    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/manifest.json'],
}
