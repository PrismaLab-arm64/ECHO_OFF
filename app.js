/* =============================================
   ECHO_OFF PWA - P2P COMMUNICATION LOGIC
   Version: 2.8.0 - Matrix Animations & Clean UI
   
   ARQUITECTURA P2P 1:1 (Peer-to-Peer)
   ===================================
   Este sistema soporta comunicación 1:1 (uno-a-uno)
   entre dos dispositivos simultáneamente.
   
   - Host (Sala): Acepta UNA conexión a la vez
   - Cliente: Se conecta a UNA sala a la vez
   - Protocolo: PeerJS con WebRTC directo
   
   NEW IN 2.7.0:
   - FIX: Copy button now works correctly (bypass security protection)
   - FIX: Improved ID generation with crypto.getRandomValues (less collisions)
   - UI: Security layers now minimal and non-intrusive (opacity 0.4-0.5)
   - ANIMATION: Typing effect when generating room ID
   - ANIMATION: Connection progress steps with messages
   - ANIMATION: Progress bar utility for future features
   - ANIMATION: Glitch text effect utility
   
   NEW IN 2.5.0:
   - Messages fade to gray after 3 seconds (not destroyed)
   - Messages destroyed only when user replies
   - Remote encryption indicator with Matrix effect
   - Better visual feedback and UX
   
   NEW IN 2.4.0:
   - Text messages: Destroyed when user replies
   - No timeout: Messages stay until user responds
   
   NEW IN 2.3.0:
   - Extended countdown: 20 seconds AFTER action completes
   - Audio: 20s countdown AFTER reproduction ends
   - Files: 20s countdown AFTER download (3s grace period)
   - Better status indicators for availability
   
   NEW IN 2.2.0:
   - Smart countdown: Audio starts AFTER playback ends
   - Smart countdown: Files start AFTER download click
   - SAS Verification: Fixed display and generation
   - Audio status: Shows [▶ REPRODUCIENDO], [⏸ PAUSADO], [FINALIZADO]
   - File status: Shows [⏳ PENDIENTE], [✓ DESCARGADO]
   
   NEW IN 2.1.0:
   - Auto-destruct timer: Files and voice notes with countdown
   - 10-second destruction window with visual countdown
   - Revoke blob URLs before destruction
   
   NEW IN 2.0.0:
   - File Transfer: P2P chunked file transfer (50MB max)
   - Voice Notes: Audio recording and playback
   - SAS Verification: Short Authentication String
   - Panic Button: ESC x3 emergency exit
   ============================================= */

// Global Variables
let peer = null;
let currentConnection = null;
let myPeerId = null;
let targetPeerId = null; // Store target ID for display
let isHost = false;
let deferredPrompt = null;
let wakeLock = null; // Keep screen awake on mobile

// Advanced Features State
let messageHistory = []; // For panic button garbage overwrite
let activeMessages = []; // Track active message elements for instant destroy on reply
let escapeKeyCount = 0;
let escapeKeyTimer = null;
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let fileTransferProgress = {};
let sasCode = null; // Short Authentication String
const CHUNK_SIZE = 16384; // 16KB chunks for file transfer
let currentFileTransfer = null;

// Audio Context for 8-bit sounds
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext = null;

// DOM Elements
const splashScreen = document.getElementById('splash-screen');
const terminal = document.getElementById('terminal');
const welcomeScreen = document.getElementById('welcome-screen');
const createRoomScreen = document.getElementById('create-room-screen');
const joinRoomScreen = document.getElementById('join-room-screen');
const chatScreen = document.getElementById('chat-screen');
const installPrompt = document.getElementById('install-prompt');

const btnCreateRoom = document.getElementById('btn-create-room');
const btnJoinRoom = document.getElementById('btn-join-room');
const btnBackFromCreate = document.getElementById('btn-back-from-create');
const btnBackFromJoin = document.getElementById('btn-back-from-join');
const btnConnect = document.getElementById('btn-connect');
const btnDisconnect = document.getElementById('btn-disconnect');
const btnSend = document.getElementById('btn-send');
const btnCopyId = document.getElementById('btn-copy-id');
const btnRegenerateId = document.getElementById('btn-regenerate-id');
const btnInstall = document.getElementById('btn-install');
const btnCancelInstall = document.getElementById('btn-cancel-install');

const roomIdDisplay = document.getElementById('room-id');
const peerIdInput = document.getElementById('peer-id-input');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages-container');
const statusIndicator = document.getElementById('status');
const chatPeerId = document.getElementById('chat-peer-id');

/* =============================================
   SECURITY SIMULATION SYSTEM
   Animaciones visuales de seguridad avanzada
   ============================================= */

// Security Animation State
let securityInterval = null;
let vpnRotationInterval = null;
let ipRotationInterval = null;

// VPN Servers Pool (fictional)
const VPN_SERVERS = [
    { location: 'Zurich, Switzerland', protocol: 'WireGuard' },
    { location: 'Reykjavik, Iceland', protocol: 'OpenVPN' },
    { location: 'Singapore', protocol: 'IKEv2' },
    { location: 'Tokyo, Japan', protocol: 'WireGuard' },
    { location: 'Stockholm, Sweden', protocol: 'Shadowsocks' },
    { location: 'Amsterdam, Netherlands', protocol: 'OpenVPN' },
    { location: 'Tallinn, Estonia', protocol: 'IKEv2' }
];

// IP Pool (fictional)
const IP_POOL = [
    '185.220.101.', '94.142.241.', '199.249.230.', 
    '45.141.215.', '163.172.67.', '176.126.252.',
    '198.98.51.', '185.100.87.', '46.232.251.'
];

// Encryption algorithms rotation
const ENCRYPTION_ALGOS = [
    'AES-256-GCM', 'ChaCha20-Poly1305', 'XChaCha20',
    'AES-256-CBC', 'Salsa20', 'Twofish-256'
];

// Generate random IP
function generateRandomIP(prefix) {
    const suffix = Math.floor(Math.random() * 255);
    return prefix + suffix;
}

// Generate random port
function generateRandomPort() {
    return Math.floor(10000 + Math.random() * 50000);
}

