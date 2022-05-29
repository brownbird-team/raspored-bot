const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('404Page', {
        layout: 'index',
        title: 'Raspored bot'
    });
});


module.exports = router;