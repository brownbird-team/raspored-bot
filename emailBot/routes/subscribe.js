const express = require("express");
const router = express.Router();
const database = require('./../rasporedEmailFunkcije');
const routeNames = require('../getRouteName');
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
        await database.checkAllEmailTables(req.body.subEmail);
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
    } catch {
        await database.insertTempData(req.body.subEmail, token.token());
        await database.setTokenDate(req.body.subEmail, 'mail_privremeni_korisnici');
        let userToken = await database.getToken(req.body.subEmail);
        let data = {receiverEmail: req.body.subEmail,
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
                const client = new database.Client(req.body.email, req.body.razred, req.body.saljiSve, req.body.tamnaTema);
                await database.insertData(client.receiverEmail, client.classID, client.sendAll, client.darkTheme);
                await database.deleteTempData(req.params.id);
                client.className = await database.getClassById(client.classID);
                await rasporedEmail.sender(client, null, 2);
                res.render('webResponseReject', {
                    layout: 'index',
                    title: 'Raspored bot | Pretplata',
                    urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                    urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                    email: client.receiverEmail,
                    res2: true,
                    homeRoute: await routeNames.giveRouteName('home')
                });
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