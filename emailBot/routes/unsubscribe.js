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
    res.render('webUnsubscribe', {
        layout: 'index',
        title: 'Raspored bot | Odjava',
        unsubscribeRoute: await routeNames.giveRouteName('unsubscribe'),
        homeRoute: await routeNames.giveRouteName('home')
    });
});


router.post('/', async(req, res) => {
    try {
        await database.checkEmail(req.body.unsubEmail, 'mail_korisnici');
        let emailToken = token.token();
        const emailData = {receiverEmail: req.body.unsubEmail, tokenEmail: emailToken};
        await database.updateToken(emailData.receiverEmail, emailData.tokenEmail);
        await database.setTokenDate(emailData.receiverEmail, 'mail_korisnici');
        await rasporedEmail.sender(emailData, null, 3);
        res.render('webResponseReject', {
            layout: 'index', 
            title: 'Raspored bot | Odjava',
            email: req.body.unsubEmail,
            res1: true,
            homeRoute: await routeNames.giveRouteName('home')
        });

    } catch {
        res.render('webResponseReject', {
            layout: 'index', 
            title: 'Raspored bot | Odjava',
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
                invalid: true
            });
        } catch {
            res.render('webEmailUnsubscribe', {
                layout: 'index',
                title: 'Raspored bot | Odjava',
                tokenURL: req.params.id,
                before: true,
                unsubscribeRoute: await routeNames.giveRouteName('unsubscribe')
             });
        }
    } else {
        res.render('webEmailUnsubscribe', {
           layout: 'index',
           title: 'Raspored bot | Odjava',
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
                res.render('webEmailUnsubscribe', {
                    layout: 'index',
                    title: 'Raspored bot | Odjava',
                    after: true, 
                    email: userEmail,
                    homeRoute: await routeNames.giveRouteName('home')
                });
            }
        }
    } else {
        res.render('webEmailUnsubscribe', {
            layout: 'index',
            title: 'Raspored bot | Odjava',
            invalid: true,
            invalidToken: req.params.id
         });
    }
});


module.exports = router;