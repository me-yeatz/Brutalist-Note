# App Icons Setup

This folder should contain all the app icons needed for PWA and iOS deployment.

## Required Icons

### PWA Icons (manifest.json)
- `icon-72x72.png` - 72x72 pixels
- `icon-96x96.png` - 96x96 pixels
- `icon-128x128.png` - 128x128 pixels
- `icon-144x144.png` - 144x144 pixels
- `icon-152x152.png` - 152x152 pixels
- `icon-192x192.png` - 192x192 pixels
- `icon-384x384.png` - 384x384 pixels
- `icon-512x512.png` - 512x512 pixels (required)

### iOS Icons
- `apple-touch-icon.png` - 180x180 pixels (for iOS home screen)
- `icon-32x32.png` - 32x32 pixels (favicon)
- `icon-16x16.png` - 16x16 pixels (favicon)
- `safari-pinned-tab.svg` - SVG icon for Safari pinned tabs

## Creating Icons

### Option 1: Use an Icon Generator
1. Create a 1024x1024 master icon
2. Use tools like:
   - [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
   - [RealFaviconGenerator](https://realfavicongenerator.net/)
   - [App Icon Generator](https://www.appicon.co/)

### Option 2: Manual Creation
1. Design your icon at 1024x1024
2. Export at all required sizes
3. Ensure icons are square with no transparency (except SVG)

## Icon Design Guidelines

- Use the Neo-Brutalist design style
- High contrast colors (#ff6b35, #1D1D1B, #EAC119)
- Simple, bold shapes
- Readable at small sizes
- No text in small icons

## Quick Setup

If you don't have icons yet, you can:

1. Use a placeholder icon generator
2. Create a simple geometric icon matching the app's design
3. Use the app logo as the base

## Testing Icons

After adding icons:
1. Test PWA installation on different browsers
2. Test iOS "Add to Home Screen"
3. Verify icons appear correctly in all contexts

