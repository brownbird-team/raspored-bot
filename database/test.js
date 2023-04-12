const fs = require('fs');
const db = require('./connect');
const imp = require('./queries/import');
const {getLastMasterId} = require('./queries/general.js');
const { Console } = require('console');
const func = async () => {
    db.databaseInit()
    let a = await  getLastMasterId();
    console.log(a);
}
func()
