const express = require('express');
const router = express.Router();

router.use('/', require('./users'));
router.use('/', require('./readingType'));
router.use('/', require('./plant'));
router.use('/', require('./sensor'));
router.use('/', require('./zone'));


// router.use('/', require('./sensor'));
module.exports = router;