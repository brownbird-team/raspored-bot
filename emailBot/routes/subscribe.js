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
        title: 'Raspored bot | Pretplata',
        before: true
    });
});

router.post('/', async(req, res) => {
    try {
        await database.checkAllEmailTables(req.body.subEmail);
        res.render('webResponseReject', {
            layout: 'index',
            title: 'Raspored bot | Pretplata',
            email: req.body.subEmail,
            rej2: true
        });
    } catch {
        await database.insertTempData(req.body.subEmail, token.token());
        await database.setTokenDate(req.body.subEmail, 'mail_privremeni_korisnici');
        res.render('webResponseReject', {
            layout: 'index',
            title: 'Raspored bot | Pretplata',
            email: req.body.subEmail,
            auth: true
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
                invalid: true
            });
        } catch {
            let tempEmail = await database.getEmail(req.params.id, 'mail_privremeni_korisnici');
            let classList = await database.getAllClasses();
            res.render('webForm', {
                layout: 'index',
                title: 'Raspored bot | Pretplata',
                after: true,
                dbEmail: tempEmail,
                tokenURL: req.params.id,
                classL: classList
            });
        }
    } else {
        res.render('webResponseReject', {
            layout: 'index',
            title: 'Raspored bot | Pretplata',
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
                    email: client.receiverEmail,
                    res2: true
                });
            }
        }
    } else {
        res.render('webResponseReject', {
            layout: 'index',
            title: 'Raspored bot | Pretplata',
            invalid: true
        });
    }
});


module.exports = router;