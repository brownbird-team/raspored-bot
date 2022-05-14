const express = require("express");
const router = express.Router();
const database = require('./../rasporedEmailFunkcije');
let rasporedEmail = require('./../rasporedEmail');
let token = require('./../createToken');

let isTokenExist = async(id) => {
    let tokenExist = (await database.getTokens('mail_korisnici')).includes(id);
    return tokenExist;
}

router.get('/', async(req, res) => {    
    res.render('webUnsubscribe', {layout: 'index'});
});


router.post('/', async(req, res) => {
    try {
        await database.checkEmail(req.body.unsubEmail, 'mail_korisnici');
        let emailToken = token.token();
        const emailData = {receiverEmail: req.body.unsubEmail, tokenEmail: emailToken};
        await database.updateToken(emailData.receiverEmail, emailData.tokenEmail);
        await database.setTokenDate(emailData.receiverEmail, 'mail_korisnici');
        rasporedEmail.sender(emailData, null, 3);
        res.render('webResponseReject', {
            layout: 'index', 
            email: req.body.unsubEmail,
            res1: true
        });

    } catch {
        res.render('webResponseReject', {
            layout: 'index', 
            email: req.body.unsubEmail,
            rej1: true
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
                invalid: true
            });
        } catch {
            res.render('webEmailUnsubscribe', {
                layout: 'index',
                tokenURL: req.params.id,
                before: true 
             });
        }
    } else {
        res.render('webEmailUnsubscribe', {
           layout: 'index',
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
                    after: true, 
                    email: userEmail
                });
            }
        }
    } else {
        res.render('webEmailUnsubscribe', {
            layout: 'index',
            invalid: true,
            invalidToken: req.params.id
         });
    }
});


module.exports = router;