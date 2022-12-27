const { promiseQuery, query } = require('./../databaseConnect.js');
const token = require('./createToken');
const raporedEmail = require('./rasporedEmail');

const prefix = '[\u001b[33mEmail\033[00m]';

// Vrati vrijednost optiona iz baze
exports.getOption = (option) => {
    return new Promise(async (resolve, reject) => {
        const query = `SELECT * FROM mail_settings WHERE option = '${option}'`;
        let result = await promiseQuery(query);
        let objekt;
        if(result.length === 0) {
            objekt = null;
        } else {
            objekt = {
                id: result[0].id,
                option: result[0].option,
                value: result[0].value
            }
        }
        resolve(objekt);
    });
}
// Postavi novu vrijednost na option i kreiraj ga ako ne postoji
exports.setOption = (option, value) => {
    return new Promise(async (resolve, reject) => {
        const check = await exports.getOption(option);
        let query;
        if(check !== null) {
            query = `UPDATE mail_settings SET value = '${value}' WHERE option = '${option}'`;
        } else {
            query = `INSERT INTO mail_settings (option, value) VALUES ('${option}', '${value}')`;
        }
        await promiseQuery(query);
        resolve("done");
    });
}
// Pregledaj sve postavke u tablici mail_settings i kreiraj ih ako ne postoje
exports.checkOptions = async () => {
    // Postavi allGood na false ako je neki settings u takvom stanju da se bot
    // ne može pokrenuti
    let allGood = true;
    const host = await this.getOption("host");
    if (!host) {
        this.setOption("host", "");
        console.log(prefix + " Host record nije pronađen, kreiram ga (ne porećem bota)");
        allGood = false;
    } else if (host.value === "") {
        console.log(prefix + " Host record je prazan (ne pokrećem bota)");
        allGood = false;
    }
    const port = await this.getOption("port");
    if (!port) {
        this.setOption("port", "587");
        console.log(prefix + " Port record nije pronađen, kreiram ga (ne porećem bota)");
        allGood = false;
    } else if (port.value === "") {
        console.log(prefix + " Port record je prazan (ne pokrećem bota)");
        allGood = false;
    }
    const name = await this.getOption("name");
    if (!name) {
        this.setOption("name", "Raspored bot");
        console.log(prefix + " Name record nije pronađen, kreiram ga (ne porećem bota)");
        allGood = false;
    } else if (name.value === "") {
        console.log(prefix + " Name record je prazan (ne pokrećem bota)");
        allGood = false;
    }
    const username = await this.getOption("username");
    if (!username) {
        this.setOption("username", "");
        console.log(prefix + " Username record nije pronađen, kreiram ga (ne porećem bota)");
        allGood = false;
    } else if (username.value === "") {
        console.log(prefix + " Username record je prazan (ne pokrećem bota)");
        allGood = false;
    }
    const password = await this.getOption("password");
    if (!password) {
        this.setOption("password", "");
        console.log(prefix + " Password record nije pronađen, kreiram ga (ne porećem bota)");
        allGood = false;
    } else if (password.value === "") {
        console.log(prefix + " Password record je prazan (ne pokrećem bota)");
        allGood = false;
    }
    return allGood;
}

exports.Client = class {
    constructor(receiverEmail, classID, sendAll, darkTheme) {
        this.receiverEmail = receiverEmail;
        this.classID = classID;
        if (sendAll == undefined)
            this.sendAll = 0;
        else
            this.sendAll = 1;
        if (darkTheme == undefined)
            this.darkTheme = 0;
        else
            this.darkTheme = 1;
    }
}

exports.getDateNow = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const addZero = (num) => `${num}`.padStart(2, '0');

    const formatted =
        year +
        '-' +
        addZero(month + 1) +
        '-' +
        addZero(day) +
        ' ' +
        addZero(hours) +
        ':' +
        addZero(minutes) +
        ':' +
        addZero(seconds);
    return formatted;
};

exports.getUserLastChange = (email) => {
    return new Promise(async (resolve, reject) => {
        let userLast = await promiseQuery(`SELECT zadnja_poslana FROM mail_korisnici WHERE adresa = '${email}'`);
        resolve(userLast[0].zadnja_poslana);
    });
}

