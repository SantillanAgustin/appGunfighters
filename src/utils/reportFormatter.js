const { EmbedBuilder } = require('discord.js');

/**
 * Formatear el informe semanal para Discord
 */
function formatWeeklyReport(report) {
    const embed = new EmbedBuilder()
        .setTitle('📊 Informe Semanal Completo - Gunfighters')
        .setDescription(`**Semana del ${report.week}**`)
        .setColor(0x0099ff)
        .setTimestamp()
        .setFooter({ text: 'Gunfighters - Sistema Integrado de Actividades y Balances' });

    // Estadísticas generales combinadas
    embed.addFields({
        name: '📈 Estadísticas Generales',
        value: `👥 **Usuarios Activos:** ${report.totalUsers}\n📅 **Total de Actividades:** ${report.totalActivities}\n📊 **Promedio por Usuario:** ${report.totalUsers > 0 ? Math.round(report.totalActivities / report.totalUsers * 100) / 100 : 0}`,
        inline: true
    });

    // Estadísticas de balances si existen
    if (report.balanceStats) {
        const formatMoney = (amount) => new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);

        embed.addFields({
            name: '💰 Estadísticas de Balances',
            value: `💵 **Total Aportado:** ${formatMoney(report.balanceStats.totalOrganizationAmount)}\n✅ **Cuotas Completadas:** ${report.balanceStats.completedQuotas}\n⏳ **Cuotas Pendientes:** ${report.balanceStats.pendingQuotas}\n📋 **Total de Aportes:** ${report.balanceStats.contributionsCount}`,
            inline: true
        });
    }

    // Usuarios de la semana - Top 3 destacados + resto con información de balance
    if (report.userStats.length > 0) {
        let usersText = '';
        
        // Top 3 con medallas especiales
        const topMedals = ['🥇', '🥈', '🥉'];
        const top3 = report.userStats.slice(0, 3);
        
        top3.forEach((user, index) => {
            const balanceInfo = user.balance ? 
                `(Balance: ${user.balance.quotaCompleted ? '✅ Completado' : `⏳ $${user.balance.currentBalance.toLocaleString()}`})` : 
                '';
            usersText += `${topMedals[index]} **${user.username}**: ${user.totalActivities} actividades ${balanceInfo}\n`;
        });
        
        // Resto de usuarios activos (si hay más de 3)
        const restUsers = report.userStats.slice(3);
        if (restUsers.length > 0) {
            usersText += '\n**Otros usuarios activos:**\n';
            restUsers.forEach((user) => {
                const balanceInfo = user.balance ? 
                    `(${user.balance.quotaCompleted ? '✅' : '⏳'})` : 
                    '';
                usersText += `🎖️ **${user.username}**: ${user.totalActivities} actividades ${balanceInfo}\n`;
            });
        }

        embed.addFields({
            name: '🏆 Usuarios de la Semana',
            value: usersText,
            inline: false
        });
    }

    return embed;
}

/**
 * Formatear resumen de una actividad específica
 */
function formatActivitySummary(activityKey, count, username) {
    const activityNames = {
        limpieza_espacios: 'Limpieza de Espacios Públicos',
        abastecimiento_electrico: 'Restablecimiento Eléctrico',
        asesoramiento_empresarial: 'Asesoramiento Empresarial',
        jardineria: 'Servicio de Jardinería',
        mantenimiento_gasolineras: 'Mantenimiento de Gasolineras',
        limpieza_rascacielos: 'Limpieza de Rascacielos'
    };

    const activityEmojis = {
        limpieza_espacios: '🧹',
        abastecimiento_electrico: '⚡',
        asesoramiento_empresarial: '💼',
        jardineria: '🌱',
        mantenimiento_gasolineras: '⛽',
        limpieza_rascacielos: '🏢'
    };

    return `${activityEmojis[activityKey]} **${activityNames[activityKey]}**\n` +
           `👤 Usuario: ${username}\n` +
           `📊 Total esta semana: **${count}** actividades`;
}

/**
 * Crear embed para notificación de supervisor
 */
function createSupervisorEmbed(username, activityKey, photoUrl = null) {
    const activityNames = {
        limpieza_espacios: 'Limpieza de Espacios Públicos',
        abastecimiento_electrico: 'Restablecimiento Eléctrico',
        asesoramiento_empresarial: 'Asesoramiento Empresarial',
        jardineria: 'Servicio de Jardinería',
        mantenimiento_gasolineras: 'Mantenimiento de Gasolineras',
        limpieza_rascacielos: 'Limpieza de Rascacielos'
    };

    const activityEmojis = {
        limpieza_espacios: '🧹',
        abastecimiento_electrico: '⚡',
        asesoramiento_empresarial: '💼',
        jardineria: '🌱',
        mantenimiento_gasolineras: '⛽',
        limpieza_rascacielos: '🏢'
    };

    const embed = new EmbedBuilder()
        .setTitle('🔔 Nueva Actividad Registrada')
        .setDescription(`${activityEmojis[activityKey]} **${activityNames[activityKey]}**`)
        .addFields({
            name: '👤 Usuario',
            value: username,
            inline: true
        }, {
            name: '🕐 Fecha y Hora',
            value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
            inline: true
        })
        .setColor(0x00ff00)
        .setTimestamp();

    if (photoUrl) {
        embed.setImage(photoUrl);
    }

    return embed;
}

/**
 * Crear mensaje de éxito para el usuario
 */
function createSuccessMessage(username, activityKey, weeklyCount) {
    const activityNames = {
        limpieza_espacios: 'Limpieza de Espacios Públicos',
        abastecimiento_electrico: 'Restablecimiento Eléctrico',
        asesoramiento_empresarial: 'Asesoramiento Empresarial',
        jardineria: 'Servicio de Jardinería',
        mantenimiento_gasolineras: 'Mantenimiento de Gasolineras',
        limpieza_rascacielos: 'Limpieza de Rascacielos'
    };

    const activityEmojis = {
        limpieza_espacios: '🧹',
        abastecimiento_electrico: '⚡',
        asesoramiento_empresarial: '💼',
        jardineria: '🌱',
        mantenimiento_gasolineras: '⛽',
        limpieza_rascacielos: '🏢'
    };

    return `✅ **Actividad registrada exitosamente!**\n\n` +
           `${activityEmojis[activityKey]} **${activityNames[activityKey]}**\n` +
           `👤 Usuario: ${username}\n` +
           `📊 Total esta semana: **${weeklyCount}** actividades\n\n` +
           `🎯 ¡Sigue así, buen trabajo!`;
}

module.exports = {
    formatWeeklyReport,
    formatActivitySummary,
    createSupervisorEmbed,
    createSuccessMessage
};