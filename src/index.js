require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { 
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
    shouldGenerateWeeklyReport,
    markWeeklyReportGenerated,
    savePersistentMessageId,
    getPersistentMessageId
} = require('./utils/activityManager');

const { formatWeeklyReport } = require('./utils/reportFormatter');

// Importar el nuevo módulo de recordatorios
const {
    addScheduledActivity,
    getActivitiesForReminder,
    markReminderAsSent,
    removeScheduledActivity,
    getAllScheduledActivities,
    toggleActivityStatus,
    getDayNames
} = require('./utils/scheduleManager');

// Importar el módulo de gestión de balances
const {
    getUserBalance,
    registerContribution,
    getWeeklyStats,
    getAllUserBalances,
    resetWeeklyBalances,
    shouldResetWeeklyBalances,
    getCurrentWeekKey,
    updateSettings,
    getSettings,
    formatMoney
} = require('./utils/balanceManager');

// Crear el cliente del bot
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Limpiar registros expirados cada minuto
setInterval(cleanExpiredRegistrations, 60000);

// Verificar y generar informes semanales cada minuto
setInterval(checkAndGenerateWeeklyReport, 60000);

// Verificar mensaje persistente cada 5 minutos
setInterval(checkPersistentMessage, 300000);

// Verificar recordatorios de actividades programadas cada minuto
setInterval(checkScheduledReminders, 60000);

// Verificar reset de balances semanales cada minuto
setInterval(checkWeeklyBalanceReset, 60000);

/**
 * Verificar si es momento de generar el informe semanal
 */
async function checkAndGenerateWeeklyReport() {
    try {
        if (shouldGenerateWeeklyReport()) {
            console.log('⏰ Es momento de generar el informe semanal...');
            await generateAndSendWeeklyReport();
        }
    } catch (error) {
        console.error('❌ Error verificando informe semanal:', error);
    }
}

/**
 * Generar y enviar el informe semanal
 */
async function generateAndSendWeeklyReport() {
    try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        if (!guild) {
            console.error('❌ No se pudo encontrar el servidor');
            return;
        }

        const threadsChannel = guild.channels.cache.get(process.env.THREADS_CHANNEL_ID);
        if (!threadsChannel) {
            console.error('❌ No se pudo encontrar el canal de hilos');
            return;
        }

        // Generar el informe
        console.log('📊 Generando informe semanal...');
        const report = generateWeeklyReport();
        
        // Guardar el informe en el historial
        saveWeeklyReport(report);
        
        // Formatear para Discord
        const embed = formatWeeklyReport(report);
        
        // Enviar el informe
        await threadsChannel.send({
            content: '📊 **INFORME SEMANAL DE ACTIVIDADES**\n\n' + 
                    `<@&${process.env.SUPERVISOR_ROLE_ID}> El informe semanal está listo:`,
            embeds: [embed]
        });
        
        // Marcar como generado
        markWeeklyReportGenerated();
        
        console.log('✅ Informe semanal enviado exitosamente');
        
    } catch (error) {
        console.error('❌ Error generando informe semanal:', error);
    }
}

/**
 * Crear el mensaje persistente de registro
 */
async function createPersistentRegisterMessage() {
    try {
        if (!process.env.REGISTER_CHANNEL_ID) {
            console.log('⚠️ REGISTER_CHANNEL_ID no configurado. Mensaje persistente no creado.');
            return;
        }

        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        if (!guild) {
            console.error('❌ No se pudo encontrar el servidor');
            return;
        }

        const registerChannel = guild.channels.cache.get(process.env.REGISTER_CHANNEL_ID);
        if (!registerChannel) {
            console.error('❌ No se pudo encontrar el canal de registro');
            return;
        }

        // Verificación adicional: buscar mensajes existentes del bot en el canal
        try {
            const recentMessages = await registerChannel.messages.fetch({ limit: 5 });
            const existingBotMessage = recentMessages.find(msg => 
                msg.author.id === client.user.id && 
                msg.embeds.length > 0 &&
                msg.embeds[0].title?.includes('Sistema de Registro de Actividades')
            );
            
            if (existingBotMessage) {
                console.log(`⚠️ Ya existe un mensaje persistente (${existingBotMessage.id}), actualizando ID guardado`);
                savePersistentMessageId(existingBotMessage.id);
                return existingBotMessage;
            }
        } catch (fetchError) {
            console.log('⚠️ Error verificando mensajes existentes, continuando...');
        }

        // Crear embed del mensaje persistente
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('🏗️ Sistema de Registro de Actividades - Gunfighters')
            .setDescription('**¡Registra tu servicio comunitario!**\n\n' +
                          '📋 **Actividades disponibles:**\n' +
                          '🧹 Limpieza de Espacios Públicos\n' +
                          '⚡ Restablecimiento Eléctrico\n' +
                          '💼 Asesoramiento Empresarial\n' +
                          '🌱 Servicio de Jardinería\n' +
                          '⛽ Mantenimiento de Gasolineras\n' +
                          '🏢 Limpieza de Rascacielos\n\n' +
                          '🎯 **¿Cómo funciona?**\n' +
                          '1. Haz clic en el botón de la actividad que realizaste\n' +
                          '2. Envía 1 foto como evidencia\n' +
                          '3. ¡Tu actividad será registrada automáticamente!\n\n' +
                          '📊 **Consulta tus estadísticas** con el botón correspondiente.')
            .setFooter({ text: 'Gunfighters - Las estadísticas se reinician cada domingo a las 23:59 HUB' })
            .setTimestamp();

        // Crear botones de actividades
        const activityRow1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('persistent_limpieza_espacios')
                    .setLabel('🧹 Limpieza Espacios')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('persistent_abastecimiento_electrico')
                    .setLabel('⚡ Restablecimiento Eléctrico')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('persistent_asesoramiento_empresarial')
                    .setLabel('💼 Asesoramiento Empresarial')
                    .setStyle(ButtonStyle.Success)
            );

        const activityRow2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('persistent_jardineria')
                    .setLabel('🌱 Servicio de Jardinería')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('persistent_mantenimiento_gasolineras')
                    .setLabel('⛽ Mantenimiento Gasolineras')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('persistent_limpieza_rascacielos')
                    .setLabel('🏢 Limpieza Rascacielos')
                    .setStyle(ButtonStyle.Success)
            );

        const utilityRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('persistent_consultar_actividades')
                    .setLabel('📊 Consultar Mis Actividades')
                    .setStyle(ButtonStyle.Primary)
            );

        // Enviar el mensaje
        const message = await registerChannel.send({
            embeds: [embed],
            components: [activityRow1, activityRow2, utilityRow]
        });

        // Guardar el ID del mensaje
        savePersistentMessageId(message.id);
        console.log(`✅ Mensaje persistente creado exitosamente en #${registerChannel.name} (ID: ${message.id})`);

        return message;

    } catch (error) {
        console.error('❌ Error creando mensaje persistente:', error);
    }
}

/**
 * Verificar y recrear el mensaje persistente si es necesario
 */
