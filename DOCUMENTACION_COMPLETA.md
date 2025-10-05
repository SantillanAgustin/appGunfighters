# 🎯 Gunfighters Bot - Documentación Completa

## 📋 Índice
- [Descripción General](#descripción-general)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración](#configuración)
- [Comandos Disponibles](#comandos-disponibles)
- [Sistema de Registro de Actividades](#sistema-de-registro-de-actividades)
- [Sistema de Balances Semanales](#sistema-de-balances-semanales)
- [Sistema de Hilos Duales](#sistema-de-hilos-duales)
- [Sistema de Reportes Semanales](#sistema-de-reportes-semanales)
- [Sistema de Mensajes Persistentes](#sistema-de-mensajes-persistentes)
- [Sistema de Recordatorios Automáticos](#sistema-de-recordatorios-automáticos)
- [Base de Datos](#base-de-datos)
- [Instalación y Uso](#instalación-y-uso)
- [Desarrollo](#desarrollo)

## 📝 Descripción General

Gunfighters Bot es un sistema automatizado diseñado específicamente para la organización **Gunfighters** en **GTA V Roleplay**. El bot gestiona:

- **Registro de actividades laborales** con validación fotográfica
- **Sistema de balances semanales** con cuotas de $50,000
- **Hilos personalizados duales** (actividades + aportes económicos)
- **Reportes semanales automáticos** integrados
- **Interfaz moderna** con botones persistentes y formularios modales

### ✨ Características Principales
- 📊 **Sistema de Registro Automatizado**: Usuarios registran actividades enviando fotos como prueba
- 🧵 **Gestión de Hilos Personalizados**: Cada usuario tiene hilos separados para actividades y aportes
- 📈 **Estadísticas y Reportes**: Informes automáticos de actividades completadas Y balances financieros
- ⏰ **Reportes Semanales Automáticos**: Generación automática cada domingo a las 23:59 UTC con integración completa
- 🔔 **Sistema de Recordatorios**: Notificaciones automáticas 10 minutos antes de actividades del sistema
- 💰 **Sistema de Balances Semanales**: Gestión de cuotas de $50,000 semanales por miembro ✨ NUEVO
- 💬 **Mensajes Persistentes**: Interfaz permanente con botones para registro y consultas
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
│       ├── scheduleManager.js   # Sistema de recordatorios automáticos
│       └── balanceManager.js    # Sistema de balances semanales ✨ NUEVO
├── data/
│   ├── activities.json          # Registro de todas las actividades
│   ├── weeklyReports.json       # Reportes semanales generados
│   ├── threads.json             # Mapeo de usuarios a hilos de actividades
│   ├── persistentMessages.json  # IDs de mensajes persistentes
│   ├── scheduledActivities.json # Actividades programadas del sistema
│   └── balances.json            # Sistema de balances y aportes ✨ NUEVO
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

# CANALES DE DISCORD (todos requeridos)
# ID del canal donde se crearán los hilos de actividades - Log-actividades
THREADS_CHANNEL_ID=tu_canal_hilos_actividades_id

# ID del canal donde se crearán los hilos de aportes/balance ✨ NUEVO
BALANCE_THREADS_CHANNEL_ID=tu_canal_hilos_balance_id

# ID del canal donde estará el mensaje persistente de registro - registro-actividades
REGISTER_CHANNEL_ID=tu_canal_registro_id

# ID del canal donde se enviarán los recordatorios de actividades programadas
REMINDERS_CHANNEL_ID=tu_canal_recordatorios_id

# ID del canal donde se enviarán los informes semanales automáticos ✨ NUEVO
REPORTS_CHANNEL_ID=tu_canal_informes_id

# ROLES DE DISCORD (opcionales pero recomendados)
# ID del rol que será etiquetado en nuevos hilos
SUPERVISOR_ROLE_ID=tu_rol_supervisor_id

# ID del rol de líderes (permisos especiales) ✨ NUEVO  
LIDER_ROLE_ID=tu_rol_lider_id

# CONFIGURACIONES DEL BOT
# Eliminar automáticamente las fotos del canal después de procesarlas
AUTO_DELETE_PHOTOS=true

# Prefijo para los comandos del bot
PREFIX=!
```

### Configuración de Canales

#### 🎯 Canal de Hilos de Actividades (`THREADS_CHANNEL_ID`)
- **Propósito**: Donde se crean hilos individuales para cada usuario al registrar su primera actividad
- **Permisos requeridos**: Crear hilos públicos, Gestionar hilos, Enviar mensajes
- **Ejemplo**: `#log-actividades`

#### 💰 Canal de Hilos de Balance (`BALANCE_THREADS_CHANNEL_ID`) ✨ NUEVO
- **Propósito**: Donde se crean hilos individuales para seguimiento de aportes económicos
- **Permisos requeridos**: Crear hilos públicos, Gestionar hilos, Enviar mensajes
- **Ejemplo**: `#hilos-balance`

#### 📝 Canal de Registro (`REGISTER_CHANNEL_ID`)
- **Propósito**: Donde se coloca el mensaje persistente con botones de registro
- **Permisos requeridos**: Enviar mensajes, Usar emojis externos, Usar comandos de aplicación
- **Ejemplo**: `#registro-actividades`

#### 🔔 Canal de Recordatorios (`REMINDERS_CHANNEL_ID`)
- **Propósito**: Donde se envían notificaciones automáticas de actividades programadas
- **Permisos requeridos**: Enviar mensajes, Mencionar @everyone, @here y todos los roles
- **Ejemplo**: `#recordatorios-actividades`

#### 📊 Canal de Informes (`REPORTS_CHANNEL_ID`) ✨ NUEVO
- **Propósito**: Donde se envían informes semanales automáticos y notificaciones de reset de balance
- **Permisos requeridos**: Enviar mensajes, Incrustar enlaces
- **Ejemplo**: `#informes-semanales`

### Configuración de Roles

#### 👥 Rol Supervisor (`SUPERVISOR_ROLE_ID`)
- **Propósito**: Etiquetado en hilos nuevos y notificaciones importantes
- **Permisos sugeridos**: Gestionar mensajes, Ver canales, Enviar mensajes
- **Opcional**: Sí, pero altamente recomendado

#### 🎖️ Rol Líder (`LIDER_ROLE_ID`) ✨ NUEVO
- **Propósito**: Acceso a comandos administrativos sin permisos de administrador completos
- **Permisos especiales**: Comando `!limpiar-todo`, gestión de sistema
- **Opcional**: Sí, útil para delegar responsabilidades

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

#### **Interfaz Principal - Botones Persistentes**
El bot mantiene un mensaje permanente en el canal de registro con:
- 🎯 **Registrar Actividad** - Abre selector de 6 actividades específicas
- 💰 **Aportar** - Abre formulario modal para registrar aportes económicos
- 📊 **Consultar Actividades** - Ver progreso personal completo (actividades + balance)

#### `!balance`
Consulta tu balance semanal personal y estado de cuota.
- **Uso**: `!balance`
- **Descripción**: Muestra cuota restante, total aportado, contribuciones y estado
- **Permisos**: Todos los usuarios
- **Información mostrada**:
  - Balance restante de $50,000
  - Total aportado esta semana
  - Número de contribuciones
  - Estado de cuota (completada/pendiente)

#### `!aportar [monto] [descripción]`
Registra un aporte económico con imagen de evidencia.
- **Uso**: `!aportar 10000 Abastecimiento restaurante La Cocina`
- **Descripción**: Registra aporte con validación fotográfica
- **Permisos**: Todos los usuarios
- **Requiere**: Imagen adjunta como evidencia
- **Sistema**: 50% descuenta de cuota, 50% ganancia personal

#### `!actividades`
Consulta tus actividades registradas.
- **Uso**: `!actividades`
- **Descripción**: Lista todas tus actividades por tipo
- **Permisos**: Todos los usuarios

#### `!cancelar`
Cancela un registro de actividad o aporte en progreso.
- **Uso**: `!cancelar`
- **Descripción**: Limpia datos temporales de registro pendiente
- **Permisos**: Todos los usuarios

### 🔧 Comandos Administrativos/Líderes

#### `!config`
Verifica la configuración completa del bot.
- **Uso**: `!config`
- **Descripción**: Muestra estado de todas las configuraciones y canales
- **Permisos**: Gestionar Mensajes
- **Información mostrada**:
  - Estado de canales configurados
  - Verificación de roles
  - Estado del sistema de eliminación automática
  - Sistemas activos (registro, balance, recordatorios)

#### `!balances`
Ver resumen de todos los balances semanales.
- **Uso**: `!balances`
- **Descripción**: Panel administrativo con estadísticas completas
- **Permisos**: Gestionar Mensajes
- **Información mostrada**:
  - Estadísticas generales (usuarios activos, cuotas completadas)
  - Lista de usuarios con deuda pendiente
  - Lista de usuarios con cuota completada
  - Total aportado por todos los usuarios

#### `!informe`
Genera un reporte manual de actividades y balances.
- **Uso**: `!informe`
- **Descripción**: Reporte completo con estadísticas integradas
- **Permisos**: Gestionar Hilos
- **Contenido**:
  - Estadísticas de actividades
  - Estadísticas de balances semanales
  - Top 3 usuarios destacados
  - Lista completa de usuarios activos

#### `!limpiar-todo`
Limpia TODOS los datos del sistema (IRREVERSIBLE).
- **Uso**: `!limpiar-todo`
- **Descripción**: Elimina todas las actividades, balances, hilos y configuraciones
- **Permisos**: Administrador o Rol Líder
- **Requiere**: Confirmación escribiendo "CONFIRMAR"
- **Elimina**:
  - Todos los hilos de actividades
  - Todos los hilos de balance
  - Todos los registros de actividades
  - Todos los balances y aportes
  - Todos los datos de usuarios

#### `!crear-mensaje`
Crea mensaje persistente en el canal de registro.
- **Uso**: `!crear-mensaje`
- **Descripción**: Genera/actualiza el mensaje con botones persistentes
- **Permisos**: Gestionar Mensajes
- **Nota**: Se verifica automáticamente cada 5 minutos

#### `!test-canal`
Verifica permisos del canal actual.
- **Uso**: `!test-canal`
- **Descripción**: Prueba que el bot pueda funcionar correctamente
- **Permisos**: Gestionar Mensajes

#### `!test-supervisor`
Verifica configuración del rol supervisor.
- **Uso**: `!test-supervisor`
- **Descripción**: Confirma que el rol esté correctamente configurado
- **Permisos**: Gestionar Mensajes

### 🕒 Sistema de Recordatorios (Solo Administradores)

#### `!listar-actividades`
Muestra todas las actividades programadas del sistema.
- **Uso**: `!listar-actividades`
- **Descripción**: Lista actividades con horarios, días y estado (activo/pausado)
- **Permisos**: Gestionar Mensajes

#### `!agregar-actividad`
Agregar nueva actividad programada con recordatorio.
- **Uso**: `!agregar-actividad "Nombre" "HH:MM" "días" "descripción"`
- **Descripción**: Crea actividad con recordatorio automático 10 min antes
- **Permisos**: Gestionar Mensajes
- **Ejemplo**: `!agregar-actividad "Ronda Matutina" "08:00" "lunes,miércoles,viernes" "Patrullaje de seguridad"`

#### `!recordatorios`
Panel de gestión de recordatorios automáticos.
- **Uso**: `!recordatorios`
- **Descripción**: Interface para gestionar actividades programadas
- **Permisos**: Gestionar Mensajes
- **Funciones**: Activar/desactivar recordatorios, ver estadísticas
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

## � Sistema de Balances Semanales ✨ NUEVO

### 📋 Descripción General

El sistema de balances semanales es una funcionalidad avanzada que gestiona las contribuciones económicas de los miembros de Gunfighters. Cada miembro activo recibe una **cuota semanal de $50,000** que debe completar mediante aportes a la organización.

### 🎯 Características Principales

#### **💵 Cuota Semanal**
- **Monto inicial**: $50,000 por miembro por semana
- **Objetivo**: Llegar a $0 mediante aportes económicos
- **Reset automático**: Cada domingo a las 23:59 UTC
- **Seguimiento individual**: Hilo personal para cada usuario

#### **📊 Distribución de Aportes**
- **50% para la organización**: Se descuenta de la cuota semanal
- **50% ganancia personal**: Beneficio del miembro
- **Ejemplo**: Aporte de $10,000 → $5,000 para organización + $5,000 ganancia personal

#### **🧵 Hilos Personalizados de Balance**
- **Canal específico**: `BALANCE_THREADS_CHANNEL_ID`
- **Creación automática**: Al primer aporte del usuario
- **Contenido del hilo**:
  - Registro detallado de cada aporte
  - Evidencias fotográficas
  - Historial de contribuciones
  - Estado actual del balance

### 🔄 Flujo de Trabajo

#### **1. Registro de Aporte**
```
Usuario → Botón "💰 Aportar" → Modal Form → Imagen → Confirmación → Hilo
```

**Paso a paso:**
1. Usuario presiona botón "💰 Aportar" en mensaje persistente
2. Se abre formulario modal con campos:
   - **Monto**: Cantidad del encargo en pesos
   - **Descripción**: Detalle del trabajo realizado
3. Usuario envía imagen como evidencia (5 minutos máximo)
4. Sistema registra aporte y actualiza balance
5. Se envía resumen al hilo personal de balance

#### **2. Comando Alternativo**
```bash
!aportar [monto] [descripción]
# Ejemplo: !aportar 15000 Abastecimiento eléctrico restaurante Central
```

### �📋 Comandos del Sistema de Balance

#### **Para Usuarios**
- `!balance` - Ver estado personal de cuota semanal
- `!aportar [monto] [descripción]` - Registrar aporte con imagen

#### **Para Administradores**
- `!balances` - Resumen completo de todos los usuarios
- `!limpiar-todo` - Incluye limpieza de datos de balance

### 🔧 Configuración Técnica

#### **Variables de Entorno**
```env
# Canal para hilos de balance (requerido)
BALANCE_THREADS_CHANNEL_ID=1422420592052797503

# Canal para informes de reset semanal
REPORTS_CHANNEL_ID=1422420535974826054
```

#### **Estructura de Datos**
```json
{
  "settings": {
    "initialBalance": 50000,
    "organizationPercentage": 50,
    "resetDay": 0,
    "resetHour": 23,
    "resetMinute": 59
  },
  "users": {
    "userId": {
      "currentBalance": 25000,
      "weeklyContributions": {
        "2025-W41": [
          {
            "id": "unique_id",
            "amount": 25000,
            "organizationAmount": 12500,
            "memberAmount": 12500,
            "description": "Trabajo específico",
            "photoUrl": "imagen_evidencia",
            "timestamp": "2025-10-05T20:00:00Z"
          }
        ]
      },
      "balanceThreadId": "thread_id_aquí"
    }
  }
}
```

### 📊 Reportes e Integración

#### **Informes Semanales**
Los balances se integran completamente en los reportes automáticos semanales:
- **Estadísticas generales**: Total aportado, cuotas completadas/pendientes
- **Top usuarios**: Incluye estado de cuota en medallas
- **Listado completo**: Cada usuario muestra balance además de actividades

#### **Reset Semanal Automático**
- **Cuándo**: Cada domingo a las 23:59 UTC
- **Proceso**:
  1. Se resetean todos los balances a $50,000
  2. Se archivan contribuciones de la semana anterior
  3. Se envía notificación al canal de informes
  4. Se actualiza clave de semana del sistema

### 🎨 Interfaz de Usuario

#### **Mensaje Persistente**
Botón dedicado "💰 Aportar" que abre un formulario modal moderno con:
- Campo numérico para monto
- Campo de texto largo para descripción
- Validación automática de datos
- Interfaz responsive y fácil de usar

#### **Consulta de Estado**
Integrado en el botón "📊 Consultar Actividades":
- Balance restante de la cuota
- Total aportado esta semana
- Estado de la cuota (completada/pendiente)
- Número de contribuciones realizadas
- Información de la semana actual

## 📋 Sistema de Registro de Actividades

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

## 🧵 Sistema de Hilos Duales ✨ ACTUALIZADO

### 📋 Descripción General

Gunfighters Bot implementa un **sistema de hilos dual** que proporciona seguimiento separado y organizado para cada usuario:

1. **🎯 Hilos de Actividades** - Para trabajos y tareas tradicionales
2. **💰 Hilos de Balance** - Para aportes económicos y contribuciones

### 🎯 Hilos de Actividades

#### **📍 Ubicación y Configuración**
- **Canal**: `THREADS_CHANNEL_ID` (ej: #log-actividades)
- **Formato del nombre**: `🎯 [Nombre de Usuario] - Actividades`
- **Creación**: Automática al primer registro de actividad
- **Duración**: 7 días de archivo automático

#### **📋 Contenido del Hilo**
- **Mensaje de bienvenida**: Información sobre el sistema de actividades
- **Registros de actividades**: Cada actividad registrada con detalles completos
- **Evidencias fotográficas**: Imágenes reenviadas automáticamente
- **Estadísticas**: Progreso y contadores actualizados

#### **🔄 Flujo de Trabajo**
```
Actividad → Validación → Registro → Hilo de Actividades → Confirmación
```

### 💰 Hilos de Balance ✨ NUEVO

#### **📍 Ubicación y Configuración**
- **Canal**: `BALANCE_THREADS_CHANNEL_ID` (ej: #hilos-balance)
- **Formato del nombre**: `💰 [Nombre de Usuario] - Aportes`
- **Creación**: Automática al primer aporte económico
- **Duración**: 7 días de archivo automático

#### **📋 Contenido del Hilo**
- **Mensaje de bienvenida**: Información sobre el sistema de balances
- **Registros de aportes**: Cada contribución con detalles financieros
- **Evidencias**: Imágenes de trabajos realizados y pagos
- **Estado del balance**: Cuota restante y progreso semanal
- **Historial**: Contribuciones anteriores organizadas por semana

#### **🔄 Flujo de Trabajo**
```
Aporte → Modal/Comando → Validación → Registro → Hilo de Balance → Actualización Cuota
```

### 🛠️ Gestión Automática de Hilos

#### **🔧 Creación Inteligente**
- **Verificación de existencia**: Antes de crear, verifica si ya existe
- **Reutilización**: Si existe un hilo archivado, lo reactiva
- **Nombres únicos**: Basados en el nombre de usuario en el servidor
- **Permisos**: Configuración automática para acceso correcto

#### **👥 Notificaciones a Supervisores**
Al crear hilos nuevos:
1. **Mensaje de notificación**: Etiqueta al rol supervisor configurado
2. **Información del usuario**: Nombre y propósito del hilo
3. **Auto-eliminación**: La notificación se elimina después de 5 segundos
4. **Solo nuevos**: No notifica en hilos reutilizados

#### **🗂️ Organización por Canales**
```
Discord Server
├── #log-actividades (THREADS_CHANNEL_ID)
│   ├── 🎯 Usuario1 - Actividades
│   ├── 🎯 Usuario2 - Actividades
│   └── 🎯 Usuario3 - Actividades
└── #hilos-balance (BALANCE_THREADS_CHANNEL_ID)
    ├── 💰 Usuario1 - Aportes
    ├── 💰 Usuario2 - Aportes
    └── 💰 Usuario3 - Aportes
```

### 📊 Ventajas del Sistema Dual

#### **🎯 Para Actividades Tradicionales**
- **Seguimiento específico**: Solo actividades de trabajo
- **Historial limpio**: Fácil revisión de tareas completadas
- **Evidencias organizadas**: Imágenes y confirmaciones centralizadas
- **Estadísticas claras**: Progreso por tipo de actividad

#### **💰 Para Aportes Económicos**
- **Control financiero**: Seguimiento de contribuciones monetarias
- **Transparencia**: Historial completo de aportes
- **Balance en tiempo real**: Estado actual de cuota semanal
- **Evidencias económicas**: Pruebas de trabajos pagados

#### **🔄 Integración Sistémica**
- **Reportes completos**: Ambos sistemas en informes semanales
- **Consulta unificada**: Botón de consulta muestra ambos estados
- **Limpieza coordinada**: `!limpiar-todo` maneja ambos tipos de hilos
- **Configuración separada**: Canales independientes para mejor organización

### 🔧 Configuración Técnica

#### **Variables Requeridas**
```env
# Hilos de actividades tradicionales
THREADS_CHANNEL_ID=tu_canal_actividades

# Hilos de aportes económicos (NUEVO)
BALANCE_THREADS_CHANNEL_ID=tu_canal_balance

# Rol para notificaciones (opcional)
SUPERVISOR_ROLE_ID=tu_rol_supervisor
```

#### **Permisos de Canal Necesarios**
- **Crear hilos públicos**
- **Gestionar hilos**
- **Enviar mensajes**
- **Adjuntar archivos** (para imágenes)
- **Usar emojis externos**

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

## 🗃️ Base de Datos

### 📄 activities.json
Almacena todos los registros de actividades tradicionales:
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

### 📄 balances.json ✨ NUEVO
Gestiona el sistema de balances semanales y aportes económicos:
```json
{
  "settings": {
    "initialBalance": 50000,
    "organizationPercentage": 50,
    "resetDay": 0,
    "resetHour": 23,
    "resetMinute": 59,
    "lastResetDate": "2025-10-05"
  },
  "users": {
    "123456789": {
      "currentBalance": 25000,
      "weeklyContributions": {
        "2025-W41": [
          {
            "id": "contrib_1728158400_123456789",
            "amount": 25000,
            "organizationAmount": 12500,
            "memberAmount": 12500,
            "description": "Abastecimiento eléctrico restaurante",
            "photoUrl": "https://cdn.discordapp.com/attachments/...",
            "timestamp": "2025-10-05T20:00:00.000Z"
          }
        ]
      },
      "totalContributed": 12500,
      "lastActivity": "2025-10-05T20:00:00.000Z",
      "balanceThreadId": "1422420000000000000"
    }
  },
  "weeklyResets": {
    "2025-W41": "2025-10-06T23:59:00.000Z"
  }
}
```

### 📄 threads.json
Mapea usuarios a sus hilos de actividades correspondientes:
```json
{
  "123456789": "987654321"
}
```

**Nota**: Los hilos de balance se almacenan dentro de `balances.json` en el campo `balanceThreadId` de cada usuario.

### 📄 weeklyReports.json
Guarda los reportes semanales generados con información integrada:
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
    "balanceStats": {
      "totalOrganizationAmount": 125000,
      "completedQuotas": 3,
      "pendingQuotas": 2,
      "contributionsCount": 8
    },
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