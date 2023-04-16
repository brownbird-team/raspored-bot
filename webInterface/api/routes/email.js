const express = require('express');
const emailController = require('./../controllers/emailController.js');
const auth = require('./../middleware/authorizationEmail');
const { use } = require('./../../helperFunctionsWeb.js');

const router = express.Router();

// Rute skupine email, koriste se za upravljanje email korisnicima

router.post('/auth/register', use(emailController.register));
router.post('/auth/login', use(emailController.login));

router.post('/auth/permanent', auth.tempTokenAuth, use(emailController.permanent));

router.post('/auth/logout', auth.permTokenAuth, use(emailController.logout));

router.get('/account', auth.permTokenAuth, use(emailController.get));
router.put('/account', auth.permTokenAuth, use(emailController.update));
router.delete('/account', auth.permTokenAuth, use(emailController.delete));

module.exports = router;