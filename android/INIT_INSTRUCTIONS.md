# Bubblewrap Initialization Instructions

## Issue: "Invalid URL" Error

Bubblewrap is trying to fetch the manifest from the live URL, but it needs to be accessible. Here are two solutions:

## Solution 1: Initialize from Local Manifest (Recommended)

Instead of using `webManifestUrl` in the TWA manifest, initialize Bubblewrap by pointing directly to your local manifest:

```bash
cd android
npx @bubblewrap/cli init --manifest ../public/manifest.json
```

This will create a `twa-manifest.json` automatically. Then you can copy our custom configuration into it.

## Solution 2: Deploy Manifest First, Then Initialize

1. **Push your changes** (if not already done):
   ```bash
   git push
   ```

2. **Wait for Vercel deployment** (check Vercel dashboard)

3. **Verify manifest is accessible**:
   ```bash
   curl https://sudokuclash.com/manifest.json
   ```
   Should return JSON content.

4. **Then run init**:
   ```bash
   cd android
   npx @bubblewrap/cli init --manifest twa-manifest.json
   ```

## Solution 3: Initialize Without webManifestUrl, Add Later

1. **Temporarily remove webManifestUrl** from `twa-manifest.json` (already done)

2. **Initialize**:
   ```bash
   cd android
   npx @bubblewrap/cli init --manifest twa-manifest.json
   ```

3. **After initialization, update the project**:
   ```bash
   npx @bubblewrap/cli update --manifest twa-manifest.json
   ```
   (This will add the webManifestUrl back)

## Recommended: Try Solution 1 First

Point Bubblewrap directly to your local manifest file - this is the most reliable approach.
