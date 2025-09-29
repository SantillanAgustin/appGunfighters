# 🎯 Gunfighters Bot - Documentación Completa

## 📋 Índice
- [Descripción General](#descripción-general)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración](#configuración)
- [Comandos Disponibles](#comandos-disponibles)
- [Sistema de Registro](#sistema-de-registro)
- [Sistema de Hilos](#sistema-de-hilos)
- [Sistema de Reportes Semanales](#sistema-de-reportes-semanales)
- [Sistema de Mensajes Persistentes](#sistema-de-mensajes-persistentes)
- [Base de Datos](#base-de-datos)
- [Instalación y Uso](#instalación-y-uso)
- [Desarrollo](#desarrollo)

## � Descripción General

Gunfighters Bot es un sistema automatizado diseñado específicamente para la organización **Gunfighters** en **GTA V Roleplay**. El bot gestiona el registro de actividades laborales de los miembros, crea hilos personalizados para cada usuario, mantiene estadísticas detalladas de participación, y genera reportes semanales automáticos.

### ✨ Características Principales
- 📊 **Sistema de Registro Automatizado**: Los usuarios registran actividades enviando fotos como prueba
- 🧵 **Gestión de Hilos Personalizados**: Cada usuario tiene su propio hilo para un seguimiento detallado
- 📈 **Estadísticas y Reportes**: Informes automáticos de actividades completadas
- ⏰ **Reportes Semanales Automáticos**: Generación automática cada domingo a las 23:59 UTC
- 💬 **Mensajes Persistentes**: Interfaz permanente para registro de actividades
- 🔒 **Control de Permisos**: Diferentes niveles de acceso según roles de Discord
- 📸 **Validación por Fotos**: Sistema de verificación mediante imágenes
- 🎯 **Actividades Específicas**: 6 tipos diferentes de trabajos de Gunfighters
- 🗑️ **Auto-limpieza**: Eliminación automática de fotos y mensajes de confirmación

## 📁 Estructura del Proyecto

```
appGunfighters/
├── src/
│   ├── index.js                 # Archivo principal del bot
│   └── utils/
│       ├── activityManager.js   # Gestión de actividades y datos
│       └── reportFormatter.js   # Formateo de reportes
├── data/
│   ├── activities.json          # Registro de todas las actividades
│   ├── weeklyReports.json       # Reportes semanales generados
│   ├── threads.json             # Mapeo de usuarios a hilos
│   └── persistentMessages.json  # IDs de mensajes persistentes
├── .env                         # Variables de entorno
├── package.json                 # Dependencias del proyecto
├── README.md                    # Documentación básica
└── DOCUMENTACION_COMPLETA.md    # Esta documentación
```
## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Token del bot de Discord
DISCORD_TOKEN=tu_token_aqui

# ID del servidor de Discord
GUILD_ID=tu_guild_id_aqui

# ID del canal donde se crearán los hilos
THREADS_CHANNEL_ID=tu_canal_id_aqui

# ID del rol de supervisor (opcional)
SUPERVISOR_ROLE_ID=tu_rol_id_aqui

# ID del canal para mensajes persistentes de registro
REGISTER_CHANNEL_ID=tu_canal_registro_id_aqui

# Auto-eliminación de fotos (true/false)
AUTO_DELETE_PHOTOS=true

# Prefijo para comandos (opcional, por defecto "!")
PREFIX=!
```

### 📝 Descripción de Variables

- **DISCORD_TOKEN**: Token único de tu bot de Discord
- **GUILD_ID**: ID del servidor donde funcionará el bot
- **THREADS_CHANNEL_ID**: Canal específico para crear hilos de usuarios
- **SUPERVISOR_ROLE_ID**: Rol que será notificado en nuevos hilos
- **REGISTER_CHANNEL_ID**: Canal donde se mantendrá el mensaje persistente de registro
- **AUTO_DELETE_PHOTOS**: Si eliminar automáticamente las fotos después del registro
- **PREFIX**: Símbolo que precede a los comandos (por defecto "!")

## 🎮 Comandos Disponibles

### 👤 Comandos de Usuario

#### `!registro`
Muestra el formulario interactivo para registrar actividades.
- **Uso**: `!registro`
- **Descripción**: Despliega botones para cada tipo de actividad
- **Permisos**: Todos los usuarios
- **Nota**: También disponible como mensaje persistente

#### `!help`
Muestra la lista de comandos disponibles.
- **Uso**: `!help`
- **Descripción**: Lista todos los comandos según permisos del usuario
- **Permisos**: Todos los usuarios

### 🔧 Comandos Administrativos

#### `!config`
Verifica la configuración completa del bot.
- **Uso**: `!config`
- **Descripción**: Muestra estado de todas las configuraciones
- **Permisos**: Gestionar Mensajes

#### `!informe`
Genera un reporte detallado de actividades.
- **Uso**: `!informe`
- **Descripción**: Estadísticas completas de todos los usuarios
- **Permisos**: Gestionar Mensajes
- **Nota**: Los reportes también se generan automáticamente cada domingo

#### `!crear-mensaje`
Crea un mensaje persistente de registro en el canal configurado.
- **Uso**: `!crear-mensaje`
- **Descripción**: Genera el mensaje persistente con botones de actividades
- **Permisos**: Gestionar Mensajes
- **Nota**: Se verifica automáticamente cada 5 minutos

#### `!limpiar-todo`
Elimina todos los datos y hilos del sistema.
- **Uso**: `!limpiar-todo`
- **Descripción**: Limpieza completa del sistema (IRREVERSIBLE)
- **Permisos**: Administrador
- **Confirmación**: Requiere escribir `CONFIRMAR` en 30 segundos

## 📋 Sistema de Registro

### 🎯 Actividades Disponibles

El bot reconoce 6 tipos específicos de actividades de Gunfighters:

1. **🧹 Limpieza de Espacios Públicos** (2 fotos requeridas)
2. **⚡ Restablecimiento Eléctrico** (3 fotos requeridas)
3. **💼 Asesoramiento Empresarial** (2 fotos requeridas)
4. **🌱 Servicio de Jardinería** (3 fotos requeridas)
5. **⛽ Mantenimiento de Gasolineras** (2 fotos requeridas)
6. **🏢 Limpieza de Rascacielos** (4 fotos requeridas)

### 🔄 Proceso de Registro

1. **Iniciación**: Usuario usa el mensaje persistente o `!registro`
2. **Selección**: Elige el tipo de actividad realizada pulsando el botón correspondiente
3. **Confirmación**: El bot confirma el inicio del registro (mensaje se borra en 25 segundos)
4. **Envío de Fotos**: Usuario tiene 5 minutos para enviar las fotos requeridas
5. **Validación**: El bot verifica que el número de fotos sea correcto
6. **Completado**: Se registra la actividad y se envía al hilo personal
7. **Auto-limpieza**: Las fotos se eliminan automáticamente si está configurado

### ⏱️ Timeouts y Validaciones

- **Tiempo límite**: 5 minutos para enviar fotos
- **Validación de cantidad**: Debe coincidir exactamente con lo requerido
- **Un registro a la vez**: No se pueden tener múltiples registros pendientes
- **Auto-expiración**: Los registros pendientes expiran automáticamente
- **Confirmaciones temporales**: Los mensajes de confirmación se eliminan en 25 segundos

## 🧵 Sistema de Hilos

### � Funcionamiento Automático

- **Creación automática**: Se crea un hilo personal al primer registro de actividad
- **Reutilización inteligente**: Si el hilo existe, se reutiliza
- **Nomenclatura**: Usa el apodo del servidor o nombre de usuario
- **Localización**: Se crean en el canal configurado (`THREADS_CHANNEL_ID`)
- **Notificaciones**: El rol supervisor es agregado automáticamente

### 📨 Contenido del Hilo

Cada hilo personal contiene:
- **Registro de actividades**: Todas las actividades completadas por el usuario
- **Timestamps**: Fecha y hora exacta de cada registro
- **Fotos de prueba**: Imágenes adjuntas como evidencia
- **Embeds informativos**: Formato profesional y organizado

## 📊 Sistema de Reportes Semanales

### ⏰ Generación Automática

- **Horario**: Cada domingo a las 23:59 UTC
- **Automático**: No requiere intervención manual
- **Persistente**: Se guarda en `weeklyReports.json`
- **Notificación**: Se envía al canal configurado

### 📈 Contenido del Reporte

Cada reporte semanal incluye:

#### 🏆 Top 3 Usuarios Más Activos
- 🥇 **Primer lugar**: Usuario con más actividades (con emoji de medalla)
- 🥈 **Segundo lugar**: Usuario con segunda mayor participación
- 🥉 **Tercer lugar**: Usuario con tercera mayor participación

#### 👥 Resto de Usuarios
- Lista de usuarios con actividades completadas (sin medallas)
- Formato organizado y claro

#### 📅 Información General
- Rango de fechas del reporte
- Número total de usuarios activos
- Timestamp de generación

### 🎨 Formato del Reporte

```
📊 REPORTE SEMANAL - Gunfighters

Período: [Fecha Inicio] - [Fecha Final]

🏆 TOP 3 USUARIOS MÁS ACTIVOS:
🥇 Usuario1 - X actividades
🥈 Usuario2 - Y actividades  
🥉 Usuario3 - Z actividades

👥 OTROS USUARIOS ACTIVOS:
• Usuario4 - W actividades
• Usuario5 - V actividades
[...]

📈 TOTAL: N usuarios activos esta semana
```

## � Sistema de Mensajes Persistentes

### 🔄 Verificación Automática

- **Frecuencia**: Cada 5 minutos
- **Detección**: Verifica si el mensaje persistente existe
- **Recreación**: Si no existe, lo recrea automáticamente
- **Canal**: Utiliza `REGISTER_CHANNEL_ID`

### 🛡️ Prevención de Duplicados

- **Verificación de existencia**: Comprueba si ya existe un mensaje antes de crear uno nuevo
- **Manejo de errores**: Detecta errores específicos de Discord (código 10008 - Unknown Message)
- **Limpieza automática**: Elimina mensajes huérfanos o incorrectos
- **Log de estado**: Registra todas las operaciones para debugging

### 🎯 Funcionalidad del Mensaje

El mensaje persistente contiene:
- **Título informativo**: "🎯 Sistema de Registro Gunfighters"
- **Instrucciones claras**: Cómo usar el sistema
- **Botones interactivos**: Uno para cada tipo de actividad
- **Formato profesional**: Embeds con colores y emojis

## 🗃️ Base de Datos

### 📄 activities.json
Almacena todos los registros de actividades:
```json
[
  {
    "userId": "123456789",
    "username": "Usuario#1234",
    "displayName": "Apodo",
    "activityType": "limpieza_espacios",
    "timestamp": "2024-03-15T10:30:00.000Z",
    "photos": ["url1.jpg", "url2.jpg"]
  }
]
```

### 📄 threads.json
Mapea usuarios a sus hilos correspondientes:
```json
{
  "123456789": "987654321"
}
```

### 📄 weeklyReports.json
Guarda los reportes semanales generados:
```json
[
  {
    "weekStart": "2024-03-11",
    "weekEnd": "2024-03-17",
    "users": [
      {
        "userId": "123456789",
        "username": "Usuario#1234",
        "displayName": "Apodo",
        "count": 5
      }
    ],
    "generatedAt": "2024-03-17T23:59:00.000Z"
  }
]
```

### 📄 persistentMessages.json
Almacena IDs de mensajes persistentes por canal:
```json
{
  "123456789": "987654321"
}
```

## 🚀 Instalación y Uso

### 📋 Prerrequisitos

- **Node.js** v16.9.0 o superior
- **npm** o **yarn**
- **Bot de Discord** configurado con permisos necesarios

### 🔧 Instalación

1. **Clonar/descargar** el proyecto
2. **Instalar dependencias**:
   ```bash
   npm install
   ```
3. **Configurar variables de entorno** en `.env`
4. **Ejecutar el bot**:
   ```bash
   npm start
   ```

### 🔑 Permisos del Bot

El bot necesita los siguientes permisos en Discord:
- **Ver Canales**
- **Enviar Mensajes**
- **Gestionar Mensajes**
- **Adjuntar Archivos**
- **Leer Historial de Mensajes**
- **Crear Hilos Públicos**
- **Enviar Mensajes en Hilos**
- **Gestionar Hilos**
- **Usar Slash Commands**

## �️ Desarrollo

### 📊 Arquitectura

- **index.js**: Controlador principal y manejo de eventos
- **activityManager.js**: Lógica de datos y persistencia
- **reportFormatter.js**: Formateo de reportes y embeds

### 🔍 Debugging

- **Logs detallados**: El bot registra todas las operaciones importantes
- **Manejo de errores**: Captura y reporta errores específicos
- **Modo desarrollo**: Variables de entorno para testing

### 🚀 Nuevas Características

Para añadir nuevas actividades:
1. Actualizar `activityTypes` en `index.js`
2. Añadir botón correspondiente en `createActivityButtons()`
3. Actualizar `activityNames` en las funciones relevantes

### 📋 Testing

- **Comando de configuración**: `!config` para verificar setup
- **Reportes manuales**: `!informe` para testing
- **Mensaje persistente**: `!crear-mensaje` para verificar funcionalidad

---

## 📞 Soporte

Para problemas técnicos o consultas sobre el bot, revisar:
1. **Logs del console**: Errores y warnings en tiempo real
2. **Configuración**: Verificar todas las variables de entorno
3. **Permisos**: Confirmar que el bot tiene todos los permisos necesarios
4. **Canal de configuración**: Usar `!config` para diagnóstico

---

**Última actualización**: Septiembre 2025  
**Versión**: 2.0 - Sistema completo con reportes automáticos y mensajes persistentes