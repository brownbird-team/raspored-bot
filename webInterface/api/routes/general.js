const express = require('express');
const generalController = require('./../controllers/generalController.js');

const router = express.Router();

router.get('/classes/all', generalController.classes);
router.get('/classes/active', generalController.activeClasses);

module.exports = router;
