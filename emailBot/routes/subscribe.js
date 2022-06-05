const express = require("express");
const router = express.Router();
const database = require('./../rasporedEmailFunkcije');
const routeNames = require('../getRouteName');
const func = require('../../databaseQueries');
let rasporedEmail = require('./../rasporedEmail');
let token = require('./../createToken');

let isTokenExist = async(id) => {
    let tokenExist = (await database.getTokens('mail_privremeni_korisnici')).includes(id);
    return tokenExist;
}

router.get('/', async(req, res) => {
    res.render('webForm', {
        layout: 'index',
        title: 'Raspored bot | Pretplata',
        urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
        urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
        before: true,
        subscribeRoute: await routeNames.giveRouteName('subscribe'),
        homeRoute: await routeNames.giveRouteName('home')
    });
});

router.post('/', async(req, res) => {
    try {
        if (func.onlyASCII(req.body.subEmail)) {
            let newEmail = func.prepareForSQL(req.body.subEmail);

            await database.checkAllEmailTables(newEmail);
            res.render('webResponseReject', {
                layout: 'index',
                title: 'Raspored bot | Pretplata',
                urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                email: req.body.subEmail,
                rej2: true,
                subscribeRoute: await routeNames.giveRouteName('subscribe'),
                homeRoute: await routeNames.giveRouteName('home')
            });
        }

    } catch {
        if (func.onlyASCII(req.body.subEmail)) {
            let newEmail = func.prepareForSQL(req.body.subEmail);

            await database.insertTempData(newEmail, token.token());
            await database.setTokenDate(newEmail, 'mail_privremeni_korisnici');
            let userToken = await database.getToken(newEmail, 'mail_privremeni_korisnici');
            let data = {receiverEmail: newEmail,
                        urlR: await routeNames.giveRouteName('url'),
                        homeR: await routeNames.giveRouteName('home'),
                        subscribeR: await routeNames.giveRouteName('subscribe'),
                        tokenR: userToken,
                        tExpired: await database.getTokenDateT2(userToken),
                        privacyR: await routeNames.giveRouteName('privacy-policy')};
            await rasporedEmail.sender(data, null, 4);
            res.render('webResponseReject', {
                layout: 'index',
                title: 'Raspored bot | Pretplata',
                urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                email: req.body.subEmail,
                auth: true,
                homeRoute: await routeNames.giveRouteName('home')
            });
        }
    }
});

router.get('/:id', async(req, res) => {
    let exist = await isTokenExist(req.params.id);
    if (exist) {
        try {
            await database.checkToken(req.params.id, 'mail_privremeni_korisnici');
            await database.deleteTempData(req.params.id);
            res.render('webResponseReject', {
                layout: 'index',
                title: 'Raspored bot | Pretplata',
                urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                invalid: true
            });
        } catch {
            let tempEmail = await database.getEmail(req.params.id, 'mail_privremeni_korisnici');
            let classList = await database.getAllClasses();
            res.render('webForm', {
                layout: 'index',
                title: 'Raspored bot | Pretplata',
                urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                after: true,
                dbEmail: tempEmail,
                tokenURL: req.params.id,
                classL: classList,
                subscribeRoute: await routeNames.giveRouteName('subscribe'),
                homeRoute: await routeNames.giveRouteName('home'),
                secureRoute: await routeNames.giveRouteName('privacy-policy')
            });
        }
    } else {
        res.render('webResponseReject', {
            layout: 'index',
            title: 'Raspored bot | Pretplata',
            urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
            urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
            invalid: true
        });
    }
});

router.post('/:id', async(req, res) => {
    let result = await isTokenExist(req.params.id);
    if (result) {
        try {
            await database.checkToken(req.params.id, 'mail_privremeni_korisnici');
            await database.deleteTempData(req.params.id);
            res.render('webResponseReject', {
                layout: 'index',
                title: 'Raspored bot | Pretplata',
                urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                invalid: true
            });
        } catch {
            if (req.body.click) {
                if (req.body.razred > 0 && req.body.razred <= 40) {
                    let dbEmail = await database.getEmail(req.params.id, 'mail_privremeni_korisnici');
                    const client = new database.Client(dbEmail, req.body.razred, req.body.saljiSve, req.body.tamnaTema);
                    await database.insertData(client.receiverEmail, client.classID, client.sendAll, client.darkTheme);
                    await database.deleteTempData(req.params.id);
                    client.className = await database.getClassById(client.classID);

                    await rasporedEmail.sender(client, null, 'welcome');
                    await database.sendLastChange(client.classID, client.receiverEmail);
                    
                    res.render('webResponseReject', {
                        layout: 'index',
                        title: 'Raspored bot | Pretplata',
                        urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                        urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                        email: client.receiverEmail,
                        res2: true,
                        homeRoute: await routeNames.giveRouteName('home')
                    });
                } // response ako je razred id veci od 40 ili manji od 1
            }
        }
    } else {
        res.render('webResponseReject', {
            layout: 'index',
            title: 'Raspored bot | Pretplata',
            urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
            urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
            invalid: true
        });
    }
});


module.exports = router;