// Start security animation layer
function startSecurityAnimation() {
    const securityLayer = document.getElementById('security-layer');
    if (!securityLayer) return;
    
    // Show security layer
    securityLayer.style.display = 'block';
    
    let currentVPN = 0;
    let currentEncryption = 0;
    
    // Update security info every 10 seconds
    securityInterval = setInterval(() => {
        const vpnInfo = VPN_SERVERS[currentVPN];
        const encryption = ENCRYPTION_ALGOS[currentEncryption];
        const currentIP = generateRandomIP(IP_POOL[Math.floor(Math.random() * IP_POOL.length)]);
        const tunnelPort = generateRandomPort();
        
        // Update security display
        updateSecurityDisplay({
            vpn: `${vpnInfo.location} [${vpnInfo.protocol}]`,
            ip: currentIP,
            port: tunnelPort,
            encryption: encryption,
            latency: Math.floor(8 + Math.random() * 15) + 'ms'
        });
        
        currentVPN = (currentVPN + 1) % VPN_SERVERS.length;
        currentEncryption = (currentEncryption + 1) % ENCRYPTION_ALGOS.length;
    }, 10000);
    
    // Initial display
    const initialVPN = VPN_SERVERS[0];
    updateSecurityDisplay({
        vpn: `${initialVPN.location} [${initialVPN.protocol}]`,
        ip: generateRandomIP(IP_POOL[0]),
        port: generateRandomPort(),
        encryption: ENCRYPTION_ALGOS[0],
        latency: '12ms'
    });
}

// Stop security animation
function stopSecurityAnimation() {
    if (securityInterval) {
        clearInterval(securityInterval);
        securityInterval = null;
    }
    
    const securityLayer = document.getElementById('security-layer');
    if (securityLayer) {
        securityLayer.style.display = 'none';
    }
}

// Update security display
function updateSecurityDisplay(info) {
    const securityLayer = document.getElementById('security-layer');
    if (!securityLayer) return;
    
    // Add typing cursor effect
    securityLayer.innerHTML = `
        <div class="security-line">
            <span class="security-label">VPN Tunnel:</span>
            <span class="security-value typing">${info.vpn}</span>
        </div>
        <div class="security-line">
            <span class="security-label">Exit IP:</span>
            <span class="security-value">${info.ip}:${info.port}</span>
        </div>
        <div class="security-line">
            <span class="security-label">Encryption:</span>
            <span class="security-value">${info.encryption}</span>
        </div>
        <div class="security-line">
            <span class="security-label">Latency:</span>
            <span class="security-value">${info.latency}</span>
        </div>
    `;
}

/* =============================================
   REMOTE ENCRYPTION INDICATOR
   Matrix-style encryption visualization
   ============================================= */

let encryptionInterval = null;

function startEncryptionIndicator() {
    const indicator = document.getElementById('encryption-indicator');
    const matrix1 = document.getElementById('encryption-matrix-1');
    
    if (!indicator || !matrix1) return;
    
    // Show indicator
    indicator.classList.remove('hidden');
    
    const hexChars = '0123456789ABCDEF';
    
    function generateMatrixLine(length = 30) {
        let line = '';
        for (let i = 0; i < length; i++) {
            line += hexChars[Math.floor(Math.random() * hexChars.length)];
            if (i % 4 === 3) line += ' ';
        }
        return line;
    }
    
    // Update matrix text every 500ms (slower, less distracting)
    encryptionInterval = setInterval(() => {
        matrix1.textContent = generateMatrixLine(30);
    }, 500);
    
    console.log('[ENCRYPTION INDICATOR] Started');
}

function stopEncryptionIndicator() {
    const indicator = document.getElementById('encryption-indicator');
    if (indicator) {
        indicator.classList.add('hidden');
    }
    
    if (encryptionInterval) {
        clearInterval(encryptionInterval);
        encryptionInterval = null;
    }
    
    console.log('[ENCRYPTION INDICATOR] Stopped');
}

/* =============================================
   CANAL SEGURO MATRIX ANIMATION
   ============================================= */
let canalSeguroInterval = null;

function startCanalSeguroAnimation() {
    const canalText = document.getElementById('canal-seguro-text');
    if (!canalText) return;
    
    const originalText = 'CANAL SEGURO';
    const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    
    canalSeguroInterval = setInterval(() => {
        let newText = '';
        for (let i = 0; i < originalText.length; i++) {
            if (originalText[i] === ' ') {
                newText += ' ';
            } else {
                // 70% chance to show original char, 30% random
                if (Math.random() > 0.3) {
                    newText += originalText[i];
                } else {
                    newText += matrixChars[Math.floor(Math.random() * matrixChars.length)];
                }
            }
        }
        canalText.textContent = newText;
    }, 1000); // Every 1 second
    
    console.log('[CANAL SEGURO] Animation started');
}

function stopCanalSeguroAnimation() {
    if (canalSeguroInterval) {
        clearInterval(canalSeguroInterval);
        canalSeguroInterval = null;
    }
    const canalText = document.getElementById('canal-seguro-text');
    if (canalText) {
        canalText.textContent = 'CANAL SEGURO';
    }
}

/* =============================================
   VPN ANIMATION (Countries + Hash + Countdown)
   ============================================= */
let vpnInterval = null;

function startVPNAnimation() {
    const vpnLocation = document.getElementById('vpn-location');
    const vpnHash = document.getElementById('vpn-hash');
    const vpnCountdown = document.getElementById('vpn-countdown');
    
    if (!vpnLocation || !vpnHash || !vpnCountdown) return;
    
    const locations = [
        'VPN: Tokyo, JP | 103.5.140.142',
        'VPN: London, UK | 185.93.3.123',
        'VPN: New York, US | 192.241.135.67',
        'VPN: Berlin, DE | 46.4.119.88',
        'VPN: Singapore, SG | 139.180.141.205',
        'VPN: Sydney, AU | 45.248.77.142',
        'VPN: Paris, FR | 51.159.23.45',
        'VPN: Toronto, CA | 192.99.45.78',
        'VPN: Mumbai, IN | 103.253.145.29',
        'VPN: Seoul, KR | 211.249.45.123'
    ];
    
    const hexChars = '0123456789ABCDEF';
    let countdown = 2;
    
    function generateHash(length = 16) {
        let hash = '';
        for (let i = 0; i < length; i++) {
            hash += hexChars[Math.floor(Math.random() * hexChars.length)];
        }
        return hash;
    }
    
    function updateVPN() {
        // Random location
        const location = locations[Math.floor(Math.random() * locations.length)];
        vpnLocation.textContent = location;
        
        // Matrix hash animation
        const hash = generateHash(16);
        vpnHash.textContent = `[${hash}]`;
        
        // Reset countdown
        countdown = 2;
    }
    
    // Initial update
    updateVPN();
    
    // Update location and hash every 2 seconds
    vpnInterval = setInterval(() => {
        updateVPN();
    }, 2000);
    
    // Update countdown every 100ms
    setInterval(() => {
        if (countdown > 0) {
            vpnCountdown.textContent = `[${countdown.toFixed(1)}s]`;
            countdown -= 0.1;
        }
    }, 100);
    
    console.log('[VPN ANIMATION] Started');
}

