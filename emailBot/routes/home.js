const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('webEmailHome', {layout: 'index'});
});


module.exports = router