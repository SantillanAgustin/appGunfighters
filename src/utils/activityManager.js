const fs = require('fs');
const path = require('path');
const { getWeeklyStats, getAllUserBalances } = require('./balanceManager');

const dataPath = path.join(__dirname, '..', '..', 'data', 'activities.json');

/**
 * Cargar datos del archivo JSON
 */
function loadData() {
    try {
        // Crear directorio data si no existe
        const dataDir = path.dirname(dataPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // Crear archivo si no existe
        if (!fs.existsSync(dataPath)) {
            const initialData = {
                users: {},
                weeklyReports: {},
                currentWeek: getCurrentWeek(),
                pendingRegistrations: {}
            };
            fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
            return initialData;
        }
        
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error cargando datos:', error);
        return {
            users: {},
            weeklyReports: {},
            currentWeek: getCurrentWeek(),
            pendingRegistrations: {}
        };
    }
}

/**
 * Guardar datos al archivo JSON
 */
function saveData(data) {
    try {
        // Crear directorio data si no existe
        const dataDir = path.dirname(dataPath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error guardando datos:', error);
        return false;
    }
}

/**
 * Obtener la semana actual en formato YYYY-WW
 */
function getCurrentWeek() {
    const date = new Date();
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
}

/**
 * Registrar una actividad para un usuario
 */
function registerActivity(userId, username, activityType, proofImages) {
    const data = loadData();
    const currentWeek = getCurrentWeek();
    
    // Inicializar usuario si no existe
    if (!data.users[userId]) {
        data.users[userId] = {
            username: username,
            activities: {}
        };
    }
    
    // Inicializar semana si no existe
    if (!data.users[userId].activities[currentWeek]) {
        data.users[userId].activities[currentWeek] = {
            limpieza_espacios: 0,
            abastecimiento_electrico: 0,
            asesoramiento_empresarial: 0,
            jardineria: 0,
            mantenimiento_gasolineras: 0,
            limpieza_rascacielos: 0,
            history: []
        };
    }
    
    // Registrar actividad
    data.users[userId].activities[currentWeek][activityType]++;
    data.users[userId].activities[currentWeek].history.push({
        type: activityType,
        timestamp: new Date().toISOString(),
        proofImages: proofImages
    });
    
    data.currentWeek = currentWeek;
    
    return saveData(data);
}

/**
 * Obtener actividades de un usuario para la semana actual
 */
function getUserActivities(userId) {
    const data = loadData();
    const currentWeek = getCurrentWeek();
    
    if (!data.users[userId] || !data.users[userId].activities[currentWeek]) {
        return {
            limpieza_espacios: 0,
            abastecimiento_electrico: 0,
            asesoramiento_empresarial: 0,
            jardineria: 0,
            mantenimiento_gasolineras: 0,
            limpieza_rascacielos: 0,
            total: 0
        };
    }
    
    const activities = data.users[userId].activities[currentWeek];
    const total = activities.limpieza_espacios + activities.abastecimiento_electrico + 
                  activities.asesoramiento_empresarial + activities.jardineria + 
                  activities.mantenimiento_gasolineras + activities.limpieza_rascacielos;
    
    return {
        limpieza_espacios: activities.limpieza_espacios,
        abastecimiento_electrico: activities.abastecimiento_electrico,
        asesoramiento_empresarial: activities.asesoramiento_empresarial,
        jardineria: activities.jardineria,
        mantenimiento_gasolineras: activities.mantenimiento_gasolineras,
        limpieza_rascacielos: activities.limpieza_rascacielos,
        total: total
    };
}

/**
 * Agregar registro pendiente (esperando fotos)
 */
function addPendingRegistration(userId, activityType) {
    const data = loadData();
    
    // Verificar si ya existe un registro pendiente
    const existingPending = data.pendingRegistrations[userId];
    if (existingPending) {
        // Devolver información sobre el registro existente
        return {
            success: false,
            existingActivity: existingPending.activityType,
            timestamp: existingPending.timestamp
        };
    }
    
    data.pendingRegistrations[userId] = {
        activityType: activityType,
        timestamp: Date.now(),
        expectedPhotos: 1
    };
    
    const saved = saveData(data);
    return {
        success: saved,
        existingActivity: null
    };
}

/**
 * Forzar reemplazo de registro pendiente
 */
function forceReplacePendingRegistration(userId, activityType) {
    const data = loadData();
    data.pendingRegistrations[userId] = {
        activityType: activityType,
        timestamp: Date.now(),
        expectedPhotos: 1
    };
    return saveData(data);
}

/**
 * Obtener y eliminar registro pendiente
 */
function getPendingRegistration(userId) {
    const data = loadData();
    const pending = data.pendingRegistrations[userId];
    
    if (pending) {
        delete data.pendingRegistrations[userId];
        saveData(data);
    }
    
    return pending;
}

/**
 * Limpiar registros pendientes expirados (más de 5 minutos)
 */
function cleanExpiredRegistrations() {
    const data = loadData();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    for (const userId in data.pendingRegistrations) {
        if (now - data.pendingRegistrations[userId].timestamp > fiveMinutes) {
            delete data.pendingRegistrations[userId];
        }
    }
    
    saveData(data);
}

/**
 * Guardar ID de hilo para un usuario
 */
function saveUserThread(userId, threadId) {
    const data = loadData();
    
    if (!data.users[userId]) {
        data.users[userId] = {
            username: '',
            activities: {},
            threadId: threadId
        };
    } else {
        data.users[userId].threadId = threadId;
    }
    
    return saveData(data);
}

/**
 * Obtener ID de hilo de un usuario
 */
function getUserThread(userId) {
    const data = loadData();
    return data.users[userId]?.threadId || null;
}

/**
 * Limpiar todos los datos (CUIDADO: Esta función elimina todo)
 */
function clearAllData() {
    try {
        const initialData = {
            users: {},
            weeklyReports: {},
            currentWeek: getCurrentWeek(),
            pendingRegistrations: {}
        };
        
        fs.writeFileSync(dataPath, JSON.stringify(initialData, null, 2));
        console.log('✅ Todos los datos han sido limpiados');
        return true;
    } catch (error) {
        console.error('❌ Error limpiando datos:', error);
        return false;
    }
}

/**
 * Obtener todos los IDs de hilos para eliminar
 */
function getAllThreadIds() {
    const data = loadData();
    const threadIds = [];
    
    for (const userId in data.users) {
        if (data.users[userId].threadId) {
            threadIds.push({
                userId: userId,
                username: data.users[userId].username,
                threadId: data.users[userId].threadId
            });
        }
    }
    
    return threadIds;
}

/**
 * Generar informe semanal completo
 */
function generateWeeklyReport(week = null) {
    const data = loadData();
    const targetWeek = week || getCurrentWeek();
    
    // Obtener estadísticas de balance para la semana
    const balanceStats = getWeeklyStats();
    const allBalances = getAllUserBalances();
    
    const report = {
        week: targetWeek,
        totalUsers: 0,
        totalActivities: 0,
        activityStats: {
            limpieza_espacios: 0,
            abastecimiento_electrico: 0,
            asesoramiento_empresarial: 0,
            jardineria: 0,
            mantenimiento_gasolineras: 0,
            limpieza_rascacielos: 0
        },
        userStats: [],
        // Nuevas estadísticas de balance
        balanceStats: {
            totalContributions: balanceStats.totalContributions,
            totalOrganizationAmount: balanceStats.totalOrganizationAmount,
            activeMembers: balanceStats.activeMembers,
            contributionsCount: balanceStats.contributionsCount,
            completedQuotas: allBalances.filter(user => user.currentBalance === 0).length,
            pendingQuotas: allBalances.filter(user => user.currentBalance > 0).length
        },
        generatedAt: new Date().toISOString()
    };
    
    // Procesar cada usuario
    for (const userId in data.users) {
        const user = data.users[userId];
        const weekActivities = user.activities[targetWeek];
        
        // Buscar datos de balance del usuario
        const userBalance = allBalances.find(balance => balance.userId === userId);
        
        if (weekActivities) {
            const userTotal = Object.keys(report.activityStats).reduce((sum, activity) => {
                const count = weekActivities[activity] || 0;
                report.activityStats[activity] += count;
                return sum + count;
            }, 0);
            
            if (userTotal > 0) {
                report.totalUsers++;
                report.totalActivities += userTotal;
                
                report.userStats.push({
                    userId: userId,
                    username: user.username,
                    totalActivities: userTotal,
                    activities: { ...report.activityStats },
                    // Agregar datos de balance
                    balance: {
                        currentBalance: userBalance ? userBalance.currentBalance : 50000,
                        weeklyContributed: userBalance ? userBalance.weeklyContributed : 0,
                        contributionsCount: userBalance ? userBalance.contributionsCount : 0,
                        quotaCompleted: userBalance ? userBalance.currentBalance === 0 : false
                    }
                });
            }
        }
    }
    
    // Ordenar por rendimiento (mayor a menor actividades)
    report.userStats.sort((a, b) => b.totalActivities - a.totalActivities);
    
    return report;
}

/**
 * Guardar informe semanal en historial
 */
function saveWeeklyReport(report) {
    try {
        const data = loadData();
        if (!data.weeklyReports) {
            data.weeklyReports = {};
        }
        
        data.weeklyReports[report.week] = report;
        return saveData(data);
    } catch (error) {
        console.error('❌ Error guardando informe semanal:', error);
        return false;
    }
}

/**
 * Obtener fecha y hora del próximo domingo a las 23:59 UTC
 */
function getNextSundayEndTime() {
    const now = new Date();
    const nextSunday = new Date(now);
    
    // Calcular días hasta el próximo domingo (0 = domingo)
    const daysUntilSunday = (7 - now.getUTCDay()) % 7;
    if (daysUntilSunday === 0 && now.getUTCHours() < 23) {
        // Es domingo pero antes de las 23:59, usar el mismo día
        nextSunday.setUTCDate(now.getUTCDate());
    } else {
        // Ir al próximo domingo
        nextSunday.setUTCDate(now.getUTCDate() + (daysUntilSunday || 7));
    }
    
    // Establecer hora a 23:59:00 UTC
    nextSunday.setUTCHours(23, 59, 0, 0);
    
    return nextSunday;
}

/**
 * Verificar si es tiempo de generar el informe semanal
 */
function shouldGenerateWeeklyReport() {
    const now = new Date();
    const data = loadData();
    
    // Verificar si es domingo entre 23:59 y 00:00 UTC
    const isDayToGenerate = now.getUTCDay() === 0 && now.getUTCHours() === 23 && now.getUTCMinutes() >= 59;
    
    // Verificar si ya se generó esta semana
    const currentWeek = getCurrentWeek();
    const lastReportWeek = data.lastReportGenerated;
    
    return isDayToGenerate && lastReportWeek !== currentWeek;
}

/**
 * Marcar que se generó el informe de esta semana
 */
function markWeeklyReportGenerated() {
    try {
        const data = loadData();
        data.lastReportGenerated = getCurrentWeek();
        return saveData(data);
    } catch (error) {
        console.error('❌ Error marcando informe generado:', error);
        return false;
    }
}

/**
 * Guardar ID del mensaje persistente de registro
 */
function savePersistentMessageId(messageId) {
    try {
        const data = loadData();
        data.persistentMessageId = messageId;
        return saveData(data);
    } catch (error) {
        console.error('❌ Error guardando ID del mensaje persistente:', error);
        return false;
    }
}

/**
 * Obtener ID del mensaje persistente de registro
 */
function getPersistentMessageId() {
    try {
        const data = loadData();
        return data.persistentMessageId || null;
    } catch (error) {
        console.error('❌ Error obteniendo ID del mensaje persistente:', error);
        return null;
    }
}

module.exports = {
    loadData,
    saveData,
    getCurrentWeek,
    registerActivity,
    getUserActivities,
    addPendingRegistration,
    forceReplacePendingRegistration,
    getPendingRegistration,
    cleanExpiredRegistrations,
    saveUserThread,
    getUserThread,
    clearAllData,
    getAllThreadIds,
    generateWeeklyReport,
    saveWeeklyReport,
    getNextSundayEndTime,
    shouldGenerateWeeklyReport,
    markWeeklyReportGenerated,
    savePersistentMessageId,
    getPersistentMessageId
};