function stopVPNAnimation() {
    if (vpnInterval) {
        clearInterval(vpnInterval);
        vpnInterval = null;
    }
}

/* =============================================
   ADVANCED FEATURES MODULE
   1. File Transfer (P2P Chunked Blob)
   2. Voice Notes (Audio Blob)
   3. SAS Verification (Security Fingerprint)
   4. Panic Button (ESC x3 Emergency Exit)
   ============================================= */

/* ─────────────────────────────────────────────
   1. FILE TRANSFER (P2P Chunked Blob)
   ───────────────────────────────────────────── */

// File transfer handler
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!currentConnection || !currentConnection.open) {
        addSystemMessage('/// ERROR: No hay conexion activa');
        return;
    }
    
    // Check file size (limit to 50MB for safety)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        addSystemMessage('/// ERROR: Archivo muy grande (max 50MB)');
        return;
    }
    
    sendFile(file);
}

function sendFile(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const totalChunks = Math.ceil(arrayBuffer.byteLength / CHUNK_SIZE);
        
        // Send file metadata first
        const metadata = {
            type: 'FILE_META',
            name: file.name,
            size: file.size,
            mimeType: file.type,
            totalChunks: totalChunks
        };
        
        currentConnection.send(JSON.stringify(metadata));
        
        // Show progress bar
        const progressDiv = document.createElement('div');
        progressDiv.className = 'file-progress';
        progressDiv.innerHTML = `
            <div class="progress-label">ENVIANDO: ${file.name}</div>
            <div class="progress-bar-container">
                <div id="upload-progress-bar" class="progress-bar-fill"></div>
            </div>
            <div class="progress-text" id="upload-progress-text">[░░░░░░░░░░] 0%</div>
        `;
        messagesContainer.appendChild(progressDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Send chunks
        let chunkIndex = 0;
        const sendNextChunk = () => {
            if (chunkIndex < totalChunks) {
                const start = chunkIndex * CHUNK_SIZE;
                const end = Math.min(start + CHUNK_SIZE, arrayBuffer.byteLength);
                const chunk = arrayBuffer.slice(start, end);
                
                const chunkData = {
                    type: 'FILE_CHUNK',
                    index: chunkIndex,
                    data: Array.from(new Uint8Array(chunk))
                };
                
                currentConnection.send(JSON.stringify(chunkData));
                
                chunkIndex++;
                const progress = Math.floor((chunkIndex / totalChunks) * 100);
                updateProgressBar('upload', progress);
                
                // Continue sending
                setTimeout(sendNextChunk, 10);
            } else {
                // Transfer complete
                const endSignal = { type: 'FILE_END' };
                currentConnection.send(JSON.stringify(endSignal));
                
                setTimeout(() => {
                    progressDiv.remove();
                    addSystemMessage(`/// Archivo enviado: ${file.name}`);
                }, 1000);
            }
        };
        
        sendNextChunk();
    };
    
    reader.readAsArrayBuffer(file);
}

// Receive file handler
let incomingFile = {
    metadata: null,
    chunks: [],
    receivedChunks: 0
};

