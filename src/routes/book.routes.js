const express = require('express');
const bookController = require('../controllers/book.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);
router.post('/', requireAuth, requireRole('admin'), bookController.createBook);
router.patch('/:id', requireAuth, requireRole('admin'), bookController.updateBook);
router.delete('/:id', requireAuth, requireRole('admin'), bookController.deleteBook);

module.exports = router;
