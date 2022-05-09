const { errorEmbed, normalEmbed } = require("../helperFunctionsDisc.js");

module.exports = {
    name: "edit",
    admin: false,
    dmOnly: false,
    aliases: [],

    async execute(message) {
        let embed = await normalEmbed(
            'Link za Web sučelje Raspored Bota',
            'Pomoću Web sučelja lakše i brže konfigurirajte bota za svoj server'
        );
        embed.setURL('https://brownbird.eu');

        embed.addFields({
            name: "Napomena !",
            value: "Web sučelje je eksperimentalna funkcija koja još nije dostupna u ovoj verziji bota"
        });
        
        await message.reply( {
            embeds: [embed],
            allowedMentions: { repliedUser: false }
        });
    }
}