exports.checkChanges = (classID, email, template) => {
    return new Promise(async (resolve, reject) => {
        let changes = await promiseQuery(`SELECT id, tablica_id FROM izmjene_razred WHERE razred_id = ${classID} ORDER BY id DESC`);
        let browse = await promiseQuery(`SELECT id FROM izmjene_razred WHERE tablica_id = ${changes[0].tablica_id} AND razred_id = ${classID} ORDER BY id DESC`);
        if (browse.length > 1) {
            if (browse[0].id != (await exports.getUserLastChange(email))) {
                let data = {}, j;
                let fResult = await promiseQuery(`SELECT razred_id, tablica_id, sat1, sat2, sat3, sat4, sat5, sat6, sat7, sat8, sat9 FROM izmjene_razred WHERE id = ${changes[0].id}`);
                let sResult = await promiseQuery(`SELECT naslov, smjena, prijepodne FROM izmjene_tablica WHERE id = ${fResult[0].tablica_id}`);
                //console.log(fResult, sResult);
                for (let i = 1; i < 10; i++) {
                    data[`sat${i}`] = fResult[0][`sat${i}`];
                }
                cName = await promiseQuery(`SELECT ime FROM general_razred WHERE id = ${fResult[0].razred_id}`);
                data.receiverEmail = email;
                data.changeID = changes[0].id
                data.className = cName[0].ime;
                data.tableHeading = sResult[0].naslov;
                data.shiftHeading = "POSLIJEPODNE";
                j = -1;
                if (sResult[0].prijepodne) {
                    data.shiftHeading = "PRIJEPODNE";
                    j = 1;
                }
                //console.log(data);
                await raporedEmail.send_changes(data, j, template);
                resolve(1);
            }
            resolve(0);
        } else {
            resolve(0);
        }
    });
}

exports.getSenderEmailData = () => {
    return new Promise(async (resolve, reject) => {
        let data = await promiseQuery(`SELECT adresa, lozinka FROM mail_settings`);
        resolve(data);
    });
}

exports.setUnsubscribe = (token) => {
    return new Promise(async (resolve, reject) => {
        let updateState = await promiseQuery(`UPDATE mail_korisnici SET unsubscribed = 1 WHERE token = '${token}'`);
        resolve(updateState);
    });
}

exports.updateLastSend = (classChangesID, email) => {
    return new Promise(async (resolve, reject) => {
        let updateLast = await promiseQuery(`UPDATE mail_korisnici SET zadnja_poslana = '${classChangesID}' WHERE adresa = '${email}'`);
        resolve(updateLast);
    });
}

exports.getLastChange = (classID) => {
    return new Promise(async (resolve, reject) => {
        let change = await promiseQuery(`SELECT id FROM izmjene_razred WHERE razred_id = ${classID} ORDER BY id DESC LIMIT 1`);
        resolve(change[0].id);
    });
}

exports.setLastChange = (email, classID) => {
    return new Promise(async (resolve, reject) => {
        let lastChange = await this.getLastChange(classID);
        let update = await this.updateLastSend(lastChange, email);
        resolve(update);
    });
}

exports.sendLastChange = (classID, email) => {
    return new Promise(async (resolve, reject) => {
        let lastChangeID = await exports.getLastChange(classID);
        
        let change = await promiseQuery(`SELECT * FROM izmjene_razred WHERE id = ${lastChangeID}`);
        let table = await promiseQuery(`SELECT * FROM izmjene_tablica WHERE id = ${change[0].tablica_id}`);
        let user = await promiseQuery(`SELECT salji_sve, tamna_tema FROM mail_korisnici WHERE adresa = '${email}'`);
        let j, empty = 0;
        let data = {receiverEmail: email,
                    changeID: lastChangeID,
                    className: await exports.getClassById(change[0].razred_id),
                    tableHeading: table[0].naslov};
        for (let i = 1; i < 10; i++) {
            data[`sat${i}`] = change[0][`sat${i}`];
            if (data[`sat${i}`] == '')
                empty++;
        }
        data.shiftHeading = "POSLIJEPODNE";
        j = -1;
        if (table[0].prijepodne) {
            data.shiftHeading = "PRIJEPODNE";
            j = 1;
        }
        let template = 1;
        if (!user[0].tamna_tema) template = 0;
        if (empty == 9) {
            if (user[0].salji_sve)
                await raporedEmail.send_changes(data, j, template);
                resolve(true);
        } else {
            await raporedEmail.send_changes(data, j, template);
            resolve(true);
        }
    });
}

exports.updateToken = (email, token) => {
    return new Promise(async (resolve, reject) => {
        let updateClientToken = `UPDATE mail_korisnici SET token = '${token}' WHERE adresa = '${email}'`;
        await promiseQuery(updateClientToken);
        resolve("Success");
    });
}

