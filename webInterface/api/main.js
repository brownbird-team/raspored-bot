const express = require('express');
const email = require('./routes/email.js');
const general = require('./routes/general.js');
const change = require('./routes/change.js');
const errorHandler = require('./middleware/errorsHandler.js');

const router = express.Router();

router.use(express.json());

router.use('/email', email);
router.use('/general', general);
router.use('/change', change);
router.use(errorHandler.handle);

module.exports = router;