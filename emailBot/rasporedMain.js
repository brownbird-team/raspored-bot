let rasporedEmail = require('./rasporedEmail');
const { promiseQuery } = require('./../databaseConnect.js');
const { dajIzmjene } = require('../databaseQueries');
const database = require('./rasporedEmailFunkcije');

exports.main = async() => {
    const mailUsers = await promiseQuery(`SELECT * FROM mail_korisnici`);
    for (let user in mailUsers) {
        let j, chooseTemplate;
        let tableData = {}, classSchedule = {}, lenOfNewChanges;

        if (mailUsers[user].unsubscribed) 
            continue;

        const generalClass = await promiseQuery(`SELECT * 
                                                FROM general_razred 
                                                WHERE id = '${mailUsers[user].razred_id}'`);
        if (!generalClass[0].aktivan) 
            continue;

        tableData.receiverEmail = mailUsers[user].adresa;
        tableData.classID = mailUsers[user].razred_id;
        tableData.sendAll = mailUsers[user].salji_sve;
        tableData.lastSend = mailUsers[user].zadnja_poslana;
        tableData.darkTheme = mailUsers[user].tamna_tema;
        tableData.className = generalClass[0].ime;
    
        if (tableData.lastSend == null)
            await database.setLastChange(tableData.receiverEmail, tableData.classID);
        
        chooseTemplate = 1;
        if (!tableData.darkTheme) chooseTemplate = 0;

        tableData.classChanges = await dajIzmjene(tableData.classID, tableData.lastSend);
        lenOfNewChanges = tableData.classChanges.length;

        if (lenOfNewChanges != 0) {
            for (let change = lenOfNewChanges - 1; change >= 0; change--) {
                for (let j = 1; j < 10; j++) {
                    classSchedule[`sat${j}`] = tableData.classChanges[change][`sat${j}`];
                }
                tableData.scheduleChanges = classSchedule;
                tableData.tableHeading = tableData.classChanges[change].naslov;

                j = 1;
                tableData.shiftHeading = "PRIJEPODNE";
                if (!tableData.classChanges[change].ujutro) {
                    j = -1;
                    tableData.shiftHeading = "POSLIJEPODNE";
                }

                if (tableData.classChanges[change].sve_null) {
                    if (tableData.sendAll) {
                        // korisnik zeli sve izmjene
                        await rasporedEmail.send_changes(tableData, j, chooseTemplate, change);
                    }
                } else {
                    // korisnik ne zeli sve izmjene
                    await rasporedEmail.send_changes(tableData, j, chooseTemplate, change);
                }
            }
        }
    }
}

exports.main();