exports.removeToken = (token) => {
    return new Promise(async (resolve, reject) => {
        let rmToken = await promiseQuery(`UPDATE mail_korisnici SET token = "", zadnji_token = "0000-00-00 00:00:00" WHERE token = '${token}'`);
        resolve(rmToken);
    });
}

exports.getToken = (email, table) => {
    return new Promise(async (resolve, reject) => {
        let getT = await promiseQuery(`SELECT token FROM ${table} WHERE adresa = '${email}'`);
        resolve(getT[0].token);
    });
}

exports.setTokenDate = (email, table) => {
    return new Promise(async (resolve, reject) => {
        let newDate = new Date();
        const leftTime = 2;
        newDate.setTime(newDate.getTime() + (leftTime * 60 * 60 * 1000));
        date = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate() + " " + newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();
        let setClientTokenDate = await promiseQuery(`UPDATE ${table} SET zadnji_token = '${date}' WHERE adresa = '${email}'`);
        resolve(setClientTokenDate);
    });
}

exports.getTokenDate = (token) => {
    return new Promise(async (resolve, reject) => {
        let tokenDate = await promiseQuery(`SELECT zadnji_token FROM mail_korisnici WHERE token = '${token}'`);
        resolve(tokenDate);
    });
}

exports.getTokenDateT2 = (token) => {
    return new Promise(async (resolve, reject) => {
        let tokenDate = await promiseQuery(`SELECT zadnji_token FROM mail_privremeni_korisnici WHERE token = '${token}'`);
        resolve(tokenDate[0].zadnji_token);
    });
}

exports.removeTokenDate = (token) => {
    return new Promise(async (resolve, reject) => {
        let removeDate = await promiseQuery(`UPDATE mail_korisnici SET zadnji_token = "0000-00-00 00:00:00" WHERE token = '${token}'`);
        resolve(removeDate);
    });
}

exports.checkToken = (token, table) => {
    return new Promise(async (resolve, reject) => {
        let nowDate = new Date();
        let dbTokenDate = await promiseQuery(`SELECT zadnji_token FROM ${table} WHERE token = '${token}'`);
        const diffInMiliseconds = dbTokenDate[0].zadnji_token.valueOf() - nowDate.valueOf();
        const diffInHours = diffInMiliseconds / 1000 / 60;
        //console.log("razlika u sekundama: ", diffInHours);
        if (diffInHours <= 0) {
            //console.log("Token je istekao.");
            await this.removeTokenDate(token);
            await this.removeToken(token);
            resolve(true);
        } else {
            //console.log("Token nije istekao.");
            reject(false);
        }
    });
}

exports.getTokens = (table) => {
    return new Promise((resolve, reject) => {
        query(`SELECT token FROM ${table} WHERE token IS NOT NULL`, (err, result) => {
            if (err) throw err;
            let listOfTokens = [];
            for (t in result) {
                listOfTokens[t] = result[t].token;
            }
            resolve(listOfTokens);
        });
    });
}

exports.getEmail = (token, table) => {
    return new Promise(async(resolve, reject) => {
        let email = await promiseQuery(`SELECT adresa FROM ${table} WHERE token = '${token}'`);
        resolve(email[0].adresa);
    });
}

exports.insertData = (email, classID, sendAll, darkTheme) => {
    return new Promise(async (resolve, reject) => {
        let insert = `INSERT INTO mail_korisnici (adresa, razred_id, salji_sve, tamna_tema) VALUES ('${email}', '${classID}', '${sendAll}', '${darkTheme}')`;
        await promiseQuery(insert);
        resolve("Success");
    });
}

exports.insertTempData = (email, token) => {
    return new Promise(async (resolve, reject) => {
        let tempData = await promiseQuery(`INSERT INTO mail_privremeni_korisnici (adresa, token) VALUES ('${email}', '${token}')`);
        resolve(tempData);
    });
}

exports.deleteTempData = (token) => {
    return new Promise(async (resolve, reject) => {
        let deleteData = await promiseQuery(`DELETE FROM mail_privremeni_korisnici WHERE token = '${token}'`);
        resolve(deleteData);
    });
}

exports.checkEmail = (email, table) => {
    return new Promise(async (resolve, reject) => {
        let check = await promiseQuery(`SELECT * FROM ${table} WHERE adresa = '${email}'`);
        if (check.length > 0)
            resolve(true);
        else 
            reject(false);
    });
}

