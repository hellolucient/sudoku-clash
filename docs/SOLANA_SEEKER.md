# Solana Seeker dApp Store Deployment Guide

## Overview
This document outlines the steps and requirements for deploying Sudoku Clash to the Solana Seeker dApp store.

## Prerequisites
- Solana wallet (Phantom, Solflare, etc.)
- Solana Seeker developer account
- Next.js app ready for production build

## Deployment Steps

### 1. Build the Application
```bash
npm run build
# or
pnpm build
```

### 2. Export Static Site (if required)
If Solana Seeker requires static hosting:
```bash
# Add to next.config.mjs:
output: 'export'
```

### 3. Prepare Metadata
- App name: Sudoku Clash
- Description: A competitive twist on the classic Sudoku puzzle
- Category: Games / Puzzle
- Icon/Logo: Prepare app icon (recommended: 512x512px)
- Screenshots: Prepare 3-5 screenshots of gameplay

### 4. Solana Integration (if required)
- Check if Solana wallet connection is needed
- Add Solana wallet adapter if required
- Configure network (mainnet/devnet)

### 5. Environment Variables
Create `.env.production` if needed:
```
# Add any required environment variables
```

### 6. Submit to Solana Seeker
- Follow Solana Seeker's submission process
- Upload build artifacts
- Provide metadata and screenshots
- Submit for review

## Notes
- This is a client-side only game (no backend required)
- Uses localStorage for player profiles
- No blockchain transactions needed (unless adding Solana features)
