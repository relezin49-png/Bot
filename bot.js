const mineflayer = require('mineflayer');

function createBot() {
    const bot = mineflayer.createBot({
        host: 'redezinbr.aternos.me', // <--- REEMPLAZA ESTO POR LA IP DE TU SERVER
        port:  14510,                // Puerto predeterminado de Minecraft
        username: 'BotAfk',    // Nombre genÃ©rico del bot/NPC dentro del juego
        version: false              // Autodetecta la versiÃ³n exacta del servidor (1.8 a 1.21+)
    });

    bot.on('spawn', () => {
        console.log(`[NPC] El bot ha aparecido correctamente en el mapa.`);
        // Si tu servidor No-Premium requiere contraseÃ±a, descomenta la lÃ­nea de abajo:
        // setTimeout(() => bot.chat('/login BotAfk'), 4000);
    });

    bot.on('login', () => {
        console.log(`[NPC] ConexiÃ³n establecida con el servidor de Minecraft.`);
    });

    // Rutina automatizada del NPC: Buscar cofre, interactuar, cerrar y saltar (Cada 45 segundos)
    setInterval(async () => {
        if (!bot || !bot.entity) return;

        try {
            // 1. Localizar el bloque de cofre en un radio de 5 bloques
            const chestBlock = bot.findBlock({
                matching: bot.registry.blocksByName.chest.id,
                maxDistance: 5
            });

            if (chestBlock) {
                console.log('[NPC] Interactuando con el contenedor cercano...');
                
                // 2. Abrir el contenedor (genera la animaciÃ³n y sonido fÃ­sico en el servidor)
                const chest = await bot.openChest(chestBlock);
                console.log('[NPC] Contenedor abierto.');
                
                // Mantener la interfaz abierta durante 2 segundos simulando actividad de inventario
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // 3. Cerrar la interfaz del contenedor
                chest.close();
                console.log('[NPC] Contenedor cerrado.');
            } else {
                console.log('[NPC] Aviso: No se detectÃ³ ningÃºn contenedor vÃ¡lido cerca.');
            }

            // 4. Ejecutar acciÃ³n de salto fÃ­sico para evitar la inactividad (Anti-AFK)
            await new Promise(resolve => setTimeout(resolve, 1000));
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), 500);
            console.log('[NPC] AcciÃ³n anti-inactividad completada con Ã©xito.');

        } catch (err) {
            console.log(`[NPC] Error en el ciclo de ejecuciÃ³n: ${err.message}`);
        }
    }, 45000);

    // Sistema de auto-reconexiÃ³n segura tras expulsiones o reinicios del servidor
    bot.on('end', (reason) => {
        console.log(`[NPC] ConexiÃ³n finalizada por: ${reason}. Reintentando en 25 segundos...`);
        setTimeout(createBot, 25000);
    });

    bot.on('error', (err) => console.log(`[NPC] Error crÃ­tico de red detectado: ${err}`));
}

createBot();

