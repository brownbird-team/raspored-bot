const express = require("express");
const router = express.Router();
const database = require('./../rasporedEmailFunkcije');

router.get('/', (req, res) => {
    res.render('webForm', {layout: 'index'});
});

router.post('/', async(req, res) => {
    const client = new database.Client(req.body.email, req.body.razred, req.body.saljiSve, req.body.tamnaTema);
    try {
        await database.checkEmail(client.email);
        res.render('webResponseReject', {
            layout: 'index',
            email: client.email,
            rej2: true
        });
    } catch {
        await database.insertData(client.email, client.classID, client.sendAll, client.darkTheme);
        res.render('webResponseReject', {
            layout: 'index',
            email: client.email,
            res2: true
        });
    }
});

module.exports = router