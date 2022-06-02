const express = require("express");
const router = express.Router();
const routeNames = require('../getRouteName');

router.get('/', async(req, res) => {
    res.render('webEmailHome', {
        layout: 'index', 
        title: "Raspored bot | Email",
        subscribeRoute: await routeNames.giveRouteName('subscribe'),
        settingsRoute: await routeNames.giveRouteName('settings'),
        unsubscribeRoute: await routeNames.giveRouteName('unsubscribe'),
        homeRoute: await routeNames.giveRouteName('home')
    });
});


module.exports = router