async function checkPersistentMessage() {
    try {
        if (!process.env.REGISTER_CHANNEL_ID) return;

        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        if (!guild) return;

        const registerChannel = guild.channels.cache.get(process.env.REGISTER_CHANNEL_ID);
        if (!registerChannel) return;

        const savedMessageId = getPersistentMessageId();
        
        if (savedMessageId) {
            try {
                // Verificar si el mensaje aún existe
                const existingMessage = await registerChannel.messages.fetch(savedMessageId);
                if (existingMessage) {
                    // El mensaje existe, verificar que tenga los botones correctos
                    if (existingMessage.components && existingMessage.components.length > 0) {
                        console.log('✅ Mensaje persistente verificado correctamente');
                        return;
                    } else {
                        console.log('⚠️ Mensaje persistente existe pero sin botones, recreando...');
                    }
                }
            } catch (error) {
                // Solo recrear si específicamente no se encuentra el mensaje
                if (error.code === 10008) { // Unknown Message
                    console.log('🔄 Mensaje persistente no encontrado (eliminado), recreando...');
                } else {
                    console.log(`⚠️ Error verificando mensaje persistente: ${error.message} - No recreando para evitar duplicados`);
                    return; // No recrear en caso de otros errores
                }
            }
        } else {
            console.log('🆕 No hay mensaje persistente guardado, creando uno nuevo...');
        }

        // Antes de crear, verificar que no haya mensajes del bot recientes en el canal
        try {
            const recentMessages = await registerChannel.messages.fetch({ limit: 10 });
            const botMessages = recentMessages.filter(msg => 
                msg.author.id === client.user.id && 
                msg.embeds.length > 0 &&
                msg.embeds[0].title?.includes('Sistema de Registro de Actividades')
            );
            
            if (botMessages.size > 0) {
                const latestBotMessage = botMessages.first();
                console.log(`⚠️ Encontrado mensaje del bot reciente (${latestBotMessage.id}), actualizando ID guardado en lugar de crear duplicado`);
                savePersistentMessageId(latestBotMessage.id);
                return;
            }
        } catch (fetchError) {
            console.log('⚠️ Error verificando mensajes recientes, continuando con creación...');
        }

        // Crear nuevo mensaje persistente solo si no existe uno reciente
        await createPersistentRegisterMessage();

    } catch (error) {
        console.error('❌ Error verificando mensaje persistente:', error);
    }
}

/**
 * Verificar y enviar recordatorios de actividades programadas
 */
async function checkScheduledReminders() {
    try {
        if (!process.env.REMINDERS_CHANNEL_ID) return;

        const activitiesForReminder = getActivitiesForReminder();
        
        if (activitiesForReminder.length === 0) return;

        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        if (!guild) {
            console.error('❌ No se pudo encontrar el servidor para recordatorios');
            return;
        }

        const reminderChannel = guild.channels.cache.get(process.env.REMINDERS_CHANNEL_ID);
        if (!reminderChannel) {
            console.error('❌ No se pudo encontrar el canal de recordatorios');
            return;
        }

        for (const activity of activitiesForReminder) {
            console.log(`⏰ Enviando recordatorio para: ${activity.name}`);
            
            const embed = new EmbedBuilder()
                .setColor(0xff6b35)
                .setTitle('⏰ Recordatorio de Actividad - HORA HUB')
                .setDescription(`**${activity.name}** comenzará en **10 minutos**`)
                .addFields([
                    {
                        name: '🕐 Hora de inicio (UTC)',
                        value: `${activity.activityTime}`,
                        inline: true
                    },
                    {
                        name: '📅 Tipo de evento',
                        value: 'Actividad del Sistema',
                        inline: true
                    }
                ])
                .setFooter({ text: 'Gunfighters - Sistema de Recordatorios' })
                .setTimestamp();

            if (activity.description) {
                embed.addFields([
                    {
                        name: '📝 Descripción',
                        value: activity.description,
                        inline: false
                    }
                ]);
            }

            // Mencionar al rol supervisor si está configurado
            let content = '🔔 **RECORDATORIO DE ACTIVIDAD**';
            if (process.env.SUPERVISOR_ROLE_ID) {
                content += `\n<@&${process.env.SUPERVISOR_ROLE_ID}>`;
            }

            await reminderChannel.send({
                content: content,
                embeds: [embed]
            });

            // Marcar recordatorio como enviado
            markReminderAsSent(activity.id);
        }

    } catch (error) {
        console.error('❌ Error enviando recordatorios:', error);
    }
}

/**
 * Verificar y resetear balances semanales si es necesario
 */
