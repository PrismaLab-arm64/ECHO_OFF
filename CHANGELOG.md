# Changelog

All notable changes to the Shadow-Chat PWA project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-14

### Added
- Initial release of Shadow-Chat PWA
- Peer-to-peer communication using PeerJS 1.5.2
- Zero-trace protocol (no database, no persistence)
- Cyberpunk terminal aesthetics with CRT scanline effects
- Progressive Web App support (Service Worker + Web Manifest)
- Manual connection approval system ("Intrusion Detection")
- Real-time messaging interface
- Responsive design for mobile and desktop
- Neon green terminal theme with JetBrains Mono font
- Auto-scroll in message container
- Copy-to-clipboard functionality for Room ID
- Connection status indicator
- Automatic peer disconnection handling
- Zero-trace protocol on page unload
- Custom ASCII art branding
- Smooth animations and transitions
- Message typing effects
- Glitch effect on title
- Complete documentation (README, DEPLOYMENT, PROJECT_SUMMARY)
- MIT License with privacy disclaimer
- .gitignore configuration
- Comprehensive testing checklist
- Security best practices guide
- Troubleshooting documentation

### Security
- End-to-end encryption via WebRTC (DTLS-SRTP)
- No external database usage
- No message persistence (RAM only)
- No cookies or localStorage usage
- No analytics or tracking
- Manual peer approval required
- Zero-trace on session end

### Technical Details
- HTML5 semantic markup (6.1 KB)
- Custom CSS3 with animations (11.5 KB)
- Vanilla JavaScript ES6+ (12.7 KB)
- PWA manifest configuration (3.0 KB)
- Service Worker for offline support (5.2 KB)
- Total codebase: ~55 KB (extremely lightweight)
- Zero external dependencies except PeerJS CDN
- STUN servers: Google, Twilio (public)
- Browser support: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Documentation
- Complete README.md with features and technical stack
- DEPLOYMENT.md with hosting and usage instructions
- PROJECT_SUMMARY.md with project overview and metrics
- LICENSE file (MIT with privacy notice)
- CHANGELOG.md (this file)
- Inline code comments and documentation

### UI/UX
- Dark cyberpunk theme (black background, neon green text)
- CRT monitor scanline effect
- Neon glow text shadows
- Terminal-style interface
- ASCII art branding
- Smooth screen transitions
- Message appearance animations
- Hover effects on buttons
- Responsive layout for all screen sizes
- Custom scrollbar styling
- Visual feedback for all interactions

### Known Limitations
- One-to-one communication only (no group chat)
- Text messages only (no file transfer)
- Peer ID must be shared manually (no discovery)
- Requires WebRTC support (no fallback)
- May not work behind restrictive firewalls
- WebRTC may leak local IP addresses

### Browser Compatibility
- ✅ Chrome 90+ (Full support)
- ✅ Firefox 88+ (Full support)
- ✅ Safari 14+ (Full support)
- ✅ Edge 90+ (Full support)
- ❌ Internet Explorer (Not supported)

---

## Future Versions (Planned)

### [1.1.0] - TBD
- File transfer support (drag & drop)
- Typing indicators
- Message read receipts
- Custom theme colors (red, blue, purple)
- Enhanced error handling
- Reconnection logic

### [1.2.0] - TBD
- Voice chat support (WebRTC audio)
- Video chat support (WebRTC video)
- Screen sharing capability
- Multi-user rooms (group chat)
- Custom encryption passphrase

### [2.0.0] - TBD
- TypeScript migration
- React/Vue component version
- Automated testing suite
- CI/CD pipeline
- Custom signaling server option
- TURN server support

---

## Version Numbering

This project follows Semantic Versioning (semver):

- **MAJOR version** (X.0.0): Incompatible API changes or major overhauls
- **MINOR version** (0.X.0): New features in a backwards compatible manner
- **PATCH version** (0.0.X): Backwards compatible bug fixes

---

## Upgrade Instructions

When a new version is released:

1. **Backup** (if self-hosted): Download current version
2. **Replace files**: Update all HTML, CSS, JS files
3. **Clear cache**: Force refresh (Ctrl+F5 / Cmd+Shift+R)
4. **Update Service Worker**: New version auto-updates cache
5. **Test**: Create/join rooms to verify functionality

---

## Reporting Issues

If you encounter bugs or have feature requests:

1. Check existing documentation (README, DEPLOYMENT)
2. Test in incognito mode (rule out extensions)
3. Try different browser/network
4. Document steps to reproduce
5. Note browser/OS version

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

**Commit Message Format:**
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## License

MIT License - See LICENSE file for details.

---

## Acknowledgments

- **PeerJS Team**: Excellent WebRTC wrapper library
- **Google Fonts**: JetBrains Mono typography
- **Community**: Privacy advocates and open-source contributors

---

*Last Updated: 2026-01-14*  
*Current Version: 1.0.0*  
*Status: Stable*
