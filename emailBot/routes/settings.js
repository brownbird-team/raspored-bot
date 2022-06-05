const express = require("express");
const router = express.Router();
const database = require('./../rasporedEmailFunkcije');
const routeNames = require('../getRouteName');
let rasporedEmail = require('./../rasporedEmail');
let token = require('./../createToken');

let isTokenExist = async(id) => {
    let tokenExist = (await database.getTokens('mail_korisnici')).includes(id);
    return tokenExist;
}

router.get('/', async(req, res) => {
    res.render('webSettings', {
        layout: 'index',
        title: 'Raspored bot | Postavke',
        urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
        urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
        before: true,
        settingsRoute: await routeNames.giveRouteName('settings'),
        homeRoute: await routeNames.giveRouteName('home'),
        url: await routeNames.giveRouteName('url')
    });
});

router.post('/', async(req, res) => {
    try {
        await database.checkEmail(req.body.sEmail, 'mail_korisnici');
        await database.updateToken(req.body.sEmail, token.token());
        await database.setTokenDate(req.body.sEmail, 'mail_korisnici');
        
        let userToken = await database.getToken(req.body.sEmail, 'mail_korisnici');
        let userTokenDate = await database.getTokenDate(userToken);
        let data = {receiverEmail: req.body.sEmail,
                    tExpired: userTokenDate[0].zadnji_token,
                    tokenR: userToken
        };
        await rasporedEmail.sender(data, null, 'postavke-potvrda');
        res.render('webResponseReject', {
            layout: 'index',
            title: 'Raspored bot | Postavke',
            urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
            urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
            settingsRes: true,
            email: req.body.sEmail,
            homeRoute: await routeNames.giveRouteName('home')
        });
    } catch {
        res.render('webResponseReject', {
            layout: 'index',
            title: 'Raspored bot | Postavke',
            urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
            urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
            settingsRej: true,
            email: req.body.sEmail,
            settingsRoute: await routeNames.giveRouteName('settings')
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
                urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                expired: true,
                homeRoute: await routeNames.giveRouteName('home')
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
                urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                tokenURL: req.params.id,
                notExpired: true,
                classID: clID,
                className: clName,
                email: dbEmail,
                sendAll: sendAllState,
                darkTheme: darkThemeState,
                unsubscribe: unsubState,
                classL: classList,
                settingsRoute: await routeNames.giveRouteName('settings'),
                homeRoute: await routeNames.giveRouteName('home')
            });
        }
    } else {
        res.render('webSettings', {
            layout: 'index',
            title: 'Raspored bot | Postavke',
            urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
            urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
            expired: true,
            homeRoute: await routeNames.giveRouteName('home')
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
                urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                expired: true,
                homeRoute: await routeNames.giveRouteName('home')
            });
        } catch {
            if (req.body.click) {
                let clientEmail = await database.getEmail(req.params.id, 'mail_korisnici');
                let classChanged = 1;
                if (req.body.razred == await database.getClassIDByEmail(clientEmail))
                    classChanged = 0;
                await database.setNewClass(clientEmail, req.body.razred);
                await database.updateSendAll(clientEmail, req.body.saljiSve);
                await database.updateTheme(clientEmail, req.body.tamnaTema);
                await database.updateUnsubscribe(clientEmail, req.body.pretplata);

                await database.removeTokenDate(req.params.id);
                await database.removeToken(req.params.id);

                let data = {receiverEmail: clientEmail,
                            className: await database.getClassById(req.body.razred),
                            sendAll: req.body.saljiSve,
                            darkTheme: req.body.tamnaTema
                };
                
                await rasporedEmail.sender(data, null, 'postavke');
                if (classChanged)
                    await database.sendLastChange(req.body.razred, clientEmail);
                res.render('webSettings', {
                    layout: 'index',
                    title: 'Raspored bot | Postavke',
                    urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                    urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                    complete: true,
                    email: clientEmail,
                    homeRoute: await routeNames.giveRouteName('home')
                })
            }
        }
    } else {
        res.render('webSettings', {
            layout: 'index',
            title: 'Raspored bot | Postavke',
            urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
            urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
            expired: true,
            homeRoute: await routeNames.giveRouteName('home')
        });
    }
});

module.exports = router;