async function checkWeeklyBalanceReset() {
    try {
        if (shouldResetWeeklyBalances()) {
            console.log('⏰ Es momento de resetear los balances semanales...');
            
            if (resetWeeklyBalances()) {
                console.log('✅ Balances semanales reseteados exitosamente');
                
                // Opcional: Enviar notificación al canal de recordatorios
                if (process.env.REMINDERS_CHANNEL_ID) {
                    const guild = client.guilds.cache.get(process.env.GUILD_ID);
                    if (guild) {
                        const reminderChannel = guild.channels.cache.get(process.env.REMINDERS_CHANNEL_ID);
                        if (reminderChannel) {
                            const embed = new EmbedBuilder()
                                .setColor(0x00ff00)
                                .setTitle('💰 Nueva Semana - Balances Reseteados')
                                .setDescription('Los balances semanales han sido reseteados. Todos los miembros activos comienzan con $50,000 de cuota semanal.')
                                .addFields([
                                    {
                                        name: '📅 Semana',
                                        value: getCurrentWeekKey(),
                                        inline: true
                                    },
                                    {
                                        name: '💵 Balance Inicial',
                                        value: formatMoney(50000),
                                        inline: true
                                    },
                                    {
                                        name: '🎯 Objetivo',
                                        value: 'Llegar a $0 mediante aportes',
                                        inline: true
                                    }
                                ])
                                .setFooter({ text: 'Gunfighters - Sistema de Balances' })
                                .setTimestamp();

                            await reminderChannel.send({
                                content: process.env.SUPERVISOR_ROLE_ID ? `<@&${process.env.SUPERVISOR_ROLE_ID}>` : '',
                                embeds: [embed]
                            });
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error('❌ Error verificando reset de balances:', error);
    }
}

/**
 * Crear o obtener hilo para un usuario
 */
async function getOrCreateUserThread(member, originalChannel) {
    const existingThreadId = getUserThread(member.id);
    
    // Obtener el nombre a mostrar (nickname del servidor o nombre de usuario)
    const displayName = member.displayName || member.user.username;
    
    // Determinar el canal donde crear hilos
    let threadsChannel = originalChannel;
    if (process.env.THREADS_CHANNEL_ID) {
        try {
            threadsChannel = await originalChannel.guild.channels.fetch(process.env.THREADS_CHANNEL_ID);
            console.log(`✅ Usando canal específico para hilos: ${threadsChannel.name}`);
        } catch (error) {
            console.log('⚠️ Canal de hilos específico no encontrado, usando canal actual');
            threadsChannel = originalChannel;
        }
    } else {
        console.log('📝 No hay canal específico configurado, usando canal actual');
    }
    
    // Verificar si el hilo existe y está accesible
    if (existingThreadId) {
        try {
            const existingThread = await threadsChannel.threads.fetch(existingThreadId);
            if (existingThread && !existingThread.archived) {
                console.log(`🔄 Reutilizando hilo existente: ${existingThread.name}`);
                return existingThread;
            }
        } catch (error) {
            console.log(`🗑️ Hilo ${existingThreadId} no encontrado o inaccesible, creando uno nuevo`);
        }
    }
    
    // Crear nuevo hilo
    try {
        console.log(`🧵 Creando nuevo hilo para ${displayName} en #${threadsChannel.name}`);
        
        const thread = await threadsChannel.threads.create({
            name: `📊 ${displayName} - Actividades`,
            autoArchiveDuration: 10080, // 7 días
            reason: `Hilo automático para registro de actividades de ${displayName}`
        });
        
        // Guardar el ID del hilo
        saveUserThread(member.id, thread.id);
        console.log(`✅ Hilo creado exitosamente: ${thread.name} (ID: ${thread.id})`);
        
        // Mensaje de bienvenida al hilo
        const welcomeEmbed = new EmbedBuilder()
            .setColor(0xff6b35)
            .setTitle(`🎯 Hilo de Actividades - ${displayName}`)
            .setDescription('Este es tu hilo personal para el registro de actividades de Gunfighters.\n\n**Aquí se registrarán automáticamente:**\n• Todas tus actividades completadas\n• Fotos de prueba\n• Registro de fechas y horas\n\n¡Buen trabajo! ')
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: 'Gunfighters - Sistema de Registro' })
            .setTimestamp();
        
        // Enviar mensaje de bienvenida
        await thread.send({ embeds: [welcomeEmbed] });
        
        // Etiquetar al rol supervisor si está configurado
        if (process.env.SUPERVISOR_ROLE_ID) {
            try {
                const supervisorRole = await threadsChannel.guild.roles.fetch(process.env.SUPERVISOR_ROLE_ID);
                if (supervisorRole) {
                    // Etiquetar el rol en el hilo
                    const supervisorMessage = await thread.send({
                        content: `${supervisorRole} 👋 **Nuevo empleado registrado**\n\n📋 Se ha creado un hilo de actividades para **${displayName}**\n🔔 Serás notificado de todas las actividades registradas aquí`,
                        allowedMentions: { roles: [process.env.SUPERVISOR_ROLE_ID] }
                    });
                    
                    console.log(`👔 Rol supervisor ${supervisorRole.name} etiquetado en el hilo`);
                } else {
                    console.log(`⚠️ Rol supervisor ${process.env.SUPERVISOR_ROLE_ID} no encontrado`);
                }
            } catch (error) {
                console.error('❌ Error al etiquetar rol supervisor:', error);
            }
        }
        
        return thread;
    } catch (error) {
        console.error('❌ Error creando hilo:', error);
        return null;
    }
}

// Evento cuando el bot está listo
client.once('clientReady', async () => {
    console.log(`${client.user.tag} está online!`);
    
    // Crear/verificar mensaje persistente de registro
    setTimeout(async () => {
        await checkPersistentMessage();
    }, 3000); // Esperar 3 segundos para asegurar que todo esté cargado
});

// Evento para manejar mensajes
client.on('messageCreate', async message => {
    // Ignorar mensajes de bots
    if (message.author.bot) return;
    
    // Verificar si el mensaje es del servidor autorizado
    if (message.guild?.id !== process.env.GUILD_ID) return;

    // Verificar si hay un registro pendiente y el mensaje contiene fotos
    const pending = getPendingRegistration(message.author.id);
    if (pending && message.attachments.size > 0) {
        const photos = Array.from(message.attachments.values());
        
        if (photos.length === pending.expectedPhotos) {
            // Registrar la actividad
            const success = registerActivity(
                message.author.id,
                message.member.displayName || message.author.username,
                pending.activityType,
                photos.map(photo => photo.url)
            );
            
            if (success) {
                const activityNames = {
                    'limpieza_espacios': '🧹 Limpieza de Espacios Públicos',
                    'abastecimiento_electrico': '⚡ Restablecimiento Eléctrico',
                    'asesoramiento_empresarial': '💼 Asesoramiento Empresarial',
                    'jardineria': '🌱 Servicio de Jardinería',
                    'mantenimiento_gasolineras': '⛽ Mantenimiento de Gasolineras',
                    'limpieza_rascacielos': '🏢 Limpieza de Rascacielos'
                };
                
                const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle('✅ Actividad Registrada')
                    .setDescription(`${activityNames[pending.activityType]} registrada correctamente.\n\n📸 Foto recibida: ${photos.length}\n⏰ Registrado: <t:${Math.floor(Date.now() / 1000)}:R>`)
                    .setFooter({ text: 'Gunfighters - Solo tú puedes ver este mensaje' })
                    .setTimestamp();
                
                // Enviar confirmación que solo el usuario puede ver (se elimina rápidamente)
                const confirmationMessage = await message.reply({ 
                    content: `<@${message.author.id}>`, 
                    embeds: [embed] 
                });
                
                // Eliminar mensaje de confirmación después de 25 segundos para mantener el canal limpio
                setTimeout(async () => {
                    try {
                        await confirmationMessage.delete();
                        console.log(`🗑️ Confirmación eliminada para ${message.author.tag}`);
                    } catch (error) {
                        console.log(`⚠️ No se pudo eliminar confirmación: ${error.message}`);
                    }
                }, 25000);
                
                // Enviar registro al hilo personal del usuario
                const userThread = await getOrCreateUserThread(message.member, message.channel);
                if (userThread) {
                    const threadEmbed = new EmbedBuilder()
                        .setColor(0x00ff00)
                        .setTitle(`${activityNames[pending.activityType]}`)
                        .setDescription(`**Actividad completada exitosamente**\n\n📅 Fecha: <t:${Math.floor(Date.now() / 1000)}:F>\n📸 Fotos de prueba adjuntas`)
                        .setFooter({ text: 'Registro de actividad' })
                        .setTimestamp();
                    
                    // Enviar embed y fotos al hilo
                    await userThread.send({ embeds: [threadEmbed] });
                    
                    // Reenviar las fotos al hilo
                    for (const photo of photos) {
                        await userThread.send({ 
                            content: `📸 Evidencia de ${activityNames[pending.activityType]}`,
                            files: [photo.url]
                        });
                    }
                }
                
                // Eliminar el mensaje con las fotos para mantener el canal limpio
                if (process.env.AUTO_DELETE_PHOTOS === 'true') {
                    try {
                        await message.delete();
                        console.log(`🧹 Mensaje con fotos eliminado automáticamente de ${message.author.tag}`);
                    } catch (deleteError) {
                        console.log(`⚠️ No se pudo eliminar el mensaje: ${deleteError.message}`);
                    }
                }
            } else {
                await message.reply('❌ Error al registrar la actividad. Inténtalo de nuevo.');
            }
        } else {
            const photoWord = pending.expectedPhotos === 1 ? 'foto' : 'fotos';
            const sentPhotoWord = photos.length === 1 ? 'foto' : 'fotos';
            await message.reply(`❌ Se requiere exactamente ${pending.expectedPhotos} ${photoWord}. Enviaste ${photos.length} ${sentPhotoWord}. Inténtalo de nuevo con \`!registro\`.`);
        }
        return;
    }

    const prefix = process.env.PREFIX || '!';
    
    // Verificar si el mensaje comienza con el prefijo
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();


    
    // Comando help básico
    if (command === 'help') {
        const isAdmin = message.member.permissions.has(PermissionFlagsBits.Administrator);
        const canManageMessages = message.member.permissions.has(PermissionFlagsBits.ManageMessages);
        
        let commands = '`!help`, `!registro`, `!balance`, `!aportar`';
        
        if (canManageMessages) {
            commands += ', `!config`, `!informe`, `!crear-mensaje`, `!recordatorios`, `!agregar-actividad`, `!listar-actividades`, `!balances`, `!estadisticas-balance`';
        }
        
        if (isAdmin) {
            commands += ', `!limpiar-todo` (admin)';
        }
        
        message.reply('Comandos disponibles: ' + commands);
    }

    // Comando para probar configuración del canal de hilos




    // Comando para verificar toda la configuración del bot
    if (command === 'config') {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❌ No tienes permisos para usar este comando.');
        }
        
        // Verificar canal de hilos
        let channelStatus = '';
        if (process.env.THREADS_CHANNEL_ID) {
            try {
                const threadsChannel = await message.guild.channels.fetch(process.env.THREADS_CHANNEL_ID);
                channelStatus = `✅ **${threadsChannel.name}**`;
            } catch (error) {
                channelStatus = `❌ Canal no encontrado`;
            }
        } else {
            channelStatus = `⚠️ No configurado (usa canal actual)`;
        }
        
        // Verificar rol supervisor
        let roleStatus = '';
        if (process.env.SUPERVISOR_ROLE_ID) {
            try {
                const supervisorRole = await message.guild.roles.fetch(process.env.SUPERVISOR_ROLE_ID);
                roleStatus = supervisorRole ? `✅ **${supervisorRole.name}**` : `❌ Rol no encontrado`;
            } catch (error) {
                roleStatus = `❌ Error al verificar rol`;
            }
        } else {
            roleStatus = `⚠️ No configurado`;
        }
        
        // Verificar eliminación automática
        const autoDeleteStatus = process.env.AUTO_DELETE_PHOTOS === 'true' ? '✅ **Activada**' : '❌ **Desactivada**';
        
        const configEmbed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('⚙️ Configuración del Bot Gunfighters')
            .setDescription('Estado actual de todas las configuraciones:')
            .addFields([
                {
                    name: '🧵 Canal de Hilos',
                    value: channelStatus,
                    inline: true
                },
                {
                    name: '👔 Rol Supervisor',
                    value: roleStatus,
                    inline: true
                },
                {
                    name: '🧹 Eliminación Automática',
                    value: autoDeleteStatus,
                    inline: true
                },
                {
                    name: '📊 Sistema de Registro',
                    value: '✅ **Funcionando**\n6 actividades disponibles',
                    inline: false
                },
                {
                    name: '🔧 Comandos Adicionales',
                    value: '`!test-canal` - Verificar canal\n`!test-supervisor` - Verificar rol\n`!cancelar` - Cancelar registro',
                    inline: false
                }
            ])
            .setFooter({ text: 'Gunfighters - Panel de Control' })
            .setTimestamp();
            
        message.reply({ embeds: [configEmbed] });
    }

    // Comando para crear hilo manualmente (solo administradores)


    // Comando para limpiar todos los datos y hilos (SOLO ADMINISTRADORES)
    if (command === 'limpiar-todo') {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ Este comando requiere permisos de administrador.');
        }
        
        // Mensaje de confirmación
        const confirmEmbed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('⚠️ ADVERTENCIA: Limpieza Total')
            .setDescription('**Este comando eliminará:**\n\n🗑️ Todos los hilos de actividades existentes\n📊 Todos los registros de actividades\n👥 Todos los datos de usuarios\n\n**Esta acción NO se puede deshacer.**')
            .addFields([
                {
                    name: '🔴 Para confirmar:',
                    value: 'Responde con `CONFIRMAR` en los próximos 30 segundos'
                },
                {
                    name: '🟢 Para cancelar:',
                    value: 'Responde con cualquier otra cosa o espera 30 segundos'
                }
            ])
            .setFooter({ text: 'Gunfighters - Sistema de Limpieza' })
            .setTimestamp();
        
        await message.reply({ embeds: [confirmEmbed] });
        
        // Esperar confirmación
        const filter = (response) => response.author.id === message.author.id;
        try {
            const collected = await message.channel.awaitMessages({ 
                filter, 
                max: 1, 
                time: 30000, 
                errors: ['time'] 
            });
            
            const response = collected.first();
            
            if (response.content.toUpperCase() === 'CONFIRMAR') {
                // Proceder con la limpieza
                const processingEmbed = new EmbedBuilder()
                    .setColor(0xffa500)
                    .setTitle('🔄 Procesando Limpieza...')
                    .setDescription('Por favor espera mientras se eliminan los hilos y datos...')
                    .setTimestamp();
                
                const processingMessage = await message.reply({ embeds: [processingEmbed] });
                
                let deletedThreadsCount = 0;
                let errors = [];
                
                // Obtener todos los hilos para eliminar
                const threadsToDelete = getAllThreadIds();
                
                // Eliminar hilos de Discord
                if (process.env.THREADS_CHANNEL_ID) {
                    try {
                        const threadsChannel = await message.guild.channels.fetch(process.env.THREADS_CHANNEL_ID);
                        
                        for (const threadInfo of threadsToDelete) {
                            try {
                                const thread = await threadsChannel.threads.fetch(threadInfo.threadId);
                                if (thread) {
                                    await thread.delete('Limpieza administrativa');
                                    deletedThreadsCount++;
                                    console.log(`🗑️ Hilo eliminado: ${threadInfo.username} (${threadInfo.threadId})`);
                                }
                            } catch (error) {
                                errors.push(`${threadInfo.username}: ${error.message}`);
                                console.error(`❌ Error eliminando hilo ${threadInfo.threadId}:`, error);
                            }
                        }
                    } catch (error) {
                        errors.push(`Canal no encontrado: ${error.message}`);
                    }
                }
                
                // Limpiar datos del archivo
                const dataCleared = clearAllData();
                
                // Reporte final
                const resultEmbed = new EmbedBuilder()
                    .setColor(dataCleared && errors.length === 0 ? 0x00ff00 : 0xffa500)
                    .setTitle('✅ Limpieza Completada')
                    .setDescription(`**Resultados de la limpieza:**\n\n🗑️ Hilos eliminados: ${deletedThreadsCount}\n📊 Datos limpiados: ${dataCleared ? 'Sí' : 'Error'}\n❌ Errores: ${errors.length}`)
                    .setFooter({ text: 'Gunfighters - Limpieza Completada' })
                    .setTimestamp();
                
                if (errors.length > 0) {
                    resultEmbed.addFields([{
                        name: '⚠️ Errores encontrados:',
                        value: errors.slice(0, 3).join('\n') + (errors.length > 3 ? `\n... y ${errors.length - 3} más` : '')
                    }]);
                }
                
                await processingMessage.edit({ embeds: [resultEmbed] });
                
            } else {
                await message.reply('❌ Limpieza cancelada.');
            }
            
        } catch (error) {
            await message.reply('⏰ Tiempo agotado. Limpieza cancelada por seguridad.');
        }
    }

    // Comando para generar informe semanal manual
    if (command === 'informe') {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageThreads)) {
            return message.reply('❌ No tienes permisos para generar informes.');
        }

        try {
            const processingEmbed = new EmbedBuilder()
                .setColor(0xffa500)
                .setTitle('📊 Generando Informe...')
                .setDescription('Por favor espera mientras se genera el informe semanal...')
                .setTimestamp();

            const processingMessage = await message.reply({ embeds: [processingEmbed] });

            // Generar el informe
            const report = generateWeeklyReport();
            
            // Guardar el informe en el historial
            saveWeeklyReport(report);
            
            // Formatear para Discord
            const embed = formatWeeklyReport(report);
            
            // Editar el mensaje con el informe
            await processingMessage.edit({
                content: '📊 **INFORME SEMANAL DE ACTIVIDADES** (Generado manualmente)',
                embeds: [embed]
            });
            
            console.log('✅ Informe semanal generado manualmente por:', message.author.tag);
            
        } catch (error) {
            console.error('❌ Error generando informe manual:', error);
            await message.reply('❌ Error al generar el informe. Revisa la configuración del bot.');
        }
    }

    // Comando para crear/recrear mensaje persistente
    if (command === 'crear-mensaje') {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❌ No tienes permisos para crear el mensaje persistente.');
        }

        if (!process.env.REGISTER_CHANNEL_ID) {
            return message.reply('❌ Variable REGISTER_CHANNEL_ID no configurada en el archivo .env');
        }

        try {
            const processingEmbed = new EmbedBuilder()
                .setColor(0xffa500)
                .setTitle('🔄 Creando Mensaje Persistente...')
                .setDescription('Por favor espera mientras se crea el mensaje de registro...')
                .setTimestamp();

            const processingMessage = await message.reply({ embeds: [processingEmbed] });

            // Eliminar mensaje anterior si existe
            const savedMessageId = getPersistentMessageId();
            if (savedMessageId) {
                try {
                    const registerChannel = message.guild.channels.cache.get(process.env.REGISTER_CHANNEL_ID);
                    if (registerChannel) {
                        const oldMessage = await registerChannel.messages.fetch(savedMessageId);
                        if (oldMessage) {
                            await oldMessage.delete();
                            console.log('🗑️ Mensaje persistente anterior eliminado');
                        }
                    }
                } catch (error) {
                    console.log('⚠️ No se pudo eliminar el mensaje anterior (puede que ya no exista)');
                }
            }

            // Crear nuevo mensaje
            const newMessage = await createPersistentRegisterMessage();

            if (newMessage) {
                const successEmbed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle('✅ Mensaje Persistente Creado')
                    .setDescription(`El mensaje de registro ha sido creado exitosamente en <#${process.env.REGISTER_CHANNEL_ID}>`)
                    .addFields([
                        {
                            name: '📝 ID del Mensaje',
                            value: newMessage.id,
                            inline: true
                        },
                        {
                            name: '📍 Canal',
                            value: `<#${process.env.REGISTER_CHANNEL_ID}>`,
                            inline: true
                        }
                    ])
                    .setTimestamp();

                await processingMessage.edit({ embeds: [successEmbed] });
            } else {
                throw new Error('No se pudo crear el mensaje');
            }

        } catch (error) {
            console.error('❌ Error creando mensaje persistente:', error);
            await message.reply('❌ Error al crear el mensaje persistente. Revisa la configuración del bot.');
        }
    }

    // Comando para listar actividades programadas
    if (command === 'listar-actividades') {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❌ No tienes permisos para usar este comando.');
        }

        try {
            const activities = getAllScheduledActivities();
            
            if (activities.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(0xffa500)
                    .setTitle('⏰ Actividades Programadas')
                    .setDescription('No hay actividades programadas actualmente.')
                    .addFields([
                        {
                            name: '📝 Para agregar una actividad:',
                            value: 'Usa el comando `!agregar-actividad`',
                            inline: false
                        }
                    ])
                    .setTimestamp();
                
                return message.reply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('⏰ Actividades Programadas')
                .setDescription(`Se encontraron **${activities.length}** actividades programadas:`)
                .setTimestamp();

            for (const activity of activities) {
                const status = activity.active ? '✅ Activa' : '❌ Desactivada';
                const days = getDayNames(activity.daysOfWeek);
                
                embed.addFields([
                    {
                        name: `${activity.name} (ID: ${activity.id})`,
                        value: `**Estado:** ${status}\n**Hora UTC:** ${activity.timeUTC}\n**Días:** ${days}\n**Descripción:** ${activity.description || 'Sin descripción'}`,
                        inline: false
                    }
                ]);
            }

            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Error listando actividades:', error);
            message.reply('❌ Error al listar las actividades programadas.');
        }
    }

    // Comando para agregar nueva actividad programada
    if (command === 'agregar-actividad') {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❌ No tienes permisos para usar este comando.');
        }

        const args = message.content.split(' ').slice(1).join(' ');
        if (!args) {
            const embed = new EmbedBuilder()
                .setColor(0xffa500)
                .setTitle('⏰ Agregar Actividad Programada')
                .setDescription('**Uso del comando:**')
                .addFields([
                    {
                        name: '📝 Formato:',
                        value: '`!agregar-actividad "Nombre" "HH:MM" "días" "descripción"`',
                        inline: false
                    },
                    {
                        name: '📅 Días de la semana:',
                        value: '0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado\nEjemplo: "1,2,3,4,5" para lunes a viernes',
                        inline: false
                    },
                    {
                        name: '⏰ Ejemplo:',
                        value: '`!agregar-actividad "Limpieza de calles" "14:30" "1,3,5" "Actividad de limpieza semanal"`',
                        inline: false
                    }
                ])
                .setTimestamp();
            
            return message.reply({ embeds: [embed] });
        }

        try {
            // Parsing manual de argumentos con comillas
            const parts = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < args.length; i++) {
                const char = args[i];
                if (char === '"') {
                    if (inQuotes) {
                        parts.push(current);
                        current = '';
                        inQuotes = false;
                    } else {
                        inQuotes = true;
                    }
                } else if (char === ' ' && !inQuotes) {
                    if (current.length > 0) {
                        parts.push(current);
                        current = '';
                    }
                } else {
                    current += char;
                }
            }
            
            if (current.length > 0) {
                parts.push(current);
            }

            if (parts.length < 3) {
                return message.reply('❌ Formato incorrecto. Usa: `!agregar-actividad "Nombre" "HH:MM" "días" "descripción"`');
            }

            const [name, timeUTC, daysStr, description = ''] = parts;

            // Validar formato de hora
            if (!/^\d{2}:\d{2}$/.test(timeUTC)) {
                return message.reply('❌ Formato de hora incorrecto. Usa HH:MM (ej: 14:30)');
            }

            // Validar y parsear días
            const daysArray = daysStr.split(',').map(d => parseInt(d.trim())).filter(d => d >= 0 && d <= 6);
            if (daysArray.length === 0) {
                return message.reply('❌ Días inválidos. Usa números del 0-6 separados por comas (ej: 1,2,3,4,5)');
            }

            const activityData = {
                name,
                timeUTC,
                daysOfWeek: daysArray,
                description
            };

            const newActivity = addScheduledActivity(activityData);
            
            if (newActivity) {
                const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle('✅ Actividad Agregada')
                    .setDescription(`La actividad **${name}** ha sido programada exitosamente.`)
                    .addFields([
                        {
                            name: '🆔 ID',
                            value: newActivity.id,
                            inline: true
                        },
                        {
                            name: '⏰ Hora UTC',
                            value: timeUTC,
                            inline: true
                        },
                        {
                            name: '📅 Días',
                            value: getDayNames(daysArray),
                            inline: false
                        },
                        {
                            name: '📝 Descripción',
                            value: description || 'Sin descripción',
                            inline: false
                        }
                    ])
                    .setFooter({ text: 'Los recordatorios se enviarán 10 minutos antes' })
                    .setTimestamp();

                message.reply({ embeds: [embed] });
            } else {
                message.reply('❌ Error al agregar la actividad. Inténtalo de nuevo.');
            }

        } catch (error) {
            console.error('❌ Error agregando actividad:', error);
            message.reply('❌ Error al procesar el comando. Verifica el formato.');
        }
    }

    // Comando para mostrar/gestionar recordatorios
    if (command === 'recordatorios') {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❌ No tienes permisos para usar este comando.');
        }

        const subcommand = message.content.split(' ')[1];

        if (subcommand === 'eliminar') {
            const activityId = message.content.split(' ')[2];
            if (!activityId) {
                return message.reply('❌ Uso: `!recordatorios eliminar [ID_ACTIVIDAD]`');
            }

            if (removeScheduledActivity(activityId)) {
                message.reply('✅ Actividad eliminada exitosamente.');
            } else {
                message.reply('❌ No se encontró la actividad con ese ID.');
            }
            return;
        }

        if (subcommand === 'toggle') {
            const activityId = message.content.split(' ')[2];
            if (!activityId) {
                return message.reply('❌ Uso: `!recordatorios toggle [ID_ACTIVIDAD]`');
            }

            const updatedActivity = toggleActivityStatus(activityId);
            if (updatedActivity) {
                const status = updatedActivity.active ? 'activada' : 'desactivada';
                message.reply(`✅ Actividad **${updatedActivity.name}** ${status}.`);
            } else {
                message.reply('❌ No se encontró la actividad con ese ID.');
            }
            return;
        }

        // Mostrar información general
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('⏰ Sistema de Recordatorios')
            .setDescription('Gestión de actividades programadas con recordatorios automáticos.')
            .addFields([
                {
                    name: '📋 Comandos disponibles:',
                    value: '`!listar-actividades` - Ver todas las actividades\n`!agregar-actividad` - Agregar nueva actividad\n`!recordatorios eliminar [ID]` - Eliminar actividad\n`!recordatorios toggle [ID]` - Activar/desactivar',
                    inline: false
                },
                {
                    name: '⚙️ Configuración:',
                    value: `**Canal de recordatorios:** ${process.env.REMINDERS_CHANNEL_ID ? `<#${process.env.REMINDERS_CHANNEL_ID}>` : 'No configurado'}\n**Tiempo de aviso:** 10 minutos antes\n**Verificación:** Cada minuto`,
                    inline: false
                }
            ])
            .setFooter({ text: 'Gunfighters - Sistema de Recordatorios' })
            .setTimestamp();

        message.reply({ embeds: [embed] });
    }

    // Comando para ver balance personal
    if (command === 'balance') {
        try {
            const userBalance = getUserBalance(message.author.id);
            const currentWeek = getCurrentWeekKey();
            const weeklyContributions = userBalance.weeklyContributions[currentWeek] || [];
            const weeklyTotal = weeklyContributions.reduce((sum, contrib) => sum + contrib.organizationAmount, 0);
            const settings = getSettings();
            
            const embed = new EmbedBuilder()
                .setColor(userBalance.currentBalance === 0 ? 0x00ff00 : userBalance.currentBalance < 25000 ? 0xffa500 : 0xff0000)
                .setTitle('💰 Tu Balance Semanal')
                .setDescription(`**${message.member.displayName || message.author.username}**\n\nSemana: ${currentWeek}`)
                .addFields([
                    {
                        name: '💵 Balance Restante',
                        value: formatMoney(userBalance.currentBalance),
                        inline: true
                    },
                    {
                        name: '📊 Aportado Esta Semana',
                        value: formatMoney(weeklyTotal),
                        inline: true
                    },
                    {
                        name: '🎯 Estado de Cuota',
                        value: userBalance.currentBalance === 0 ? '✅ Completada' : '⏳ Pendiente',
                        inline: true
                    },
                    {
                        name: '📋 Contribuciones',
                        value: `${weeklyContributions.length} encargos realizados`,
                        inline: true
                    },
                    {
                        name: '⚙️ Configuración',
                        value: `${settings.organizationPercentage}% para la organización`,
                        inline: true
                    },
                    {
                        name: '💡 Información',
                        value: 'Usa `!aportar` para registrar un nuevo encargo',
                        inline: true
                    }
                ])
                .setFooter({ text: 'Los balances se resetean cada domingo a las 23:59 UTC' })
                .setTimestamp();

            if (weeklyContributions.length > 0) {
                const recentContributions = weeklyContributions.slice(-3).map((contrib, index) => {
                    const date = new Date(contrib.timestamp).toLocaleDateString('es-ES');
                    return `**${contrib.description}**: ${formatMoney(contrib.totalAmount)} (Aporte: ${formatMoney(contrib.organizationAmount)}) - ${date}`;
                }).join('\n');
                
                embed.addFields([
                    {
                        name: '📝 Contribuciones Recientes',
                        value: recentContributions,
                        inline: false
                    }
                ]);
            }

            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Error consultando balance:', error);
            message.reply('❌ Error al consultar tu balance.');
        }
    }

    // Comando para registrar aporte
    if (command === 'aportar') {
        try {
            // Verificar si hay adjuntos (screenshots)
            if (message.attachments.size === 0) {
                const embed = new EmbedBuilder()
                    .setColor(0xffa500)
                    .setTitle('📸 Registro de Aporte')
                    .setDescription('**Para registrar un aporte necesitas:**')
                    .addFields([
                        {
                            name: '📝 Formato del comando:',
                            value: '`!aportar [monto] [descripción]`',
                            inline: false
                        },
                        {
                            name: '📸 Screenshot requerido:',
                            value: 'Adjunta una imagen del trabajo realizado y el pago recibido',
                            inline: false
                        },
                        {
                            name: '💰 Ejemplo:',
                            value: '`!aportar 10000 Abastecimiento restaurante La Cocina`',
                            inline: false
                        },
                        {
                            name: '⚙️ Sistema:',
                            value: 'El 50% del monto se descontará automáticamente de tu balance semanal',
                            inline: false
                        }
                    ])
                    .setTimestamp();
                
                return message.reply({ embeds: [embed] });
            }

            const args = message.content.split(' ').slice(1);
            if (args.length < 2) {
                return message.reply('❌ Formato incorrecto. Usa: `!aportar [monto] [descripción]`');
            }

            const amount = parseInt(args[0]);
            if (isNaN(amount) || amount <= 0) {
                return message.reply('❌ El monto debe ser un número válido mayor a 0.');
            }

            const description = args.slice(1).join(' ');
            if (description.length < 5) {
                return message.reply('❌ La descripción debe tener al menos 5 caracteres.');
            }

            // Obtener URL de la primera imagen
            const photoUrl = message.attachments.first().url;
            const settings = getSettings();
            const organizationAmount = Math.floor(amount * (settings.organizationPercentage / 100));
            const memberAmount = amount - organizationAmount;

            // Registrar la contribución
            const contribution = registerContribution(
                message.author.id,
                message.author.username,
                message.member.displayName || message.author.username,
                amount,
                description,
                photoUrl
            );

            if (contribution) {
                // Obtener balance actualizado
                const userBalance = getUserBalance(message.author.id);
                
                const embed = new EmbedBuilder()
                    .setColor(0x00ff00)
                    .setTitle('✅ Aporte Registrado Exitosamente')
                    .setDescription(`**${message.member.displayName || message.author.username}**`)
                    .addFields([
                        {
                            name: '💵 Monto Total del Encargo',
                            value: formatMoney(amount),
                            inline: true
                        },
                        {
                            name: '🏢 Aporte a la Organización',
                            value: formatMoney(organizationAmount),
                            inline: true
                        },
                        {
                            name: '👤 Tu Ganancia',
                            value: formatMoney(memberAmount),
                            inline: true
                        },
                        {
                            name: '💰 Balance Restante',
                            value: formatMoney(userBalance.currentBalance),
                            inline: true
                        },
                        {
                            name: '🎯 Estado de Cuota',
                            value: userBalance.currentBalance === 0 ? '✅ Completada' : '⏳ Pendiente',
                            inline: true
                        },
                        {
                            name: '📝 Descripción',
                            value: description,
                            inline: false
                        }
                    ])
                    .setImage(photoUrl)
                    .setFooter({ text: `ID: ${contribution.id} | Gunfighters - Sistema de Balances` })
                    .setTimestamp();

                const confirmMessage = await message.reply({ embeds: [embed] });

                // Auto-eliminar confirmación después de 30 segundos
                setTimeout(async () => {
                    try {
                        await confirmMessage.delete();
                    } catch (error) {
                        console.log(`⚠️ No se pudo eliminar confirmación de aporte: ${error.message}`);
                    }
                }, 30000);

                // Auto-eliminar la imagen original si está configurado
                if (process.env.AUTO_DELETE_PHOTOS === 'true') {
                    setTimeout(async () => {
                        try {
                            await message.delete();
                        } catch (error) {
                            console.log(`⚠️ No se pudo eliminar imagen de aporte: ${error.message}`);
                        }
                    }, 35000);
                }

            } else {
                message.reply('❌ Error al registrar el aporte. Inténtalo de nuevo.');
            }

        } catch (error) {
            console.error('❌ Error registrando aporte:', error);
            message.reply('❌ Error al procesar el aporte.');
        }
    }

    // Comando para ver todos los balances (administradores)
    if (command === 'balances') {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❌ No tienes permisos para usar este comando.');
        }

        try {
            const allBalances = getAllUserBalances();
            const currentWeek = getCurrentWeekKey();
            const settings = getSettings();

            if (allBalances.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor(0xffa500)
                    .setTitle('💰 Balances Semanales')
                    .setDescription('No hay usuarios con balances registrados.')
                    .setTimestamp();
                
                return message.reply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor(0x3498db)
                .setTitle('💰 Balances Semanales - Resumen')
                .setDescription(`**Semana:** ${currentWeek}\n**Configuración:** ${settings.organizationPercentage}% para la organización`)
                .setTimestamp();

            let completedQuotas = 0;
            let totalContributed = 0;

            // Agrupar usuarios por estado
            const usersWithDebt = [];
            const usersCompleted = [];

            for (const user of allBalances) {
                totalContributed += user.weeklyContributed;
                
                if (user.currentBalance === 0) {
                    completedQuotas++;
                    usersCompleted.push(user);
                } else {
                    usersWithDebt.push(user);
                }
            }

            // Estadísticas generales
            embed.addFields([
                {
                    name: '📊 Estadísticas Generales',
                    value: `**Usuarios activos:** ${allBalances.length}\n**Cuotas completadas:** ${completedQuotas}\n**Total aportado:** ${formatMoney(totalContributed)}`,
                    inline: false
                }
            ]);

            // Usuarios con deuda pendiente
            if (usersWithDebt.length > 0) {
                const debtList = usersWithDebt.slice(0, 10).map(user => {
                    return `**${user.displayName}**: ${formatMoney(user.currentBalance)} restantes (Aportado: ${formatMoney(user.weeklyContributed)})`;
                }).join('\n');
                
                embed.addFields([
                    {
                        name: '⏳ Usuarios con Cuota Pendiente',
                        value: debtList + (usersWithDebt.length > 10 ? `\n... y ${usersWithDebt.length - 10} más` : ''),
                        inline: false
                    }
                ]);
            }

            // Usuarios que completaron la cuota
            if (usersCompleted.length > 0) {
                const completedList = usersCompleted.slice(0, 10).map(user => {
                    return `**${user.displayName}**: ✅ Cuota completa (${user.contributionsCount} aportes)`;
                }).join('\n');
                
                embed.addFields([
                    {
                        name: '✅ Cuotas Completadas',
                        value: completedList + (usersCompleted.length > 10 ? `\n... y ${usersCompleted.length - 10} más` : ''),
                        inline: false
                    }
                ]);
            }

            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Error consultando balances:', error);
            message.reply('❌ Error al consultar los balances.');
        }
    }

    // Comando para ver estadísticas detalladas de balance
    if (command === 'estadisticas-balance') {
        if (!message.member.permissions.has(PermissionFlagsBits.ManageMessages)) {
            return message.reply('❌ No tienes permisos para usar este comando.');
        }

        try {
            const weeklyStats = getWeeklyStats();
            const settings = getSettings();

            const embed = new EmbedBuilder()
                .setColor(0x9b59b6)
                .setTitle('📈 Estadísticas Detalladas de Balances')
                .setDescription(`**Semana:** ${weeklyStats.week}`)
                .addFields([
                    {
                        name: '💰 Totales Financieros',
                        value: `**Total en encargos:** ${formatMoney(weeklyStats.totalContributions)}\n**Aporte a organización:** ${formatMoney(weeklyStats.totalOrganizationAmount)}\n**Ganancia de miembros:** ${formatMoney(weeklyStats.totalMemberAmount)}`,
                        inline: true
                    },
                    {
                        name: '👥 Participación',
                        value: `**Miembros activos:** ${weeklyStats.activeMembers}\n**Total de aportes:** ${weeklyStats.contributionsCount}\n**Promedio por miembro:** ${weeklyStats.activeMembers > 0 ? formatMoney(Math.floor(weeklyStats.totalOrganizationAmount / weeklyStats.activeMembers)) : '$0'}`,
                        inline: true
                    },
                    {
                        name: '⚙️ Configuración',
                        value: `**Balance inicial:** ${formatMoney(settings.initialBalance)}\n**% Organización:** ${settings.organizationPercentage}%\n**% Miembros:** ${100 - settings.organizationPercentage}%`,
                        inline: true
                    }
                ])
                .setTimestamp();

            // Top contribuyentes
            if (weeklyStats.users.length > 0) {
                const topContributors = weeklyStats.users.slice(0, 5).map((user, index) => {
                    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🔸';
                    const status = user.quotaCompleted ? '✅' : '⏳';
                    return `${medal} **${user.displayName}**: ${formatMoney(user.weeklyContributed)} ${status}`;
                }).join('\n');
                
                embed.addFields([
                    {
                        name: '🏆 Top Contribuyentes de la Semana',
                        value: topContributors,
                        inline: false
                    }
                ]);
            }

            message.reply({ embeds: [embed] });

        } catch (error) {
            console.error('❌ Error consultando estadísticas:', error);
            message.reply('❌ Error al consultar las estadísticas.');
        }
    }



    // Comando para mostrar el formulario de registro
    if (command === 'registro') {
        const embed = new EmbedBuilder()
            .setColor(0xff6b35)
            .setTitle('🎯 Sistema de Registro Gunfighters')
            .setDescription('Bienvenido al sistema de registro de actividades.\n\n**¿Cómo registrar?**\n1. Pulsa el botón de la actividad que realizaste\n2. Envía exactamente el número de fotos requeridas\n3. El bot confirmará tu registro\n\n**Importante:**\n• Tienes 5 minutos para enviar tus fotos después de pulsar\n• Si no envías la cantidad correcta, el registro fallará')
            .setFooter({ text: 'Gunfighters - Sistema de Registro' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('registrar_actividad')
                    .setLabel('🏗️ Actividad')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('consultar_actividades')
                    .setLabel('📊 Consultar Actividades')
                    .setStyle(ButtonStyle.Secondary)
            );

        message.reply({ embeds: [embed], components: [row] });
    }
});