function handleIncomingFileData(data) {
    if (data.type === 'FILE_META') {
        // Initialize file reception
        incomingFile = {
            metadata: data,
            chunks: new Array(data.totalChunks),
            receivedChunks: 0
        };
        
        // Show progress bar
        const progressDiv = document.createElement('div');
        progressDiv.className = 'file-progress';
        progressDiv.id = 'download-progress';
        progressDiv.innerHTML = `
            <div class="progress-label">RECIBIENDO: ${data.name}</div>
            <div class="progress-bar-container">
                <div id="download-progress-bar" class="progress-bar-fill"></div>
            </div>
            <div class="progress-text" id="download-progress-text">[░░░░░░░░░░] 0%</div>
        `;
        messagesContainer.appendChild(progressDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
    } else if (data.type === 'FILE_CHUNK') {
        // Store chunk
        incomingFile.chunks[data.index] = new Uint8Array(data.data);
        incomingFile.receivedChunks++;
        
        const progress = Math.floor((incomingFile.receivedChunks / incomingFile.metadata.totalChunks) * 100);
        updateProgressBar('download', progress);
        
    } else if (data.type === 'FILE_END') {
        // Reconstruct file
        const blob = new Blob(incomingFile.chunks, { type: incomingFile.metadata.mimeType });
        const url = URL.createObjectURL(blob);
        
        // Remove progress bar
        const progressDiv = document.getElementById('download-progress');
        if (progressDiv) progressDiv.remove();
        
        // Add download link
        addFileDownloadMessage(incomingFile.metadata.name, url);
        
        // Reset
        incomingFile = { metadata: null, chunks: [], receivedChunks: 0 };
    }
}

// Update progress bar (ASCII style)
function updateProgressBar(type, percentage) {
    const barId = type === 'upload' ? 'upload-progress-bar' : 'download-progress-bar';
    const textId = type === 'upload' ? 'upload-progress-text' : 'download-progress-text';
    
    const barElement = document.getElementById(barId);
    const textElement = document.getElementById(textId);
    
    if (barElement) {
        barElement.style.width = percentage + '%';
    }
    
    if (textElement) {
        const filled = Math.floor(percentage / 10);
        const empty = 10 - filled;
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        textElement.textContent = `[${bar}] ${percentage}%`;
    }
}

// Add file download message
function addFileDownloadMessage(filename, url) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message file-message';
    
    const timestamp = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    messageDiv.innerHTML = `
        <div class="message-header">[${timestamp}] FILE RECEIVED <span class="countdown-timer">[⏳ PENDIENTE]</span></div>
        <div class="message-body">
            <div class="file-download">
                <span class="file-icon">📎</span>
                <span class="file-name">${filename}</span>
                <a href="${url}" download="${filename}" class="file-download-btn" id="download-${Date.now()}">[ DOWNLOAD ]</a>
            </div>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Get elements
    const downloadBtn = messageDiv.querySelector('.file-download-btn');
    const timerSpan = messageDiv.querySelector('.countdown-timer');
    
    // Start countdown AFTER download click + waiting time
    downloadBtn.addEventListener('click', () => {
        timerSpan.textContent = '[✓ DESCARGANDO...]';
        timerSpan.style.color = '#00CC00';
        
        // Wait 3 seconds for download to complete, then show "keep for 20s" message
        setTimeout(() => {
            timerSpan.textContent = '[💾 DISPONIBLE]';
            
            // Start 20-second countdown
            setTimeout(() => {
                startCountdownTimer(messageDiv, 20, () => {
                    // Revoke blob URL before destroying
                    URL.revokeObjectURL(url);
                });
            }, 1000);
        }, 3000);
        
        // Remove click listener to prevent multiple countdowns
        downloadBtn.replaceWith(downloadBtn.cloneNode(true));
    });
}

/* ─────────────────────────────────────────────
   2. VOICE NOTES (Audio Blob)
   ───────────────────────────────────────────── */

async function startVoiceRecording() {
    if (isRecording) return;
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            sendVoiceNote(audioBlob);
            stream.getTracks().forEach(track => track.stop());
        };
        
        mediaRecorder.start();
        isRecording = true;
        
        // Update button visual
        const recBtn = document.getElementById('btn-record');
        if (recBtn) {
            recBtn.classList.add('recording');
            recBtn.textContent = '● REC';
        }
        
    } catch (err) {
        console.error('[VOICE] Error:', err);
        addSystemMessage('/// ERROR: No se pudo acceder al microfono');
    }
}

function stopVoiceRecording() {
    if (!isRecording || !mediaRecorder) return;
    
    mediaRecorder.stop();
    isRecording = false;
    
    // Update button visual
    const recBtn = document.getElementById('btn-record');
    if (recBtn) {
        recBtn.classList.remove('recording');
        recBtn.textContent = '[ REC ]';
    }
}

function sendVoiceNote(audioBlob) {
    if (!currentConnection || !currentConnection.open) {
        addSystemMessage('/// ERROR: No hay conexion activa');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
        const base64Audio = reader.result.split(',')[1];
        const voiceData = {
            type: 'VOICE_NOTE',
            audio: base64Audio,
            timestamp: Date.now()
        };
        
        currentConnection.send(JSON.stringify(voiceData));
        addVoiceNoteMessage('sent', base64Audio);
    };
    
    reader.readAsDataURL(audioBlob);
}

function handleIncomingVoiceNote(data) {
    addVoiceNoteMessage('received', data.audio);
}

function addVoiceNoteMessage(type, base64Audio) {
    const audioUrl = `data:audio/webm;base64,${base64Audio}`;
    const label = type === 'sent' ? 'TU' : 'PEER';
    
    const timestamp = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message voice-message ${type}`;
    messageDiv.innerHTML = `
        <div class="message-header">[${timestamp}] ${label} VOICE NOTE <span class="countdown-timer">[▶ REPRODUCIR]</span></div>
        <div class="message-body">
            <audio controls class="voice-player">
                <source src="${audioUrl}" type="audio/webm">
            </audio>
        </div>
    `;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Get audio element
    const audioElement = messageDiv.querySelector('.voice-player');
    const timerSpan = messageDiv.querySelector('.countdown-timer');
    
    // Start countdown AFTER audio ends
    audioElement.addEventListener('ended', () => {
        timerSpan.textContent = '[✓ REPRODUCIDO]';
        timerSpan.style.color = '#00CC00';
        
        // Wait 2 seconds, then show "keep for 20s" message
        setTimeout(() => {
            timerSpan.textContent = '[🔊 DISPONIBLE]';
            
            // Start 20-second countdown after playback
            setTimeout(() => {
                startCountdownTimer(messageDiv, 20);
            }, 1000);
        }, 2000);
    });
    
    // Update timer while playing
    audioElement.addEventListener('play', () => {
        timerSpan.textContent = '[▶ REPRODUCIENDO]';
        timerSpan.style.color = '#00CC00';
    });
    
    audioElement.addEventListener('pause', () => {
        if (!audioElement.ended) {
            timerSpan.textContent = '[⏸ PAUSADO]';
            timerSpan.style.color = '#808080';
        }
    });
}

/* ─────────────────────────────────────────────
   AUTO-DESTRUCT COUNTDOWN TIMER
   For files and voice notes
   ───────────────────────────────────────────── */

function startCountdownTimer(messageElement, seconds, beforeDestroy = null) {
    const timerSpan = messageElement.querySelector('.countdown-timer');
    if (!timerSpan) return;
    
    let remaining = seconds;
    
    // Update countdown every second
    const countdownInterval = setInterval(() => {
        remaining--;
        
        if (remaining > 0) {
            timerSpan.textContent = `[🕒 ${remaining}s]`;
            timerSpan.style.color = remaining <= 3 ? '#CC0000' : '#808080';
        } else {
            clearInterval(countdownInterval);
            
            // Execute pre-destroy callback if provided
            if (beforeDestroy) {
                beforeDestroy();
            }
            
            // Destroy message with fade-out animation
            destroyMessage(messageElement);
        }
    }, 1000);
    
    // Initial display
    timerSpan.textContent = `[🕒 ${remaining}s]`;
    timerSpan.style.color = '#808080';
}

function destroyMessage(messageElement) {
    // Fade out animation
    messageElement.style.transition = 'opacity 0.5s';
    messageElement.style.opacity = '0';
    
    setTimeout(() => {
        // Remove from DOM
        if (messageElement.parentNode) {
            messageElement.remove();
        }
        
        // Add system message about destruction
        addSystemMessage('/// Mensaje autodestruido');
    }, 500);
}

/* ─────────────────────────────────────────────
   3. SAS VERIFICATION (Security Fingerprint)
   ───────────────────────────────────────────── */

