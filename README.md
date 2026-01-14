# 🔐 ECHO_OFF PWA - MS-DOS Edition

![Version](https://img.shields.io/badge/version-1.1.0-00AA00?style=for-the-badge)
![Status](https://img.shields.io/badge/status-operational-00AA00?style=for-the-badge)
![Privacy](https://img.shields.io/badge/privacy-maximum-00AA00?style=for-the-badge)
![Theme](https://img.shields.io/badge/theme-MS--DOS%20%2F%20Win95-000084?style=for-the-badge)

**Sala de Chat P2P Segura con Estética Retro MS-DOS / Windows 95**

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ███████╗ ██████╗██╗  ██╗ ██████╗     ╔═══════════════╗    ║
║   ██╔════╝██╔════╝██║  ██║██╔═══██╗    ║  ███████╗     ║    ║
║   █████╗  ██║     ███████║██║   ██║    ║  ██╔═══██╗    ║    ║
║   ██╔══╝  ██║     ██╔══██║██║   ██║    ║  ██║   ██║    ║    ║
║   ███████╗╚██████╗██║  ██║╚██████╔╝    ║  ╚██████╔╝    ║    ║
║   ╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝     ║   ╚═════╝     ║    ║
║                                         ╚═══════════════╝    ║
╚═══════════════════════════════════════════════════════════════╝

C:\> ECHO_OFF v1.1.0 - MS-DOS Compatible System
C:\> Type HELP for available commands
```

## 🎯 Características

- **🔒 Privacidad Total**: Protocolo Zero-Trace - sin bases de datos, sin almacenamiento en servidor
- **🌐 Comunicación P2P**: Conexión directa navegador-a-navegador usando PeerJS
- **💾 Sin Persistencia**: Todos los mensajes se destruyen al recargar/cerrar página
- **📱 Progressive Web App**: Instalable en móvil y escritorio con prompt nativo
- **🎨 UI Retro MS-DOS/Win95**: Interfaz estilo MS-DOS con ventanas Windows 95
- **🔐 Cifrado End-to-End**: Transmisión de datos P2P cifrada automática
- **👁️ Autorización Manual**: El Host aprueba manualmente las solicitudes de conexión
- **🔊 Sonidos Retro**: Efectos de audio 8-bit para enviar, recibir y desencriptar mensajes
- **⏱️ Mensajes Temporales**: Los mensajes se muestran 3 segundos y luego desaparecen
- **🎭 Efecto de Encriptación**: Animación tipo Matrix al recibir y desaparecer mensajes
- **💻 Estética Retro Completa**: Colores MS-DOS, fuente VT323, ventanas Windows 95

## 🆕 Novedades v1.1.0 - MS-DOS Edition

### 🎨 Diseño Retro Completo
- **Paleta MS-DOS**: Colores clásicos (negro, azul, verde, cyan, rojo, magenta, amarillo, blanco)
- **Ventanas Windows 95**: Bordes 3D, barras de título, botones minimize/maximize/close
- **Fuente VT323**: Tipografía monoespaciada estilo terminal MS-DOS
- **ASCII Art**: Arte ASCII para la pantalla de bienvenida
- **Boot Screen**: Pantalla de arranque estilo MS-DOS con efecto de carga

### 🖥️ Interfaz Estilo Windows 95
- **Barra de Título**: Gradiente azul característico de Windows 95
- **Barra de Menú**: Menú con File, Connection, Options, Help
- **Bordes 3D**: Efectos raised/sunken para dar profundidad
- **Botones Clásicos**: Botones con borde 3D y efecto hover
- **Scrollbar Retro**: Barra de desplazamiento estilo Windows 95

### 🎵 Efectos Visuales Retro
- **Cursor Parpadeante**: Guion bajo parpadeante tipo terminal
- **Animación de Carga**: Barra de progreso estilo DOS
- **Mensajes con Bordes**: Cajas de texto con bordes ASCII
- **Color Coding**: Mensajes enviados (verde), recibidos (cyan), sistema (amarillo)

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
1. Haz clic en **"[ 1 ] CREAR NUEVA SALA"**
2. Se generará un ID único (formato: ECHO_XXXXXXXXXX)
3. Copia el ID usando el botón **"COPIAR"**
4. Compártelo solo con peers de confianza
5. Espera la solicitud de conexión
6. Aprueba la conexión cuando aparezca la alerta

### Unirse a Sala (Peer)
1. Haz clic en **"[ 2 ] UNIRSE A SALA EXISTENTE"**
2. Ingresa el ID del Host
3. Haz clic en **"[ ENTER ] CONECTAR"**
4. Espera la aprobación del Host

### Chat
- Escribe tu mensaje en el campo `C:\>`
- Presiona **Enter** o haz clic en **"ENVIAR"**
- Los mensajes se muestran con efecto de desencriptación
- Después de 3 segundos, los mensajes desaparecen automáticamente
- Sonidos retro indican envío, recepción y desencriptación

## 🔊 Efectos de Sonido

- **Enviar Mensaje**: Beep ascendente (440Hz → 554Hz)
- **Recibir Mensaje**: Beep descendente (554Hz → 440Hz)
- **Desencriptar**: Sweep rápido tipo sawwave (200Hz → 800Hz)
- **Desaparecer**: Fade out triangular (660Hz → 110Hz)

## 🎨 Paleta de Colores MS-DOS

| Color | Hex | Uso |
|-------|-----|-----|
| Negro | `#000000` | Fondo principal |
| Azul MS-DOS | `#0000AA` | Texto secundario |
| Verde MS-DOS | `#00AA00` | Prompt y mensajes enviados |
| Cyan MS-DOS | `#00AAAA` | ASCII art y mensajes recibidos |
| Rojo MS-DOS | `#AA0000` | Errores |
| Magenta MS-DOS | `#AA00AA` | Encriptación |
| Amarillo MS-DOS | `#AAAA00` | Advertencias y sistema |
| Blanco MS-DOS | `#AAAAAA` | Texto principal |
| Gris Windows 95 | `#C0C0C0` | Fondo de ventanas |
| Azul Windows 95 | `#000084` | Barra de título |

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
- **CSS3**: Animaciones y efectos visuales retro
- **Vanilla JavaScript**: Lógica sin dependencias
- **PeerJS**: Abstracción de WebRTC
- **Web Audio API**: Generación de sonidos 8-bit
- **Service Worker**: Funcionalidad offline y PWA
- **VT323 Font**: Tipografía monoespaciada estilo terminal

## 📁 Estructura de Archivos

```
/
├── index.html          # Estructura principal MS-DOS/Win95
├── style.css           # Estilos retro completos
├── app.js              # Lógica P2P y sonidos
├── sw.js               # Service Worker v1.1.0
├── manifest.json       # Configuración PWA
├── icon-retro.png      # Ícono retro principal (1024x1024)
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

## 🎮 Comandos Disponibles

```
C:\> HELP

Comandos disponibles:

  CREATE    - Crear nueva sala de chat
  JOIN      - Unirse a sala existente
  SEND      - Enviar mensaje
  DISCONNECT - Desconectar de la sala
  EXIT      - Salir de la aplicación

Para más información, visite la documentación.
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

### La interfaz no se ve retro
- Verifica que las fuentes VT323 se hayan cargado correctamente
- Limpia la caché del navegador
- Recarga la página con Ctrl+F5

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

## 🔮 Roadmap

### v1.2.0 - Themes Adicionales
- [ ] Tema Cyberpunk (Terminal Hacker verde neón)
- [ ] Tema Classic Terminal (Amber CRT)
- [ ] Tema Matrix (Verde Matrix)
- [ ] Selector de temas en la aplicación

### v1.3.0 - Características Avanzadas
- [ ] Compartir archivos P2P
- [ ] Mensajes de voz
- [ ] Salas con múltiples peers
- [ ] Historial temporal (mientras está abierto)

### v2.0.0 - Mejoras Mayores
- [ ] Video chat P2P
- [ ] Pantalla compartida
- [ ] Cifrado adicional opcional
- [ ] Modo offline con mensajería diferida

## 📊 Changelog

### v1.1.0 (2026-01-14) - MS-DOS Edition
- ✨ Rediseño completo estilo MS-DOS/Windows 95
- 🎨 Paleta de colores clásica MS-DOS (16 colores)
- 🖥️ Ventanas estilo Windows 95 con bordes 3D
- 💾 Boot screen estilo MS-DOS
- 🔤 Fuente VT323 monoespaciada
- 📟 ASCII art en pantalla de bienvenida
- 🎵 Mantenimiento de sonidos 8-bit
- ⏱️ Mantenimiento de mensajes temporales
- 📱 PWA instalable con nuevo ícono retro
- 🇪🇸 Interfaz 100% en español

### v1.0.2 (2026-01-14) - Cyberpunk Edition
- 🔐 Rebranding a ECHO_OFF
- 🔊 Sistema de audio 8-bit
- ⏱️ Mensajes temporales (3 segundos)
- 📱 PWA instalable
- 🇪🇸 Interfaz en español
- 📱 Responsive 100%

### v1.0.0 (2026-01-13) - Initial Release
- 🚀 Lanzamiento inicial
- 🔐 Chat P2P seguro
- 💾 Protocolo Zero-Trace
- 🎨 Estética cyberpunk

---

**ECHO_OFF v1.1.0 - MS-DOS Edition** | Protocolo Zero-Trace Activo | Privacidad Máxima

```
C:\> ECHO_OFF.EXE v1.1.0
C:\> MS-DOS Compatible System
C:\> Copyright (C) 2026 CyberSec Division
C:\> 
C:\> Starting P2P Communication Protocol...      [OK]
C:\> Initializing Encryption Module...           [OK]
C:\> Loading Zero-Trace Protocol...              [OK]
C:\> System Ready.
C:\> 
C:\> Type HELP for available commands.
C:\> _
```
