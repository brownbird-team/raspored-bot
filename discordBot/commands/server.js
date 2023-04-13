const { normalEmbed, errorEmbed } = require("../helperFunctionsDisc.js");
const { prepareForSQL, onlyASCII } = require('../../database/queries/general.js');
const baza = require('./../databaseQueriesDisc.js');
const general = require('../../database/queries/classInfo.js');

module.exports = {
    name: 'server',
    admin: true,
    dmOnly: false,
    aliases: [],

    async execute(message) {

        if (!message.channel.type.startsWith('GUILD_')) {
            const embed = await errorEmbed(
                'Ova naredba može se koristiti samo u serverima'
            );
            message.reply({
                embeds: [ embed ],
                allowedMentions: { repliedUser: false }
            });
            return;
        }

        // Izvuci podkomandu i prefix u ovom kanalu
        const command = message.content.trim().split(' ')[1];
        const prefix = await baza.getPrefix(message.guildId, null);

        // Izvuci sve što dolazi nakon podkomande (argumente) i spremi u niz
        const optionsArray = message.content.trim().split(' ');
        const options = optionsArray.slice(2);

        let embed;

        if (command === 'razred') {
            const razredName = options[0];
            let razred;
            if (razredName === undefined) {
                razred = null;
            } else {
                razred = await general.getClassByName({name:razredName});
            }

            if (options.length !== 1) {
                embed = await errorEmbed(
                    "Naredba nije pravilno definirana\nUpišite `" + prefix + "razred broj.slovo` (npr: 2.G)"
                );
            } else {
                if (razred) {
                    await baza.updateServer({
                        id: message.guildId,
                        razred: razred.class_id,
                        master_id: razred.master_id,
                    });
                    embed = await normalEmbed(
                        'Mijenjam zadani razred',
                        `Postavljam **${razred.name}** kao zadani razred za server ${message.guild.name}`
                    );
                } else {
                    embed = await errorEmbed(
                        `Traženi razred** ${razredName} **nije pronađen`
                    );
                }
            }
        }

        else if (command === 'prefix') {
            if (options.length > 1) {
                embed = await errorEmbed("Prefix ne smije sadržavati razmake");
            // Ako ima manje od jednog argumenta pošalji grešku
            } else if (options.length < 1) {
                embed = await errorEmbed("Prefix nije definiran");
            // Ako prefix ne sadrži samo ASCII znakove pošalji grešku
            } else if (!onlyASCII(options[0])) {
                embed = await errorEmbed("Prefix sadrži nevaljane znakove, provjerite sadrži li prefix samo ASCII znakove");
            // Inače izmjeni podatke za prefix kanala u bazi
            } else {
                baza.updateServer({
                    id: message.guildId,
                    prefix: prepareForSQL(options[0])
                });
                embed = await normalEmbed(
                    `Izmjena prefixa za server ${message.guild.name}`,
                    `Vaš prefix postavljen je na** ${options[0]} **`
                );
            }
        }

        else if (command === 'kanali') {
            embed = await normalEmbed(`Ispis kanala za server ${message.guild.name}`, null);
            const server = await baza.getServer(message.guildId);
            let noChannels = true;

            for (const kanal in server.kanali) {
                if (noChannels) noChannels = false;
                const kanalBaza = server.kanali[kanal];
                const kanalInfo = await message.guild.channels.fetch(kanal);
                embed.addFields({
                    name: `Kanal #${kanalInfo.name}`,
                    value: '```' +
                        `Razred = ${(kanalBaza.razred ? kanalBaza.razred.ime : 'Nije definiran')}\n` +
                        'Šalji izmjene u ovaj kanal = ' + (!kanalBaza.mute ? 'DA' : 'NE') + '\n' +
                        `Prefix = ` + (kanalBaza.prefix ? kanalBaza.prefix : `Jednak kao u serveru "${prefix}"`) + '```\n'
                });
            }

            if (noChannels) {
                embed = await normalEmbed(
                    `Ispis kanala za server ${message.guild.name}`,
                    'Niti jedan kanal ovog servera nije dodan u bazu Raspored Bota'
                );
            }
        } else {
            const server = await baza.getServer(message.guildId);
            embed = await normalEmbed(`Ispis postavki za server ${message.guild.name}`, null);
            
            embed.addFields({
                name: 'Razred',
                value: '```'+ (server.razred ? server.razred.name : 'Nije definiran') + '```'
            },{
                name: 'Prefix u ovom serveru',
                value: '```' + (server.prefix ? server.prefix : `Prefix Raspored Bota "${prefix}"`) + '```'
            });
        }

        await message.reply({
            embeds: [embed],
            // Nemoj mentionat lika kad odgovaraš
            allowedMentions: { repliedUser: false }
        });
    }
}