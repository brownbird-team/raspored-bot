const express = require("express");
const router = express.Router();
const database = require('./../rasporedEmailFunkcije');
let rasporedEmail = require('./../rasporedEmail');
let token = require('./../createToken');

let isTokenExist = async(id) => {
    let tokenExist = (await database.getTokens('mail_privremeni_korisnici')).includes(id);
    return tokenExist;
}

router.get('/', async(req, res) => {
    res.render('webForm', {
        layout: 'index',
        before: true
    });
});

router.post('/auth', async(req, res) => {
    try {
        await database.checkAllEmailTables(req.body.subEmail);
        res.render('webResponseReject', {
            layout: 'index',
            email: req.body.subEmail,
            rej2: true
        });
    } catch {
        await database.insertTempData(req.body.subEmail, token.token());
        await database.setTokenDate(req.body.subEmail, 'mail_privremeni_korisnici');
        res.render('webResponseReject', {
            layout: 'index',
            email: req.body.subEmail,
            auth: true
        });
    }
});

router.get('/verification/:id', async(req, res) => {
    let exist = await isTokenExist(req.params.id);
    if (exist) {
        try {
            await database.checkToken(req.params.id, 'mail_privremeni_korisnici');
            await database.deleteTempData(req.params.id);
            res.render('webResponseReject', {
                layout: 'index',
                invalid: true
            });
        } catch {
            let tempEmail = await database.getEmail(req.params.id, 'mail_privremeni_korisnici');
            res.render('webForm', {
                layout: 'index',
                after: true,
                dbEmail: tempEmail,
                tokenURL: '/subscribe/verification/' + req.params.id
            });
        }
    } else {
        res.render('webResponseReject', {
            layout: 'index',
            invalid: true
        });
    }
});

router.post('/verification/:id', async(req, res) => {
    let result = await isTokenExist(req.params.id);
    if (result) {
        try {
            await database.checkToken(req.params.id, 'mail_privremeni_korisnici');
            await database.deleteTempData(req.params.id);
            res.render('webResponseReject', {
                layout: 'index',
                invalid: true
            });
        } catch {
            if (req.body.click) {
                const client = new database.Client(req.body.email, req.body.razred, req.body.saljiSve, req.body.tamnaTema);
                await database.insertData(client.receiverEmail, client.classID, client.sendAll, client.darkTheme);
                await database.deleteTempData(req.params.id);
                client.className = await database.getClassById(client.classID);
                rasporedEmail.sender(client, null, 2);
                res.render('webResponseReject', {
                    layout: 'index',
                    email: client.receiverEmail,
                    res2: true
                });
            }
        }
    } else {
        res.render('webResponseReject', {
            layout: 'index',
            invalid: true
        });
    }
});


module.exports = router;