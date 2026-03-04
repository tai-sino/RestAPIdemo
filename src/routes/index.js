const express = require('express');
const authRoutes = require('./auth.routes');
const bookRoutes = require('./book.routes');
const borrowRoutes = require('./borrow.routes');
const externalRoutes = require('./external.routes');
const { healthController } = require('../controllers/health.controller');

const router = express.Router();

router.get('/health', healthController);
router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/', borrowRoutes);
router.use('/external/books', externalRoutes);

module.exports = router;
