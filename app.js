/* =============================================
   ECHO_OFF PWA - P2P COMMUNICATION LOGIC
   Version: 1.1.0 - MS-DOS/Windows 95 Edition
   ============================================= */

// Global Variables
let peer = null;
let currentConnection = null;
let myPeerId = null;
let isHost = false;
let deferredPrompt = null;

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
const btnInstall = document.getElementById('btn-install');
const btnCancelInstall = document.getElementById('btn-cancel-install');

const roomIdDisplay = document.getElementById('room-id');
const peerIdInput = document.getElementById('peer-id-input');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages-container');
const statusIndicator = document.getElementById('status');
const chatPeerId = document.getElementById('chat-peer-id');

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
    // Sonido de envío: beep ascendente
    play8BitSound(440, 0.1);
    setTimeout(() => play8BitSound(554, 0.1), 100);
}

function playReceiveSound() {
    // Sonido de recepción: beep descendente
    play8BitSound(554, 0.1);
    setTimeout(() => play8BitSound(440, 0.1), 100);
}

function playDecryptSound() {
    // Sonido de desencriptación: sweep rápido
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playDisappearSound() {
    // Sonido de desaparición: fade out
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(660, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(110, audioContext.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

/* =============================================
   INITIALIZATION
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
    console.log('[ECHO_OFF v1.1.0] MS-DOS Edition - Sistema inicializado');
    setupEventListeners();
    checkServiceWorkerSupport();
    initSplashScreen();
    setupPWAInstallPrompt();
    
    // Initialize audio on first user interaction
    document.addEventListener('click', initAudio, { once: true });
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
                installPrompt.classList.remove('hidden');
            }
        }, 4000);
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('[PWA] Aplicación instalada');
        deferredPrompt = null;
        if (installPrompt) {
            installPrompt.classList.add('hidden');
        }
    });
}

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
    btnBackFromJoin.addEventListener('click', () => showScreen(welcomeScreen));
    
    // Connection
    btnConnect.addEventListener('click', connectToPeer);
    btnDisconnect.addEventListener('click', disconnect);
    btnCopyId.addEventListener('click', copyRoomId);
    
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
   PEERJS CONNECTION
   ============================================= */
function createRoom() {
    showScreen(createRoomScreen);
    
    // Generate unique Peer ID
    myPeerId = 'ECHO_' + Math.random().toString(36).substring(2, 12).toUpperCase();
    
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
        roomIdDisplay.textContent = id;
        isHost = true;
        updateStatus('EN ESPERA', 'warning');
        addSystemMessage('/// Sala ECHO_OFF creada');
        addSystemMessage(`/// ID: ${id}`);
        addSystemMessage('/// Esperando conexión entrante...');
    });
    
    peer.on('connection', (conn) => {
        // Intrusion detection - Manual approval
        const approve = confirm(`⚠️ INTRUSIÓN DETECTADA\n\nID del intruso: ${conn.peer}\n\n¿Aprobar conexión?`);
        
        if (!approve) {
            conn.close();
            addSystemMessage('/// Conexión rechazada');
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
}

function connectToPeer() {
    const targetId = peerIdInput.value.trim();
    
    if (!targetId) {
        alert('⚠️ Por favor ingrese el ID del Host');
        return;
    }
    
    // Generate unique Peer ID
    myPeerId = 'ECHO_' + Math.random().toString(36).substring(2, 12).toUpperCase();
    
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
        currentConnection = peer.connect(targetId);
        setupConnectionHandlers(currentConnection);
    });
    
    peer.on('error', (err) => {
        console.error('[PEER] Error:', err);
        alert(`⚠️ ERROR: No se pudo conectar\n${err.type}`);
    });
}

function setupConnectionHandlers(conn) {
    conn.on('open', () => {
        console.log('[CONNECTION] Establecida');
        showScreen(chatScreen);
        chatPeerId.textContent = conn.peer;
        updateStatus('CONECTADO', 'success');
        addSystemMessage('/// Conexión P2P establecida');
        addSystemMessage('/// Canal cifrado activo');
    });
    
    conn.on('data', (data) => {
        console.log('[MESSAGE RECEIVED]:', data);
        playReceiveSound();
        addMessage(data, 'received');
    });
    
    conn.on('close', () => {
        console.log('[CONNECTION] Cerrada');
        updateStatus('DESCONECTADO', 'error');
        addSystemMessage('/// Conexión terminada');
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
        alert('⚠️ No hay conexión activa');
        return;
    }
    
    currentConnection.send(message);
    console.log('[MESSAGE SENT]:', message);
    playSendSound();
    addMessage(message, 'sent');
    
    messageInput.value = '';
    messageInput.focus();
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
    header.textContent = `[${timestamp}] ${type === 'sent' ? 'TÚ' : 'PEER'}`;
    
    const body = document.createElement('div');
    body.classList.add('message-body');
    
    messageDiv.appendChild(header);
    messageDiv.appendChild(body);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Decrypt animation for received messages
    if (type === 'received') {
        decryptMessage(body, content);
    } else {
        body.textContent = `> ${content}`;
    }
    
    // Auto-disappear after 3 seconds
    setTimeout(() => {
        disappearMessage(messageDiv, body, content);
    }, 3000);
}

function decryptMessage(element, finalText) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const length = finalText.length;
    let iterations = 0;
    const maxIterations = 20;
    
    element.classList.add('message-encrypted');
    playDecryptSound();
    
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
        }
    }, 50);
}

function disappearMessage(messageDiv, bodyElement, originalText) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let text = originalText;
    
    playDisappearSound();
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
    const id = roomIdDisplay.textContent;
    navigator.clipboard.writeText(id).then(() => {
        addSystemMessage('/// ID copiado al portapapeles');
    }).catch(err => {
        console.error('[CLIPBOARD] Error:', err);
    });
}

function updateStatus(text, type) {
    statusIndicator.textContent = `● ${text}`;
    statusIndicator.className = type;
}

function disconnect() {
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
   AUTO-CLEANUP ON PAGE UNLOAD
   ============================================= */
window.addEventListener('beforeunload', () => {
    disconnect();
});