exports.checkAllEmailTables = (email) => {
    return new Promise(async (resolve, reject) => {
        let checkFirst = await promiseQuery(`SELECT * FROM mail_korisnici WHERE adresa = '${email}'`);
        let checkSecond = await promiseQuery(`SELECT * FROM mail_privremeni_korisnici WHERE adresa = '${email}'`);
        if (checkFirst.length == 0 && checkSecond.length == 0)
            reject(false);
        else
            resolve(true);
    });
}

exports.getClassById = (classID) => {
    return new Promise(async (resolve, reject) => {
        let CLASS = await promiseQuery(`SELECT ime FROM general_razred WHERE id = ${classID}`);
        resolve(CLASS[0].ime);
    });
}

exports.getClassName = (token) => {
    return new Promise(async (resolve, reject) => {
        let classID = await promiseQuery(`SELECT razred_id FROM mail_korisnici WHERE token = '${token}'`);
        let className = await promiseQuery(`SELECT ime FROM general_razred WHERE id = ${classID[0].razred_id}`);
        resolve(className[0].ime);
    });
}

exports.getSendAllState = (token) => {
    return new Promise(async (resolve, reject) => {
        let sendAll = await promiseQuery(`SELECT salji_sve FROM mail_korisnici WHERE token = '${token}'`);
        if (sendAll[0].salji_sve)
            resolve(true);
        else 
            resolve(false);
    });
}

exports.getDarkThemeState = (token) => {
    return new Promise(async (resolve, reject) => {
        let darkTheme = await promiseQuery(`SELECT tamna_tema FROM mail_korisnici WHERE token = '${token}'`);
        if (darkTheme[0].tamna_tema)
            resolve(true);
        else 
            resolve(false);
    });
}

exports.getUnsubscribedState = (email) => {
    return new Promise(async (resolve, reject) => {
        let unsubscribedState = await promiseQuery(`SELECT unsubscribed FROM mail_korisnici WHERE adresa = '${email}'`);
        if (unsubscribedState[0].unsubscribed)
            resolve(false);
        else 
            resolve(true);
    });
}

exports.setNewClass = (email, classID) => {
    return new Promise(async (resolve, reject) => {
        if (classID != undefined) {
            let newClass = await promiseQuery(`UPDATE mail_korisnici SET razred_id = ${classID} WHERE adresa = '${email}'`);
            await this.setLastChange(email, classID);
            resolve(true);
        }
    });
}

exports.updateSendAll = (email, sendAll) => {
    return new Promise(async (resolve, reject) => {
        let state = 0;
        if (sendAll == 'on') state = 1;
        let updateState = await promiseQuery(`UPDATE mail_korisnici SET salji_sve = ${state} WHERE adresa = '${email}'`);
        resolve(updateState);
    });
}

exports.updateTheme = (email, darkTheme) => {
    return new Promise(async (resolve, reject) => {
        let theme = 0;
        if (darkTheme == 'on') theme = 1;
        let themeUpdate = await promiseQuery(`UPDATE mail_korisnici SET tamna_tema = ${theme} WHERE adresa = '${email}'`);
        resolve(themeUpdate);
    });
}

exports.updateUnsubscribe = (email, unsubscribed) => {
    return new Promise(async (resolve, reject) => {
        let unsubscribe = 1;
        if (unsubscribed == 'on') unsubscribe = 0;
        let updateState = await promiseQuery(`UPDATE mail_korisnici SET unsubscribed = ${unsubscribe} WHERE adresa = '${email}'`);
        resolve(updateState);
    });
}

exports.getClassID = (className) => {
    return new Promise(async (resolve, reject) => {
        let classID = await promiseQuery(`SELECT id FROM general_razred WHERE ime = '${className}'`);
        resolve(classID[0].id);
    });
}

exports.getAllClasses = () => {
    return new Promise(async (resolve, reject) => {
        let classes = await promiseQuery(`SELECT id, ime FROM general_razred WHERE aktivan = 1`);
        resolve(classes);
    });
}

exports.getSubscribeState = (email) => {
    return new Promise(async (resolve, reject) => {
        let state = await promiseQuery(`SELECT unsubscribed FROM mail_korisnici WHERE adresa = '${email}'`);
        resolve(!state[0].unsubscribed);
    });
}

exports.getClassIDByEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        let classID = await promiseQuery(`SELECT razred_id FROM mail_korisnici WHERE adresa = '${email}'`);
        resolve(classID[0].razred_id);
    });
}