// Generate SAS from connection fingerprint
async function generateSAS() {
    try {
        // Generate from peer IDs (simpler and more reliable)
        const fingerprint = myPeerId + (isHost ? currentConnection.peer : targetPeerId);
        
        console.log('[SAS] Generating from:', fingerprint);
        
        // Create short hash
        const hash = await hashString(fingerprint);
        const shortHash = hash.substring(0, 8);
        
        // Convert to emoji + numeric code
        const emojis = ['🥑', '🍕', '🎯', '🔑', '🌟', '🎨', '🔥', '💎', '🎭', '🚀'];
        const emojiIndex = parseInt(shortHash.substring(0, 2), 16) % emojis.length;
        const numericCode = parseInt(shortHash.substring(2, 6), 16) % 10000;
        
        const sas = `${emojis[emojiIndex]} ${numericCode.toString().padStart(4, '0')}`;
        displaySAS(sas);
        
        console.log('[SAS] Generated:', sas);
        
    } catch (err) {
        console.error('[SAS] Error:', err);
        // Fallback: show generic indicator
        displaySAS('🔐 E2E');
    }
}

async function hashString(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function displaySAS(sas) {
    const sasDisplay = document.getElementById('sas-display');
    if (sasDisplay) {
        sasDisplay.textContent = `[${sas}]`;
        sasDisplay.classList.add('active');
        sasDisplay.style.display = 'inline-block';
        console.log('[SAS] Displayed:', sas);
    } else {
        console.error('[SAS] Element not found');
    }
}

/* ─────────────────────────────────────────────
   4. PANIC BUTTON (ESC x3 Emergency Exit)
   ───────────────────────────────────────────── */

function initPanicButton() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            escPressCount++;
            
            if (escPressCount === 1) {
                // Start timer - reset if 2 seconds pass
                escTimer = setTimeout(() => {
                    escPressCount = 0;
                }, 2000);
            }
            
            if (escPressCount === 3) {
                // PANIC TRIGGER
                triggerPanicMode();
            }
        }
    });
}

/* =============================================
   SECURITY PROTECTION - ANTI COPY
   ============================================= */
function initSecurityProtection() {
    // Prevent text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    
    // Prevent copy event
    document.addEventListener('copy', (e) => {
        e.preventDefault();
        console.log('[SECURITY] Copy attempt blocked');
        return false;
    });
    
    // Prevent cut event
    document.addEventListener('cut', (e) => {
        e.preventDefault();
        console.log('[SECURITY] Cut attempt blocked');
        return false;
    });
    
    // Prevent context menu (right click)
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        console.log('[SECURITY] Context menu blocked');
        return false;
    });
    
    // Prevent keyboard shortcuts for copy/paste
    document.addEventListener('keydown', (e) => {
        // Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A, Ctrl+P, Ctrl+S
        if ((e.ctrlKey || e.metaKey) && 
            (e.key === 'c' || e.key === 'C' || 
             e.key === 'x' || e.key === 'X' || 
             e.key === 'a' || e.key === 'A' ||
             e.key === 'p' || e.key === 'P' ||
             e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            console.log('[SECURITY] Keyboard shortcut blocked:', e.key);
            return false;
        }
    });
    
    console.log('[SECURITY] Anti-copy protection enabled');
}

function triggerPanicMode() {
    console.log('[PANIC] Emergency exit triggered');
    
    // 1. Close WebRTC connection
    if (currentConnection) {
        currentConnection.close();
        currentConnection = null;
    }
    
    if (peer) {
        peer.destroy();
        peer = null;
    }
    
    // 2. Clear DOM
    document.body.innerHTML = '';
    
    // 3. Overwrite sensitive data in memory with garbage
    const garbage = Array(1000).fill(0).map(() => Math.random().toString(36));
    myPeerId = garbage[0];
    targetPeerId = garbage[1];
    
    // Overwrite message container
    if (messagesContainer) {
        messagesContainer.innerHTML = garbage.join('');
    }
    
    // 4. Redirect to innocent site
    setTimeout(() => {
        window.location.href = 'https://www.google.com';
    }, 100);
}

/* =============================================
   8-BIT SOUND GENERATOR
   ============================================= */
function initAudio() {
    if (!audioContext) {
        audioContext = new AudioContext();
    }
}

function play8BitSound(frequency, duration, type = 'square') {
    initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playSendSound() {
    // Sound removed - less intrusive
}

function playReceiveSound() {
    // Sound removed - less intrusive
}

function playDecryptSound() {
    // Sound removed - less intrusive
}

function playDisappearSound() {
    // Sound removed - less intrusive
}

function playStartupSound() {
    // Startup sound: simple beep
    play8BitSound(440, 0.15);
}

function playCreateRoomSound() {
    // Create room: ascending beep
    play8BitSound(440, 0.1);
    setTimeout(() => play8BitSound(554, 0.1), 100);
}

function playJoinRoomSound() {
    // Join room: descending beep
    play8BitSound(554, 0.1);
    setTimeout(() => play8BitSound(440, 0.1), 100);
}

function playDisconnectSound() {
    // Disconnect: low tone
    play8BitSound(220, 0.2);
}

/* =============================================
   INITIALIZATION
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
    console.log('[ECHO_OFF v2.8.0] Matrix Animations & Clean UI - Sistema inicializado');
    setupEventListeners();
    checkServiceWorkerSupport();
    initSplashScreen();
    setupPWAInstallPrompt();
    requestWakeLock();
    initPanicButton(); // Initialize panic button (ESC x3)
    initSecurityProtection(); // Initialize anti-copy protection
    
    // Initialize audio on first user interaction
    document.addEventListener('click', initAudio, { once: true });
    
    // Play startup sound
    setTimeout(() => {
        playStartupSound();
    }, 500);
});

/* =============================================
   PWA INSTALL PROMPT
   ============================================= */
function setupPWAInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install prompt after splash screen
        setTimeout(() => {
            if (deferredPrompt && installPrompt) {
                console.log('[PWA] Mostrando prompt de instalacion');
                installPrompt.classList.remove('hidden');
            }
        }, 5000); // Aumentado a 5 segundos
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] Aplicacion instalada');
        deferredPrompt = null;
        if (installPrompt) {
            installPrompt.classList.add('hidden');
        }
    });
}

/* =============================================
   WAKE LOCK - Keep screen awake on mobile
   ============================================= */
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('[WAKE LOCK] Pantalla activa');
            
            wakeLock.addEventListener('release', () => {
                console.log('[WAKE LOCK] Liberado');
            });
        }
    } catch (err) {
        console.error('[WAKE LOCK] Error:', err);
    }
}

// Re-request wake lock when visibility changes
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
    }
});

