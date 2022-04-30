let rasporedEmail = require('./rasporedEmail');

const {promiseQuery} = require('./../databaseConnect.js');
const { dajIzmjene } = require('../databaseQueries');
const database = require('./rasporedEmailFunkcije');
const emailToken = require('./createToken');

async function sql_mail() {
    mailUsers = await promiseQuery(`SELECT * FROM mail_korisnici`);
    for (i in mailUsers) {
        let j, cT, first = 0;
        let tableData = {}, classSchedule = {}, lenOfNewChanges, tokenDate, newTokenDate;
        const d = new Date();
        if (mailUsers[i].unsubscribed == 0) {
            // korisnik prima izmjene

            tableData.receiverEmail = mailUsers[i].adresa;
            tableData.classID = mailUsers[i].razred_id;
            tableData.sendAll = mailUsers[i].salji_sve;
            tableData.lastSend = mailUsers[i].zadnja_poslana;
            tableData.darkTheme = mailUsers[i].tamna_tema;
            tableData.token = mailUsers[i].token;
            
            tokenDate = mailUsers[i].zadnji_token;
            if (d.getDate() > JSON.stringify(tokenDate).slice(9, 11)) {
                await database.updateToken(mailUsers[i].id, emailToken.token());
                newTokenDate = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
                await database.updateTokenDate(mailUsers[i].id, newTokenDate);
                //console.log('[\u001b[33mEmail\033[00m] Novi token za korisnika' + tableData.receiverEmail);
            }
            // query za general_razred
            generalClass = await promiseQuery(`SELECT * 
                                               FROM general_razred 
                                               WHERE id = '${tableData.classID}'`);
            tableData.className = generalClass[0].ime;

            if (mailUsers[i].dobrodoslica) {
                // poslati email dobrodoslice
                cT = 2;
                first = 1;
                await database.updateWelcome(mailUsers[i].id);
                rasporedEmail.send_email(tableData, null, cT);
            }

            if (tableData.darkTheme)
                cT = 1;
            else
                cT = 0;

            if (generalClass[0].aktivan == 1) {
                //console.log(`Razred ${tableData.className} je aktivan.`);
                // query za izmjene_razred
                if (first) {
                    // korisnik jos nije primio niti jednu izmjenu
                    first = 0;
                    tableData.classChanges = await dajIzmjene(tableData.classID, 0);
                    await database.updateLastSend(tableData.classChanges[0].id, mailUsers[i].id);
                    lenOfNewChanges = 1; // provjeri                                                         
                } else {
                    // korisnik je primio barem jednu izmjenu
                    tableData.classChanges = await dajIzmjene(tableData.classID, tableData.lastSend);
                    lenOfNewChanges = tableData.classChanges.length;
                }
                
                if (tableData.classChanges.length != 0) {
                    for (let change = lenOfNewChanges - 1; change >= 0; change--) {
                        for (let j = 1; j < 10; j++)
                            classSchedule[`sat${j}`] = tableData.classChanges[change][`sat${j}`];

                        tableData.scheduleChanges = classSchedule;
                        tableData.tableHeading = tableData.classChanges[change].naslov;

                        if (tableData.classChanges[change].ujutro == false) {
                            j = -1;
                            tableData.shiftHeading = "POSLIJEPODNE";
                        } else {
                            j = 1;
                            tableData.shiftHeading = "PRIJEPODNE";
                        }
                
                        if (tableData.classChanges[change].sve_null == true) {
                            if (tableData.sendAll == 1) {
                                // korisnik zeli sve izmjene
                                console.log('[\u001b[33mEmail\033[00m] Nova izmjena za korisnika ' + tableData.receiverEmail + ': Razred: ' + tableData.className + '.');
                                await database.updateLastSend(tableData.classChanges[change].id, mailUsers[i].id);
                                rasporedEmail.send_email(tableData, j, cT);
                                console.log(`Zadnja poslana: ${tableData.classChanges[change].id}`);
                            }
                        } else {
                            // korisnik ne zeli sve izmjene
                            console.log('[\u001b[33mEmail\033[00m] Nova izmjena za korisnika ' + tableData.receiverEmail + ': Razred: ' + tableData.className + '.');
                            await database.updateLastSend(tableData.classChanges[change].id, mailUsers[i].id);
                            rasporedEmail.send_email(tableData, j, cT); 
                        }
                    }
                } else {
                    //console.log(`Nema novih izmjena za korisnika ${tableData.receiverEmail}: Razred: ${tableData.className}.`);
                }
            } else {
                // razred nije aktivan
                console.log('[\u001b[33mEmail\033[00m] Razred ' + generalClass[i].ime + ' nije aktivan.');
            }

        } else {
            // korisnik ne prima izmjene
            console.log('[\u001b[33mEmail\033[00m] Korisnik ' + mailUsers[i].adresa + ' ne prima izmjene.')
        }
    }
}

step = 10000 // broj milisekundi između izvršavanja

const myloop = () => {
  setTimeout(async () => {
    await sql_mail();
    myloop();
  }, step);
}

myloop();
