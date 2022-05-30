const express = require("express");
const router = express.Router();
const routeNames = require('../getRouteName');

router.get('/', async(req, res) => {
    res.render('404Page', {
        layout: 'index',
        title: 'Raspored bot',
        homeRoute: await routeNames.giveRouteName('home')
    });
});


module.exports = router;