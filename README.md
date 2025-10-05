# 🎯 Gunfighters Discord Bot

Bot automatizado para la organización **Gunfighters** en **GTA V Roleplay** que gestiona el registro de actividades laborales, aportes económicos, crea hilos personalizados y genera reportes semanales automáticos.

## ✨ Características Principales

🎯 **6 Actividades Específicas** - Sistema diseñado para las actividades de Gunfighters  
� **Sistema de Balances Semanales** - Gestión de cuotas de $50,000 con aportes automáticos  
�📊 **Reportes Semanales Automáticos** - Generación automática cada domingo 23:59 UTC (actividades Y balances)  
🧵 **Hilos Personalizados Duales** - Cada usuario tiene hilos para actividades Y aportes económicos  
💬 **Interfaz con Botones Persistentes** - Registro fácil mediante botones y formularios modales  
⏰ **Recordatorios Automáticos** - Notificaciones 10 minutos antes de actividades del sistema  
📸 **Validación por Fotos** - Sistema de verificación mediante imágenes  
🗑️ **Auto-limpieza Inteligente** - Eliminación automática de fotos y confirmaciones  
🔒 **Control de Permisos** - Diferentes niveles según roles de Discord  

## 💰 Sistema de Balances Semanales

| Característica | Descripción |
|----------------|-------------|
| **Cuota Inicial** | $50,000 por semana por miembro |
| **Objetivo** | Llegar a $0 mediante aportes |
| **Distribución** | 50% para organización, 50% ganancia personal |
| **Reset Automático** | Cada domingo 23:59 UTC |
| **Seguimiento** | Hilos personalizados para cada usuario |

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

# CANALES (todos requeridos)
THREADS_CHANNEL_ID=canal_hilos_actividades
BALANCE_THREADS_CHANNEL_ID=canal_hilos_balance  # NUEVO
REGISTER_CHANNEL_ID=canal_registro_actividades
REMINDERS_CHANNEL_ID=canal_recordatorios
REPORTS_CHANNEL_ID=canal_informes_semanales     # NUEVO

# ROLES (opcional pero recomendado)
SUPERVISOR_ROLE_ID=rol_supervisor
LIDER_ROLE_ID=rol_lider                         # NUEVO

