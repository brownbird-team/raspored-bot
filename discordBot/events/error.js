const { discordLog } = require('./../helperFunctionsDisc');

module.exports = {
    name: "shardError",
    once: false,
    async execute(error) {
        discordLog('Network error accured');
        console.log(error);
    }
}