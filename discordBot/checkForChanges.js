const { normalEmbed, formatDateString, asyncFilter } = require('./helperFunctionsDisc.js');
const baza = require('./databaseQueriesDisc.js');
const izmjene = require('./../databaseQueries.js');
const discord = require('./main.js');

// Provjeri ima li izmjena za sve korisnike u bazi i pošalji im
exports.check = async () => {
    // Prekini ako bot nije spreman
    if (!discord.client || !discord.client.isReady()) return false;

    // Povuci sve registrirane kanale iz baze
    let channels = await baza.listKanal();
    
    // Za svaki kanal
    channelsLoop: for (const each of channels) {
        // Povuci podatke o kanalu
        const channelData = await baza.getKanal(each);
        
        let embeds = [];
        // Ako kanalu nije definiran razred ili je mutean preskoči ga
        if (channelData.mute || !channelData.razred) { continue; }

        // Povuci array novih izmjena za odabrani razred od zadnje poslane
        let noveIzmjene = await izmjene.dajIzmjene(channelData.razred.id, channelData.zadnja_poslana ?? 0);
        const zadanjaIzmjena = noveIzmjene[0];

        // Filtriraj nove izmjene tako da ako je korisnik odabrao da ne želi primati sve
        // ne dobije prazne izmjene
        noveIzmjene = await asyncFilter(noveIzmjene, async (izmjena) => {
            // Ako je korisnik odabrao sve preskoći filtriranje
            if (!izmjena.sve_null || channelData.salji_sve) {
                return true;
            }
            // Povuci iz baze izmjenu prije ove
            const izmjenaPrijeOve = await izmjene.dajPovijest(channelData.razred.id, 2, izmjena.id);
            // Ako je izmjena prije ove u istoj tablici i nije prazna, znači da je izmjena uklonjena
            // stoga ju pošalji kako bi obavjestio da ipak nema izmjene
            if (izmjenaPrijeOve.izmjena && izmjena.naslov === izmjenaPrijeOve.izmjena.naslov && !izmjenaPrijeOve.izmjena.sve_null) {
                return true;
            }
            // U suprotnom izbaci izmjenu iz arraya
            return false;
        });

        // Preokreni array tako da prvo šalje najstarije izmjene
        const reverseIzmjene = [...noveIzmjene].reverse();

        // Kreiraj embed za svaku izmjenu u arrayu
        for (const izmjena of reverseIzmjene) {
            // Inicijaliziraj normal embed
            let embed = await normalEmbed(
                `Nove izmjene u rasporedu za ${channelData.razred.ime} razred`,
                'Naš sustav pronašao je nove izmjene za vaš razred'
                );
            // Dodaj svaki sad kao novi red
            let izmjeneString = '```\n';
            let j = (izmjena.ujutro) ? 1 : -1;
            for(let i = 1; i < 10; i++, j++) {
                izmjeneString += `${(j === -1) ? '' : ' '}${j}. sat = ${izmjena[`sat${i}`]}\n`
            }
            izmjeneString += '```'
            // Dodaj polja za smjenu, prije/poslje podne, te status i datum
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
            // Dodaj embed u embeds array
            embeds.push(embed);
        }
        // Ako je kanal u serveru i ima bar jednu izmjenu pošalji embeds array
        if (channelData.server && embeds.length !== 0) {
            try {
                const channel = await discord.client.channels.fetch(channelData.id);
                await channel.send({
                    embeds: embeds
                });
            } catch {
                continue channelsLoop;
            }
        // Ako je kanal DM i ima bar jednu izmjenu pošalji embeds array
        } else if (embeds.length !== 0) {
            try {
                await discord.client.users.send(channelData.id, {
                    embeds: embeds
                });
            } catch {
                continue channelsLoop;
            }
        }
        // Ako je došlo do bar jedne izmjene osvježi zadnju poslanu za kanal
        if (zadanjaIzmjena !== undefined)
            await baza.updateKanal({
                id: channelData.id,
                zadnja_poslana: zadanjaIzmjena.id
            });
    }
    // Vrati da je sve prošlo OK
    return true;
}