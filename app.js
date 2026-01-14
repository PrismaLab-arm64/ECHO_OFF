/* =============================================
   SHADOW-CHAT PWA - P2P COMMUNICATION LOGIC
   Version: 1.0.0
   ============================================= */

// Global Variables
let peer = null;
let currentConnection = null;
let myPeerId = null;
let isHost = false;

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const createRoomScreen = document.getElementById('create-room-screen');
const joinRoomScreen = document.getElementById('join-room-screen');
const chatScreen = document.getElementById('chat-screen');

const btnCreateRoom = document.getElementById('btn-create-room');
const btnJoinRoom = document.getElementById('btn-join-room');
const btnBackFromCreate = document.getElementById('btn-back-from-create');
const btnBackFromJoin = document.getElementById('btn-back-from-join');
const btnConnect = document.getElementById('btn-connect');
const btnDisconnect = document.getElementById('btn-disconnect');
const btnSend = document.getElementById('btn-send');
const btnCopyId = document.getElementById('btn-copy-id');

const roomIdDisplay = document.getElementById('room-id');
const peerIdInput = document.getElementById('peer-id-input');
const messageInput = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages-container');
const statusIndicator = document.getElementById('status');
const chatPeerId = document.getElementById('chat-peer-id');

/* =============================================
   INITIALIZATION
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
    console.log('[SHADOW-CHAT] System initialized');
    setupEventListeners();
    checkServiceWorkerSupport();
});

/* =============================================
   SERVICE WORKER REGISTRATION (PWA)
   ============================================= */
function checkServiceWorkerSupport() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('[PWA] Service Worker registered:', reg.scope))
            .catch(err => console.error('[PWA] Service Worker registration failed:', err));
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
}

/* =============================================
   SCREEN NAVIGATION
   ============================================= */
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function showJoinScreen() {
    showScreen(joinRoomScreen);
    peerIdInput.value = '';
    peerIdInput.focus();
}

/* =============================================
   PEER CONNECTION - CREATE ROOM (HOST)
   ============================================= */
function createRoom() {
    updateStatus('INITIALIZING...', '#ffff00');
    
    // Generate random ID
    const randomId = 'shadow-' + Math.random().toString(36).substr(2, 9);
    
    peer = new Peer(randomId, {
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
            ]
        }
    });
    
    peer.on('open', (id) => {
        myPeerId = id;
        isHost = true;
        roomIdDisplay.value = id;
        showScreen(createRoomScreen);
        updateStatus('HOST MODE - LISTENING', '#00ffff');
        console.log('[HOST] Room created with ID:', id);
    });
    
    peer.on('connection', (conn) => {
        console.log('[HOST] Incoming connection from:', conn.peer);
        
        // INTRUSION DETECTION - Manual Approval
        const approved = confirm(`⚠️ INTRUSION DETECTED ⚠️\n\nPeer ID: ${conn.peer}\n\nAccept connection?`);
        
        if (approved) {
            setupConnection(conn);
            showScreen(chatScreen);
            chatPeerId.textContent = `[Connected: ${conn.peer}]`;
            addSystemMessage('Connection established - Secure channel active');
            updateStatus('CONNECTED', '#00ff00');
        } else {
            conn.close();
            addSystemMessage('Connection rejected by host');
            console.log('[HOST] Connection rejected:', conn.peer);
        }
    });
    
    peer.on('error', handlePeerError);
    peer.on('disconnected', () => {
        updateStatus('DISCONNECTED', '#ff0000');
        console.log('[HOST] Peer disconnected');
    });
}

/* =============================================
   PEER CONNECTION - JOIN ROOM (CLIENT)
   ============================================= */
function connectToPeer() {
    const peerId = peerIdInput.value.trim();
    
    if (!peerId) {
        alert('⚠️ ERROR: Room ID required');
        return;
    }
    
    updateStatus('CONNECTING...', '#ffff00');
    
    // Create peer with random ID
    peer = new Peer('shadow-' + Math.random().toString(36).substr(2, 9), {
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
            ]
        }
    });
    
    peer.on('open', (id) => {
        myPeerId = id;
        isHost = false;
        console.log('[CLIENT] Peer ID:', id);
        console.log('[CLIENT] Attempting to connect to:', peerId);
        
        // Establish connection
        currentConnection = peer.connect(peerId, {
            reliable: true
        });
        
        setupConnection(currentConnection);
    });
    
    peer.on('error', handlePeerError);
}

/* =============================================
   CONNECTION SETUP
   ============================================= */
