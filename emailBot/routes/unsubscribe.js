const express = require("express");
const router = express.Router();
const schedule = require("node-schedule");
const database = require('./../rasporedEmailFunkcije');

let token = require('./../createToken');

let isTokenExist = async(id) => {
    let tokenExist = (await database.getTokens()).includes(id);
    return tokenExist;
}

router.get('/', async(req, res) => {    
    res.render('webUnsubscribe', {layout: 'index'});
});


router.post('/', async(req, res) => {
    try {
        await database.checkEmail(req.body.unsubEmail);
        let emailToken = token.token();
        const emailData = {receiverEmail: req.body.unsubEmail, tokenEmail: emailToken};
        await database.updateToken(emailData.receiverEmail, emailData.tokenEmail);
        await database.setTokenDate(emailData.receiverEmail);
        //rasporedEmail.send_email(emailData, null, 3);
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
        res.render('webEmailUnsubscribe', {
           layout: 'index',
           tokenURL: req.params.id,
           before: true 
        });
    } else {
        res.render('webEmailUnsubscribe', {
           layout: 'index',
           invalid: true,
           invalidToken: req.params.id
        });
    }
});

router.post('/:id', async(req, res) => {
    let result = await isTokenExist(req.params.id);
    if (result) {
        let userEmail;
        if (req.body.click)
            userEmail = await database.getEmail(req.params.id);
            await database.setUnsubscribe(req.params.id);
            res.render('webEmailUnsubscribe', {
                layout: 'index',
                after: true, 
                email: userEmail
            });
    } else {
        res.render('webEmailUnsubscribe', {
            layout: 'index',
            invalid: true,
            invalidToken: req.params.id
         });
    }
});


module.exports = router;