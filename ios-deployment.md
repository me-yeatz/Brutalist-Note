# iOS Deployment Guide

This guide will help you deploy Brutal Notes as a native iOS app.

## Prerequisites

- macOS (required for iOS development)
- Xcode (latest version recommended)
- Apple Developer Account (for App Store distribution)
- Node.js and npm (for Capacitor)

## Method 1: PWA (Simplest - No Code Changes)

This is the easiest way to get your app on iOS:

1. **Deploy to a web server:**
   - GitHub Pages
   - Netlify
   - Vercel
   - Your own server

2. **Open in Safari on iOS:**
   - Navigate to your deployed URL
   - Tap the Share button
   - Select "Add to Home Screen"
   - The app will appear as a native app icon

3. **Done!** Your app now works like a native iOS app.

## Method 2: Capacitor (Native iOS App)

### Step 1: Install Dependencies

```bash
# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Install Capacitor packages
npm install @capacitor/core @capacitor/ios
```

### Step 2: Initialize Capacitor

```bash
# Initialize Capacitor (if not already done)
npx cap init "Brutal Notes" "com.yeatz.brutalnotes"

# Add iOS platform
npx cap add ios
```

### Step 3: Configure Capacitor

Create or update `capacitor.config.json`:

```json
{
  "appId": "com.yeatz.brutalnotes",
  "appName": "Brutal Notes",
  "webDir": ".",
  "bundledWebRuntime": false,
  "server": {
    "iosScheme": "https",
    "androidScheme": "https"
  },
  "ios": {
    "contentInset": "automatic"
  }
}
```

### Step 4: Sync and Open in Xcode

```bash
# Sync web assets to iOS
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### Step 5: Configure in Xcode

1. **Set Bundle Identifier:**
   - Select project in Xcode
   - Go to "Signing & Capabilities"
   - Set your unique bundle identifier

2. **Configure Signing:**
   - Select your development team
   - Xcode will automatically manage provisioning

3. **Set App Icons:**
   - Add app icons in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Required sizes: 20x20, 29x29, 40x40, 60x60, 76x76, 83.5x83.5, 1024x1024

4. **Configure Info.plist:**
   - Add app name, version, etc.
   - Set minimum iOS version (recommended: 13.0+)

### Step 6: Build and Run

1. **For Simulator:**
   - Select a simulator from the device menu
   - Click Run (⌘R)

2. **For Physical Device:**
   - Connect your iPhone via USB
   - Select your device from the device menu
   - Click Run
   - Trust the developer certificate on your device if prompted

### Step 7: Build for Distribution

1. **Archive:**
   - Product → Archive
   - Wait for archive to complete

2. **Distribute:**
   - Click "Distribute App"
   - Choose distribution method:
     - **App Store Connect** - For App Store
     - **Ad Hoc** - For testing on specific devices
     - **Enterprise** - For enterprise distribution
     - **Development** - For development builds

## Method 3: WebView Wrapper (Alternative)

If you prefer not to use Capacitor, you can create a simple WebView wrapper:

1. Create a new Xcode project (Single View App)
2. Add a WKWebView to your ViewController
3. Load your web app URL
4. Configure for full-screen experience

See example code in `ios-webview-example/` (if provided).

## App Store Submission

### Requirements

1. **App Icons:**
   - 1024x1024 PNG (required)
   - All sizes in AppIcon asset

2. **Screenshots:**
   - iPhone 6.7" (1290 x 2796)
   - iPhone 6.5" (1284 x 2778)
   - iPhone 5.5" (1242 x 2208)
   - iPad Pro 12.9" (2048 x 2732)

3. **App Information:**
   - App name
   - Subtitle
   - Description
   - Keywords
   - Category
   - Privacy policy URL

4. **Build Upload:**
   - Upload via Xcode or Transporter app
   - Wait for processing
   - Submit for review

### App Store Guidelines

- Ensure your app follows Apple's Human Interface Guidelines
- Provide a privacy policy if you collect any data
- Test thoroughly on real devices
- Ensure all features work offline (if claimed)

## Troubleshooting

### Common Issues

1. **Build Errors:**
   - Clean build folder (⌘⇧K)
   - Delete DerivedData
   - Restart Xcode

2. **Signing Issues:**
   - Check bundle identifier is unique
   - Verify Apple Developer account
   - Check provisioning profiles

3. **WebView Not Loading:**
   - Check Info.plist for App Transport Security settings
   - Ensure HTTPS or allow HTTP in development

4. **Icons Not Showing:**
   - Verify all icon sizes are present
   - Clean build and rebuild

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)

## Support

If you encounter issues, please:
1. Check the [Issues](https://github.com/yourusername/brutal-notes/issues) page
2. Search existing issues
3. Create a new issue with detailed information

---

**Happy Coding! 🚀**

