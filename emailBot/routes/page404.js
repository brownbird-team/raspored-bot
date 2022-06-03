const express = require("express");
const router = express.Router();
const routeNames = require('../getRouteName');

router.get('/', async(req, res) => {
    res.render('404Page', {
        layout: 'index',
        title: 'Raspored bot',
        urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
        urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
        homeRoute: await routeNames.giveRouteName('home')
    });
});


module.exports = router;