# CONFIGURACIONES
AUTO_DELETE_PHOTOS=true
PREFIX=!
```

### 3. Ejecutar
```bash
npm start
```

## 🎮 Comandos

### 👤 Usuarios
- **Botones Persistentes** - Interfaz principal para registro y consultas
- `!balance` - Consultar balance semanal personal
- `!aportar [monto] [descripción]` - Registrar aporte con screenshot
- `!actividades` - Ver actividades registradas
- `!cancelar` - Cancelar registro en progreso

### 🔧 Administradores/Líderes
- `!config` - Verificar configuración del bot
- `!informe` - Generar reporte manual de actividades y balances
- `!balances` - Ver resumen de todos los balances semanales
- `!crear-mensaje` - Crear mensaje persistente en canal de registro
- `!limpiar-todo` - Limpiar TODOS los datos incluyendo balances (IRREVERSIBLE)
- `!test-canal` - Verificar permisos del canal
- `!test-supervisor` - Verificar configuración del rol

### 🕒 Sistema de Recordatorios (Solo Administradores)
- `!listar-actividades` - Ver actividades programadas del sistema
- `!agregar-actividad` - Agregar nueva actividad con recordatorio
- `!recordatorios` - Panel de gestión de recordatorios automáticos

## 📋 Cómo Usar

### **Interfaz Principal - Botones Persistentes**
El bot mantiene un mensaje permanente en el canal de registro con botones para:
- 🎯 **Registrar Actividad** - Abre selector de actividades
- 💰 **Aportar** - Abre formulario modal para aportes
- 📊 **Consultar Actividades** - Ver progreso personal completo

### **Registrar Actividad**
1. **Pulsar "🎯 Registrar Actividad"** en el mensaje persistente
2. **Seleccionar actividad** usando los botones específicos
3. **Enviar las fotos requeridas** en los próximos 5 minutos
4. **Confirmación automática** - El bot registra y crea/actualiza tu hilo personal
5. **Auto-limpieza** - Las fotos se eliminan automáticamente

### **Registrar Aportes Económicos**
1. **Pulsar "� Aportar"** en el mensaje persistente
2. **Rellenar formulario modal**:
   - Monto del encargo en pesos
   - Descripción del trabajo realizado
3. **Enviar imagen** como evidencia en los próximos 5 minutos
4. **Registro automático**:
   - 50% del monto se descuenta de tu cuota semanal
   - 50% queda como ganancia personal
   - Se registra en tu hilo personal de balance

### **Consultar Tu Progreso**
- **Usar el botón "📊 Consultar Actividades"** en el mensaje persistente
- **Ver información completa**:
  - Actividades completadas por tipo
  - Balance restante de la cuota semanal ($50,000 inicial)
  - Total aportado a la organización esta semana
  - Estado de la cuota (completada/pendiente)
  - Número de contribuciones realizadas

### **Hilos Personalizados**
Cada usuario obtiene automáticamente:
- 🎯 **Hilo de Actividades** - Para seguimiento de trabajos
- 💰 **Hilo de Balance** - Para seguimiento de aportes económicos

### Sistema Automático
- ⏰ **Reportes semanales integrados** - Cada domingo 23:59 UTC (actividades Y balances)
- 🔔 **Recordatorios de actividades** - 10 minutos antes de cada actividad del sistema
- � **Reset de balances** - Automático cada domingo con notificación en canal de informes
- �🔄 **Verificación de mensajes** - Cada 5 minutos para mantener interfaz actualizada
- 🧵 **Creación de hilos** - Automática al primer registro (actividades y balance)
- 🗑️ **Limpieza de confirmaciones** - 25 segundos después del registro

## 🏗️ Estructura del Proyecto

```
appGunfighters/
├── src/
│   ├── index.js                 # Bot principal con lógica de interacciones
│   └── utils/
│       ├── activityManager.js   # Gestión de actividades y datos
│       ├── reportFormatter.js   # Formateo de reportes semanales
│       ├── scheduleManager.js   # Sistema de recordatorios automáticos
│       └── balanceManager.js    # Sistema de balances semanales ✨ NUEVO
├── data/
│   ├── activities.json          # Base de datos actividades
│   ├── weeklyReports.json       # Reportes semanales generados
│   ├── threads.json             # Mapeo usuario-hilo de actividades
│   ├── persistentMessages.json  # IDs mensajes persistentes
│   ├── scheduledActivities.json # Actividades programadas del sistema
│   └── balances.json            # Sistema de balances y aportes ✨ NUEVO
└── .env                         # Configuración de canales y roles
```

## 🔧 Tecnologías

- **Node.js** v22.18.0 - Runtime
- **Discord.js** v14.22.1 - API de Discord
- **dotenv** v16.4.7 - Variables de entorno

## 📊 Funcionalidades Avanzadas

### **Reportes Semanales Integrados**
- 🏆 **Top 3 usuarios** con medallas (🥇🥈🥉) + estado de cuota de balance
- 👥 **Lista completa** de usuarios activos con información de balance
- 💰 **Estadísticas financieras** integradas (aportes totales, cuotas completadas/pendientes)
- � **Métricas de actividades** tradicionales
- �📅 **Rango de fechas** automático
- 💾 **Guardado persistente** en JSON
- 🚀 **Envío automático** al canal de informes específico

### **Sistema de Balances Avanzado**
- 💰 **Cuota semanal** de $50,000 por miembro activo
- 🔄 **Reset automático** cada domingo con notificación
- 📈 **Seguimiento individual** con hilos personalizados
- 💸 **Distribución 50/50** (organización/ganancia personal)
- 📊 **Integración completa** en reportes semanales
- 🎯 **Estados visuales** (completado/pendiente)

### **Interfaz de Usuario Mejorada**
- 🔘 **Botones persistentes** en mensaje fijo
- 📝 **Formularios modales** para aportes económicos
- 🎯 **Selectores específicos** para cada actividad
- 📱 **Interfaz responsiva** y fácil de usar
- ⚡ **Respuestas inmediatas** con confirmaciones visuales

### **Gestión de Hilos Dual**
- 🎯 **Hilos de actividades** - Seguimiento de trabajos tradicionales
- 💰 **Hilos de balance** - Seguimiento de aportes económicos
- 🧵 **Creación automática** al primer uso
- 📋 **Organización por canales** específicos
- 🔍 **Búsqueda y acceso** facilitado

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

## ⏰ Sistema de Recordatorios Automáticos

### 🎯 Actividades del Sistema (18 recordatorios diarios)
El bot monitorea automáticamente las actividades del sistema del juego GTA V y envía recordatorios 10 minutos antes de cada una:

#### 🧹 **Limpieza de Espacios Públicos** (4 horarios diarios)
- 00:00-01:00 UTC (recordatorio: 23:50)
- 06:00-07:00 UTC (recordatorio: 05:50)
- 12:00-13:00 UTC (recordatorio: 11:50)
- 21:00-22:00 UTC (recordatorio: 20:50)

#### ⚡ **Restablecimiento Eléctrico** (4 horarios diarios)
- 03:00-04:00 UTC (recordatorio: 02:50)
- 15:00-16:00 UTC (recordatorio: 14:50)
- 18:00-19:00 UTC (recordatorio: 17:50)
- 20:00-21:00 UTC (recordatorio: 19:50)

#### 💼 **Asesoramiento Empresarial** (3 horarios diarios)
- 01:00-02:00 UTC (recordatorio: 00:50)
- 10:00-11:00 UTC (recordatorio: 09:50)
- 13:00-14:00 UTC (recordatorio: 12:50)

#### 🌱 **Servicio de Jardinería** (2 horarios diarios)
- 04:00-05:00 UTC (recordatorio: 03:50)
- 22:00-23:00 UTC (recordatorio: 21:50)

#### ⛽ **Mantenimiento de Gasolineras** (3 horarios diarios)
- 02:00-03:00 UTC (recordatorio: 01:50)
- 08:00-09:00 UTC (recordatorio: 07:50)
- 16:00-17:00 UTC (recordatorio: 15:50)

#### 🏢 **Limpieza de Rascacielos** (2 horarios diarios)
- 09:00-10:00 UTC (recordatorio: 08:50)
- 19:00-20:00 UTC (recordatorio: 18:50)

### 🔧 Gestión de Recordatorios
```bash
# Ver todas las actividades programadas
!listar-actividades

