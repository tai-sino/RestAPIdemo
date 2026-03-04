const express = require('express');
const externalController = require('../controllers/external.controller');

const router = express.Router();

router.get('/search', externalController.searchBooks);

module.exports = router;
