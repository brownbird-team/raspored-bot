const dbDisc = require('./../../../../discordBot/databaseQueriesDisc.js');

module.exports = async () => {
    const inviteLink = await dbDisc.getOption('botInviteLink');
    return {
        link: (inviteLink) ? inviteLink : ''
    };
}