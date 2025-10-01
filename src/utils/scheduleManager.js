const fs = require('fs');
const path = require('path');

// Rutas de archivos
const SCHEDULED_ACTIVITIES_FILE = path.join(__dirname, '../../data/scheduledActivities.json');

// Cargar actividades programadas
function loadScheduledActivities() {
    try {
        if (fs.existsSync(SCHEDULED_ACTIVITIES_FILE)) {
            const data = fs.readFileSync(SCHEDULED_ACTIVITIES_FILE, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error('❌ Error al cargar actividades programadas:', error);
        return [];
    }
}

// Guardar actividades programadas
function saveScheduledActivities(activities) {
    try {
        const dir = path.dirname(SCHEDULED_ACTIVITIES_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(SCHEDULED_ACTIVITIES_FILE, JSON.stringify(activities, null, 2));
        return true;
    } catch (error) {
        console.error('❌ Error al guardar actividades programadas:', error);
        return false;
    }
}

// Agregar nueva actividad programada
function addScheduledActivity(activityData) {
    const activities = loadScheduledActivities();
    
    const newActivity = {
        id: Date.now().toString(),
        name: activityData.name,
        description: activityData.description || '',
        timeUTC: activityData.timeUTC, // Formato: "HH:MM"
        daysOfWeek: activityData.daysOfWeek || [0, 1, 2, 3, 4, 5, 6], // 0=Domingo, 1=Lunes, etc.
        reminderSent: {}, // Para trackear recordatorios enviados por día
        active: true,
        createdAt: new Date().toISOString()
    };
    
    activities.push(newActivity);
    
    if (saveScheduledActivities(activities)) {
        return newActivity;
    }
    return null;
}

// Obtener actividades que necesitan recordatorio
function getActivitiesForReminder() {
    const activities = loadScheduledActivities();
    const now = new Date();
    const currentDay = now.getUTCDay();
    const currentTime = now.getUTCHours().toString().padStart(2, '0') + ':' + now.getUTCMinutes().toString().padStart(2, '0');
    const todayKey = now.toISOString().split('T')[0]; // YYYY-MM-DD
    
    const activitiesNeedingReminder = [];
    
    for (const activity of activities) {
        if (!activity.active) continue;
        if (!activity.daysOfWeek.includes(currentDay)) continue;
        if (activity.reminderSent[todayKey]) continue; // Ya se envió recordatorio hoy
        
        // Calcular tiempo de la actividad
        const [activityHour, activityMinute] = activity.timeUTC.split(':').map(Number);
        const activityDate = new Date();
        activityDate.setUTCHours(activityHour, activityMinute, 0, 0);
        
        // Calcular tiempo de recordatorio (10 minutos antes)
        const reminderDate = new Date(activityDate.getTime() - 10 * 60 * 1000);
        const reminderTime = reminderDate.getUTCHours().toString().padStart(2, '0') + ':' + reminderDate.getUTCMinutes().toString().padStart(2, '0');
        
        // Verificar si es hora del recordatorio
        if (currentTime === reminderTime) {
            activitiesNeedingReminder.push({
                ...activity,
                activityTime: activity.timeUTC,
                reminderTime: reminderTime
            });
        }
    }
    
    return activitiesNeedingReminder;
}

// Marcar recordatorio como enviado
function markReminderAsSent(activityId) {
    const activities = loadScheduledActivities();
    const todayKey = new Date().toISOString().split('T')[0];
    
    const activityIndex = activities.findIndex(a => a.id === activityId);
    if (activityIndex !== -1) {
        if (!activities[activityIndex].reminderSent) {
            activities[activityIndex].reminderSent = {};
        }
        activities[activityIndex].reminderSent[todayKey] = true;
        saveScheduledActivities(activities);
        return true;
    }
    return false;
}

// Eliminar actividad programada
function removeScheduledActivity(activityId) {
    const activities = loadScheduledActivities();
    const filteredActivities = activities.filter(a => a.id !== activityId);
    
    if (filteredActivities.length !== activities.length) {
        saveScheduledActivities(filteredActivities);
        return true;
    }
    return false;
}

// Obtener todas las actividades programadas
function getAllScheduledActivities() {
    return loadScheduledActivities();
}

// Togglear estado activo de una actividad
function toggleActivityStatus(activityId) {
    const activities = loadScheduledActivities();
    const activityIndex = activities.findIndex(a => a.id === activityId);
    
    if (activityIndex !== -1) {
        activities[activityIndex].active = !activities[activityIndex].active;
        saveScheduledActivities(activities);
        return activities[activityIndex];
    }
    return null;
}

// Obtener nombres de días de la semana
function getDayNames(daysArray) {
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return daysArray.map(day => dayNames[day]).join(', ');
}

module.exports = {
    loadScheduledActivities,
    saveScheduledActivities,
    addScheduledActivity,
    getActivitiesForReminder,
    markReminderAsSent,
    removeScheduledActivity,
    getAllScheduledActivities,
    toggleActivityStatus,
    getDayNames
};