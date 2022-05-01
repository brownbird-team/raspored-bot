const { promiseQuery, query } = require('./../databaseConnect.js');
const token = require('./createToken');

exports.Client = class {
    constructor(email, classID, sendAll, darkTheme) {
        this.email = email;
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

exports.setUnsubscribe = (token) => {
    return new Promise(async (resolve, reject) => {
        let updateState = `UPDATE mail_korisnici SET unsubscribed = 1 WHERE token = '${token}'`;
        await promiseQuery(updateState);
        resolve("Success");
    });
}

exports.updateWelcome = (clientID) => {
    return new Promise(async (resolve, reject) => {
        let updateWelcomeState = `UPDATE mail_korisnici SET dobrodoslica = 0 WHERE id = ${clientID}`;
        await promiseQuery(updateWelcomeState);
        resolve("Success");
    });
}

exports.updateLastSend = (classChangesID, clientID) => {
    return new Promise(async (resolve, reject) => {
        let updateLast = `UPDATE mail_korisnici SET zadnja_poslana = '${classChangesID}' WHERE id = ${clientID}`;
        await promiseQuery(updateLast);
        resolve("Success");
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
        let rmToken = await promiseQuery(`UPDATE mail_korisnici SET token = "", zadnji_token = "" WHERE token = '${token}'`);
        resolve("Success");
    });
}

exports.setTokenDate = (email) => {
    return new Promise(async (resolve, reject) => {
        let newDate = new Date();
        const leftTime = 1;
        newDate.setTime(newDate.getTime() + (leftTime * 60 * 1000));
        date = newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate() + " " + newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();
        let setClientTokenDate = await promiseQuery(`UPDATE mail_korisnici SET zadnji_token = '${date}' WHERE adresa = '${email}'`);
        resolve(setClientTokenDate);
    });
}

exports.getTokenDate = (token) => {
    return new Promise(async (resolve, reject) => {
        let tokenDate = await promiseQuery(`SELECT zadnji_token FROM mail_korisnici WHERE token = '${token}'`);
        resolve(tokenDate);
    });
}

exports.checkToken = (token) => {
    return new Promise(async (resolve, reject) => {
        let nowDate = new Date();
        let dbTokenDate = await promiseQuery(`SELECT zadnji_token FROM mail_korisnici WHERE token = '${token}'`);
        const timeToLeave = 1;
        const diffInMiliseconds = nowDate.valueOf() - dbTokenDate[0].zadnji_token.valueOf();
        const diffInHours = diffInMiliseconds / 1000 / 60;
        if (diffInHours >= timeToLeave) {
            console.log("Token je istekao.");
            resolve(true);
        } else {
            console.log("Token nije istekao.");
            reject(false);
        }
    });
}

exports.getTokens = () => {
    return new Promise((resolve, reject) => {
        query(`SELECT token FROM mail_korisnici WHERE token IS NOT NULL`, (err, result) => {
            if (err) throw err;
            let listOfTokens = [];
            for (t in result) {
                listOfTokens[t] = result[t].token;
            }
            resolve(listOfTokens);
        });
    });
}

exports.getEmail = (token) => {
    return new Promise(async(resolve, reject) => {
        let email = await promiseQuery(`SELECT adresa FROM mail_korisnici WHERE token = '${token}'`);
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

exports.checkEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        let check = await promiseQuery(`SELECT * FROM mail_korisnici WHERE adresa = '${email}'`);
        if (check.length > 0)
            resolve(true);
        else 
            reject(false);
    });
}
