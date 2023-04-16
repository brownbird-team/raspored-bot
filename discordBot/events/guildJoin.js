const baza = require("./../databaseQueriesDisc.js");
const func = require("./../helperFunctionsDisc.js");

module.exports = {
    name: "guildCreate",
    once: false,
    async execute(guild) {
        const server = await baza.getServer(guild.id);
        if (!server) {
            func.discordLog(`Adding server [${guild.name}] into database`);
            baza.addServer(guild.id);
        }
    }
}