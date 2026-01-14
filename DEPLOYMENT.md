# 🚀 SHADOW-CHAT - DEPLOYMENT & USAGE GUIDE

## 📦 Deployment Options

### Option 1: GitHub Pages (Recommended)
```bash
# 1. Create a new GitHub repository
# 2. Push the code
git remote add origin https://github.com/YOUR_USERNAME/shadow-chat-pwa.git
git branch -M main
git push -u origin main

# 3. Enable GitHub Pages
# Go to: Settings → Pages → Source → main branch → Save
# Your app will be available at: https://YOUR_USERNAME.github.io/shadow-chat-pwa/
```

### Option 2: Netlify (One-Click Deploy)
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Deploy
cd /path/to/shadow-chat-pwa
netlify deploy --prod

# Or use drag-and-drop: https://app.netlify.com/drop
```

### Option 3: Vercel
```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
cd /path/to/shadow-chat-pwa
vercel --prod
```

### Option 4: Cloudflare Pages
```bash
# 1. Go to: https://pages.cloudflare.com/
# 2. Connect your GitHub repo
# 3. Deploy with these settings:
#    - Build command: (leave empty)
#    - Build output directory: /
```

### Option 5: Local Server
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

## 🎮 User Guide

### For Room Host (Creator)

1. **Open the App**
   - Navigate to the deployed URL or localhost

2. **Create New Room**
   - Click "CREATE NEW ROOM" button
   - Your unique Room ID will be generated (e.g., `shadow-a7b9c2d4e`)

3. **Share Room ID**
   - Click the 📋 copy button next to your Room ID
   - Send it to your peer via secure channel (Signal, WhatsApp, etc.)
   - ⚠️ **IMPORTANT**: Only share with trusted contacts

4. **Accept Connection**
   - When someone tries to connect, you'll see:
     ```
     ⚠️ INTRUSION DETECTED ⚠️
     
     Peer ID: shadow-x1y2z3a4b
     
     Accept connection?
     ```
   - Click "OK" to accept or "Cancel" to reject

5. **Start Chatting**
   - Type your message in the input field
   - Press ENTER or click "SEND ►"
   - Messages appear in real-time

### For Room Joiner (Client)

1. **Open the App**
   - Navigate to the same URL as the host

2. **Join Existing Room**
   - Click "JOIN EXISTING ROOM" button
   - Paste the Room ID received from host
   - Click "ESTABLISH CONNECTION"

3. **Wait for Approval**
   - Host must manually accept your connection
   - Status will show "CONNECTING..." then "CONNECTED"

4. **Start Chatting**
   - Once connected, type and send messages
   - Both peers see messages in real-time

## 🔒 Security Best Practices

### DO's ✅
- ✅ Only share Room IDs with trusted contacts
- ✅ Use over HTTPS (automatically with most hosting)
- ✅ Verify peer identity before sharing sensitive info
- ✅ Use VPN/Tor for additional anonymity
- ✅ Close tab immediately after conversation ends

### DON'Ts ❌
- ❌ Post Room IDs publicly (social media, forums, etc.)
- ❌ Reuse Room IDs for multiple conversations
- ❌ Share Room IDs over insecure channels
- ❌ Keep the app open when not in use
- ❌ Use on public/shared computers without clearing data

## 🐛 Common Issues & Solutions

### Issue: "Peer not found"
**Cause**: Room ID is incorrect or host disconnected  
**Solution**: 
- Verify the Room ID is exact (copy-paste recommended)
- Ask host to confirm they're still online
- Try creating a new room

### Issue: "Network error"
**Cause**: Firewall blocking WebRTC  
**Solution**:
- Check firewall settings
- Try different network (mobile data vs WiFi)
- Disable VPN temporarily (some VPNs block WebRTC)

### Issue: "Connection rejected by host"
**Cause**: Host clicked "Cancel" on approval dialog  
**Solution**:
- Contact host and ask them to accept
- Verify you have the correct Room ID

### Issue: PWA not installing
**Cause**: HTTPS required for PWA  
**Solution**:
- Deploy to HTTPS hosting (GitHub Pages, Netlify, etc.)
- Use localhost for testing (also works)

### Issue: Messages not sending
**Cause**: Connection lost  
**Solution**:
- Check status indicator (top-right)
- If "DISCONNECTED", click "◀ ABORT MISSION" and reconnect

## 📱 Mobile Installation

### Android (Chrome/Edge)
1. Open Shadow-Chat in Chrome
2. Tap menu (⋮) → "Add to Home screen"
3. Name it "Shadow-Chat"
4. Tap "Add"
5. Icon appears on home screen

### iOS (Safari)
1. Open Shadow-Chat in Safari
2. Tap share button (📤)
3. Scroll and tap "Add to Home Screen"
4. Name it "Shadow-Chat"
5. Tap "Add"
6. Icon appears on home screen

### Desktop (Chrome/Edge/Brave)
1. Open Shadow-Chat
2. Look for install icon (⊕) in address bar
3. Click it
4. Click "Install"
5. App opens in standalone window

## 🔧 Customization

### Change Color Scheme
Edit `style.css`:
```css
:root {
    --bg-primary: #000000;      /* Background */
    --text-primary: #00ff00;    /* Main text (change to #ff0000 for red) */
    --accent-color: #00ffff;    /* Accents */
    --warning-color: #ff0000;   /* Warnings */
}
```

### Change Font
Edit `style.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;700&display=swap');

