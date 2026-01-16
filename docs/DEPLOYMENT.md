# Deployment Documentation

## General Deployment Guidelines

### Build Commands
```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start
```

### Environment Setup
- Node.js 18+ required
- No environment variables currently needed (all client-side)

### Static Export (for static hosting)
If deploying to static hosting (Vercel, Netlify, etc.):
- Next.js will automatically detect and optimize
- No additional configuration needed

## Platform-Specific Deployment

### Vercel
1. Connect GitHub repository
2. Vercel auto-detects Next.js
3. Deploy automatically on push

### Netlify
1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `.next`

### Solana Seeker
See `SOLANA_SEEKER.md` for specific instructions.
