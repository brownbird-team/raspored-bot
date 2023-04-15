const express = require('express');
const generalController = require('./../controllers/generalController.js');
const { use } = require('./../../helperFunctionsWeb.js');

const router = express.Router();

router.get('/classes/all', use(generalController.classes));
router.get('/classes/active', use(generalController.activeClasses));
router.delete('/class', use(generalController.deleteClass));
router.post('/class', use(generalController.insertClass));
router.get('/shifts', use(generalController.allShifts));
router.get('/shift', use(generalController.shift));
router.get('/discord/invite', use(generalController.inviteLink));

module.exports = router;
