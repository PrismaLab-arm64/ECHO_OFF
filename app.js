/* =============================================
   ECHO_OFF PWA - P2P COMMUNICATION LOGIC
   Version: 1.5.0 - Enhanced UX
   
   ARQUITECTURA P2P 1:1 (Peer-to-Peer)
   ===================================
   Este sistema soporta comunicación 1:1 (uno-a-uno)
   entre dos dispositivos simultáneamente.
   
   - Host (Sala): Acepta UNA conexión a la vez
   - Cliente: Se conecta a UNA sala a la vez
   - Protocolo: PeerJS con WebRTC directo
   
   Para múltiples usuarios simultáneos se requeriría:
   - Arquitectura diferente (mesh/star/broadcast)
   - Servidor de señalización personalizado
   - Gestión de múltiples conexiones simultáneas
   ============================================= */

// Global Variables
let peer = null;
let currentConnection = null;
let myPeerId = null;
let targetPeerId = null; // Store target ID for display
let isHost = false;
let deferredPrompt = null;
let wakeLock = null; // Keep screen awake on mobile

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
    console.log('[ECHO_OFF v1.5.0] P2P 1:1 Architecture - Sistema inicializado');
    setupEventListeners();
    checkServiceWorkerSupport();
    initSplashScreen();
    setupPWAInstallPrompt();
    requestWakeLock();
    
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
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ECHO_${timestamp}${random}`;
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
        roomIdDisplay.value = id;
        isHost = true;
        updateStatus('EN ESPERA', 'warning');
        addSystemMessage('/// Sala ECHO_OFF creada');
        addSystemMessage(`/// ID: ${id}`);
        addSystemMessage('/// Esperando conexion entrante...');
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
        currentConnection = peer.connect(targetId);
        setupConnectionHandlers(currentConnection);
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
    });
    
    conn.on('data', (data) => {
        console.log('[MESSAGE RECEIVED]:', data);
        // Sound removed - less intrusive
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
        alert('No hay conexion activa');
        return;
    }
    
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
    header.textContent = `[${timestamp}] ${type === 'sent' ? 'TU' : 'PEER'}`;
    
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
    
    // Decrypt animation for received messages
    if (type === 'received') {
        decryptMessage(body, content);
    } else {
        // For sent messages, show immediately
        body.textContent = `> ${content}`;
    }
    
    // Auto-disappear after 5 seconds
    setTimeout(() => {
        disappearMessage(messageDiv, body, content);
    }, 5000);
    
    console.log(`[MESSAGE ADDED] Type: ${type}, Content: ${content}`);
}

function decryptMessage(element, finalText) {
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
        }
    }, 50);
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
    navigator.clipboard.writeText(id).then(() => {
        addSystemMessage('/// ID copiado al portapapeles');
    }).catch(err => {
        console.error('[CLIPBOARD] Error:', err);
    });
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
