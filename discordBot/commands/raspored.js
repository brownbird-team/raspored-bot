// Dodaj potrebne datoteke
const { MessageActionRow, MessageButton } = require("discord.js");
const { errorEmbed, normalEmbed, formatDateString } = require('./../helperFunctionsDisc.js');
const wait = require('node:timers/promises').setTimeout;
const baza = require('./../databaseQueriesDisc.js');
const general = require('./../../databaseQueries.js');
const notifier = require('./../../globalErrorNotifier.js');

module.exports = {
    name: 'raspored',
    admin: false,
    dmOnly: false,
    aliases: ['r', 'ras'],

    async execute(message) {

        // Iz baze zatraži potrebne podatke
        let kanal;
        if (message.channel.type.startsWith('DM')) {
            kanal = await baza.getKanal(message.author.id);
        } else {
            kanal = await baza.getKanal(message.channelId);
        }
        const server = await baza.getServer(message.guildId);
        const embedWaitingTime = await baza.getOption('embedWaitingTime');

        // Izvuci podkomandu i prefix u ovom kanalu
        const options = message.content.trim().split(' ').slice(1).slice(-2);

        let page;
        let razred;
        let sentMessage;
        let embed;

        const razredTest = await general.dajRazredByName(options[0]);
        if (razredTest) {
            razred = razredTest;
        } else if (options.length > 0 && !/^[0-9]+$/.test(options[0])) {
            embed = await errorEmbed(
                `Traženi razred** ${options[0]} **nije pronađen`
            );
            await message.reply({
                embeds: [ embed ],
                allowedMentions: { repliedUser: false }
            });
            return;
        } else {
            if (kanal && kanal.razred) {
                razred = kanal.razred;
            } else if (server && server.razred) {
                razred = server.razred;
            } else {
                if (server) {
                    embed = await errorEmbed(
                        `Razred nije definiran, odaberite razred za server ili kanal, ili ga definirajte u naredbi`
                    );
                } else {
                    embed = await errorEmbed(
                        `Razred nije definiran, odaberite svoj razred ili ga definirajte u naredbi`
                    );
                }
                await message.reply({
                    embeds: [ embed ],
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
        }

        let trenutnoRikverc = 1;
        let izmjenaObjekt = await general.dajPovijest(razred.id, trenutnoRikverc);

        if (options.length > 0 && /^[0-9]+$/.test(options[options.length - 1])) {
            page = parseInt(options[options.length - 1]);
            if (page <= izmjenaObjekt.broj && page > 0) {
                trenutnoRikverc = page;
            } else {
                embed = await errorEmbed(
                    `Tražena stranica ne postoji za zadani razred`
                );
                await message.reply({
                    embeds: [ embed ],
                    allowedMentions: { repliedUser: false }
                });
                return;
            }
        } else if (options.length === 2) {
            embed = await errorEmbed(
                `**${options[1]} **nije valjani broj stranice`
            );
            await message.reply({
                embeds: [ embed ],
                allowedMentions: { repliedUser: false }
            });
            return;
        } else {
            page = null;
        }

        if (page) {
            izmjenaObjekt = await general.dajPovijest(razred.id, trenutnoRikverc);
        }

        const ukupnoIzmjena = izmjenaObjekt.broj;
        let izmjena = izmjenaObjekt.izmjena;

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId(JSON.stringify({
                        id: message.id,
                        user: message.author.id,
                        name: 'prije'
                    }))
                    .setLabel('Prošla')
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setCustomId(JSON.stringify({
                        id: message.id,
                        user: message.author.id,
                        name: 'sada'
                    }))
                    .setLabel('Sadašnjost')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomId(JSON.stringify({
                        id: message.id,
                        user: message.author.id,
                        name: 'poslje'
                    }))
                    .setLabel('Sljedeća')
                    .setStyle('SUCCESS')
            );

        let izmjeneString = '```\n';
        let j = (izmjena.ujutro) ? 1 : -1;
        for(let i = 1; i < 10; i++, j++) {
            izmjeneString += `${(j === -1) ? '' : ' '}${j}. sat = ${izmjena[`sat${i}`]}\n`
        }
        izmjeneString += '```'

        embed = await normalEmbed(`Pregled izmjena u rasporedu za ${razred.ime} razred`);
        embed.addFields({
            name: izmjena.naslov,
            value: izmjeneString
        },{
            name: 'Smjena rasporeda',
            value: '```' + `[${izmjena.ujutro ? 'Prijepodne' : 'Poslijepodne'}] ${razred.smjena} smjena` + '```'
        },{
            name: 'Status i Datum primanja izmjene',
            value: '```' + `[Zadnja] ${formatDateString(izmjena.datum)}` + '```'
        },{
            name: 'Koliko ste izmjena u prošlosti',
            value: '```' + `[ ${trenutnoRikverc} / ${ukupnoIzmjena} ]` + '```'
        });

        sentMessage = await message.reply({
            content: '> Inicijaliziram pregled izmjena ...',
            embeds: [ embed ],
            allowedMentions: { repliedUser: false }
        });

        await wait(700);

        await sentMessage.edit({
            content: '> Pomoću tipki možete pregledavati stare izmjene',
            embeds: [ embed ],
            components: [ row ],
            allowedMentions: { repliedUser: false }
        });

        const filter = i => JSON.parse(i.customId).id === message.id;
        const collector = message.channel.createMessageComponentCollector({ filter: filter, time: embedWaitingTime });

        collector.on('collect', async inter => {
            const data = JSON.parse(inter.customId);

            if (inter.user.id !== message.author.id) {
                await inter.reply({
                    content: 'Ovi gumbi nisu za tebe',
                    allowedMentions: { repliedUser: false },
                    ephemeral: true
                });
                return;
            }

            collector.resetTimer({
                time: embedWaitingTime
            });

            if (data.name === 'sada') {
                trenutnoRikverc = 1;
            }
            if (data.name === 'prije') {
                if (trenutnoRikverc !== ukupnoIzmjena) {
                    trenutnoRikverc += 1;
                }
            }
            if (data.name === 'poslje') {
                if (trenutnoRikverc !== 1) {
                    trenutnoRikverc -= 1;
                }
            }

            try {
                izmjena = await general.dajPovijest(razred.id, trenutnoRikverc);
            } catch (err) {
                notifier.handle(err);
                return;
            }

            izmjena = izmjena.izmjena;

            let izmjeneString = '```\n';
            let j = (izmjena.ujutro) ? 1 : -1;
            for(let i = 1; i < 10; i++, j++) {
                izmjeneString += `${(j === -1) ? '' : ' '}${j}. sat = ${izmjena[`sat${i}`]}\n`
            }
            izmjeneString += '```'

            try {
                embed = await normalEmbed(`Pregled izmjena u rasporedu za ${razred.ime} razred`);
            } catch (err) {
                notifier.handle(err);
                return;
            }

            embed.addFields({
                name: izmjena.naslov,
                value: izmjeneString
            },{
                name: 'Smjena rasporeda',
                value: '```' + `[${izmjena.ujutro ? 'Prijepodne' : 'Poslijepodne'}] ${razred.smjena} smjena` + '```'
            },{
                name: 'Status i Datum primanja izmjene',
                value: '```' + `${(trenutnoRikverc === 1) ? '[Zadnja]' : '[Prošla]'} ${formatDateString(izmjena.datum)}` + '```'
            },{
                name: 'Koliko ste izmjena u prošlosti',
                value: '```' + `[ ${trenutnoRikverc} / ${ukupnoIzmjena} ]` + '```'
            });

            await inter.update({
                content: '> Pomoću tipki možete pregledavati stare izmjene',
                embeds: [ embed ],
                components: [ row ],
                allowedMentions: { repliedUser: false }
            });
        });

        collector.on('end', async () => {
            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('prije')
                        .setLabel('Prošla')
                        .setStyle('SUCCESS')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('sada')
                        .setLabel('Sadašnjost')
                        .setStyle('DANGER')
                        .setDisabled(true),
                    new MessageButton()
                        .setCustomId('poslje')
                        .setLabel('Sljedeća')
                        .setStyle('SUCCESS')
                        .setDisabled(true)
                );
            await sentMessage.edit({
                embeds: [ embed ],
                components: [ row ],
                allowedMentions: { repliedUser: false }
            });
        });
    }
}