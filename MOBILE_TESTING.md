# Mobile Testing Guide

## Fastest Method: Chrome DevTools (Recommended)

1. **Open Chrome** → Press `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
2. **Click the device icon** (toggle device toolbar) or press `Cmd+Shift+M` (Mac) / `Ctrl+Shift+M` (Windows)
3. **Select device preset**: iPhone 12 Pro, Pixel 5, etc.
4. **Refresh** the page
5. **Test at different sizes**: Drag the width to test responsive breakpoints

This is **instant** - no setup needed!

## Test on Real Device (If Needed)

### Option 1: Use Your Vercel URL
1. Push code to GitHub
2. Vercel auto-deploys (2-3 minutes)
3. Open the Vercel URL on your Android phone
4. This is the **real production** version

### Option 2: Local Network Testing
```bash
# Start your server
python3 -m http.server 8001

# Find your local IP (Mac)
ifconfig | grep "inet " | grep -v 127.0.0.1

# On your Android phone:
# Open Chrome → Go to: http://YOUR_IP:8001
# (Both devices must be on same WiFi)
```

## Common Mobile Issues to Check

- [ ] Menu button visible and working
- [ ] Bottom nav appears and is clickable
- [ ] No horizontal scrolling
- [ ] Text is readable (not too small)
- [ ] Buttons are easy to tap (44px+)
- [ ] Images load properly
- [ ] Forms work on mobile
- [ ] Modals are full-width on mobile

