const express = require('express');
const email = require('./routes/email.js');
const general = require('./routes/general.js');
const change = require('./routes/change.js');
const admin = require('./routes/admin.js');
const notFoundHandler = require('./middleware/notFoundError.js');
const errorHandler = require('./middleware/errorsHandler.js');

const router = express.Router();

router.use(express.json());

// Kreiraj podrute za /api rutu
router.use('/email', email);
router.use('/general', general);
router.use('/change', change);
router.use('/admin', admin);
// Ako ruta nije nađena pozovi not found middleware
router.use(notFoundHandler.notFound);
// Uhvati greške koje su nastale prilikom izvršavanja
router.use(errorHandler.handle);

module.exports = router;