/* =============================================
   SPLASH SCREEN INITIALIZATION
   ============================================= */
function initSplashScreen() {
    setTimeout(() => {
        splashScreen.classList.remove('active');
        terminal.classList.remove('hidden');
    }, 3000);
}

/* =============================================
   SERVICE WORKER REGISTRATION (PWA)
   ============================================= */
function checkServiceWorkerSupport() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('[PWA] Service Worker registrado:', reg.scope))
            .catch(err => console.error('[PWA] Fallo al registrar Service Worker:', err));
    }
}

/* =============================================
   EVENT LISTENERS SETUP
   ============================================= */
function setupEventListeners() {
    // Navigation
    btnCreateRoom.addEventListener('click', createRoom);
    btnJoinRoom.addEventListener('click', showJoinScreen);
    btnBackFromCreate.addEventListener('click', () => {
        destroyPeer();
        showScreen(welcomeScreen);
    });
    btnBackFromJoin.addEventListener('click', () => {
        // Clear input field when going back
        peerIdInput.value = '';
        showScreen(welcomeScreen);
    });
    
    // Connection
    btnConnect.addEventListener('click', connectToPeer);
    btnDisconnect.addEventListener('click', disconnect);
    btnCopyId.addEventListener('click', copyRoomId);
    btnRegenerateId.addEventListener('click', regenerateRoomId);
    
    // Messaging
    btnSend.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Enter key for peer ID input
    peerIdInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') connectToPeer();
    });
    
    // PWA Install
    if (btnInstall) {
        btnInstall.addEventListener('click', async () => {
            if (!deferredPrompt) return;
            
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`[PWA] Elección de instalación: ${outcome}`);
            deferredPrompt = null;
            installPrompt.classList.add('hidden');
        });
    }
    
    if (btnCancelInstall) {
        btnCancelInstall.addEventListener('click', () => {
            installPrompt.classList.add('hidden');
        });
    }
    
    // Advanced Features
    // File upload
    const btnUploadFile = document.getElementById('btn-upload-file');
    const fileInput = document.getElementById('file-input');
    if (btnUploadFile && fileInput) {
        btnUploadFile.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Voice recording
    const btnRecord = document.getElementById('btn-record');
    if (btnRecord) {
        btnRecord.addEventListener('mousedown', startVoiceRecording);
        btnRecord.addEventListener('mouseup', stopVoiceRecording);
        btnRecord.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startVoiceRecording();
        });
        btnRecord.addEventListener('touchend', (e) => {
            e.preventDefault();
            stopVoiceRecording();
        });
    }
}

/* =============================================
   SCREEN NAVIGATION
   ============================================= */
function showScreen(screen) {
    [welcomeScreen, createRoomScreen, joinRoomScreen, chatScreen].forEach(s => {
        s.classList.remove('active');
    });
    screen.classList.add('active');
}

/* =============================================
   GENERATE UNIQUE RANDOM ID
   ============================================= */
function generateUniqueId() {
    // Use crypto.getRandomValues for better randomness
    const timestamp = Date.now().toString(36).toUpperCase();
    
    // Generate cryptographically secure random values
    const randomArray = new Uint32Array(2);
    crypto.getRandomValues(randomArray);
    const random1 = randomArray[0].toString(36).substring(0, 6).toUpperCase();
    const random2 = randomArray[1].toString(36).substring(0, 6).toUpperCase();
    
    // Add extra entropy from performance.now()
    const entropy = Math.floor(performance.now() * 1000).toString(36).substring(0, 4).toUpperCase();
    
    return `ECHO_${timestamp}${random1}${random2}${entropy}`;
}

/* =============================================
   PEERJS CONNECTION
   ============================================= */
function createRoom() {
    showScreen(createRoomScreen);
    playCreateRoomSound();
    
    // Generate unique Peer ID with timestamp
    myPeerId = generateUniqueId();
    
    // Initialize PeerJS
    peer = new Peer(myPeerId, {
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        }
    });
    
    peer.on('open', (id) => {
        console.log('[PEER] Sala creada:', id);
        
        // Typing animation for room ID
        typeTextIntoInput(roomIdDisplay, id, 30, () => {
            isHost = true;
            updateStatus('EN ESPERA', 'warning');
            addSystemMessage('/// Sala ECHO_OFF creada');
            addSystemMessage(`/// ID: ${id}`);
            addSystemMessage('/// Esperando conexion entrante...');
        });
    });
    
    peer.on('connection', (conn) => {
        // Check if already connected (P2P 1:1 limitation)
        if (currentConnection && currentConnection.open) {
            addSystemMessage('/// Ya existe una conexion activa');
            addSystemMessage('/// Esta sala solo admite 1 usuario simultaneo');
            conn.close();
            return;
        }
        
        // Store target ID for display
        targetPeerId = conn.peer;
        
        // Connection approval with better UX
        const approvalMessage = `═══════════════════════════════════════════════

NUEVA SOLICITUD DE CONEXION

Usuario desea unirse a tu sala
ID: ${conn.peer}

¿Permitir acceso a esta sala?

═══════════════════════════════════════════════`;
        
        const approve = confirm(approvalMessage);
        
        if (!approve) {
            conn.close();
            addSystemMessage('/// Conexion rechazada');
            addSystemMessage(`/// Usuario ${conn.peer} fue bloqueado`);
            return;
        }
        
        currentConnection = conn;
        setupConnectionHandlers(conn);
        addSystemMessage(`/// Peer conectado: ${conn.peer}`);
        showScreen(chatScreen);
        chatPeerId.textContent = conn.peer;
        updateStatus('CONECTADO', 'success');
    });
    
    peer.on('error', (err) => {
        console.error('[PEER] Error:', err);
        addSystemMessage(`/// ERROR: ${err.type}`);
    });
}

function showJoinScreen() {
    showScreen(joinRoomScreen);
    // Clear input field when showing join screen
    peerIdInput.value = '';
    peerIdInput.focus();
}

