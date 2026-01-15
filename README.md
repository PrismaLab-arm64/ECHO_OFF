# 🔐 ECHO_OFF PWA - Java Console Edition

![Version](https://img.shields.io/badge/version-1.6.0-00CC00?style=for-the-badge)
![Status](https://img.shields.io/badge/status-operational-00CC00?style=for-the-badge)
![Privacy](https://img.shields.io/badge/privacy-maximum-00CC00?style=for-the-badge)
![Architecture](https://img.shields.io/badge/P2P-1:1-00CC00?style=for-the-badge)

**Sala de Chat P2P 1:1 Segura con Estetica Java Console**

```
╔═══════════════════════════════════════════════╗
║                                               ║
║   ECHO_OFF                                    ║
║   Sistema de Comunicacion Segura 1:1         ║
║                                               ║
║   Version: 1.6.0                              ║
║   Protocolo: P2P 1:1                          ║
║   Usuarios: 1 a 1 simultaneo                  ║
║   Encriptacion: E2E                           ║
║   Privacidad: MAXIMA                          ║
║                                               ║
╚═══════════════════════════════════════════════╝

> ECHO_OFF v1.6.0 - Security Simulation Layer
> Type HELP for available commands
```

## 🎯 Caracteristicas

- **🔒 Privacidad Total**: Protocolo Zero-Trace - sin bases de datos, sin almacenamiento
- **🌐 Comunicacion P2P 1:1**: Conexion directa navegador-a-navegador usando PeerJS
- **👥 Arquitectura 1:1**: Solo 2 usuarios simultaneos (uno-a-uno)
- **💾 Sin Persistencia**: Mensajes destruidos al recargar/cerrar pagina
- **📱 Progressive Web App**: Instalable en movil y escritorio
- **🎨 UI Java Console**: Interfaz estilo terminal Java limpia
- **🔐 Cifrado E2E**: Transmision de datos P2P cifrada
- **👁️ Autorizacion Manual**: El Host aprueba conexiones manualmente
- **🔊 Sonidos Retro**: Efectos de audio 8-bit en eventos clave
- **⏱️ Mensajes Temporales**: Mensajes visibles 5 segundos y desaparecen
- **🎭 Efecto Matrix**: Animacion de desencriptacion al recibir mensajes
- **💻 Diseño Limpio**: Verde suave (#00CC00), fuente Courier Prime
- **🔒 Simulación de Seguridad**: Animación visual de VPN, IPs rotativas, cifrado en tiempo real

## 🆕 Novedades v1.6.0 - Security Simulation Layer

### 🔒 Capa de Simulación de Seguridad
- **Animación VPN**: Rotación de servidores VPN cada 10 segundos
- **IPs Dinámicas**: Simulación de IPs cambiantes y puertos túnel
- **Algoritmos de Cifrado**: Rotación visual de algoritmos (AES-256, ChaCha20, etc.)
- **Latencia en Tiempo Real**: Monitoreo simulado de latencia de conexión
- **Diseño No Invasivo**: Gris claro (#808080) para no interrumpir el chat
- **Actualización Suave**: Cambios cada 10 segundos sin distraer

### 🌐 Servidores VPN Simulados
- Zurich, Switzerland [WireGuard]
- Reykjavik, Iceland [OpenVPN]
- Singapore [IKEv2]
- Tokyo, Japan [WireGuard]
- Stockholm, Sweden [Shadowsocks]
- Amsterdam, Netherlands [OpenVPN]
- Tallinn, Estonia [IKEv2]

### ⚡ Características Técnicas
- **IP Pool**: 9 prefijos de IP ficticios con generación dinámica
- **Puerto Túnel**: Rango 10000-60000 aleatorio
- **Animación Cursor**: Efecto typing cursor en valores actualizados
- **Responsive**: Adaptado para móvil (columna) y escritorio (fila)

## 🆕 Novedades v1.5.0 - Architecture & Icons

### 🔗 URL del Servicio
**🔒 Puerto: 8000**  
https://8000-ibr4o9t915o4jcubam7h9-b32ec7bb.sandbox.novita.ai/

### ⚙️ Arquitectura P2P 1:1 Clarificada
- **Documentacion**: Sistema ahora documenta claramente que es 1:1 (uno-a-uno)
- **Limitacion de Usuarios**: Solo 1 conexion activa por sala a la vez
- **Validacion**: Sistema rechaza automaticamente conexiones multiples
- **Mensaje Informativo**: "Esta sala solo admite 1 usuario simultaneo"

### ✅ Mejoras de UX
- **Alerta Mejorada**: "NUEVA SOLICITUD DE CONEXION" en lugar de "INTRUSION DETECTADA"
- **Mensajes Claros**: Explicacion amigable del proceso de aprobacion
- **Limpieza de Inputs**: Input field se limpia al cambiar de pantalla
- **Validacion de ID**: Verifica que el ID comience con "ECHO_"

### 🎨 Mejoras Visuales
- **Color Verde Ajustado**: #00FF00 → #00CC00 (menos invasivo)
- **Iconos Completos**: icon-192.png y icon-512.png generados desde icon-app.png
- **PWA Icon Fix**: Todas las referencias de iconos actualizadas
- **Display de IDs Mejorado**: IDs siempre muestran el peer correcto

### 🔧 Correcciones Criticas
- **ID Display Bug**: Host muestra ID del cliente; Cliente muestra ID de la sala
- **Iconos PWA**: Instalacion ahora muestra el icono correcto (C:\>_)
- **Multi-Connection**: Sistema ahora rechaza multiples conexiones automaticamente
- **Logs Detallados**: Mejor debug para identificar issues

### 📱 Responsive Mobile-First
- **100% Responsive**: Optimizado para moviles
- **Botones Grandes**: Targets tactiles de 44px minimo
- **Layout Vertical**: Input bar adaptable en moviles
- **Fuentes Escalables**: clamp() para todos los tamaños

## 🚀 Inicio Rapido

### Deployment Online
```bash
# Subir a GitHub Pages, Netlify, Vercel, etc.
# Solo archivos estaticos - no requiere backend
```

### Testing Local
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

Abre `http://localhost:8000` en tu navegador.

## 📖 Como Usar

### Crear Nueva Sala (Host)

1. Click en **"CREAR NUEVA SALA"**
2. Se genera un ID unico: `ECHO_XXXXXXXXXX`
3. Click en **"COPIAR"** para copiar el ID
4. Click en **"REGENERAR"** para nuevo ID (opcional)
5. Comparte el ID con la persona con quien quieres chatear
6. Espera la conexion entrante
7. Acepta la alerta de "INTRUSION DETECTADA"

### Unirse a Sala (Cliente)

1. Click en **"UNIRSE A SALA EXISTENTE"**
2. Pega el ID compartido por el Host
3. Click en **"CONECTAR"**
4. Espera que el Host apruebe la conexion

### Chat Seguro

- Los mensajes se muestran durante 5 segundos
- Luego desaparecen automaticamente
- Efecto de desencriptacion estilo Matrix
- Todos los mensajes en color verde terminal
- Sin persistencia - privacidad maxima

## 🔒 Privacidad y Seguridad

### Protocolo Zero-Trace
- **Sin base de datos**: No hay almacenamiento server-side
- **Sin logs**: No se registran mensajes ni metadata
- **Sin cookies**: No se almacena informacion del usuario
- **Sin rastreo**: No hay analytics ni tracking

### Encriptacion End-to-End
- Conexion P2P directa navegador-a-navegador
- WebRTC con cifrado automatico
- STUN servers de Google para NAT traversal
- Sin intermediarios - datos no pasan por servidor

### Autorizacion Manual
- El Host debe aprobar cada conexion
- Alerta de "INTRUSION DETECTADA"
- Control total sobre quien se conecta
- Sin conexiones automaticas

## 💻 Tecnologias

- **HTML5/CSS3**: Interfaz responsive
- **Vanilla JavaScript**: Sin frameworks pesados
- **PeerJS**: Abstraccion de WebRTC
- **Web Audio API**: Sonidos 8-bit retro
- **Service Worker**: PWA offline-ready
- **Manifest.json**: Instalacion en home screen

## 📱 Progressive Web App

### Instalacion

#### Android
1. Abre la app en Chrome
2. Aparece prompt "Instalar ECHO_OFF"
3. Click "SI" para instalar
4. Icono aparece en home screen

#### iOS
1. Abre la app en Safari
2. Click icono "Compartir"
3. "Añadir a Inicio"
4. Icono aparece en home screen

#### Desktop
1. Abre la app en Chrome/Edge
2. Click icono "Instalar" en barra de direcciones
3. La app se instala como aplicacion de escritorio

## 🎨 Personalizacion

### Colores Command Line
```css
--dos-black: #000000;    /* Fondo */
--dos-green: #00AA00;    /* Texto principal */
--dos-cyan: #00AAAA;     /* Titulos */
--dos-white: #AAAAAA;    /* Texto secundario */
--dos-gray: #808080;     /* Bordes */
--win95-gray: #C0C0C0;   /* Botones */
--win95-blue: #000080;   /* Barra de titulo */
```

### Fuentes
- **VT323**: Fuente monoespaciada estilo terminal
- **Tamaños escalables**: clamp() para responsive
- **Legibilidad optimizada**: Contraste alto

## 📊 Version History

### v1.3.0 (2026-01-15) - Command Line Style
- Eliminado fondo amarillo invasivo del ID
- Color verde terminal para todos los mensajes
- Boton regenerar ID agregado
- IDs unicos con timestamp
- Mejor contraste y legibilidad

### v1.2.0 (2026-01-14) - Simplified Design
- Eliminado ASCII art complejo
- Colores MS-DOS basicos
- Mensajes de 5 segundos (antes 3s)
- Sonidos solo en eventos clave
- 100% responsive mobile-first

### v1.1.0 (2026-01-13) - MS-DOS Edition
- Diseño retro MS-DOS/Windows 95
- Sonidos 8-bit retro
- Mensajes temporales
- PWA instalable

### v1.0.0 (2026-01-12) - Initial Release
- Chat P2P basico
- Encriptacion E2E
- Zero-trace protocol

## 📄 Licencia

MIT License - Ver LICENSE para mas detalles.

## ⚠️ Disclaimer

Este proyecto es educativo y para uso personal. No garantizamos 100% privacidad en entornos de produccion. Use bajo su propio riesgo.

## 🤝 Contribuciones

Contributions, issues y feature requests son bienvenidos.

## 👨‍💻 Autor

**PrismaLab**
- GitHub: [@PrismaLab-arm64](https://github.com/PrismaLab-arm64)

## ⭐ Soporte

Dale una ⭐ si este proyecto te ayudo!

---

**C:\> ECHO_OFF v1.3.0 - Command Line Edition**  
**C:\> Maximum Privacy | Zero Trace | P2P Encrypted**
