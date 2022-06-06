const { Client, Intents, Collection } = require("discord.js");
const baza = require("./databaseQueriesDisc.js");
const func = require("./helperFunctionsDisc.js");
const izmjeneCheck = require("./checkForChanges.js").check;
const fs = require("fs");

exports.check = izmjeneCheck;

exports.isRunning = false;
exports.client = undefined;

exports.startDiscordBot = async () => {

    const eventFiles = fs.readdirSync("./discordBot/events").filter(file => file.endsWith(".js"));
    exports.client = new Client({
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Intents.FLAGS.DIRECT_MESSAGE_TYPING,
            Intents.FLAGS.GUILD_INVITES
        ],
        partials: [
            'CHANNEL'
        ]
    });

    exports.client.commands = new Collection();

    const goodToGo = await func.checkOptions();
    if (!goodToGo) return false;

    const token = await baza.getOption("token");

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            exports.client.once(event.name, (...args) => event.execute(...args));
        } else {
            exports.client.on(event.name, (...args) => event.execute(...args));
        }
    }

    const commandFiles = fs.readdirSync("./discordBot/commands").filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        exports.client.commands.set(command.name, command);
    }

    exports.client.on('messageCreate', async message => {
        if (message.author.bot) return;

        const primaryCommand = message.content.split(' ')[0];
        
        let prefix;
        if (message.channel.type.startsWith('DM')) {
            prefix = await baza.getPrefix(null, message.author.id);
        } else {
            prefix = await baza.getPrefix(message.guildId, message.channelId);
        }

        if (!primaryCommand.startsWith(prefix)) return;

        const cmdName = primaryCommand.slice(prefix.length);
        const command = exports.client.commands.get(cmdName) || exports.client.commands.find(cmd => cmd.aliases.includes(cmdName));
        if (!command) return;

        if (!message.channel.type.startsWith('DM') && command.dmOnly) {
            const embed = await func.errorEmbed(
                `Ova naredba nije namijenjena za izvršavanje u serverima`
            );
            await message.reply({
                embeds: [ embed ],
                allowedMentions: { repliedUser: false }
            });
            return;
        }

        if (!command.dmOnly && command.admin && !message.member.permissionsIn(message.channel).has('ADMINISTRATOR')) {
            const embed = await func.errorEmbed(
                `Samo administratori servera mogu koristiti naredbe za manipulaciju postavkama bota`
            );
            await message.reply({
                embeds: [ embed ],
                allowedMentions: { repliedUser: false }
            });
            return;
        }

        command.execute(message);
    });

    await exports.client.login(token.value);
    exports.isRunning = true;
}

exports.stopDiscordBot = async () => {
    await exports.client.destroy();
    func.discordLog("Gasim discord bota");
    exports.isRunning = false;
}