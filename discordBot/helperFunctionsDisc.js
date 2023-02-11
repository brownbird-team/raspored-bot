const { MessageEmbed } = require("discord.js");
const { checkOptions } = require("../databaseQueries.js");
const baza = require("./databaseQueriesDisc.js");

exports.asyncFilter = async (arr, condFunc) => {
    const results = await Promise.all(arr.map(condFunc));

    return arr.filter((val, index) => 
        results[index]
    );
}

exports.discordLog = async (logThis) => {
    console.log('[\u001b[34mDiscord\033[00m] ' + logThis);
}

exports.errorEmbed = async (error) => {
    const errorColor = await baza.getOption('errorColor');
    const footer = await baza.getOption('embedFooter');

    const embed = new MessageEmbed()
        .setTitle('Pogreška')
        .setColor(errorColor)
        .setTimestamp()
        .setFooter({ text: footer })
        .addFields({
            name: 'Opis pogreške:',
            value: error
        });

    return embed;
}

exports.normalEmbed = async (title, desc) => {
    const color = await baza.getOption('color');
    const footer = await baza.getOption('embedFooter');

    const embed = new MessageEmbed()
        .setTitle(title)
        .setColor(color)
        .setTimestamp()
        .setFooter({ text: footer })

    if (desc) {
        embed.setDescription(desc);
    }

    return embed;
}

exports.formatDateString = (dateString) => {
    const dateObject = new Date(dateString);
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = String(dateObject.getFullYear()).padStart(4, '0');
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
}

// Pregledaj sve postavke u tablici disc_settings i kreiraj ih ako ne postoje
exports.checkOptions = async () => {
    return await checkOptions('disc_settings', [
        
        { name: 'token',             value: '',                               defaultOk: false },
        { name: 'prefix',            value: '.',                              defaultOk: true  },
        { name: 'color',             value: '#05A134',                        defaultOk: true  },
        { name: 'errorColor',        value: '#f73131',                        defaultOk: true  },
        { name: 'embedWaitingTime',  value: '20000',                          defaultOk: true  },
        { name: 'helpWaitingTime',   value: '120000',                         defaultOk: true  },
        { name: 'embedFooter',       value: 'RasporedBot by BrownBird Team',  defaultOk: true  },
        { name: 'activityType',      value: 'WATCHING',                       defaultOk: true  },
        { name: 'activityText',      value: 'for schedule changes',           defaultOk: true  },
        { name: 'botInviteLink',     value: 'http://localhost:3000',          defaultOk: true  },

    ], this.discordLog);
}