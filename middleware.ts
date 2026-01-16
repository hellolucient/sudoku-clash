import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Intercept manifest.json requests and rewrite to API route
  if (request.nextUrl.pathname === '/manifest.json') {
    const url = request.nextUrl.clone()
    url.pathname = '/api/manifest'
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/manifest.json',
}
