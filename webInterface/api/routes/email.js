const express = require('express');
const emailController = require('./../controllers/emailController.js');
const auth = require('./../middleware/authorizationEmail');

const router = express.Router();

router.use(express.json());

router.post('/auth/register', emailController.register);
router.post('/auth/login', emailController.login);

router.post('/auth/permanent', auth.tempTokenAuth, emailController.permanent);

router.post('/auth/logout', auth.permTokenAuth, emailController.logout);

router.get('/account', auth.permTokenAuth, emailController.get);
router.put('/account', auth.permTokenAuth, emailController.update);
router.delete('/account', auth.permTokenAuth, emailController.delete);

module.exports = router;