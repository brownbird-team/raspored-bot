const express = require('express');
const changeController = require('./../controllers/changeController.js');
const { use } = require('./../../helperFunctionsWeb.js');

const router = express.Router();

router.get('/', use(changeController.get));
router.put('/', use(changeController.update));
router.post('/', use(changeController.create));
router.get('/content', use(changeController.getContent));
router.post('/content', use(changeController.setContent));

module.exports = router;