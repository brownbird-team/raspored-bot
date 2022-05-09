const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { errorEmbed, normalEmbed } = require('./../helperFunctionsDisc.js');
const baza = require('./../databaseQueriesDisc.js');
const helpObj = require('./help.json');

// Zamjeni %prefix% iz datoteke sa prefixom korisnika
const getHelp = (prefix) => JSON.parse(JSON.stringify(helpObj).replaceAll('%prefix%', prefix));

module.exports = {
    name: 'help',
    admin: false,
    dmOnly: false,
    aliases: [],

    async execute(message) {
        let prefix, dm;
        if (message.channel.type.startsWith('GUILD')) {
            dm = false;
            prefix = await baza.getPrefix(message.guildId, message.channelId);
        } else {
            dm = true;
            prefix = await baza.getPrefix(null, message.author.id);
        }

        const helpWaitingTime = (await baza.getOption('helpWaitingTime')).value;
        const help = getHelp(prefix);

        let embed = await normalEmbed(help.home.title, help.home.desc);

        for (field of help.home.fields) {
            embed.addFields({
                name: field.name,
                value: field.value
            });
        }

        let options = [];

        for (page in help) {
            if (!dm && help[page].type !== 'dm' || dm && help[page].type !== 'server') {
                options.push({
                    label: help[page].name,
                    description: help[page].sdesc,
                    value: page
                });
            }
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId(JSON.stringify({
                        id: message.id,
                        user: message.author.id,
                        name: 'menu'
                    }))
                    .setPlaceholder('Odaberi naredbu')
                    .addOptions(options)
            );

        const filter = i => JSON.parse(i.customId).id === message.id;
        const collector = message.channel.createMessageComponentCollector({ filter: filter, time: helpWaitingTime });

        collector.on('collect', async inter => {
            
            if (inter.user.id !== message.author.id) {
                await inter.reply({
                    content: 'Ovaj help nije za tebe, nabavi si svoj',
                    allowedMentions: { repliedUser: false },
                    ephemeral: true
                });
                return;
            }

            collector.resetTimer({
                time: helpWaitingTime
            });

            const page = help[inter.values[0]];

            if (page !== undefined) {
                embed = await normalEmbed(page.title, page.desc);
                for (field of page.fields) {
                    embed.addFields({
                        name: field.name,
                        value: field.value
                    });
                }
            }

            await inter.update({
                content: 'Odaberi naredbu u izborniku',
                embeds: [ embed ],
                components: [ row ],
                allowedMentions: { repliedUser: false }
            });
        });

        collector.on('end', () => {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId(JSON.stringify({
                            id: message.id,
                            user: message.author.id,
                            name: 'menu'
                        }))
                        .setPlaceholder('Odaberi naredbu')
                        .addOptions(options)
                        .setDisabled(true)
                );

            sendMessage.edit({
                content: `Prošlo je ${helpWaitingTime / 1000} s, gasim izbornik`,
                embeds: [ embed ],
                components: [ row ],
                allowedMentions: { repliedUser: false }
            });
        });

        const sendMessage = await message.reply({
            content: 'Odaberi naredbu u izborniku',
            embeds: [ embed ],
            components: [ row ],
            allowedMentions: { repliedUser: false }
        });
    }
}