# Agregar nueva actividad
!agregar-actividad "Nombre" "HH:MM" "días" "descripción"

# Gestionar recordatorios
!recordatorios                    # Panel principal
!recordatorios toggle [ID]        # Activar/desactivar
!recordatorios eliminar [ID]      # Eliminar actividad
```

## 💰 Sistema de Balances Semanales

### 🎯 Funcionamiento del Sistema
Cada miembro de Gunfighters tiene un **balance semanal de $50,000** que debe completar:

- 🎮 **Trabajos externos**: Los miembros realizan trabajos fuera de la organización (restaurantes, empresas, etc.)
- 💵 **Aporte obligatorio**: El 50% de las ganancias debe ir a la organización
- 📊 **Cuota semanal**: Al aportar $50,000, el balance queda en $0 (cuota completada)
- 🔄 **Reset automático**: Cada domingo a las 23:59 UTC se reinician los balances

### 🔧 Comandos del Sistema

#### Para Miembros:
```bash
!balance                          # Ver tu balance personal
!aportar [monto] [descripción]    # Registrar aporte (requiere screenshot)
```

#### Para Administradores:
```bash
!balances                         # Resumen de todos los balances
!estadisticas-balance             # Estadísticas detalladas semanales
```

### 📝 Ejemplo de Uso

```bash
# Un miembro trabaja en un restaurante y gana $10,000
!aportar 10000 Trabajo en restaurante La Mesa

# El sistema automáticamente:
# - Descuenta $5,000 del balance ($45,000 restantes)
# - Registra $5,000 para la organización
# - $5,000 quedan para el miembro
```

### 📊 Funcionalidades

- ✅ **Registro con evidencia**: Cada aporte requiere screenshot
- 📈 **Estadísticas automáticas**: Seguimiento de contribuciones semanales
- 🏆 **Rankings**: Top contribuyentes de la semana
- 🔔 **Notificaciones**: Recordatorios automáticos de reset semanal
- 💾 **Persistencia**: Todos los datos se almacenan permanentemente

!recordatorios eliminar [ID]      # Eliminar actividad
```

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
**Última actualización**: Diciembre 2024  
**Versión**: 4.0 - Sistema completo con reportes automáticos, mensajes persistentes, recordatorios de actividades del sistema y balance semanal de cuotas

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