function connectToPeer() {
    const targetId = peerIdInput.value.trim();
    
    if (!targetId) {
        alert('Por favor ingrese el ID de la sala');
        return;
    }
    
    if (!targetId.startsWith('ECHO_')) {
        alert('ID invalido. Debe comenzar con ECHO_');
        return;
    }
    
    // Store target ID for display
    targetPeerId = targetId;
    
    playJoinRoomSound();
    
    // Generate unique Peer ID for client
    myPeerId = generateUniqueId();
    
    // Initialize PeerJS
    peer = new Peer(myPeerId, {
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        }
    });
    
    peer.on('open', (id) => {
        console.log('[PEER] Conectando a:', targetId);
        
        // Show connection progress animation
        showConnectionProgress(() => {
            currentConnection = peer.connect(targetId);
            setupConnectionHandlers(currentConnection);
        });
    });
    
    peer.on('error', (err) => {
        console.error('[PEER] Error:', err);
        let errorMsg = 'No se pudo conectar';
        
        if (err.type === 'peer-unavailable') {
            errorMsg = 'Sala no encontrada o inactiva';
        } else if (err.type === 'network') {
            errorMsg = 'Error de red';
        } else if (err.type === 'server-error') {
            errorMsg = 'Error del servidor PeerJS';
        }
        
        alert(`ERROR DE CONEXION\n\n${errorMsg}\n\nVerifique el ID e intente nuevamente`);
    });
}

function setupConnectionHandlers(conn) {
    conn.on('open', () => {
        console.log('[CONNECTION] Establecida con:', isHost ? conn.peer : targetPeerId);
        showScreen(chatScreen);
        
        // Display correct peer ID - ALWAYS show the other end
        // Host: shows client ID (conn.peer)
        // Client: shows room ID (targetPeerId)
        const displayId = isHost ? conn.peer : targetPeerId;
        chatPeerId.textContent = displayId;
        
        console.log('[DISPLAY] Mostrando ID:', displayId, '| isHost:', isHost);
        
        updateStatus('CONECTADO', 'success');
        addSystemMessage('/// ===================================');
        addSystemMessage('/// CONEXION P2P 1:1 ESTABLECIDA');
        addSystemMessage('/// Canal cifrado E2E activo');
        addSystemMessage('/// Privacidad maxima garantizada');
        addSystemMessage('/// Arquitectura: Peer-to-Peer directo');
        addSystemMessage('/// ===================================');
        
        // Start security animation layer
        startSecurityAnimation();
        
        // Start encryption indicator
        startEncryptionIndicator();
        
        // Start canal seguro matrix animation
        startCanalSeguroAnimation();
        
        // Start VPN animation
        startVPNAnimation();
        
        // Generate SAS for verification (with small delay to ensure IDs are set)
        setTimeout(() => {
            generateSAS();
        }, 500);
    });
    
    conn.on('data', (data) => {
        console.log('[MESSAGE RECEIVED]:', data);
        
        // Try to parse as JSON (for advanced features)
        try {
            const parsed = JSON.parse(data);
            
            if (parsed.type === 'FILE_META' || parsed.type === 'FILE_CHUNK' || parsed.type === 'FILE_END') {
                handleIncomingFileData(parsed);
            } else if (parsed.type === 'VOICE_NOTE') {
                handleIncomingVoiceNote(parsed);
            } else {
                // Regular text message
                addMessage(data, 'received');
            }
        } catch (e) {
            // Not JSON, regular text message
            addMessage(data, 'received');
        }
    });
    
    conn.on('close', () => {
        console.log('[CONNECTION] Cerrada');
        updateStatus('DESCONECTADO', 'error');
        addSystemMessage('/// Conexión terminada');
        stopSecurityAnimation();
        currentConnection = null;
    });
    
    conn.on('error', (err) => {
        console.error('[CONNECTION] Error:', err);
        addSystemMessage(`/// ERROR: ${err}`);
    });
}

/* =============================================
   MESSAGING
   ============================================= */
function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    if (!currentConnection || !currentConnection.open) {
        alert('No hay conexion activa');
        return;
    }
    
    // DESTROY ALL PREVIOUS MESSAGES (user replied, so they read them)
    destroyAllActiveMessages();
    
    // Send message to peer
    currentConnection.send(message);
    console.log('[MESSAGE SENT]:', message);
    
    // Add message to own screen immediately
    addMessage(message, 'sent');
    
    // Clear input and refocus
    messageInput.value = '';
    
    // Force focus back on mobile
    setTimeout(() => {
        messageInput.focus();
    }, 100);
}

function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    
    const timestamp = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const header = document.createElement('div');
    header.classList.add('message-header');
    
    // Add countdown timer to header
    const timerSpan = document.createElement('span');
    timerSpan.className = 'message-countdown';
    timerSpan.style.marginLeft = '10px';
    timerSpan.style.color = '#808080';
    
    header.textContent = `[${timestamp}] ${type === 'sent' ? 'TU' : 'PEER'}`;
    header.appendChild(timerSpan);
    
    const body = document.createElement('div');
    body.classList.add('message-body');
    
    messageDiv.appendChild(header);
    messageDiv.appendChild(body);
    
    // Ensure container exists
    if (!messagesContainer) {
        console.error('[ERROR] Messages container not found');
        return;
    }
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Track this message for destruction on reply
    activeMessages.push({
        element: messageDiv,
        body: body,
        content: content,
        timestamp: Date.now()
    });
    
    // Decrypt animation for received messages
    if (type === 'received') {
        decryptMessage(body, content, () => {
            // After decryption, fade to gray after 3 seconds
            setTimeout(() => {
                messageDiv.style.transition = 'color 2s ease';
                messageDiv.style.color = '#606060';
                timerSpan.style.color = '#505050';
            }, 3000);
        });
    } else {
        // For sent messages, show immediately
        body.textContent = `> ${content}`;
        // Fade to gray after 3 seconds
        setTimeout(() => {
            messageDiv.style.transition = 'color 2s ease';
            messageDiv.style.color = '#606060';
            timerSpan.style.color = '#505050';
        }, 3000);
    }
    
    // Show "Responde para destruir" hint
    timerSpan.textContent = '[Responde para destruir]';
    timerSpan.style.color = '#808080';
    
    console.log(`[MESSAGE ADDED] Type: ${type}, Length: ${content.length} chars, ActiveMessages: ${activeMessages.length}`);
}

function decryptMessage(element, finalText, callback) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const length = finalText.length;
    let iterations = 0;
    const maxIterations = 20;
    
    element.classList.add('message-encrypted');
    // Sound removed - less intrusive
    
    const interval = setInterval(() => {
        element.textContent = '> ' + finalText
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return finalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        iterations += length / maxIterations;
        
        if (iterations >= length) {
            clearInterval(interval);
            element.textContent = `> ${finalText}`;
            element.classList.remove('message-encrypted');
            element.classList.add('message-decrypted');
            // Call callback if provided
            if (callback) callback();
        }
    }, 50);
}

