# 🎯 Gunfighters Bot ### ✨ Características Pri```
appGunfighters/
├── src/
│   ├── index.js                 # Archivo principal del bot
│   └── utils/
│       ├── activityManager.js   # Gestión de actividades y datos
│       ├── reportFormatter.js   # Formateo de reportes
│       ├── scheduleManager.js   # Sistema de recordatorios automáticos
│       └── balanceManager.js    # Sistema de balances semanales (NUEVO)
├── data/
│   ├── activities.json          # Registro de todas las actividades
│   ├── weeklyReports.json       # Reportes semanales generados
│   ├── threads.json             # Mapeo de usuarios a hilos
│   ├── persistentMessages.json  # IDs de mensajes persistentes
│   ├── scheduledActivities.json # Actividades programadas del sistema
│   └── balances.json            # Sistema de balances semanales (NUEVO)
├── .env                         # Variables de entorno
├── package.json                 # Dependencias del proyecto*Sistema de Registro Automatizado**: Los usuarios registran actividades enviando fotos como prueba
- 🧵 **Gestión de Hilos Personalizados**: Cada usuario tiene su propio hilo para un seguimiento detallado
- 📈 **Estadísticas y Reportes**: Informes automáticos de actividades completadas
- ⏰ **Reportes Semanales Automáticos**: Generación automática cada domingo a las 23:59 UTC con integración completa
- 🔔 **Sistema de Recordatorios**: Notificaciones automáticas 10 minutos antes de actividades del sistema
- 💰 **Sistema de Balances Semanales**: Gestión de cuotas de $50,000 semanales por miembro (NUEVO)
- 💬 **Mensajes Persistentes**: Interfaz permanente para registro de actividades
- 🔒 **Control de Permisos**: Diferentes niveles de acceso según roles de Discord
- 📸 **Validación por Fotos**: Sistema de verificación mediante imágenes
- 🎯 **Actividades Específicas**: 6 tipos diferentes de trabajos de Gunfighters
- 🗑️ **Auto-limpieza**: Eliminación automática de fotos y mensajes de confirmaciónción Completa

