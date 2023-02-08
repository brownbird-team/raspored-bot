const loadConfig = require('./loadConfig.js');
const sendEmail = require('./emailBot/sendEmail.js');
const errorTemplate = require('./emailBot/templates/templateError.js');
const discord = require('./discordBot/main.js');

const config = loadConfig.getData();

// Function used to create message displayed on discord
const createErrorMsg = (err) => {
    let message = `` +
        `**RasporedBot FATAL ERROR**\n` +
        `Fatal error accured on your RasporedBot instance. You are receiving this message because id of this channel is writen in \`config.json\` file\n` +
        `\`\`\`Error name: ${err.name}\n` +
        `Error message: ${err.message}\n\n` +
        `Error object properties:\n`;

    for (const key of Object.keys(err)) {
        message += `- ${key}: ${err[key]}\n`;
    }

    message += `\`\`\`\nGood luck with debugging !`;
    return message;
}

// Print somenthing to console with ERROR prefix
exports.errorLog = async (logThis) => {
    console.error('[\u001b[31mError\033[00m] ' + logThis);
}

// Start error notification process
exports.handle = async (err) => {

    // Ako se radi o nefatalnoj grešci koja nema veze sa neispravnosti aplikacije
    // već je normalna pojava, zanemari je
    if (err.nonFatal)
        return;

    this.errorLog("Fatal error accured, application will not act normally");
    console.error(err);

    // If email is used for notifications try to contact administrator over email
    if (config.administration.sendErrorNotificationEmails) {
        try {
            this.errorLog("Trying to contact administrators using email");
            await sendEmail.send(config.administration.email, 'RasporedBot FATAL ERROR', null, errorTemplate(err));
            this.errorLog("Success");
        } catch (errr) {
            this.errorLog("Failed to contact administrators over email")
            console.error(errr);
        }
    }

    // If discord is used for notifications try to contact administrator over discord
    if (config.administration.sendErrorNotificationsOnDiscord) {
        try {
            this.errorLog("Trying to contact administrators using Discord");
            
            if (!discord.client && !discord.client.isReady())
                throw new Error('Failed to send message over discord, client not ready');

            const channel = await discord.client.channels.fetch(config.administration.channelId);

            channel.send(createErrorMsg(err));
            this.errorLog("Success");
        } catch (errr) {
            this.errorLog("Failed to contact administrators over Discord");
            console.error(errr);
        }
    }
}