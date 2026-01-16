import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const manifestPath = join(process.cwd(), 'public', 'manifest.json')
    const manifestContent = readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)
    
    return new NextResponse(JSON.stringify(manifest), {
      status: 200,
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error reading manifest.json:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Manifest not found' }),
      { 
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
