const nodemailer = require("nodemailer");
const database = require('./databaseQueriesEmail.js');
const { emailLog, checkOptions } = require('./helperFunctionsEmail.js');
const errors = require('./../errors.js');

let transporter;     // Transporter objekt, koristi se za slanje mailova
let mailSettings;    // Postavke potrebne za formiranje from polja u mail headeru

// Dobavi potrebne postavke iz baze i inicijaliziraj transporter
exports.init = async () => {
    let senderSettings;

    const status = await checkOptions();
    if (!status)
        throw new errors.EmailError('Email configuration invalid');

    senderSettings = {
        host: await database.getOption('host'),
        port: await database.getOption('port'),
        secure: (this.port == '465') ? true : false,
        auth: {
            user: await database.getOption('username'),
            pass: await database.getOption('password')
        }
    }
    mailSettings = {
        name: await database.getOption('name'),
        mail: senderSettings.auth.user
    }

    transporter = nodemailer.createTransport(senderSettings);
}

exports.send = async (toAddress, mailSubject, mailHtmlContent, mailPlainTextContent) => {
    if (!toAddress)
        throw new errors.EmailError('Receiver address cannot be undefined');
    if (!transporter || !mailSettings)
        throw new errors.EmailError('Internal error, either transporter or mailSerrings object is undefined');
    
    
    try {
        let info = await transporter.sendMail({
            from: `${mailSettings.name} <${mailSettings.mail}>`,
            to: toAddress,
            subject: mailSubject,
            html: (mailHtmlContent) ? mailHtmlContent : undefined,
            text: (mailPlainTextContent) ? mailPlainTextContent : undefined
        });

        return info;
    } catch (err) {
        throw new errors.EmailError('Failed to send email', err);
    }
}