body {
    font-family: 'Fira Code', 'Courier New', monospace;
}
```

### Custom STUN/TURN Servers
Edit `app.js`:
```javascript
config: {
    iceServers: [
        { urls: 'stun:your-stun-server.com:3478' },
        { 
            urls: 'turn:your-turn-server.com:3478',
            username: 'your-username',
            credential: 'your-password'
        }
    ]
}
```

## 📊 Technical Details

### How P2P Connection Works
```
[Host]                    [PeerJS Server]              [Client]
   |                             |                          |
   |-- Register ID ------------->|                          |
   |<-- ID Confirmed ------------|                          |
   |                             |<-- Connect to Host ID ---|
   |<-- Connection Request ------|                          |
   |                             |                          |
   |-- Accept/Reject ----------->|                          |
   |                             |-- Connection Result ---->|
   |<------------- Direct P2P Connection ----------------->|
   |                                                        |
   |<=============== Encrypted Messages ==================>|
```

### Data Flow
1. **Signaling**: PeerJS server helps initial connection
2. **P2P Establishment**: WebRTC creates direct browser-to-browser tunnel
3. **Data Transfer**: Messages travel directly between peers
4. **Encryption**: WebRTC provides built-in encryption (DTLS-SRTP)

### Browser Storage
- **None**: Zero persistent storage
- **Memory Only**: Messages exist only in RAM
- **Auto-Clear**: Everything destroyed on tab close

### Network Requirements
- **Ports**: 
  - Outbound: 443 (HTTPS), 3478 (STUN)
  - Inbound: Dynamic (handled by WebRTC)
- **Protocols**: WebRTC (UDP preferred, TCP fallback)
- **Firewall**: Must allow WebRTC traffic

## 🧪 Testing Locally

### Single Device (Two Tabs)
```bash
# 1. Start server
python3 -m http.server 8000

# 2. Open two tabs
# Tab 1: http://localhost:8000 → Create Room
# Tab 2: http://localhost:8000 → Join Room (paste ID from Tab 1)
```

### Two Devices (Same Network)
```bash
# 1. Find your local IP
# Linux/Mac: ifconfig | grep "inet "
# Windows: ipconfig

# 2. Start server on one device
python3 -m http.server 8000

# 3. On other device, open:
# http://YOUR_LOCAL_IP:8000
```

### Testing PWA Features
```bash
# Must use HTTPS or localhost for PWA
# Use ngrok for HTTPS testing:
npx ngrok http 8000
# Use the HTTPS URL provided
```

## 📞 Support & Contact

For issues, questions, or contributions:
- Check this guide first
- Review README.md for technical details
- Test in incognito mode to rule out extensions
- Try different browser/network

## 🎯 Pro Tips

1. **Fastest Connection**: Both users on same WiFi network
2. **Maximum Privacy**: Use Tor Browser + VPN
3. **Quick Reconnect**: Keep Room ID saved temporarily
4. **Mobile Data**: Works great, lower latency than WiFi sometimes
5. **Incognito Mode**: Use for extra privacy (no browser history)

## ⚡ Performance

- **Latency**: Typically 50-200ms (depends on network)
- **Message Size**: Up to 64KB per message (PeerJS limit)
- **Connections**: 1-to-1 only (host can reject multiple)
- **Battery**: Low impact, minimal processing
- **Data Usage**: ~10KB per 100 messages (extremely efficient)

---

**SHADOW-CHAT v1.0.0** - *Secure. Private. Ephemeral.*

> "The best way to keep a secret is to leave no trace."