## 📋 Índice
- [Descripción General](#descripción-general)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración](#configuración)
- [Comandos Disponibles](#comandos-disponibles)
- [Sistema de Registro](#sistema-de-registro)
- [Sistema de Hilos](#sistema-de-hilos)
- [Sistema de Reportes Semanales](#sistema-de-reportes-semanales)
- [Sistema de Mensajes Persistentes](#sistema-de-mensajes-persistentes)
- [Sistema de Recordatorios Automáticos](#sistema-de-recordatorios-automáticos)
- [Sistema de Balances Semanales](#sistema-de-balances-semanales)
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
- � **Sistema de Recordatorios**: Notificaciones automáticas 10 minutos antes de actividades del sistema
- �💬 **Mensajes Persistentes**: Interfaz permanente para registro de actividades
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
│       ├── reportFormatter.js   # Formateo de reportes
│       └── scheduleManager.js   # Sistema de recordatorios automáticos
├── data/
│   ├── activities.json          # Registro de todas las actividades
│   ├── weeklyReports.json       # Reportes semanales generados
│   ├── threads.json             # Mapeo de usuarios a hilos
│   ├── persistentMessages.json  # IDs de mensajes persistentes
│   └── scheduledActivities.json # Actividades programadas del sistema
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

#### `!listar-actividades`
Muestra todas las actividades programadas del sistema.
- **Uso**: `!listar-actividades`
- **Descripción**: Lista actividades con horarios, días y estado
- **Permisos**: Gestionar Mensajes

#### `!agregar-actividad`
Agregar nueva actividad programada con recordatorio.
- **Uso**: `!agregar-actividad "Nombre" "HH:MM" "días" "descripción"`
- **Descripción**: Crea actividad con recordatorio automático
- **Permisos**: Gestionar Mensajes
- **Ejemplo**: `!agregar-actividad "Evento Especial" "15:30" "1,3,5" "Evento semanal"`

#### `!recordatorios`
Panel de gestión del sistema de recordatorios.
- **Uso**: `!recordatorios [subcomando] [parámetros]`
- **Subcomandos**: `eliminar [ID]`, `toggle [ID]`
- **Descripción**: Gestión completa de recordatorios automáticos
- **Permisos**: Gestionar Mensajes

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

### 📊 Consulta de Progreso Personal

#### 🔍 Funcionalidad Integrada
Los usuarios pueden consultar su progreso usando el botón **"📊 Consultar Mis Actividades"** desde el mensaje persistente, que ahora muestra información completa:

**✅ Información de Actividades:**
- Desglose detallado por tipo de actividad
- Total de actividades registradas en la semana
- Contador específico para cada categoría

**✅ Información de Balance (NUEVO):**
- Balance restante de la cuota semanal ($50,000)
- Total aportado a la organización
- Estado de la cuota (✅ Completada / ⏳ Pendiente)  
- Número de contribuciones realizadas
- Semana actual del sistema

#### 🎨 Interfaz Visual
- **Colores dinámicos**: Verde (cuota completa), Naranja (progreso), Rojo (inicio)
- **Información estructurada**: Campos organizados para fácil lectura
- **Indicadores visuales**: Emojis y estados claros
- **Respuesta privada**: Solo visible para el usuario consultante

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

## ⏰ Sistema de Recordatorios Automáticos

### 🎯 Funcionalidad Principal

El sistema de recordatorios monitorea automáticamente las actividades del sistema del juego GTA V y envía notificaciones 10 minutos antes de cada una para mantener a la organización informada sobre las oportunidades de participación.

### 📋 Actividades del Sistema Configuradas

#### 🧹 **Limpieza de Espacios Públicos** (4 horarios diarios)
- **00:00-01:00 UTC** (recordatorio: 23:50)
- **06:00-07:00 UTC** (recordatorio: 05:50)
- **12:00-13:00 UTC** (recordatorio: 11:50)
- **21:00-22:00 UTC** (recordatorio: 20:50)

#### ⚡ **Restablecimiento Eléctrico** (4 horarios diarios)
- **03:00-04:00 UTC** (recordatorio: 02:50)
- **15:00-16:00 UTC** (recordatorio: 14:50)
- **18:00-19:00 UTC** (recordatorio: 17:50)
- **20:00-21:00 UTC** (recordatorio: 19:50)

#### 💼 **Asesoramiento Empresarial** (3 horarios diarios)
- **01:00-02:00 UTC** (recordatorio: 00:50)
- **10:00-11:00 UTC** (recordatorio: 09:50)
- **13:00-14:00 UTC** (recordatorio: 12:50)

#### 🌱 **Servicio de Jardinería** (2 horarios diarios)
- **04:00-05:00 UTC** (recordatorio: 03:50)
- **22:00-23:00 UTC** (recordatorio: 21:50)

#### ⛽ **Mantenimiento de Gasolineras** (3 horarios diarios)
- **02:00-03:00 UTC** (recordatorio: 01:50)
- **08:00-09:00 UTC** (recordatorio: 07:50)
- **16:00-17:00 UTC** (recordatorio: 15:50)

#### 🏢 **Limpieza de Rascacielos** (2 horarios diarios)
- **09:00-10:00 UTC** (recordatorio: 08:50)
- **19:00-20:00 UTC** (recordatorio: 18:50)

### 🔧 Sistema de Verificación

- **Frecuencia**: Cada minuto
- **Detección inteligente**: Solo envía recordatorios cuando es el momento exacto
- **Prevención de duplicados**: Una sola notificación por día por actividad
- **Configuración flexible**: Actividades pueden activarse/desactivarse individualmente

### 📱 Formato de Notificación

Cada recordatorio incluye:
- **Título llamativo**: "⏰ Recordatorio de Actividad - HORA HUB"
- **Información específica**: Nombre de la actividad y tiempo restante
- **Hora exacta**: Cuándo inicia la actividad en UTC
- **Descripción**: Detalles del rango horario
- **Mención automática**: Al rol supervisor si está configurado

### 🛠️ Gestión de Actividades

Las actividades pueden gestionarse mediante comandos:
- **Listar**: Ver todas las actividades programadas
- **Agregar**: Crear nuevas actividades personalizadas
- **Activar/Desactivar**: Controlar qué recordatorios se envían
- **Eliminar**: Remover actividades obsoletas

### 📊 Estadísticas del Sistema

- **Total diario**: 18 recordatorios automáticos
- **Cobertura**: 24 horas del día, 7 días de la semana
- **Precisión**: Notificaciones exactas 10 minutos antes
- **Eficiencia**: Sistema optimizado sin spam ni duplicados

## � Sistema de Balances Semanales

### 🎯 Descripción del Sistema

El **Sistema de Balances Semanales** es la implementación más reciente de Gunfighters Bot, diseñado para gestionar la economía interna de la organización en GTA V Roleplay. Cada miembro activo debe cumplir con una cuota semanal de **$50,000** mediante trabajos externos.

### 🔧 Funcionamiento Core

#### 📋 Estructura de Balance
- **Balance inicial**: $50,000 cada semana
- **Trabajos externos**: Los miembros realizan trabajos fuera de la organización
- **Aporte obligatorio**: 50% de cada ganancia va a la organización
- **Objetivo**: Reducir el balance a $0 para completar la cuota semanal

#### ⏰ Ciclo Semanal
- **Inicio**: Lunes 00:00 UTC - Balance reset a $50,000
- **Desarrollo**: Registro de aportes durante la semana
- **Reset**: Domingo 23:59 UTC - Notificación automática y reset

### 📝 Comandos Disponibles

#### 👤 Para Miembros
```bash
!balance                        # Consultar balance personal
!aportar [monto] [descripción]  # Registrar aporte (requiere screenshot)
```

#### 🔧 Para Administradores
```bash
!balances                      # Resumen de todos los balances
!estadisticas-balance          # Estadísticas detalladas del sistema
```

### 🎮 Ejemplo de Uso Completo

```bash
# Escenario: Usuario trabaja en un restaurante
Usuario: !aportar 10000 Trabajo en restaurante La Mesa
[Adjunta screenshot del pago]

# Resultado automático:
- Balance anterior: $45,000
- Trabajo realizado: $10,000
- Aporte a organización: $5,000 (50%)
- Ganancia personal: $5,000 (50%)
- Nuevo balance: $40,000
- Estado: ⏳ Pendiente ($40,000 restantes)
```

### 📊 Funcionalidades Avanzadas

#### 🏆 Sistema de Rankings
- **Top contribuyentes**: Ranking semanal por aportes
- **Cuotas completadas**: Seguimiento de miembros al día
- **Estadísticas globales**: Totales de organización y participación

#### 📸 Validación por Evidencia
- **Screenshot obligatorio**: Cada aporte debe incluir imagen
- **Auto-limpieza**: Eliminación automática después de 30-35 segundos
- **Verificación manual**: Los supervisores pueden revisar aportes

#### 🔔 Notificaciones Automáticas
- **Reset semanal**: Aviso cada domingo antes del reset
- **Estado de balance**: Indicadores visuales (🟢 completado, 🟡 en progreso, 🔴 pendiente)
- **Recordatorios**: Próximamente - alertas de cuotas pendientes

### 🗃️ Estructura de Datos

#### balances.json
```json
{
  "users": {
    "123456789": {
      "userId": "123456789",
      "username": "JohnDoe",
      "displayName": "John Doe",
      "currentBalance": 35000,
      "weeklyContributions": {
        "2024-W50": [
          {
            "id": "contrib_001",
            "timestamp": "2024-12-15T14:30:00Z",
            "totalAmount": 15000,
            "organizationAmount": 7500,
            "memberAmount": 7500,
            "description": "Trabajo restaurante",
            "photoUrl": "https://cdn.discord.com/..."
          }
        ]
      }
    }
  },
  "settings": {
    "initialBalance": 50000,
    "organizationPercentage": 50
  }
}
```

### 🔍 Análisis y Reportes

#### 📈 Métricas Semanales
- **Participación**: Número de miembros activos
- **Recaudación total**: Suma de todos los aportes organizacionales
- **Promedio por miembro**: Distribución de contribuciones
- **Tasa de completitud**: Porcentaje de cuotas completadas

#### 📋 Informes Automáticos
- **Balance individual**: Estado personalizado de cada miembro
- **Resumen administrativo**: Vista general para supervisores
- **Estadísticas detalladas**: Análisis profundo del sistema

### ⚙️ Configuración del Sistema

#### 🛠️ Variables Configurables
```javascript
// En balanceManager.js
const SETTINGS = {
    initialBalance: 50000,        // Balance inicial semanal
    organizationPercentage: 50,   // % que va a la organización
    autoDeleteDelay: 30000        // Tiempo de auto-limpieza
};
```

#### 🔧 Integración con Bot Principal
- **Imports necesarios**: balanceManager completo en index.js
- **Comandos integrados**: Sistema modular sin conflictos
- **Reset automático**: Función checkWeeklyBalanceReset cada minuto
- **Reportes integrados**: Los reportes semanales automáticos incluyen datos de actividades Y balances

### 📊 Reportes Semanales Integrados

El sistema genera automáticamente reportes completos que combinan:

#### 📈 Datos de Actividades
- Número total de actividades registradas
- Top 3 usuarios más activos con medallas
- Desglose por tipo de actividad
- Promedio de actividades por usuario

#### 💰 Datos de Balances  
- Total aportado a la organización
- Número de cuotas completadas vs pendientes
- Estado individual de balance por usuario
- Total de contribuciones registradas

#### 🎯 Formato del Reporte
```
📊 Informe Semanal Completo - Gunfighters
Semana del 2024-W50

📈 Estadísticas Generales    💰 Estadísticas de Balances
👥 Usuarios Activos: 8       💵 Total Aportado: $125,000
📅 Total Actividades: 45     ✅ Cuotas Completadas: 5
📊 Promedio por Usuario: 5.6 ⏳ Cuotas Pendientes: 3
                            📋 Total de Aportes: 28

🏆 Usuarios de la Semana
🥇 Usuario1: 12 actividades (Balance: ✅ Completado)
🥈 Usuario2: 8 actividades (Balance: ⏳ $15,000)
🥉 Usuario3: 7 actividades (Balance: ✅ Completado)
```

## �🗃️ Base de Datos

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

### 📄 scheduledActivities.json
Almacena las actividades programadas del sistema con sus recordatorios:
```json
[
  {
    "id": "limpieza_espacios_00",
    "name": "🧹 Limpieza de Espacios Públicos #1",
    "description": "Actividad del sistema: Limpieza de espacios públicos (Horario: 00-01hs UTC)",
    "timeUTC": "00:00",
    "daysOfWeek": [0, 1, 2, 3, 4, 5, 6],
    "reminderSent": {
      "2024-09-30": true
    },
    "active": true,
    "createdAt": "2024-09-30T15:00:00.000Z"
  }
]
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
- **scheduleManager.js**: Sistema de recordatorios automáticos y gestión de actividades programadas

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
- **Sistema de recordatorios**: `!listar-actividades` para verificar actividades programadas
- **Gestión de recordatorios**: `!recordatorios` para testing del sistema de notificaciones

---

## 📞 Soporte

Para problemas técnicos o consultas sobre el bot, revisar:
1. **Logs del console**: Errores y warnings en tiempo real
2. **Configuración**: Verificar todas las variables de entorno
3. **Permisos**: Confirmar que el bot tiene todos los permisos necesarios
4. **Canal de configuración**: Usar `!config` para diagnóstico

---

**Última actualización**: Septiembre 2025  
**Versión**: 3.0 - Sistema completo con reportes automáticos, mensajes persistentes y recordatorios de actividades del sistema