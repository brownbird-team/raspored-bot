const db = require('./../../../../databaseQueries.js');

module.exports = async () => {
    const classes = await db.dajRazrede(); 
    return classes;
}