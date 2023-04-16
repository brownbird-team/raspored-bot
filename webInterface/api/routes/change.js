const express = require('express');
const changeController = require('./../controllers/changeController.js');
const auth = require('./../middleware/authorizationAdmin');
const { use } = require('./../../helperFunctionsWeb.js');

const router = express.Router();

router.get('/', use(changeController.get));
router.put('/', auth.tokenAuth, use(changeController.update));
router.post('/', auth.tokenAuth, use(changeController.create));
router.get('/content', use(changeController.getContent));
router.post('/content', auth.tokenAuth, use(changeController.setContent));

module.exports = router;