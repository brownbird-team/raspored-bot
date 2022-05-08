const baza = require("./../databaseQueriesDisc.js");
const func = require("./../helperFunctionsDisc.js");
const { check } = require("./../checkForChanges.js");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        func.discordLog(`Spreman! Ulogirao sam se kao [${client.user.tag}]`);

        const activityType = (await baza.getOption('activityType')).value
        const activityText = (await baza.getOption('activityText')).value

        client.user.setActivity(activityText, {
            type: activityType
        });
        func.discordLog(`Status postavljen na [${activityType.charAt(0) + activityType.toLowerCase().slice(1)} ${activityText}]`);

        client.guilds.cache.forEach( async (value, key) => {
            server = await baza.getServer(key);
            if (!server) {
                func.discordLog(`Dodajem server [${value.name}] u bazu`);
                await baza.addServer(key);
            }
        });

        await check(client);
    }
}