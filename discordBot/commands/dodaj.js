const { errorEmbed, normalEmbed } = require('./../helperFunctionsDisc.js');
const baza = require("../databaseQueriesDisc.js");

module.exports = {
    name: 'dodaj',
    admin: false,
    dmOnly: true,

    async execute(message) {
        const kanal = await baza.getKanal(message.author.id);
        
        let embed;
        
        // Ako je kanal već u bazi
        if (kanal) {
            embed = await errorEmbed(`Korisnik ${message.author.tag} se već nalazi u bazi Raspored Bota`);
        } else {
            // Inače dodaj kanal u bazu
            await baza.addKanal(null, message.author.id);
            embed = await normalEmbed(
                'Dodajem korisnika u bazu Raspored Bota',
                `Korisnik ${message.author.tag} dodan je u bazu Raspored Bota`
            );
        }

        await message.reply({
            embeds: [ embed ],
            allowedMentions: { repliedUser: false },
        })
    }
}