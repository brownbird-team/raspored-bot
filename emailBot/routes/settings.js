const express = require("express");
const router = express.Router();
const database = require('./../rasporedEmailFunkcije');
let rasporedEmail = require('./../rasporedEmail');
let token = require('./../createToken');

let isTokenExist = async(id) => {
    let tokenExist = (await database.getTokens('mail_korisnici')).includes(id);
    return tokenExist;
}

router.get('/', (req, res) => {
    res.render('webSettings', {
        layout: 'index',
        title: 'Raspored bot | Postavke',
        before: true
    });
});

router.post('/', async(req, res) => {
    try {
        await database.checkEmail(req.body.sEmail, 'mail_korisnici');
        await database.updateToken(req.body.sEmail, token.token());
        await database.setTokenDate(req.body.sEmail, 'mail_korisnici');
        // ovdje poslati e-mail poruku
        res.render('webResponseReject', {
            layout: 'index',
            title: 'Raspored bot | Postavke',
            settingsRes: true,
            email: req.body.sEmail
        });
    } catch {
        res.render('webResponseReject', {
            layout: 'index',
            title: 'Raspored bot | Postavke',
            settingsRej: true,
            email: req.body.sEmail
        });
    }
});

router.get('/:id', async(req, res) => {
    let exist = await isTokenExist(req.params.id);
    if (exist) {
        try {
            await database.checkToken(req.params.id, 'mail_korisnici');
            res.render('webSettings', {
                layout: 'index',
                title: 'Raspored bot | Postavke',
                expired: true
            });
        } catch {
            let clName = await database.getClassName(req.params.id);
            let clID = await database.getClassID(clName);
            let dbEmail = await database.getEmail(req.params.id, 'mail_korisnici');
            let sendAllState = await database.getSendAllState(req.params.id);
            let darkThemeState = await database.getDarkThemeState(req.params.id);
            let unsubState = await database.getUnsubscribedState(dbEmail);
            let classList = await database.getAllClasses();
            res.render('webSettings', {
                layout: 'index',
                title: 'Raspored bot | Postavke',
                tokenURL: req.params.id,
                notExpired: true,
                classID: clID,
                className: clName,
                email: dbEmail,
                sendAll: sendAllState,
                darkTheme: darkThemeState,
                unsubscribe: unsubState,
                classL: classList
            });
        }
    } else {
        res.render('webSettings', {
            layout: 'index',
            title: 'Raspored bot | Postavke',
            expired: true
        });
    }
});

router.post('/:id', async(req, res) => {
    let exist = await isTokenExist(req.params.id);
    if (exist) {
        try {
            await database.checkToken(req.params.id, 'mail_korisnici');
            res.render('webSettings', {
                layout: 'index',
                title: 'Raspored bot | Postavke',
                expired: true
            });
        } catch {
            if (req.body.click) {
                let clientEmail = await database.getEmail(req.params.id, 'mail_korisnici');
                await database.setNewClass(clientEmail, req.body.razred);
                await database.updateSendAll(clientEmail, req.body.saljiSve);
                await database.updateTheme(clientEmail, req.body.tamnaTema);
                await database.updateUnsubscribe(clientEmail, req.body.pretplata);

                await database.removeTokenDate(req.params.id);
                await database.removeToken(req.params.id);
                res.render('webSettings', {
                    layout: 'index',
                    title: 'Raspored bot | Postavke',
                    complete: true,
                    email: clientEmail
                })
            }
        }
    } else {
        res.render('webSettings', {
            layout: 'index',
            title: 'Raspored bot | Postavke',
            expired: true
        });
    }
});

module.exports = router;