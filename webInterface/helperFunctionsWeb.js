const { checkOptions } = require("../databaseQueries.js");

// Print somenthing to console with web prefix
exports.webLog = async (logThis) => {
    console.log('[\u001b[32mWeb\033[00m] ' + logThis);
}

// Pregledaj sve postavke u tablici web_settings i kreiraj ih ako ne postoje
exports.checkOptions = async () => {
    return await checkOptions('web_settings', [
        
        { name: 'tempTokenLifetime',    value: '1200',        defaultOk: true  },
        { name: 'permTokenLifetime',    value: '2592000',     defaultOk: true  },

    ], this.webLog);
}

exports.emailValid = (email) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

exports.formatDate = (dateObject) => {
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = String(dateObject.getFullYear()).padStart(4, '0');
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    const seconds = String(dateObject.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}