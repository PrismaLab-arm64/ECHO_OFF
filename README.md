# 🔐 ECHO_OFF PWA

![Version](https://img.shields.io/badge/version-1.0.2-00ff00?style=for-the-badge)
![Status](https://img.shields.io/badge/status-operational-00ff00?style=for-the-badge)
![Privacy](https://img.shields.io/badge/privacy-maximum-00ff00?style=for-the-badge)

**Sala de Chat P2P Segura con Estética Terminal Hacker/Cyberpunk**

## 🎯 Características

- **🔒 Privacidad Total**: Protocolo Zero-Trace - sin bases de datos, sin almacenamiento en servidor
- **🌐 Comunicación P2P**: Conexión directa navegador-a-navegador usando PeerJS
- **💾 Sin Persistencia**: Todos los mensajes se destruyen al recargar/cerrar página
- **📱 Progressive Web App**: Instalable en móvil y escritorio con prompt nativo
- **🎨 UI Cyberpunk**: Interfaz estilo terminal con efectos CRT scanlines
- **🔐 Cifrado End-to-End**: Transmisión de datos P2P cifrada automática
- **👁️ Autorización Manual**: El Host aprueba manualmente las solicitudes de conexión
- **🔊 Sonidos Retro**: Efectos de audio 8-bit para enviar, recibir y desencriptar mensajes
- **⏱️ Mensajes Temporales**: Los mensajes se muestran 3 segundos y luego desaparecen
- **🎭 Efecto de Encriptación**: Animación tipo Matrix al recibir y desaparecer mensajes

## 🚀 Inicio Rápido

### Despliegue Online
Simplemente abre `index.html` en un navegador web o despliega en cualquier servicio de hosting estático.

### Prueba Local
```bash
# Usando Python
python -m http.server 8000

# Usando Node.js
npx http-server -p 8000
```

Luego abre `http://localhost:8000` en tu navegador.

## 📖 Cómo Usar

### Crear Sala (Host)
1. Haz clic en **"CREAR NUEVA SALA"**
2. Se generará un ID único (formato: ECHO_XXXXXXXXXX)
3. Copia el ID y compártelo solo con peers de confianza
4. Espera la solicitud de conexión
5. Aprueba la conexión cuando aparezca la alerta de "INTRUSIÓN DETECTADA"

### Unirse a Sala (Peer)
1. Haz clic en **"UNIRSE A SALA EXISTENTE"**
2. Ingresa el ID del Host
3. Haz clic en **"CONECTAR"**
4. Espera la aprobación del Host

### Chat
- Escribe tu mensaje en el campo de texto
- Presiona **Enter** o haz clic en **"ENVIAR"**
- Los mensajes se muestran con efecto de desencriptación
- Después de 3 segundos, los mensajes desaparecen automáticamente
- Sonidos retro indican envío, recepción y desencriptación

## 🔊 Efectos de Sonido

- **Enviar Mensaje**: Beep ascendente (440Hz → 554Hz)
- **Recibir Mensaje**: Beep descendente (554Hz → 440Hz)
- **Desencriptar**: Sweep rápido tipo sawwave (200Hz → 800Hz)
- **Desaparecer**: Fade out triangular (660Hz → 110Hz)

## 🎨 Estética Terminal

- **Colores**: Negro (#000), Verde Neón (#0f0), Cyan (#0ff), Magenta (#f0f)
- **Fuente**: JetBrains Mono (monoespaciada)
- **Efectos**: CRT scanlines, glitch, sombras de neón
- **Iconografía**: Símbolos de código (<>, {}, /, _)

## 📱 Instalación PWA

La aplicación puede instalarse como una app nativa:
- **Android**: Chrome mostrará el banner de instalación
- **iOS**: Safari > Compartir > Añadir a pantalla de inicio
- **Desktop**: Chrome mostrará el ícono de instalación en la barra de direcciones

## 🔒 Seguridad y Privacidad

### Zero-Trace Protocol
- **Sin bases de datos**: Ningún dato se almacena en servidores
- **Sin cookies**: No se usan cookies de ningún tipo
- **Sin LocalStorage**: No se guarda nada en el navegador
- **Sin tracking**: Cero analítica o seguimiento de usuarios

### Cifrado WebRTC
- **DTLS-SRTP**: Cifrado de transporte automático
- **Conexión P2P**: Directa entre navegadores
- **Sin intermediarios**: No pasa por servidores (excepto STUN inicial)

### Destrucción Automática
- **Al cerrar pestaña**: Todas las conexiones se destruyen
- **Al recargar**: Toda la conversación se borra
- **3 segundos**: Los mensajes desaparecen automáticamente

## 🛠️ Tecnologías

- **HTML5**: Estructura semántica
- **CSS3**: Animaciones y efectos visuales
- **Vanilla JavaScript**: Lógica sin dependencias
- **PeerJS**: Abstracción de WebRTC
- **Web Audio API**: Generación de sonidos 8-bit
- **Service Worker**: Funcionalidad offline y PWA

## 📁 Estructura de Archivos

```
/
├── index.html          # Estructura principal
├── style.css           # Estilos cyberpunk
├── app.js              # Lógica P2P y sonidos
├── sw.js               # Service Worker
├── manifest.json       # Configuración PWA
├── icon.svg            # Ícono vectorial
├── icon-192.png        # Ícono 192x192
├── icon-512.png        # Ícono 512x512
└── README.md           # Esta documentación
```

## 🌐 Compatibilidad de Navegadores

| Navegador | Versión Mínima | Estado |
|-----------|----------------|--------|
| Chrome    | 90+            | ✅ Completo |
| Firefox   | 88+            | ✅ Completo |
| Safari    | 14+            | ⚠️ Limitado* |
| Edge      | 90+            | ✅ Completo |

*Safari tiene limitaciones en PWA y WebRTC en iOS.

## ⚙️ Configuración Avanzada

### Cambiar Servidores STUN
Edita `app.js` y modifica la configuración de PeerJS:

```javascript
peer = new Peer(myPeerId, {
    config: {
        iceServers: [
            { urls: 'stun:tu-servidor-stun.com:19302' }
        ]
    }
});
```

### Ajustar Duración de Mensajes
Edita `app.js` en la función `addMessage()`:

```javascript
// Cambiar de 3000 (3 segundos) a tu preferencia
setTimeout(() => {
    disappearMessage(messageDiv, body, content);
}, 3000); // ← Aquí
```

## 🐛 Solución de Problemas

### No se puede conectar
- Verifica que ambos peers tengan acceso a Internet
- Asegúrate de que los firewalls no bloqueen WebRTC
- Intenta con otro navegador

### La instalación PWA no aparece
- Usa HTTPS o localhost
- Verifica que el Service Worker esté registrado (consola del navegador)
- Algunos navegadores requieren interacción del usuario

### No se escuchan los sonidos
- Haz clic en cualquier parte de la página primero (política de autoplay)
- Verifica que el volumen del navegador no esté silenciado

## 📜 Licencia

MIT License con aviso de privacidad. Ver [LICENSE](LICENSE).

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Haz fork del repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📞 Soporte

Para reportar bugs o solicitar features:
- Abre un Issue en GitHub
- Incluye detalles del navegador y sistema operativo
- Proporciona pasos para reproducir el problema

## 🔮 Roadmap v1.1.0

- [ ] Compartir archivos P2P
- [ ] Mensajes de voz
- [ ] Salas con múltiples peers
- [ ] Modo oscuro/claro
- [ ] Temas personalizables

---

**ECHO_OFF v1.0.2** | Protocolo Zero-Trace Activo | Privacidad Máxima

```
  _____ _____ _   _  ___     ___  ___________
 | ____/ ____| | | |/ _ \   / _ \|  ___|  ___|
 |  _|| |    | |_| | | | | | | | | |_  | |_
 | |__| |___ |  _  | |_| | | |_| |  _| |  _|
 |_____\____|_| |_|\___/   \___/|_|   |_|

 > Conexión segura establecida
 > Protocolo Zero-Trace: ACTIVO
 > Cifrado E2E: OPERACIONAL
```
