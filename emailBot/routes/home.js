const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('webEmailHome', {
        layout: 'index', 
        title: "Raspored bot | Email"
    });
});


module.exports = router