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
            .setDescription('**¡Registra tus actividades aquí!**\n\n' +
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
        let commands = '`!help`, `!registro`, `!config`, `!informe`, `!crear-mensaje`';
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
        
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('📊 Consultar Actividades')
            .setDescription(`**Tus actividades esta semana:**\n\n🧹 Limpieza de Espacios: ${activities.limpieza_espacios || 0}\n⚡ Restablecimiento Eléctrico: ${activities.abastecimiento_electrico || 0}\n💼 Asesoramiento Empresarial: ${activities.asesoramiento_empresarial || 0}\n🌱 Servicio de Jardinería: ${activities.jardineria || 0}\n⛽ Mantenimiento de Gasolineras: ${activities.mantenimiento_gasolineras || 0}\n🏢 Limpieza de Rascacielos: ${activities.limpieza_rascacielos || 0}\n\n**Total: ${activities.total} actividades**`)
            .setFooter({ text: 'Registro semanal se reinicia los domingos a las 23:59' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        }

        // Manejar botones del mensaje persistente
        if (interaction.customId.startsWith('persistent_')) {
            if (interaction.customId === 'persistent_consultar_actividades') {
                const activities = getUserActivities(interaction.user.id);
                
                const embed = new EmbedBuilder()
                    .setColor(0x3498db)
                    .setTitle('📊 Tus Actividades Esta Semana')
                    .setDescription(`**Resumen de actividades registradas:**\n\n🧹 Limpieza de Espacios: ${activities.limpieza_espacios || 0}\n⚡ Restablecimiento Eléctrico: ${activities.abastecimiento_electrico || 0}\n💼 Asesoramiento Empresarial: ${activities.asesoramiento_empresarial || 0}\n🌱 Servicio de Jardinería: ${activities.jardineria || 0}\n⛽ Mantenimiento de Gasolineras: ${activities.mantenimiento_gasolineras || 0}\n🏢 Limpieza de Rascacielos: ${activities.limpieza_rascacielos || 0}\n\n**Total: ${activities.total} actividades**`)
                    .setFooter({ text: 'Las estadísticas se reinician cada domingo a las 23:59 UTC' })
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