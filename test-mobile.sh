#!/bin/bash
# Quick Mobile Testing Script

echo "🚀 Starting mobile test server..."
echo ""
echo "📱 To test on your Android phone:"
echo "1. Make sure phone and computer are on same WiFi"
echo "2. Find your local IP below"
echo "3. On your phone, open: http://YOUR_IP:8001"
echo ""
echo "💡 Faster: Use Chrome DevTools (F12 → Toggle device toolbar)"
echo ""

# Get local IP
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    IP=$(hostname -I | awk '{print $1}')
else
    IP="YOUR_COMPUTER_IP"
fi

echo "📍 Your local IP: $IP"
echo ""
echo "🌐 Server starting at: http://localhost:8001"
echo "📱 Mobile URL: http://$IP:8001"
echo ""
echo "Press Ctrl+C to stop"
echo ""

python3 -m http.server 8001

