const express = require('express');
const adminController = require('./../controllers/adminController.js');
const auth = require('./../middleware/authorizationAdmin');
const { use } = require('./../../helperFunctionsWeb.js');

const router = express.Router();

// Rute skupine admin, koriste se za upravljanje admin korisnicima koji
// imaju ovlasti upisivati izmjene

router.get('/user', auth.tokenAuth, use(adminController.get));
router.put('/user', auth.tokenAuth, use(adminController.update));
router.post('/user', auth.tokenAuth, use(adminController.create));
router.delete('/user', auth.tokenAuth, use(adminController.delete));

router.get('/users', auth.tokenAuth, use(adminController.getUsers));

router.post('/login', use(adminController.login));
router.post('/logout', auth.tokenAuth, use(adminController.logout));


module.exports = router;