// Evento para manejar interacciones de botones
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    // Verificar servidor autorizado
    if (interaction.guild?.id !== process.env.GUILD_ID) return;

    try {
        if (interaction.customId === 'registrar_actividad') {
            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle('🏗️ Registro de Actividad')
                .setDescription('Selecciona el tipo de actividad que realizaste:')
                .setTimestamp();

            const activityRow1 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('actividad_limpieza_espacios')
                        .setLabel('🧹 Limpieza Espacios')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('actividad_abastecimiento_electrico')
                        .setLabel('⚡ Restablecimiento Eléctrico')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('actividad_asesoramiento_empresarial')
                        .setLabel('💼 Asesoramiento Empresarial')
                        .setStyle(ButtonStyle.Success)
                );

            const activityRow2 = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('actividad_jardineria')
                        .setLabel('🌱 Servicio de Jardinería')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('actividad_mantenimiento_gasolineras')
                        .setLabel('⛽ Mantenimiento Gasolineras')
                        .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                        .setCustomId('actividad_limpieza_rascacielos')
                        .setLabel('🏢 Limpieza Rascacielos')
                        .setStyle(ButtonStyle.Success)
                );

            await interaction.reply({ embeds: [embed], components: [activityRow1, activityRow2], flags: MessageFlags.Ephemeral });
        }

        if (interaction.customId === 'consultar_actividades') {
        const activities = getUserActivities(interaction.user.id);
        const userBalance = getUserBalance(interaction.user.id);
        const currentWeek = getCurrentWeekKey();
        const weeklyContributions = userBalance.weeklyContributions[currentWeek] || [];
        const weeklyTotal = weeklyContributions.reduce((sum, contrib) => sum + contrib.organizationAmount, 0);
        
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('📊 Consultar Actividades y Balance')
            .setDescription(`**${interaction.member.displayName || interaction.user.username}**\n\n**🎯 Actividades esta semana:**\n🧹 Limpieza de Espacios: ${activities.limpieza_espacios || 0}\n⚡ Restablecimiento Eléctrico: ${activities.abastecimiento_electrico || 0}\n💼 Asesoramiento Empresarial: ${activities.asesoramiento_empresarial || 0}\n🌱 Servicio de Jardinería: ${activities.jardineria || 0}\n⛽ Mantenimiento de Gasolineras: ${activities.mantenimiento_gasolineras || 0}\n🏢 Limpieza de Rascacielos: ${activities.limpieza_rascacielos || 0}\n\n**📊 Total actividades: ${activities.total}**`)
            .addFields([
                {
                    name: '💰 Balance Semanal',
                    value: `**Restante:** ${formatMoney(userBalance.currentBalance)}\n**Aportado:** ${formatMoney(weeklyTotal)}\n**Estado:** ${userBalance.currentBalance === 0 ? '✅ Completado' : '⏳ Pendiente'}`,
                    inline: true
                },
                {
                    name: '📋 Contribuciones',
                    value: `**Aportes:** ${weeklyContributions.length}\n**Semana:** ${currentWeek}`,
                    inline: true
                }
            ])
            .setFooter({ text: 'Los datos se reinician cada domingo a las 23:59 UTC' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        // Manejar botones del mensaje persistente
        if (interaction.customId.startsWith('persistent_')) {
            if (interaction.customId === 'persistent_consultar_actividades') {
                const activities = getUserActivities(interaction.user.id);
                const userBalance = getUserBalance(interaction.user.id);
                const currentWeek = getCurrentWeekKey();
                const weeklyContributions = userBalance.weeklyContributions[currentWeek] || [];
                const weeklyTotal = weeklyContributions.reduce((sum, contrib) => sum + contrib.organizationAmount, 0);
                
                const embed = new EmbedBuilder()
                    .setColor(userBalance.currentBalance === 0 ? 0x00ff00 : userBalance.currentBalance < 25000 ? 0xffa500 : 0xff0000)
                    .setTitle('📊 Tus Actividades y Balance Esta Semana')
                    .setDescription(`**${interaction.member.displayName || interaction.user.username}**\n\n**🎯 Actividades registradas:**\n🧹 Limpieza de Espacios: ${activities.limpieza_espacios || 0}\n⚡ Restablecimiento Eléctrico: ${activities.abastecimiento_electrico || 0}\n💼 Asesoramiento Empresarial: ${activities.asesoramiento_empresarial || 0}\n🌱 Servicio de Jardinería: ${activities.jardineria || 0}\n⛽ Mantenimiento de Gasolineras: ${activities.mantenimiento_gasolineras || 0}\n🏢 Limpieza de Rascacielos: ${activities.limpieza_rascacielos || 0}\n\n**📊 Total actividades: ${activities.total}**`)
                    .addFields([
                        {
                            name: '💰 Balance Semanal',
                            value: `**Restante:** ${formatMoney(userBalance.currentBalance)}\n**Aportado:** ${formatMoney(weeklyTotal)}`,
                            inline: true
                        },
                        {
                            name: '🎯 Estado de Cuota',
                            value: userBalance.currentBalance === 0 ? '✅ **Completada**' : '⏳ **Pendiente**',
                            inline: true
                        },
                        {
                            name: '📋 Contribuciones',
                            value: `**${weeklyContributions.length}** aportes realizados\n**Semana:** ${currentWeek}`,
                            inline: true
                        }
                    ])
                    .setFooter({ text: 'Los datos se reinician cada domingo a las 23:59 UTC | Usa !aportar para registrar contribuciones' })
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
                return;
            }

            // Manejar registro de actividades desde mensaje persistente
            const activityType = interaction.customId.replace('persistent_', '');
            const activityNames = {
                'limpieza_espacios': '🧹 Limpieza de Espacios Públicos',
                'abastecimiento_electrico': '⚡ Restablecimiento Eléctrico',
                'asesoramiento_empresarial': '💼 Asesoramiento Empresarial',
                'jardineria': '🌱 Servicio de Jardinería',
                'mantenimiento_gasolineras': '⛽ Mantenimiento de Gasolineras',
                'limpieza_rascacielos': '🏢 Limpieza de Rascacielos'
            };

            // Intentar registrar como pendiente
            const registrationResult = addPendingRegistration(interaction.user.id, activityType);
            
            if (!registrationResult.success && registrationResult.existingActivity) {
                // Ya hay un registro pendiente
                const existingActivityName = activityNames[registrationResult.existingActivity];
                const embed = new EmbedBuilder()
                    .setColor(0xff9900)
                    .setTitle('⚠️ Registro Pendiente')
                    .setDescription('Ya tienes un registro en proceso. Completa el anterior antes de iniciar uno nuevo.')
                    .addFields([
                        {
                            name: '📋 Actividad pendiente:',
                            value: `Envía 1 foto para completar: **${existingActivityName}**`
                        },
                        {
                            name: '🔄 ¿Quieres cambiar de actividad?',
                            value: 'Usa el comando `!cancelar` y vuelve a intentar'
                        }
                    ])
                    .setTimestamp();

                await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
                return;
            }

            if (!registrationResult.success) {
                await interaction.reply({ content: '❌ Error al procesar el registro. Inténtalo de nuevo.', flags: MessageFlags.Ephemeral });
                return;
            }

            // Registro exitoso
            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle('📸 Envía tu Evidencia')
                .setDescription(`📸 **Envía exactamente 1 foto** como prueba de tu ${activityNames[activityType].toLowerCase()}\n\n⏰ Tienes **5 minutos** para enviar la foto.\n🔒 Solo será válida la foto enviada por ti en este canal.\n\n✅ **Registro iniciado correctamente**`)
                .setFooter({ text: 'Gunfighters - Sistema de Actividades' })
                .setTimestamp();

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
            console.log(`${interaction.user.tag} inició registro de ${activityType} desde mensaje persistente`);
            return;
        }

        // Manejar registro de actividades específicas (comando !registro)
        if (interaction.customId.startsWith('actividad_')) {
        const activityType = interaction.customId.replace('actividad_', '');
        const activityNames = {
            'limpieza_espacios': '🧹 Limpieza de Espacios Públicos',
            'abastecimiento_electrico': '⚡ Restablecimiento Eléctrico',
            'asesoramiento_empresarial': '💼 Asesoramiento Empresarial',
            'jardineria': '🌱 Servicio de Jardinería',
            'mantenimiento_gasolineras': '⛽ Mantenimiento de Gasolineras',
            'limpieza_rascacielos': '🏢 Limpieza de Rascacielos'
        };

        // Intentar registrar como pendiente
        const registrationResult = addPendingRegistration(interaction.user.id, activityType);
        
        if (!registrationResult.success && registrationResult.existingActivity) {
            // Ya hay un registro pendiente
            const existingActivityName = activityNames[registrationResult.existingActivity];
            const timeElapsed = Math.floor((Date.now() - registrationResult.timestamp) / 1000);
            
            const conflictEmbed = new EmbedBuilder()
                .setColor(0xff9500)
                .setTitle('⚠️ Registro Pendiente Existente')
                .setDescription(`Ya tienes un registro pendiente de **${existingActivityName}** desde hace ${timeElapsed} segundos.\n\n**¿Qué quieres hacer?**`)
                .addFields([
                    {
                        name: '🔄 Continuar con el registro anterior',
                        value: `Envía 1 foto para completar: **${existingActivityName}**`
                    },
                    {
                        name: '🆕 Cancelar y empezar nuevo registro',
                        value: `Presiona el botón de **${activityNames[activityType]}** nuevamente`
                    }
                ])
                .setFooter({ text: 'Los registros expiran automáticamente en 5 minutos' })
                .setTimestamp();
                
            await interaction.reply({ embeds: [conflictEmbed], flags: MessageFlags.Ephemeral });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(`${activityNames[activityType]} - Registro Iniciado`)
            .setDescription(`📸 **Envía exactamente 1 foto** como prueba de tu ${activityNames[activityType].toLowerCase()}\n\n⏰ Tienes **5 minutos** para enviar la foto.\n🔒 Solo será válida la foto enviada por ti en este canal.\n\n✅ **Registro iniciado correctamente**`)
            .setFooter({ text: 'Gunfighters - Sistema de Registro' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        console.log(`${interaction.user.tag} inició registro de ${activityType}`);
        }
    } catch (error) {
        console.error('Error en interacción:', error);
        
        // Solo responder si no se ha respondido ya
        if (!interaction.replied && !interaction.deferred) {
            try {
                await interaction.reply({ 
                    content: '❌ Error al procesar la solicitud. Inténtalo de nuevo.', 
                    flags: MessageFlags.Ephemeral 
                });
            } catch (replyError) {
                console.error('Error al enviar mensaje de error:', replyError);
            }
        }
    }
});

// Iniciar el bot
client.login(process.env.DISCORD_TOKEN);