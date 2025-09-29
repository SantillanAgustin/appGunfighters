# 🎯 Gunfighters Discord Bot

Bot automatizado para la organización **Gunfighters** en **GTA V Roleplay** que gestiona el registro de actividades laborales, crea hilos personalizados y genera reportes semanales automáticos.

## ✨ Características Principales

🎯 **6 Actividades Específicas** - Sistema diseñado para las actividades de Gunfighters  
📊 **Reportes Semanales Automáticos** - Generación automática cada domingo 23:59 UTC  
💬 **Mensajes Persistentes** - Interfaz permanente para registro de actividades  
🧵 **Hilos Personalizados** - Cada usuario tiene su propio hilo de seguimiento  
📸 **Validación por Fotos** - Sistema de verificación mediante imágenes  
🗑️ **Auto-limpieza** - Eliminación automática de fotos y confirmaciones  
🔒 **Control de Permisos** - Diferentes niveles según roles de Discord  

## 🎮 Actividades Disponibles

| Actividad | Fotos Requeridas | Emoji |
|-----------|------------------|-------|
| Limpieza de Espacios Públicos | 1 foto | 🧹 |
| Restablecimiento Eléctrico | 1 foto | ⚡ |
| Asesoramiento Empresarial | 1 foto | 💼 |
| Servicio de Jardinería | 1 foto | 🌱 |
| Mantenimiento de Gasolineras | 1 foto | ⛽ |
| Limpieza de Rascacielos | 1 foto | 🏢 |

## 🚀 Inicio Rápido

### 1. Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd appGunfighters

# Instalar dependencias
npm install
```

### 2. Configuración
```bash
# Crear archivo de configuración
cp .env.example .env

# Editar .env con tus valores
DISCORD_TOKEN=tu_token_de_bot
GUILD_ID=id_del_servidor
THREADS_CHANNEL_ID=id_canal_hilos
REGISTER_CHANNEL_ID=id_canal_registro
SUPERVISOR_ROLE_ID=id_rol_supervisor
AUTO_DELETE_PHOTOS=true
```

### 3. Ejecutar
```bash
npm start
```

## 🎮 Comandos

### 👤 Usuarios
- `!registro` - Mostrar formulario de registro de actividades
- `!help` - Lista de comandos disponibles

### 🔧 Administradores
- `!config` - Verificar configuración del bot
- `!informe` - Generar reporte manual de actividades
- `!crear-mensaje` - Crear mensaje persistente en canal de registro
- `!limpiar-todo` - Limpiar todos los datos (IRREVERSIBLE)

## 📋 Cómo Usar

### Registrar Actividad
1. **Usar el mensaje persistente** o escribir `!registro`
2. **Pulsar el botón** de la actividad realizada
3. **Enviar las fotos requeridas** en los próximos 5 minutos
4. **Confirmación automática** - El bot registra y confirma
5. **Auto-limpieza** - Las fotos se eliminan automáticamente

### Sistema Automático
- ⏰ **Reportes semanales** - Cada domingo 23:59 UTC
- 🔄 **Verificación de mensajes** - Cada 5 minutos
- 🧵 **Creación de hilos** - Automática al primer registro
- 🗑️ **Limpieza de confirmaciones** - 25 segundos después

## 🏗️ Estructura del Proyecto

```
appGunfighters/
├── src/
│   ├── index.js                 # Bot principal
│   └── utils/
│       ├── activityManager.js   # Gestión de datos
│       └── reportFormatter.js   # Formateo de reportes
├── data/
│   ├── activities.json          # Base de datos actividades
│   ├── weeklyReports.json       # Reportes semanales
│   ├── threads.json             # Mapeo usuario-hilo
│   └── persistentMessages.json  # IDs mensajes persistentes
└── .env                         # Configuración
```

## 🔧 Tecnologías

- **Node.js** v22.18.0 - Runtime
- **Discord.js** v14.22.1 - API de Discord
- **dotenv** v16.4.7 - Variables de entorno

## 📊 Funcionalidades Avanzadas

### Reportes Semanales
- 🏆 **Top 3 usuarios** con medallas (🥇🥈🥉)
- 👥 **Lista completa** de usuarios activos
- 📅 **Rango de fechas** automático
- 💾 **Guardado persistente** en JSON

### Mensajes Persistentes
- 🔄 **Verificación automática** cada 5 minutos
- 🛡️ **Prevención de duplicados** con manejo de errores
- 📍 **Canal específico** configurable
- 🎨 **Interfaz profesional** con embeds y botones

### Sistema de Hilos
- 🏷️ **Nomenclatura automática** usando apodos del servidor
- 📨 **Notificación al supervisor** en nuevos hilos
- 📁 **Organización por canal** específico
- 💾 **Persistencia** de relación usuario-hilo

## 🔒 Permisos Necesarios

El bot requiere estos permisos en Discord:
- Ver Canales
- Enviar Mensajes
- Gestionar Mensajes
- Adjuntar Archivos
- Leer Historial de Mensajes
- Crear Hilos Públicos
- Enviar Mensajes en Hilos
- Gestionar Hilos

## 📈 Monitoreo

### Logs del Sistema
- ✅ **Registros de actividades** con timestamps
- 🔄 **Verificaciones de mensajes persistentes**
- 📊 **Generación de reportes automáticos**
- ❌ **Errores y recuperación automática**

### Comandos de Diagnóstico
- `!config` - Estado completo de configuración
- `!informe` - Prueba manual de generación de reportes

## 🛠️ Desarrollo

### Añadir Nueva Actividad
1. Actualizar `activityTypes` en `src/index.js`
2. Añadir botón en `createActivityButtons()`
3. Actualizar `activityNames` en funciones relevantes

### Testing
```bash
# Verificar configuración
!config

# Probar reporte manual
!informe

# Crear mensaje persistente
!crear-mensaje
```

## 📞 Soporte

- 📖 **Documentación completa**: `DOCUMENTACION_COMPLETA.md`
- 🔍 **Diagnóstico**: Usar comando `!config`
- 📝 **Logs**: Revisar console para errores

---

**Estado**: ✅ Funcionando completamente  
**Última actualización**: Septiembre 2025  
**Versión**: 2.0 - Sistema completo con reportes automáticos y mensajes persistentes

---

## 📸 Capturas

### Mensaje Persistente
```
🎯 Sistema de Registro Gunfighters

Bienvenido al sistema de registro de actividades.

¿Cómo registrar?
1. Pulsa el botón de la actividad que realizaste
2. Envía exactamente el número de fotos requeridas
3. El bot confirmará tu registro

[🧹] [⚡] [💼] [🌱] [⛽] [🏢]
```

### Reporte Semanal
```
📊 REPORTE SEMANAL - Gunfighters

Período: 22 Sep - 28 Sep 2024

🏆 TOP 3 USUARIOS MÁS ACTIVOS:
🥇 Usuario1 - 12 actividades
🥈 Usuario2 - 8 actividades
🥉 Usuario3 - 6 actividades

👥 OTROS USUARIOS ACTIVOS:
• Usuario4 - 4 actividades
• Usuario5 - 3 actividades

📈 TOTAL: 5 usuarios activos esta semana
```