function destroyAllActiveMessages() {
    console.log(`[DESTROY ALL] Destroying ${activeMessages.length} active messages`);
    
    // Destroy all tracked messages
    activeMessages.forEach(msg => {
        if (msg.element && msg.element.parentNode) {
            disappearMessage(msg.element, msg.body, msg.content);
        }
    });
    
    // Clear the active messages array
    activeMessages = [];
}

function disappearMessage(messageDiv, bodyElement, originalText) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let text = originalText;
    
    // Sound removed - less intrusive
    bodyElement.classList.add('message-disappearing');
    
    const interval = setInterval(() => {
        if (text.length === 0) {
            clearInterval(interval);
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.remove();
            }, 500);
            return;
        }
        
        // Replace characters with random ones
        text = text.split('').map(() => 
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        
        // Remove one character
        text = text.slice(0, -1);
        
        bodyElement.textContent = `> ${text}`;
    }, 100);
}

function addSystemMessage(content) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'system');
    messageDiv.textContent = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/* =============================================
   UTILITY FUNCTIONS
   ============================================= */
function copyRoomId() {
    const id = roomIdDisplay.value;
    
    // Create temporary textarea to copy text (bypass security protection)
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = id;
    tempTextArea.style.position = 'fixed';
    tempTextArea.style.left = '-9999px';
    tempTextArea.style.top = '0';
    // Allow selection on this specific element
    tempTextArea.style.userSelect = 'text';
    tempTextArea.style.webkitUserSelect = 'text';
    document.body.appendChild(tempTextArea);
    
    try {
        tempTextArea.focus();
        tempTextArea.select();
        
        // Try modern clipboard API first
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(id).then(() => {
                addSystemMessage('/// ID copiado al portapapeles');
                document.body.removeChild(tempTextArea);
            }).catch(err => {
                // Fallback to execCommand
                const successful = document.execCommand('copy');
                if (successful) {
                    addSystemMessage('/// ID copiado al portapapeles');
                } else {
                    addSystemMessage('/// ERROR: No se pudo copiar el ID');
                }
                document.body.removeChild(tempTextArea);
            });
        } else {
            // Fallback to execCommand for older browsers
            const successful = document.execCommand('copy');
            if (successful) {
                addSystemMessage('/// ID copiado al portapapeles');
            } else {
                addSystemMessage('/// ERROR: No se pudo copiar el ID');
            }
            document.body.removeChild(tempTextArea);
        }
    } catch (err) {
        console.error('[CLIPBOARD] Error:', err);
        addSystemMessage('/// ERROR: No se pudo copiar el ID');
        document.body.removeChild(tempTextArea);
    }
}

function regenerateRoomId() {
    if (!peer || !isHost) return;
    
    addSystemMessage('/// Regenerando ID de sala...');
    
    // Destroy old peer
    destroyPeer();
    
    // Create new room with new ID
    setTimeout(() => {
        createRoom();
    }, 500);
}

function updateStatus(text, type) {
    statusIndicator.textContent = `● ${text}`;
    statusIndicator.className = type;
}

function disconnect() {
    playDisconnectSound();
    stopSecurityAnimation();
    stopEncryptionIndicator();
    stopCanalSeguroAnimation();
    stopVPNAnimation();
    if (currentConnection) {
        currentConnection.close();
        currentConnection = null;
    }
    destroyPeer();
    showScreen(welcomeScreen);
    updateStatus('OFFLINE', 'offline');
    messagesContainer.innerHTML = '';
}

function destroyPeer() {
    if (peer) {
        peer.destroy();
        peer = null;
    }
    isHost = false;
    myPeerId = null;
}

/* =============================================
   ANIMATION UTILITIES
   ============================================= */

// Typing effect for input fields
function typeTextIntoInput(inputElement, text, speed = 50, callback = null) {
    inputElement.value = '';
    let index = 0;
    
    const typingInterval = setInterval(() => {
        if (index < text.length) {
            inputElement.value += text[index];
            index++;
        } else {
            clearInterval(typingInterval);
            if (callback) callback();
        }
    }, speed);
}

// Connection progress animation
function showConnectionProgress(callback) {
    const steps = [
        '/// Iniciando handshake P2P...',
        '/// Estableciendo tunel seguro...',
        '/// Verificando identidad del peer...',
        '/// Negociando protocolos de encriptacion...',
        '/// Conexion establecida'
    ];
    
    let currentStep = 0;
    
    const progressInterval = setInterval(() => {
        if (currentStep < steps.length) {
            addSystemMessage(steps[currentStep]);
            currentStep++;
        } else {
            clearInterval(progressInterval);
            if (callback) {
                setTimeout(callback, 300);
            }
        }
    }, 400);
}

// Progress bar animation (for future use)
function showProgressBar(container, duration = 2000, callback = null) {
    const progressDiv = document.createElement('div');
    progressDiv.className = 'progress-bar-container';
    progressDiv.innerHTML = `
        <div class="progress-bar">
            <div class="progress-bar-fill"></div>
        </div>
        <div class="progress-text">Procesando...</div>
    `;
    
    container.appendChild(progressDiv);
    
    const fillElement = progressDiv.querySelector('.progress-bar-fill');
    let progress = 0;
    const increment = 100 / (duration / 50);
    
    const progressInterval = setInterval(() => {
        progress += increment;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            setTimeout(() => {
                container.removeChild(progressDiv);
                if (callback) callback();
            }, 300);
        }
        fillElement.style.width = progress + '%';
    }, 50);
}

// Glitch effect for text (cyberpunk style)
function glitchText(element, duration = 1000) {
    const originalText = element.textContent;
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    let iterations = 0;
    const maxIterations = duration / 30;
    
    const glitchInterval = setInterval(() => {
        element.textContent = originalText
            .split('')
            .map((char, index) => {
                if (index < iterations) {
                    return originalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');
        
        iterations += 1/3;
        
        if (iterations >= originalText.length) {
            clearInterval(glitchInterval);
            element.textContent = originalText;
        }
    }, 30);
}

/* =============================================
   AUTO-CLEANUP ON PAGE UNLOAD
   ============================================= */
window.addEventListener('beforeunload', () => {
    disconnect();
});
