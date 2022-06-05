const express = require("express");
const router = express.Router();
const database = require('./../rasporedEmailFunkcije');
const routeNames = require('../getRouteName');
const func = require('../../databaseQueries');
let rasporedEmail = require('./../rasporedEmail');
let token = require('./../createToken');

let isTokenExist = async(id) => {
    let tokenExist = (await database.getTokens('mail_korisnici')).includes(id);
    return tokenExist;
}

router.get('/', async(req, res) => {    
    res.render('webUnsubscribe', {
        layout: 'index',
        title: 'Raspored bot | Odjava',
        urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
        urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
        unsubscribeRoute: await routeNames.giveRouteName('unsubscribe'),
        homeRoute: await routeNames.giveRouteName('home')
    });
});


router.post('/', async(req, res) => {
    try {
        await database.checkEmail(req.body.unsubEmail, 'mail_korisnici');
        let emailToken = token.token();
        await database.updateToken(req.body.unsubEmail, emailToken);
        await database.setTokenDate(req.body.unsubEmail, 'mail_korisnici');
        
        let data = {receiverEmail: req.body.unsubEmail,
                    tExpired: (await database.getTokenDate(emailToken))[0].zadnji_token,
                    tokenR: emailToken
        };
        
        await rasporedEmail.sender(data, null, 'prekid-pretplate-potvrda');
        
        res.render('webResponseReject', {
            layout: 'index', 
            title: 'Raspored bot | Odjava',
            urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
            urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
            email: req.body.unsubEmail,
            res1: true,
            homeRoute: await routeNames.giveRouteName('home')
        });

    } catch {
        res.render('webResponseReject', {
            layout: 'index', 
            title: 'Raspored bot | Odjava',
            urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
            urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
            email: req.body.unsubEmail,
            rej1: true,
            unsubscribeRoute: await routeNames.giveRouteName('unsubscribe')
        });
    }
});

router.get('/:id', async(req, res) => {
    let result = await isTokenExist(req.params.id);
    if (result) {
        try {
            await database.checkToken(req.params.id, 'mail_korisnici');
            res.render('webEmailUnsubscribe', {
                layout: 'index',
                title: 'Raspored bot | Odjava',
                urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                invalid: true
            });
        } catch {
            res.render('webEmailUnsubscribe', {
                layout: 'index',
                title: 'Raspored bot | Odjava',
                urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                tokenURL: req.params.id,
                before: true,
                unsubscribeRoute: await routeNames.giveRouteName('unsubscribe'),
                homeRoute: await routeNames.giveRouteName('home')
             });
        }
    } else {
        res.render('webEmailUnsubscribe', {
           layout: 'index',
           title: 'Raspored bot | Odjava',
           urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
           urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
           invalid: true,
        });
    }
});

router.post('/:id', async(req, res) => {
    let result = await isTokenExist(req.params.id);
    if (result) {
        try {
            await database.checkToken(req.params.id, 'mail_korisnici');
            res.render('webEmailUnsubscribe', {
                layout: 'index',
                title: 'Raspored bot | Odjava',
                urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                invalid: true,
                invalidToken: req.params.id
             });
        } catch {
            let userEmail;
            if (req.body.click) {
                userEmail = await database.getEmail(req.params.id, 'mail_korisnici');
                await database.setUnsubscribe(req.params.id);
                
                await database.removeTokenDate(req.params.id);
                await database.removeToken(req.params.id);

                let data = {receiverEmail: userEmail}
                await rasporedEmail.sender(data, null, 'prekid-pretplate');

                res.render('webEmailUnsubscribe', {
                    layout: 'index',
                    title: 'Raspored bot | Odjava',
                    urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
                    urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
                    after: true, 
                    email: userEmail,
                });
            }
        }
    } else {
        res.render('webEmailUnsubscribe', {
            layout: 'index',
            title: 'Raspored bot | Odjava',
            urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
            urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
            invalid: true,
            invalidToken: req.params.id
         });
    }
});


module.exports = router;