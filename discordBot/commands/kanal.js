// Dodaj potrebne datoteke
const baza = require('./../databaseQueriesDisc.js');
const general = require('./../../databaseQueries.js');
const { errorEmbed, normalEmbed } = require("../helperFunctionsDisc.js");

module.exports = {
    // Postavi ime naredbe na kanal
    name: 'kanal',
    admin: true,
    dmOnly: false,

    // Kreiraj funkciju za izvršavanje naredbe
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

        // Iz baze zatraži potrebne podatke
        const kanal = await baza.getKanal(message.channelId);

        // Izvuci sve što dolazi nakon podkomande (argumente) i spremi u niz
        const optionsArray = message.content.trim().split(' ');
        const options = optionsArray.slice(2);

        // Izvuci podkomandu i prefix u ovom kanalu
        const command = message.content.trim().split(' ')[1];
        const prefix = await baza.getPrefix(message.guildId, message.channelId);

        // Inicijaliziraj Embed
        let embed;

        // Ukoliko je podkomanda dodaj i nema argumenata
        if (command === 'dodaj') {
            // Ako je kanal već u bazi
            if (kanal) {
                embed = await errorEmbed(`Kanal #${message.channel.name} se već nalazi u bazi Raspored Bota`);
            } else {
                // Inače dodaj kanal u bazu
                await baza.addKanal(message.guildId, message.channelId);
                embed = await normalEmbed(
                    'Dodajem kanal u bazu Raspored Bota',
                    `Kanal #${message.channel.name} dodan je u bazu Raspored Bota`
                );
            }
        }

        // Ukoliko je podkomanda ukloni i nema argumenata
        else if (command === 'ukloni') {
            // Ako kanal nema u bazi
            if (!kanal) {
                embed = await errorEmbed(`Kanal #${message.channel.name} se već nalazi u bazi Raspored Bota`);
            // Inače ukloni kanal iz baze
            } else {
                await baza.removeKanal(message.channelId);
                embed = await normalEmbed(
                    'Uklanjam kanal iz baze Raspored Bota',
                    `Kanal #${message.channel.name} uklonjen je iz baze Raspored Bota`
                );
            }
        }

        // Ukoliko je podkomanda razred i ima samo jedan argument
        else if (command === 'razred' && kanal) {
            // Pogledaj za taj razred u bazi
            const razredName = options[0];
            // Ako traženi razred postoji izmjeni podatke o kanalu
            if (options.length !== 1) {
                embed = await errorEmbed(
                    "Naredba nije pravilno definirana\nUpišite `" + prefix + "kanal razred broj.slovo` (npr: 2.G)"
                );
            } else {
                const razred = await general.dajRazredByName(razredName);
                if (razred) {
                    const zadnja = await general.dajZadnju(razred.id);
                    await baza.updateKanal({
                        id: message.channelId,
                        razred: razred.id,
                        zadnja_poslana: zadnja.id
                    });
                    embed = await normalEmbed(
                        'Mijenjam zadani razred',
                        `Postavljam **${razred.ime}** kao zadani razred za kanal ${message.channel.name}`
                    );
                // Inače pošalji grešku
                } else {
                    embed = await errorEmbed(`Traženi razred** ${razredName} **nije pronađen`);
                }
            }
        }

        // Ako je podkomanda sve
        else if (command === 'sve' && kanal) {
            const value = options[0];
            // I argument je da, izmjeni podatke za kanal u bazi
            if (value === 'da' && options.length === 1) {
                await baza.updateKanal({
                    id: message.channelId,
                    salji_sve: true
                });
                embed = await normalEmbed(
                    'Izmjena postavki za slanje izmjena',
                    'Od sada ćete primati **SVE** izmjene, bez obzira jesu li sva polja prazna za vaš razred'
                );
            // I argument je ne, izmjeni podatke za kanal u bazi
            } else  if (value === 'ne' && options.length === 1) {
                await baza.updateKanal({
                    id: message.channelId,
                    salji_sve: false
                });
                embed = await normalEmbed(
                    'Izmjena postavki za slanje izmjena',
                    'Od sada ćete primati izmjene **SAMO** ako se nešto promjenilo za vaš razred'
                );
            // Inače pošalji grešku
            } else {
                embed = await errorEmbed(
                    "Naredba nije pravilno definirana\nUpišite `" + prefix + "kanal sve da/ne`"
                );
            }
        }

        // Ako je podkomanda mute
        else if (command === 'mute' && kanal) {
            const value = options[0];
            // I argument je da, izmjeni podatke za kanal u bazi
            if (value === 'da' && options.length === 1) {
                await baza.updateKanal({
                    id: message.channelId,
                    mute: true
                });
                embed = await normalEmbed(
                    'Izmjena postavki za slanje izmjena',
                    'Od sada nećete primati izmjene u ovaj kanal'
                );
            // I argument je ne, izmjeni podatke za kanal u bazi
            } else  if (value === 'ne' && options.length === 1) {
                let zadnja_poslana = null;
                if (kanal.razred)
                    zadnja_poslana = await dajZadnju(kanal.razred.id);
                await baza.updateKanal({
                    id: message.channelId,
                    mute: false,
                    zadnja_poslana: zadnja_poslana
                });
                embed = await normalEmbed(
                    'Izmjena postavki za slanje izmjena',
                    'Od sada ćete primati izmjene u ovaj kanal'
                );
            // Inače pošalji grešku
            } else {
                embed = await errorEmbed(
                    "Naredba nije pravilno definirana\nUpišite `" + prefix + "kanal mute da/ne`"
                );
            }
        }

        // Ako je podkomanda prefix
        else if (command === 'prefix' && kanal) {
            // Ako ima više od jednog argumenta pošalji grešku
            if (options.length > 1) {
                embed = await errorEmbed("Prefix ne smije sadržavati razmake");
            // Ako ima manje od jednog argumenta pošalji grešku
            } else if (options.length < 1) {
                embed = await errorEmbed("Prefix nije definiran");
            } else if (!general.onlyASCII(options[0])) {
                embed = await errorEmbed("Prefix sadrži nevaljane znakove, provjerite sadrži li prefix samo ASCII znakove");
            // Inače izmjeni podatke za prefix kanala u bazi
            } else {
                baza.updateKanal({
                    id: message.channelId,
                    prefix: general.prepareForSQL(options[0])
                });
                embed = await normalEmbed(
                    `Izmjena prefixa za kanal #${message.channel.name}`,
                    `Prefix kanala postavljen je na** ${options[0]} **`
                );
            }
        }

        // Ako nema podkomande ni argumenata i kanal postoji u bazi
        else if (command === undefined && kanal) {
            // Pošalji podatke o kanalu iz baze
            embed = await normalEmbed(`Prikaz postavki za kanal #${message.channel.name}`);
            embed.addFields({
                name: 'Razred',
                value: '```' + (kanal.razred ? kanal.razred.ime : 'Nije definiran') + '```'
            });
            embed.addFields({
                name: 'Šalji sve izmjene',
                value: '```' + (kanal.salji_sve ? 'DA' : 'NE') + '```'
            });
            embed.addFields({
                name: 'Šalji izmjene u ovaj kanal',
                value: '```' + (!kanal.mute ? 'DA' : 'NE') + '```'
            });
            embed.addFields({
                name: 'Prefix u ovom kanalu',
                value: '```' + (kanal.prefix ? kanal.prefix : `Jednak kao u serveru "${prefix}"`) + '```'
            });
        }

        // Ako kanal ne postoji u bazi i nema podkomande ni argumenata
        // Ispiši da kanal ne postoji u bazi
        else if (!kanal) {
            embed = await errorEmbed(
                `Kanal #${message.channel.name} nije dodan u bazu Raspored Bota, dodajte kanal kako bi mogli mijenjati postavke`
            );
        }

        // Pošalji rezultate na Discord
        await message.reply({
            embeds: [embed],
            // Nemoj mentionat lika kad odgovaraš
            allowedMentions: { repliedUser: false }
        });
    }
}