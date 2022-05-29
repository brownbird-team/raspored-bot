const rsprdEmail = require('./rasporedMain');
const strugac = require('../webScraper/webScraperMain');
const schedule = require('node-schedule');

const job = schedule.scheduleJob('* * * * *', async() => {
    console.log("Job"); 
    await strugac.sql();
    await rsprdEmail.main();
});
