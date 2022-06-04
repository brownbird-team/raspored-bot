const express = require("express");
const router = express.Router();
const routeNames = require('../getRouteName');

router.get('/', async(req, res) => {
    res.render('privacyPolicy', {
        layout: 'index',
        title: 'Raspored bot | Zaštita podataka',
        urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
        urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`
    });
});

module.exports = router;