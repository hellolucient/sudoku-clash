# Android TWA Setup for Sudoku Clash

This directory contains the Android Trusted Web Activity (TWA) project for deploying Sudoku Clash to the Solana Seeker dApp Store.

## Prerequisites

1. **Node.js** v18+ (you have v20.18.0 ✅)
2. **Bubblewrap CLI** - Will be installed via npx
3. **Java JDK** v17+ - Will be downloaded by Bubblewrap automatically
4. **Android Build Tools** v34.0.0+ - Will be downloaded by Bubblewrap automatically

## Initial Setup

### Step 1: Initialize TWA Project

```bash
cd android
npx @bubblewrap/cli init --manifest twa-manifest.json
```

This will:
- Download JDK and Android SDK automatically
- Generate Android project structure
- Create Gradle build files
- Set up the TWA wrapper

### Step 2: Create Android Keystore

**⚠️ CRITICAL: Keep this keystore secure! You cannot update your app without it.**

After Bubblewrap initializes, create the keystore:

```bash
# Mac/Linux
keytool -genkeypair -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000

# Windows (PowerShell)
$keytoolPath = "$env:USERPROFILE\.bubblewrap\jdk\jdk-17.0.11+9\bin\keytool.exe"
& $keytoolPath -genkeypair -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
```

**Store credentials securely:**
Create `keystore.properties`:
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=android
storeFile=android.keystore
```

### Step 3: Get Certificate Fingerprint

After creating the keystore, get the SHA-256 fingerprint:

```bash
# Mac/Linux
keytool -list -v -keystore android.keystore -alias android | grep "SHA256"

# Windows
keytool -list -v -keystore android.keystore -alias android | Select-String "SHA256"
```

**Important:** Convert the output to uppercase with colons format:
- Example: `ea:78:51:a3:20:9b:...` (uppercase, with colons)

### Step 4: Update Configuration Files

1. **Update `twa-manifest.json`:**
   - Replace `PLACEHOLDER_FINGERPRINT_WILL_BE_ADDED_AFTER_KEYSTORE_CREATION` with your actual fingerprint

2. **Update `public/.well-known/assetlinks.json`:**
   - Replace `PLACEHOLDER_FINGERPRINT_WILL_BE_ADDED_AFTER_ANDROID_KEYSTORE_CREATION` with your actual fingerprint

3. **Regenerate Android project:**
   ```bash
   npx @bubblewrap/cli update --manifest twa-manifest.json
   ```

## Building the APK

### Build Release APK

```bash
cd android
./gradlew clean assembleRelease
```

### Sign and Align APK

See `.cursor/twa-deployment-rules.md` for detailed signing instructions.

## Current Configuration

- **Package ID:** `com.sudokuclash.app`
- **Host:** `sudokuclash.com`
- **App Name:** Sudoku Clash
- **Version:** 1 (versionCode: 1)

## Next Steps

1. Run `npx @bubblewrap/cli init` to generate Android project
2. Create keystore
3. Update fingerprints in both `twa-manifest.json` and `assetlinks.json`
4. Build and test APK

For detailed instructions, see `.cursor/twa-deployment-rules.md`
