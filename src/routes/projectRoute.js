const express = require('express');
const router = express.Router();
const controller = require('../controllers/projectController')
router.post('/create', controller.post);
router.post('/load', controller.load);

module.exports = router;