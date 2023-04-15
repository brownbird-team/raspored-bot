const express = require('express');
const email = require('./routes/email.js');
const general = require('./routes/general.js');
const errorHandler = require('./middleware/errorsHandler.js');

const router = express.Router();

router.use(express.json());

router.use('/email', email);
router.use('/general', general);
router.use(errorHandler.handle);

module.exports = router;