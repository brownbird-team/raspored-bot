const { discordLog } = require('./../helperFunctionsDisc');

module.exports = {
    name: "shardError",
    once: false,
    async execute(error) {
        discordLog('Network error accrued');
        console.log(error);
    }
}