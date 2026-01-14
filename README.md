# 🕵️ SHADOW-CHAT PWA

![Version](https://img.shields.io/badge/version-1.0.0-00ff00?style=for-the-badge)
![Status](https://img.shields.io/badge/status-operational-00ff00?style=for-the-badge)
![Privacy](https://img.shields.io/badge/privacy-maximum-00ff00?style=for-the-badge)

**Secure Peer-to-Peer Chat Application with Cyberpunk Terminal Aesthetics**

## 🎯 Features

- **🔒 Complete Privacy**: Zero-trace protocol - no databases, no server storage
- **🌐 P2P Communication**: Direct browser-to-browser connection using PeerJS
- **💾 No Persistence**: All messages destroyed on page reload/close
- **📱 Progressive Web App**: Installable on mobile and desktop
- **🎨 Cyberpunk UI**: Terminal-style interface with scanline effects
- **🔐 End-to-End**: Encrypted peer-to-peer data transmission
- **👁️ Manual Authorization**: Host manually approves connection requests

## 🚀 Quick Start

### Online Deployment
Simply open `index.html` in a web browser or deploy to any static hosting service.

### Local Testing
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Then open: http://localhost:8000
```

## 📖 How to Use

### Creating a Room (Host)
1. Click **"CREATE NEW ROOM"**
2. Your unique Room ID will be generated
3. Share this ID with your peer (copy button available)
4. Wait for connection request
5. Accept or reject incoming connection via confirmation dialog

### Joining a Room (Client)
1. Click **"JOIN EXISTING ROOM"**
2. Enter the Room ID provided by the host
3. Wait for host approval
4. Start chatting once connected

### Security Features
- **Intrusion Detection**: Host receives alert when someone attempts to connect
- **Manual Approval**: Host must explicitly accept all connections
- **Zero-Trace**: All messages deleted when session ends
- **No Storage**: Nothing saved to disk or cloud

## 🛠️ Technical Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Vanilla JavaScript (ES6+) |
| Styling | Custom CSS3 with animations |
| P2P Library | PeerJS 1.5.2 |
| PWA | Service Worker + Web Manifest |
| Fonts | JetBrains Mono (Google Fonts) |

## 📁 Project Structure

```
shadow-chat-pwa/
├── index.html          # Main HTML structure
├── style.css           # Cyberpunk terminal styles
├── app.js              # P2P logic and messaging
├── manifest.json       # PWA configuration
├── sw.js               # Service Worker for offline support
└── README.md           # This file
```

## 🎨 Design Philosophy

### Visual Theme
- **Background**: Solid black (#000000)
- **Text**: Neon green (#00ff00)
- **Accents**: Cyan (#00ffff)
- **Font**: JetBrains Mono (monospaced)
- **Effects**: CRT scanlines, neon glow, terminal aesthetics

### UX Principles
- **Minimalism**: Clean, distraction-free interface
- **Feedback**: Visual animations for all actions
- **Accessibility**: High contrast, readable text
- **Responsiveness**: Works on all screen sizes

## 🔧 Configuration

### PeerJS STUN Servers
The app uses Google's public STUN servers by default:
```javascript
iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' }
]
```

To use custom STUN/TURN servers, modify the configuration in `app.js`.

## 🔐 Privacy & Security

### What We DON'T Store
- ❌ Messages
- ❌ User data
- ❌ Connection logs
- ❌ Metadata
- ❌ Any information whatsoever

### What Happens on Exit
When you close the tab or reload:
1. All connections are terminated
2. All messages are destroyed
3. Peer IDs are regenerated
4. Zero traces left behind

### Third-Party Dependencies
- **PeerJS CDN**: Used for WebRTC signaling (open-source)
- **Google Fonts**: JetBrains Mono font delivery
- **STUN Servers**: Public servers for NAT traversal

## 📱 PWA Installation

### Android/iOS
1. Open the app in Chrome/Safari
2. Tap the menu (⋮) or share button
3. Select "Add to Home Screen"
4. App icon appears on your home screen

### Desktop (Chrome/Edge)
1. Open the app
2. Click the install icon in the address bar
3. Or: Menu → Install Shadow-Chat

## 🐛 Troubleshooting

### Connection Issues
- **Peer not found**: Verify the Room ID is correct
- **Connection timeout**: Check firewall/network settings
- **Host rejection**: Host declined the connection request

### Browser Compatibility
Recommended browsers:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Network Requirements
- **WebRTC Support**: Required (modern browsers)
- **STUN Access**: Must reach STUN servers
- **Firewall**: May need to allow WebRTC traffic

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- P2P communication via PeerJS
- Terminal cyberpunk UI
- PWA support with Service Worker
- Zero-trace protocol implementation
- Manual connection approval system

## 🤝 Contributing

This is a standalone privacy-focused project. For security reasons:
- No external dependencies beyond PeerJS
- No analytics or tracking
- No third-party integrations

## 📄 License

This project is provided as-is for educational and privacy purposes.

**Privacy Notice**: This application is designed for maximum privacy. No data is collected, stored, or transmitted to any servers beyond peer-to-peer communication.

## ⚠️ Disclaimer

- This app uses public STUN servers for NAT traversal
- While P2P, metadata may be visible to network observers
- For maximum security, use over VPN/Tor
- Messages are encrypted in transit but stored in browser memory while active

## 🌟 Features Roadmap

Future considerations (would require user approval):
- [ ] File transfer support
- [ ] Voice/video chat
- [ ] Custom TURN server support
- [ ] Multi-user rooms
- [ ] Optional message encryption passphrase

---

<div align="center">

**SHADOW-CHAT v1.0.0**

*Secure. Private. Ephemeral.*

```
   _____ __  _____    ____  ____ _       __
  / ___// / / /   |  / __ \/ __ \ |     / /
  \__ \/ /_/ / /| | / / / / / / / | /| / / 
 ___/ / __  / ___ |/ /_/ / /_/ /| |/ |/ /  
/____/_/ /_/_/  |_/_____/\____/ |__/|__/   
                                            
  ██████╗██╗  ██╗ █████╗ ████████╗
 ██╔════╝██║  ██║██╔══██╗╚══██╔══╝
 ██║     ███████║███████║   ██║   
 ██║     ██╔══██║██╔══██║   ██║   
 ╚██████╗██║  ██║██║  ██║   ██║   
  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
```

*Zero-Trace Protocol Active*

</div>
