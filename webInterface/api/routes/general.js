const express = require('express');
const generalController = require('./../controllers/generalController.js');
const { use } = require('./../../helperFunctionsWeb.js');
const auth = require('./../middleware/authorizationAdmin');

const router = express.Router();

// Rute skupine general, koriste se primarno za razrede i smjene

router.get('/classes/all', use(generalController.classes));
router.get('/classes/active', use(generalController.activeClasses));
router.delete('/class', auth.tokenAuth, use(generalController.deleteClass));
router.post('/class', auth.tokenAuth, use(generalController.insertClass));
router.get('/shifts', use(generalController.allShifts));
router.get('/shift', use(generalController.shift));
router.get('/discord/invite', use(generalController.inviteLink));

module.exports = router;
