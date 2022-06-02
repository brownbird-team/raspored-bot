const express = require("express");
const router = express.Router();
const routeNames = require('../getRouteName');

router.get('/', async(req, res) => {
    res.render('privacyPolicy', {
        layout: 'index',
        title: 'Raspored bot | Zaštita podataka',
    });
});

module.exports = router;