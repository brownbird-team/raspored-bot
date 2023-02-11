const { checkOptions } = require("../databaseQueries.js");

// Print somenthing to console with email prefix
exports.emailLog = async (logThis) => {
    console.log('[\u001b[33mEmail\033[00m] ' + logThis);
}

// Asikrono filtriraj array
exports.asyncFilter = async (arr, condFunc) => {
    const results = await Promise.all(arr.map(condFunc));

    return arr.filter((val, index) => 
        results[index]
    );
}

// Pregledaj sve postavke u tablici mail_settings i kreiraj ih ako ne postoje
exports.checkOptions = async () => {
    return await checkOptions('email_settings', [
        
        { name: 'host',          value: '',                                     defaultOk: false },
        { name: 'port',          value: '587',                                  defaultOk: true  },
        { name: 'name',          value: 'Raspored Bot',                         defaultOk: true  },
        { name: 'username',      value: '',                                     defaultOk: false },
        { name: 'password',      value: '',                                     defaultOk: false },
        { name: 'maxEmailSend',  value: '3',                                    defaultOk: true  },
        { name: 'dashboardUrl',  value: 'http://localhost:3000/',               defaultOk: false },
        { name: 'tokenUrl',      value: 'http://localhost:3000/login/<token>',  defaultOk: true  },
        { name: 'supportEmail',  value: 'support@brownbird.eu',                 defaultOk: true  },
        { name: 'maxTempTokens', value: '3',                                    defaultOk: true  },

    ], this.emailLog);
}

exports.formatDate = (dateObject) => {
    if (!dateObject)
        return null;
        
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = String(dateObject.getFullYear()).padStart(4, '0');
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    const seconds = String(dateObject.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}