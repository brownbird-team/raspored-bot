let rasporedEmail = require("./rasporedEmail");

const {promiseQuery} = require('./../databaseConnect.js');
const { dajIzmjene } = require("../databaseQueries");
// query za mail_korisnici
//mailUsers = `SELECT * FROM mail_korisnici`;
async function sql_mail() {
    mailUsers = await promiseQuery(`SELECT * 
                                    FROM mail_korisnici`);
    for (i in mailUsers) {
        let j, cT, first = 0;
        let tableData = {}, classSchedule = {};
        
        if (mailUsers[i].unsubscribed == 0) {
            // korisnik prima izmjene

            tableData.receiverEmail = mailUsers[i].adresa;
            tableData.classID = mailUsers[i].razred_id;
            tableData.sendAll = mailUsers[i].salji_sve;
            tableData.lastSend = mailUsers[i].zadnja_poslana;
            //console.log(tableData);

            if (mailUsers[i].dobrodoslica == 1) {
                // poslati email dobrodoslice
                cT = 2;
                first = 1;
                rasporedEmail.send_email(tableData, null, cT);
                updateMailUsers = await promiseQuery(`UPDATE mail_korisnici 
                                                      SET dobrodoslica = '0' 
                                                      WHERE dobrodoslica = '1' 
                                                      AND adresa = '${tableData.receiverEmail}'`);
            }

            if (mailUsers[i].tamna_tema == 1)
                // korisnik zeli tamnu temu
                cT = 1;
            else
                cT = 0;
            // query za general_razred
            generalClass = await promiseQuery(`SELECT * 
                                               FROM general_razred 
                                               WHERE id = '${tableData.classID}'`);
            tableData.className = generalClass[0].ime;
            if (generalClass[0].aktivan == 1) {
                //console.log(`Razred ${tableData.className} je aktivan.`);

                // query za izmjene_razred

                if (first == 1) {
                    // korisnik jos nije primio niti jednu izmjenu
                    first = 0;
                    tableData.classChanges = await dajIzmjene(tableData.classID, 0);
                    updateZadnjaPoslana = await promiseQuery(`UPDATE mail_korisnici SET zadnja_poslana = '${tableData.classChanges[0].id}'
                                                              WHERE adresa = '${tableData.receiverEmail}'`);
                    for (let j = 1; j < 10; j++)
                        classSchedule[`sat${j}`] = tableData.classChanges[0][`sat${j}`];

                    tableData.scheduleChanges = classSchedule;
                    tableData.tableHeading = tableData.classChanges[0].naslov;

                    if (tableData.classChanges[0].ujutro == false) {
                        j = -1;
                        tableData.shiftHeading = "POSLIJEPODNE";
                    } else {
                        j = 1;
                        tableData.shiftHeading = "PRIJEPODNE";
                    }

                    if (tableData.classChanges.sve_null == true) {
                        if (tableData.sendAll == 1) {
                            // korisnik zeli sve izmjene+
                            rasporedEmail.send_email(tableData, j, cT);
                            updateZadnjaPoslana = await promiseQuery(`UPDATE mail_korisnici SET zadnja_poslana = '${tableData.classChanges[0].id}'
                                                                    WHERE adresa = '${tableData.receiverEmail}'`);
                        }
                    } else {
                        // korisnik ne zeli sve izmjene
                        rasporedEmail.send_email(tableData, j, cT);
                        updateZadnjaPoslana = await promiseQuery(`UPDATE mail_korisnici SET zadnja_poslana = '${tableData.classChanges[0].id}'
                                                                WHERE adresa = '${tableData.receiverEmail}'`);
                    }
                }
                // korisnik je primio barem jednu izmjenu
                tableData.classChanges = await dajIzmjene(tableData.classID, tableData.lastSend);
                
                if (tableData.classChanges.length != 0) {
                    
                    for (let j = 1; j < 10; j++)
                        classSchedule[`sat${j}`] = tableData.classChanges[0][`sat${j}`];

                    tableData.scheduleChanges = classSchedule;
                    tableData.tableHeading = tableData.classChanges[0].naslov;

                    if (tableData.classChanges[0].ujutro == false) {
                        j = -1;
                        tableData.shiftHeading = "POSLIJEPODNE";
                    } else {
                        j = 1;
                        tableData.shiftHeading = "PRIJEPODNE";
                    }
                    //console.log(tableData.classChanges[0].sve_null);
                    if (tableData.classChanges[0].sve_null == true) {
                        if (tableData.sendAll == 1) {
                            // korisnik zeli sve izmjene
                            console.log(`Nove izmjena za korisnika ${tableData.receiverEmail}: Razred: ${tableData.className}.`);
                            rasporedEmail.send_email(tableData, j, cT);
                            updateZadnjaPoslana = await promiseQuery(`UPDATE mail_korisnici SET zadnja_poslana = '${tableData.classChanges[0].id}'
                                                                      WHERE adresa = '${tableData.receiverEmail}'`);
                        }
                    } else {
                        // korisnik ne zeli sve izmjene
                        console.log(`Nove izmjena za korisnika ${tableData.receiverEmail}: Razred: ${tableData.className}.`);
                        rasporedEmail.send_email(tableData, j, cT);
                        updateZadnjaPoslana = await promiseQuery(`UPDATE mail_korisnici SET zadnja_poslana = '${tableData.classChanges[0].id}'
                                                                  WHERE adresa = '${tableData.receiverEmail}'`);
                    }
                } else {
                    //console.log(`Nema novih izmjena za korisnika ${tableData.receiverEmail}: Razred: ${tableData.className}.`);
                }
            } else {
                // razred nije aktivan
                //console.log(`Razred ${generalClass[i].ime} nije aktivan.`);
            }

        } else {
            // korisnik ne prima izmjene
            //console.log(`Korisnik ${mailUsers[i].adresa} ne prima izmjene.`)
        }
    }
}
/*
step = 60000 // broj milisekundi između izvršavanja

const myloop = () => {
  setTimeout(async () => {
    await sql_mail();
    myloop();
  }, step);
}

myloop();
*/