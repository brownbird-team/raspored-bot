const { checkOptions } = require("../databaseQueries.js");

// Sljedeća funkcija koristi se kako bi uhvatila greške koje
// nastaju prilikom izvršavanja kontrolera
exports.use = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
}

// Print somenthing to console with web prefix
exports.webLog = async (logThis) => {
    console.log('[\u001b[32mWeb\033[00m] ' + logThis);
}

// Pregledaj sve postavke u tablici web_settings i kreiraj ih ako ne postoje
exports.checkOptions = async () => {
    return await checkOptions('web_settings', [
        
        { name: 'tempTokenLifetime',    value: '1200',        defaultOk: true  },
        { name: 'permTokenLifetime',    value: '2592000',     defaultOk: true  },
        { name: 'adminTokenLifetime',   value: '2592000',     defaultOk: true  },

    ], this.webLog);
}

// Provjeri je li email ispravan
exports.emailValid = (email) => {
    if (typeof(email) !== 'string')
        return false;
    if (email.length > 320)
        return false

    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase());
}

// Formatiraj datum za ispis
exports.formatDate = (dateObject) => {
    const day = String(dateObject.getDate()).padStart(2, '0');
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const year = String(dateObject.getFullYear()).padStart(4, '0');
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    const seconds = String(dateObject.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}