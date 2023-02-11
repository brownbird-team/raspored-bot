const { checkOptions } = require('./../databaseQueries.js');

// Print somenthing to console with scraper prefix
exports.scraperLog = async (logThis) => {
    console.log('[\u001b[36mScraper\033[00m] ' + logThis);
}

// Pregledaj sve postavke u tablici izmjene_settings i kreiraj ih ako ne postoje
exports.checkOptions = async () => {
    return await checkOptions('izmjene_settings', [
        
        { name: 'urlSmjenaA',      value: 'https://www.tsrb.hr/a-smjena',       defaultOk: true  },
        { name: 'urlSmjenaB',      value: 'https://www.tsrb.hr/b-smjena',       defaultOk: true  },

    ], this.emailLog);
}