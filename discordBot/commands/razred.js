const { normalEmbed, errorEmbed } = require("../helperFunctionsDisc.js");
const baza = require("../databaseQueriesDisc.js");
const general = require('../../database/queries/classInfo.js');

module.exports = {
    name: 'razred',
    admin: false,
    dmOnly: true,
    aliases: [],
    
    async execute(message) {
        const kanal = await baza.getKanal(message.author.id);
        const options = message.content.trim().split(' ').slice(1);
        const prefix = await baza.getPrefix(message.author.id);

        let embed;

        if (kanal) {
            const razredName = options[0];

            if (options.length !== 1) {
                embed = await errorEmbed(
                    "Naredba nije pravilno definirana\nUpišite `" + prefix + "razred broj.slovo` (npr: 2.G)"
                );
            } else {
                const razred = await general.getClassByName({name:razredName});
                if (razred) {

                    await baza.updateKanal({
                        id: message.author.id,
                        razred: razred.class_id,
                        master_id: razred.master_id,
                    });
                    embed = await normalEmbed(
                        'Mijenjam zadani razred',
                        `Postavljam **${razred.name}** kao zadani razred za korisnika ${message.author.tag}`
                    );
                } else {
                    embed = await errorEmbed(
                        `Traženi razred** ${razredName} **nije pronađen`
                    );
                }
            }
        } else {
            embed = await errorEmbed(
                `Korisnik ${message.author.tag} ne postoji u bazi Raspored Bota\nMorate biti u bazi kako bi mogli mijenjati postavke`
            );
        }

        await message.reply({
            embeds: [ embed ],
            allowedMentions: { repliedUser: false }
        });
    }
}