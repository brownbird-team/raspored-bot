const { Client, Intents, Collection } = require("discord.js");
const baza = require("./databaseQueriesDisc.js");
const func = require("./helperFunctionsDisc.js");
const fs = require("fs");
const notifier = require("./../globalErrorNotifier.js");

exports.client = null;

exports.startDiscordBot = async () => {

    const eventFiles = fs.readdirSync("./discordBot/events").filter(file => file.endsWith(".js"));
    this.client = new Client({
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

    this.client.commands = new Collection();

    const goodToGo = await func.checkOptions();
    if (!goodToGo) {
        func.discordLog("Unable to start discord bot, there is no token in table disc_settings");
        return false;
    }

    const token = await baza.getOption("token");

    for (const file of eventFiles) {
        const event = require(`./events/${file}`);
        if (event.once) {
            this.client.once(event.name, (...args) => event.execute(...args));
        } else {
            this.client.on(event.name, (...args) => event.execute(...args));
        }
    }

    const commandFiles = fs.readdirSync("./discordBot/commands").filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        this.client.commands.set(command.name, command);
    }

    this.client.on('messageCreate', async message => {
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
        const command = this.client.commands.get(cmdName) || this.client.commands.find(cmd => cmd.aliases.includes(cmdName));
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
        try {
            await command.execute(message);
        } catch (err) {
            notifier.handle(err);
            // Treba probati postati embed koji govori da je došlo do greške
            // također još fali i error handle za evente i sve skupa bi trebalo
            // provjerit, ako ima nekih drugih gluposti
        }
    });

    await this.client.login(token);
}

exports.stopDiscordBot = async () => {
    if (!this.client) return;
    this.client.destroy();
    this.client = null;
    func.discordLog("Gasim discord bota");
}