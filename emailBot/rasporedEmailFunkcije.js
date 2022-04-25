const { promiseQuery } = require('./../databaseConnect.js');
const token = require('./createToken');

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

exports.updateToken = (clientID, token) => {
    return new Promise(async (resolve, reject) => {
        let updateClientToken = `UPDATE mail_korisnici SET token = '${token}' WHERE id = ${clientID}`;
        await promiseQuery(updateClientToken);
        resolve("Success");
    });
}

exports.updateTokenDate = (clientID, tokenDate) => {
    return new Promise(async (resolve, reject) => {
        let updateClientTokenDate = `UPDATE mail_korisnici SET zadnji_token = '${tokenDate}' WHERE id = ${clientID}`;
        await promiseQuery(updateClientTokenDate);
        resolve("Success");
    });
}