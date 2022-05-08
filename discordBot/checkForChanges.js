const { normalEmbed, formatDateString } = require('./helperFunctionsDisc.js');
const baza = require('./databaseQueriesDisc.js');
const izmjene = require('./../databaseQueries.js');

exports.check = async (client) => {
    channels = await baza.listKanal();
    
    for (each of channels) {
        
        const channelData = await baza.getKanal(each);
        let embeds = [];

        if (channelData.mute || !channelData.razred) { continue; }

        const noveIzmjene = await izmjene.dajIzmjene(channelData.razred.id, channelData.zadnja_poslana);
        const reverseIzmjene = [...noveIzmjene].reverse();

        for (const izmjena of reverseIzmjene) {
            if (izmjena.sve_null && !channelData.salji_sve) { continue; }

            let embed = await normalEmbed(
                `Nove izmjene u rasporedu za ${channelData.razred.ime} razred`,
                'Naš sustav pronašao je nove izmjene za vaš razred'
                );

            let izmjeneString = '```\n';
            let j = (izmjena.ujutro) ? 1 : -1;
            for(let i = 1; i < 10; i++, j++) {
                izmjeneString += `${(j === -1) ? '' : ' '}${j}. sat = ${izmjena[`sat${i}`]}\n`
            }
            izmjeneString += '```'
            embed.addFields({
                name: izmjena.naslov,
                value: izmjeneString
            },{
                name: 'Smjena rasporeda',
                value: '```' + `[${izmjena.ujutro ? 'Prijepodne' : 'Poslijepodne'}] ${channelData.razred.smjena} smjena` + '```'
            },{
                name: 'Status i Datum primanja izmjene',
                value: '```' + ((noveIzmjene.indexOf(izmjena) === 0) ? '[Zadnja]' : '[Prošla]') + ' ' + formatDateString(izmjena.datum) + '```'
            });

            embeds.push(embed);
        }

        if (channelData.server && embeds.length !== 0) {
            const channel = await client.channels.fetch(channelData.id);
            await channel.send({
                embeds: embeds
            });
        } else if (embeds.length !== 0) {
            client.users.send(channelData.id, {
                embeds: embeds
            });
        }
        
        if (noveIzmjene.length !== 0)
            await baza.updateKanal({
                id: channelData.id,
                zadnja_poslana: noveIzmjene[0].id
            });
    }
}