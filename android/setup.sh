#!/bin/bash

# Setup script for Android TWA project
# This script helps initialize the Bubblewrap TWA project

set -e

echo "🚀 Setting up Android TWA for Sudoku Clash"
echo ""

# Check if twa-manifest.json exists
if [ ! -f "twa-manifest.json" ]; then
    echo "❌ Error: twa-manifest.json not found!"
    exit 1
fi

echo "📋 Current configuration:"
echo "   Package ID: com.sudokuclash.app"
echo "   Host: sudokuclash.com"
echo "   App Name: Sudoku Clash"
echo ""

echo "📦 Initializing Bubblewrap TWA project..."
echo "   This will download JDK and Android SDK automatically"
echo ""

# Initialize Bubblewrap project
npx @bubblewrap/cli init --manifest twa-manifest.json

echo ""
echo "✅ Bubblewrap initialization complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Create Android keystore (see README.md)"
echo "   2. Get certificate fingerprint"
echo "   3. Update twa-manifest.json with fingerprint"
echo "   4. Update ../public/.well-known/assetlinks.json with fingerprint"
echo "   5. Run: npx @bubblewrap/cli update --manifest twa-manifest.json"
echo "   6. Build APK: ./gradlew clean assembleRelease"
echo ""
