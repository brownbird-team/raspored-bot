const { getPrefix } = require('./../databaseQueriesDisc.js');
const help = require('./../commands/help.js');

module.exports = {
    name: "messageCreate",
    once: false,
    async execute(message) {
        let prefix;

        if (message.channel.type.startsWith('DM')) {
            prefix = await getPrefix(null, message.author.id);
        } else {
            prefix = await getPrefix(message.guildId, message.channelId);
        }
        if (message.content.includes(`<@${message.client.user.id}>`)) {
            help.execute(message);
        }
    }
}