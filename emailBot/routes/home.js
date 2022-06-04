const express = require("express");
const router = express.Router();
const routeNames = require('../getRouteName');

router.get('/', async(req, res) => {
    res.render('webEmailHome', {
        layout: 'index', 
        title: "Raspored bot | Email",
        urlP: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}`,
        urlZ: `${await routeNames.giveRouteName('url')}/${await routeNames.giveRouteName('home')}/${await routeNames.giveRouteName('privacy-policy')}`,
        subscribeRoute: await routeNames.giveRouteName('subscribe'),
        settingsRoute: await routeNames.giveRouteName('settings'),
        unsubscribeRoute: await routeNames.giveRouteName('unsubscribe'),
        homeRoute: await routeNames.giveRouteName('home')
    });
});


module.exports = router