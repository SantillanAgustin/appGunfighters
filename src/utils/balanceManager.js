const fs = require('fs');
const path = require('path');

// Rutas de archivos
const BALANCES_FILE = path.join(__dirname, '../../data/balances.json');

// Configuración del sistema
const INITIAL_BALANCE = 50000; // Balance inicial semanal
const ORGANIZATION_PERCENTAGE = 50; // % que va a la organización

// Cargar balances
function loadBalances() {
    try {
        if (fs.existsSync(BALANCES_FILE)) {
            const data = fs.readFileSync(BALANCES_FILE, 'utf8');
            const parsedData = JSON.parse(data);
            
            // Verificar que la estructura es válida
            if (!parsedData || typeof parsedData !== 'object') {
                throw new Error('Invalid balance data structure');
            }
            
            // Asegurar que las propiedades básicas existen
            if (!parsedData.users) parsedData.users = {};
            if (!parsedData.weeklyStats) parsedData.weeklyStats = {};
            if (!parsedData.settings) {
                parsedData.settings = {
                    initialBalance: INITIAL_BALANCE,
                    organizationPercentage: ORGANIZATION_PERCENTAGE
                };
            }
            
            return parsedData;
        }
        return {
            users: {},
            weeklyStats: {},
            lastReset: null,
            settings: {
                initialBalance: INITIAL_BALANCE,
                organizationPercentage: ORGANIZATION_PERCENTAGE
            }
        };
    } catch (error) {
        console.error('❌ Error al cargar balances, recreando archivo:', error);
        const fallbackData = {
            users: {},
            weeklyStats: {},
            lastReset: null,
            settings: {
                initialBalance: INITIAL_BALANCE,
                organizationPercentage: ORGANIZATION_PERCENTAGE
            }
        };
        
        try {
            // Crear directorio si no existe
            const dir = path.dirname(BALANCES_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(BALANCES_FILE, JSON.stringify(fallbackData, null, 2));
        } catch (writeError) {
            console.error('❌ Error escribiendo archivo de respaldo de balances:', writeError);
        }
        
        return fallbackData;
    }
}

// Guardar balances
function saveBalances(balances) {
    try {
        const dir = path.dirname(BALANCES_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(BALANCES_FILE, JSON.stringify(balances, null, 2));
        return true;
    } catch (error) {
        console.error('❌ Error al guardar balances:', error);
        return false;
    }
}

// Obtener balance de usuario
function getUserBalance(userId) {
    const balances = loadBalances();
    const currentWeek = getCurrentWeekKey();
    
    // Asegurar que la estructura básica existe
    if (!balances.users) {
        balances.users = {};
    }
    
    if (!balances.users[userId]) {
        balances.users[userId] = {
            currentBalance: balances.settings.initialBalance,
            weeklyContributions: {},
            totalContributed: 0,
            lastActivity: new Date().toISOString()
        };
        saveBalances(balances);
    }
    
    // Asegurar que weeklyContributions existe
    if (!balances.users[userId].weeklyContributions) {
        balances.users[userId].weeklyContributions = {};
    }
    
    // Verificar si es una nueva semana
    if (!balances.users[userId].weeklyContributions[currentWeek]) {
        balances.users[userId].currentBalance = balances.settings.initialBalance;
        balances.users[userId].weeklyContributions[currentWeek] = [];
        saveBalances(balances);
    }
    
    return balances.users[userId];
}

// Registrar contribución
function registerContribution(userId, username, displayName, totalAmount, description, photoUrl) {
    const balances = loadBalances();
    const currentWeek = getCurrentWeekKey();
    const organizationAmount = Math.floor(totalAmount * (balances.settings.organizationPercentage / 100));
    const memberAmount = totalAmount - organizationAmount;
    
    // Asegurar que la estructura básica existe
    if (!balances.users) {
        balances.users = {};
    }
    
    // Asegurar que el usuario existe
    if (!balances.users[userId]) {
        balances.users[userId] = {
            currentBalance: balances.settings.initialBalance,
            weeklyContributions: {},
            totalContributed: 0,
            lastActivity: new Date().toISOString()
        };
    }
    
    // Asegurar que weeklyContributions existe
    if (!balances.users[userId].weeklyContributions) {
        balances.users[userId].weeklyContributions = {};
    }
    
    // Verificar si es una nueva semana
    if (!balances.users[userId].weeklyContributions[currentWeek]) {
        balances.users[userId].currentBalance = balances.settings.initialBalance;
        balances.users[userId].weeklyContributions[currentWeek] = [];
    }
    
    // Crear registro de contribución
    const contribution = {
        id: Date.now().toString(),
        totalAmount: totalAmount,
        organizationAmount: organizationAmount,
        memberAmount: memberAmount,
        description: description,
        photoUrl: photoUrl,
        timestamp: new Date().toISOString(),
        week: currentWeek
    };
    
    // Actualizar balance del usuario
    balances.users[userId].currentBalance = Math.max(0, balances.users[userId].currentBalance - organizationAmount);
    balances.users[userId].weeklyContributions[currentWeek].push(contribution);
    balances.users[userId].totalContributed += organizationAmount;
    balances.users[userId].lastActivity = new Date().toISOString();
    balances.users[userId].username = username;
    balances.users[userId].displayName = displayName;
    
    // Actualizar estadísticas semanales
    if (!balances.weeklyStats[currentWeek]) {
        balances.weeklyStats[currentWeek] = {
            totalContributions: 0,
            totalOrganizationAmount: 0,
            totalMemberAmount: 0,
            activeMembers: 0,
            contributionsCount: 0
        };
    }
    
    balances.weeklyStats[currentWeek].totalContributions += totalAmount;
    balances.weeklyStats[currentWeek].totalOrganizationAmount += organizationAmount;
    balances.weeklyStats[currentWeek].totalMemberAmount += memberAmount;
    balances.weeklyStats[currentWeek].contributionsCount += 1;
    
    // Contar miembros activos únicos
    const activeMembers = new Set();
    for (const uid in balances.users) {
        if (balances.users[uid].weeklyContributions[currentWeek] && 
            balances.users[uid].weeklyContributions[currentWeek].length > 0) {
            activeMembers.add(uid);
        }
    }
    balances.weeklyStats[currentWeek].activeMembers = activeMembers.size;
    
    if (saveBalances(balances)) {
        return contribution;
    }
    return null;
}

// Obtener estadísticas semanales
function getWeeklyStats(weekKey = null) {
    const balances = loadBalances();
    const week = weekKey || getCurrentWeekKey();
    
    if (!balances.weeklyStats[week]) {
        return {
            week: week,
            totalContributions: 0,
            totalOrganizationAmount: 0,
            totalMemberAmount: 0,
            activeMembers: 0,
            contributionsCount: 0,
            users: []
        };
    }
    
    // Asegurar que users existe
    if (!balances.users) {
        return {
            week: week,
            totalContributions: 0,
            totalOrganizationAmount: 0,
            totalMemberAmount: 0,
            activeMembers: 0,
            contributionsCount: 0,
            users: []
        };
    }
    
    // Obtener usuarios activos de la semana
    const activeUsers = [];
    for (const userId in balances.users) {
        const user = balances.users[userId];
        if (user.weeklyContributions && user.weeklyContributions[week] && user.weeklyContributions[week].length > 0) {
            const weeklyTotal = user.weeklyContributions[week].reduce((sum, contrib) => sum + contrib.organizationAmount, 0);
            activeUsers.push({
                userId: userId,
                username: user.username || 'Usuario Desconocido',
                displayName: user.displayName || user.username || 'Usuario Desconocido',
                currentBalance: user.currentBalance,
                weeklyContributed: weeklyTotal,
                contributionsCount: user.weeklyContributions[week].length,
                quotaCompleted: user.currentBalance === 0
            });
        }
    }
    
    // Ordenar por contribución total
    activeUsers.sort((a, b) => b.weeklyContributed - a.weeklyContributed);
    
    return {
        ...balances.weeklyStats[week],
        week: week,
        users: activeUsers
    };
}

// Obtener todos los usuarios con sus balances
function getAllUserBalances() {
    const balances = loadBalances();
    const currentWeek = getCurrentWeekKey();
    const userList = [];
    
    // Asegurar que users existe
    if (!balances.users) {
        return userList;
    }
    
    for (const userId in balances.users) {
        const user = balances.users[userId];
        // Verificar que user y sus propiedades existen
        if (!user) continue;
        
        const weeklyContributions = (user.weeklyContributions && user.weeklyContributions[currentWeek]) || [];
        const weeklyTotal = weeklyContributions.reduce((sum, contrib) => sum + contrib.organizationAmount, 0);
        
        userList.push({
            userId: userId,
            username: user.username || 'Usuario Desconocido',
            displayName: user.displayName || user.username || 'Usuario Desconocido',
            currentBalance: user.currentBalance || 0,
            weeklyContributed: weeklyTotal,
            contributionsCount: weeklyContributions.length,
            quotaCompleted: (user.currentBalance || 0) === 0,
            lastActivity: user.lastActivity
        });
    }
    
    // Ordenar por balance restante (mayor a menor)
    userList.sort((a, b) => b.currentBalance - a.currentBalance);
    
    return userList;
}

// Resetear balances semanales
function resetWeeklyBalances() {
    const balances = loadBalances();
    const newWeek = getCurrentWeekKey();
    
    // Resetear balance de todos los usuarios activos
    for (const userId in balances.users) {
        balances.users[userId].currentBalance = balances.settings.initialBalance;
        if (!balances.users[userId].weeklyContributions[newWeek]) {
            balances.users[userId].weeklyContributions[newWeek] = [];
        }
    }
    
    balances.lastReset = new Date().toISOString();
    
    if (saveBalances(balances)) {
        console.log(`✅ Balances semanales reseteados para la semana ${newWeek}`);
        return true;
    }
    return false;
}

// Verificar si es momento de reset semanal
function shouldResetWeeklyBalances() {
    const balances = loadBalances();
    const now = new Date();
    const currentWeek = getCurrentWeekKey();
    
    // Si no hay último reset, es la primera vez
    if (!balances.lastReset) {
        return true;
    }
    
    // Verificar si cambió la semana Y es lunes (día 1) a partir de las 00:00 UTC
    const lastResetDate = new Date(balances.lastReset);
    const lastResetWeek = getWeekKey(lastResetDate);
    
    // Solo resetear si:
    // 1. La semana cambió
    // 2. Es lunes (getUTCDay() === 1)
    // 3. Es a partir de las 00:00 UTC
    const isNewWeek = currentWeek !== lastResetWeek;
    const isMonday = now.getUTCDay() === 1;
    const isAfterMidnight = now.getUTCHours() >= 0; // Siempre true, pero clarifica la lógica
    
    return isNewWeek && isMonday && isAfterMidnight;
}

// Obtener clave de semana actual
function getCurrentWeekKey() {
    return getWeekKey(new Date());
}

// Obtener clave de semana para una fecha específica
function getWeekKey(date) {
    const year = date.getUTCFullYear();
    const weekNumber = getISOWeekNumber(date);
    return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

// Función para calcular número de semana ISO 8601
function getISOWeekNumber(date) {
    const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Obtener número de semana (función obsoleta, mantenida por compatibilidad)
function getWeekNumber(date) {
    return getISOWeekNumber(date);
}

// Actualizar configuración
function updateSettings(newSettings) {
    const balances = loadBalances();
    balances.settings = { ...balances.settings, ...newSettings };
    return saveBalances(balances);
}

// Obtener configuración actual
function getSettings() {
    const balances = loadBalances();
    return balances.settings;
}

// Limpiar todos los datos de balance
function clearAllBalanceData() {
    try {
        const emptyData = {
            users: {},
            weeklyStats: {},
            lastReset: null,
            settings: {
                initialBalance: INITIAL_BALANCE,
                organizationPercentage: ORGANIZATION_PERCENTAGE
            }
        };
        
        fs.writeFileSync(BALANCES_FILE, JSON.stringify(emptyData, null, 2));
        console.log('✅ Todos los datos de balance han sido eliminados');
        return true;
    } catch (error) {
        console.error('❌ Error al limpiar datos de balance:', error);
        return false;
    }
}

// Formatear cantidad de dinero
function formatMoney(amount) {
    return `$${amount.toLocaleString('es-ES')}`;
}

/**
 * Guardar ID de hilo de balance para un usuario
 */
function saveUserBalanceThread(userId, threadId) {
    const balances = loadBalances();
    
    // Asegurar que users existe
    if (!balances.users) {
        balances.users = {};
    }
    
    if (!balances.users[userId]) {
        balances.users[userId] = {
            currentBalance: balances.settings.initialBalance,
            weeklyContributions: {},
            totalContributed: 0,
            lastActivity: new Date().toISOString(),
            balanceThreadId: threadId
        };
    } else {
        balances.users[userId].balanceThreadId = threadId;
    }
    
    return saveBalances(balances);
}

/**
 * Obtener ID de hilo de balance de un usuario
 */
function getUserBalanceThread(userId) {
    const balances = loadBalances();
    
    // Asegurar que users existe
    if (!balances.users || !balances.users[userId]) {
        return null;
    }
    
    return balances.users[userId].balanceThreadId || null;
}

/**
 * Recalcular balances basándose en las contribuciones de la semana actual
 */
function recalculateCurrentBalances() {
    try {
        const balances = loadBalances();
        const currentWeek = getCurrentWeekKey();
        
        console.log(`🔄 Recalculando balances para la semana ${currentWeek}...`);
        
        // Para cada usuario
        for (const userId in balances.users) {
            const user = balances.users[userId];
            const weeklyContributions = user.weeklyContributions[currentWeek] || [];
            
            // Calcular total aportado esta semana (organizationAmount)
            const weeklyTotal = weeklyContributions.reduce((sum, contrib) => sum + contrib.organizationAmount, 0);
            
            // Calcular balance actual: inicial - aportado esta semana
            const newBalance = Math.max(0, balances.settings.initialBalance - weeklyTotal);
            
            console.log(`👤 ${user.displayName || user.username || userId}:`);
            console.log(`   Balance anterior: ${formatMoney(user.currentBalance)}`);
            console.log(`   Aportado esta semana: ${formatMoney(weeklyTotal)}`);
            console.log(`   Balance recalculado: ${formatMoney(newBalance)}`);
            
            // Actualizar balance
            user.currentBalance = newBalance;
        }
        
        // Guardar cambios
        const saved = saveBalances(balances);
        if (saved) {
            console.log('✅ Balances recalculados y guardados exitosamente');
        } else {
            console.error('❌ Error guardando balances recalculados');
        }
        
        return saved;
    } catch (error) {
        console.error('❌ Error recalculando balances:', error);
        return false;
    }
}

module.exports = {
    loadBalances,
    saveBalances,
    getUserBalance,
    registerContribution,
    getWeeklyStats,
    getAllUserBalances,
    resetWeeklyBalances,
    shouldResetWeeklyBalances,
    getCurrentWeekKey,
    updateSettings,
    getSettings,
    clearAllBalanceData,
    formatMoney,
    saveUserBalanceThread,
    getUserBalanceThread,
    recalculateCurrentBalances
};