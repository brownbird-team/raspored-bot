let rasporedEmail = require("./rasporedEmail");

const {query} = require('./../databaseConnect.js');

// query za mail_korisnici
mailUsers = `SELECT * FROM mail_korisnici`;
query(mailUsers, function(error, result) {
    if (error) throw error;

    for (i in result) {
        let j, countEmptyChanges = 0, dT;
        let tableData = {};
        let classSchedule = {};
        
        if (result[i].unsubscribed == 0) {
            // korisnik prima izmjene
            
            tableData.receiverEmail = result[i].adresa;
            tableData.classID = result[i].razred_id;
            tableData.sendAll = result[i].salji_sve;

            if (result[i].tamna_tema == 1) {
                // korisnik zeli tamnu temu
                dT = 1;
            } else {
                dT = 0;
            }

            // query za general_razred 
            generalClass = `SELECT * FROM general_razred WHERE id = '${tableData.classID}'`;
            query(generalClass, function(error, result){
                if (error) throw error;

                tableData.className = result[0].ime;
                if (result[0].aktivan == 1) {
                    console.log(`Razred ${result[0].ime} je aktivan.`);

                    // query za izmjene_razred
                    classChanges = `SELECT id,razred_id,tablica_id,sat1,sat2,sat3,sat4,sat5,sat6,sat7,sat8,sat9 
                                    FROM izmjene_razred WHERE razred_id = '${tableData.classID}'`;
                    query(classChanges, function(error, result) {
                        if (error) throw error;
                        tableData.tableID = result[0].tablica_id;
                        
                        for (let j = 1; j < 10; j++)
                            classSchedule[`sat${j}`] = result[0][`sat${j}`];

                        tableData.scheduleChanges = classSchedule;

                        // query za izmjene_tablica
                        tableChanges = `SELECT * FROM izmjene_tablica WHERE id = '${tableData.tableID}'`;
                        query(tableChanges, function(error, result) {
                            if (error) throw error;
                            
                            tableData.tableHeading = result[0].naslov;
                            tableData.morning = result[0].prijepodne;

                            if (tableData.morning == 0) {
                                j = -1;
                                tableData.shiftHeading = "POSLIJEPODNE";
                            } else {
                                j = 1;
                                tableData.shiftHeading = "PRIJEPODNE";
                            }

                            for (change in tableData.scheduleChanges) {
                                if (tableData.scheduleChanges[change] == null) {
                                    countEmptyChanges++;
                                    tableData.scheduleChanges[change] = "";
                                } 
                            }

                            console.log(tableData);
                            
                            if (countEmptyChanges == 9) {
                                if (tableData.sendAll == 1) {
                                    // korisnik zeli sve izmjene
                                    rasporedEmail.send_email(tableData, j, dT);
                                }
                            } else {
                                // korisnik ne zeli sve izmjene
                                rasporedEmail.send_email(tableData, j, dT);
                            }
                        });   
                    });
                } else {
                    console.log(`Razred ${result[0].ime} nije aktivan.`);
                }
            });
        } else { 
            // korisnik ne prima izmjene
            console.log(`Korisnik ${result[0].adresa} ne prima izmjene.`)
        }
    }
});