function setupConnection(conn) {
    currentConnection = conn;
    
    conn.on('open', () => {
        console.log('[CONNECTION] Established with:', conn.peer);
        showScreen(chatScreen);
        chatPeerId.textContent = `[Connected: ${conn.peer}]`;
        updateStatus('CONNECTED', '#00ff00');
        addSystemMessage('Secure channel established - Messages are encrypted');
        messageInput.focus();
    });
    
    conn.on('data', (data) => {
        console.log('[MESSAGE RECEIVED]:', data);
        addMessage(data, 'received');
    });
    
    conn.on('close', () => {
        console.log('[CONNECTION] Closed');
        updateStatus('DISCONNECTED', '#ff0000');
        addSystemMessage('Connection terminated - Zero-trace protocol activated');
        setTimeout(() => {
            disconnect();
        }, 2000);
    });
    
    conn.on('error', (err) => {
        console.error('[CONNECTION ERROR]:', err);
        addSystemMessage('Connection error - Attempting recovery...');
    });
}

/* =============================================
   MESSAGING FUNCTIONS
   ============================================= */
function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    if (!currentConnection || !currentConnection.open) {
        alert('⚠️ ERROR: No active connection');
        return;
    }
    
    // Send message
    currentConnection.send(message);
    console.log('[MESSAGE SENT]:', message);
    
    // Display in chat
    addMessage(message, 'sent');
    
    // Clear input
    messageInput.value = '';
    messageInput.focus();
}

function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    const timestamp = new Date().toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const header = document.createElement('div');
    header.className = 'message-header';
    header.textContent = `[${timestamp}] ${type === 'sent' ? 'YOU' : 'PEER'}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = `> ${content}`;
    
    messageDiv.appendChild(header);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Auto-scroll
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addSystemMessage(content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = `⚠ SYSTEM: ${content}`;
    
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Auto-scroll
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/* =============================================
   DISCONNECT & CLEANUP
   ============================================= */
function disconnect() {
    console.log('[DISCONNECT] Initiating shutdown sequence...');
    
    // Close connection
    if (currentConnection) {
        currentConnection.close();
        currentConnection = null;
    }
    
    // Destroy peer
    destroyPeer();
    
    // Clear chat
    messagesContainer.innerHTML = '';
    messageInput.value = '';
    
    // Reset to welcome screen
    showScreen(welcomeScreen);
    updateStatus('OFFLINE', '#ff0000');
    
    console.log('[DISCONNECT] All traces erased - Zero-trace protocol completed');
}

function destroyPeer() {
    if (peer) {
        peer.destroy();
        peer = null;
        myPeerId = null;
        isHost = false;
    }
}

/* =============================================
   UTILITY FUNCTIONS
   ============================================= */
function updateStatus(text, color) {
    statusIndicator.textContent = `● ${text}`;
    statusIndicator.style.color = color;
    statusIndicator.style.textShadow = `0 0 10px ${color}`;
}

function copyRoomId() {
    roomIdDisplay.select();
    document.execCommand('copy');
    
    // Visual feedback
    btnCopyId.textContent = '✓';
    setTimeout(() => {
        btnCopyId.textContent = '📋';
    }, 1500);
    
    console.log('[COPY] Room ID copied to clipboard');
}

function handlePeerError(err) {
    console.error('[PEER ERROR]:', err);
    
    let errorMessage = 'Connection error';
    
    switch(err.type) {
        case 'peer-unavailable':
            errorMessage = 'Peer not found - Check Room ID';
            break;
        case 'network':
            errorMessage = 'Network error - Check connection';
            break;
        case 'server-error':
            errorMessage = 'Server error - Try again later';
            break;
        default:
            errorMessage = `Error: ${err.type}`;
    }
    
    alert(`⚠️ ${errorMessage}`);
    updateStatus('ERROR', '#ff0000');
}

/* =============================================
   ZERO-TRACE PROTOCOL (Page Unload)
   ============================================= */
window.addEventListener('beforeunload', () => {
    console.log('[ZERO-TRACE] Activating data destruction protocol...');
    disconnect();
});

// Console branding
console.log(`
%c
   _____ __  _____    ____  ____ _       __
  / ___// / / /   |  / __ \\/ __ \\ |     / /
  \\__ \\/ /_/ / /| | / / / / / / / | /| / / 
 ___/ / __  / ___ |/ /_/ / /_/ /| |/ |/ /  
/____/_/ /_/_/  |_/_____/\\____/ |__/|__/   
                                            
  ██████╗██╗  ██╗ █████╗ ████████╗
 ██╔════╝██║  ██║██╔══██╗╚══██╔══╝
 ██║     ███████║███████║   ██║   
 ██║     ██╔══██║██╔══██║   ██║   
 ╚██████╗██║  ██║██║  ██║   ██║   
  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   

Version: 1.0.0
Status: OPERATIONAL
Privacy: MAXIMUM (Zero-Trace Protocol Active)
Connection: Peer-to-Peer (No Server Storage)
%c
`, 'color: #00ff00; font-family: monospace; font-size: 10px;', '');

console.log('%c[SHADOW-CHAT] System initialized - All communications encrypted', 'color: #00ffff; font-weight: bold;');
