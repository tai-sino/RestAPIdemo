const express = require('express');
const borrowController = require('../controllers/borrow.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { requireRole } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/borrows', requireAuth, borrowController.borrowBook);
router.patch('/borrows/:id/return', requireAuth, borrowController.returnBook);
router.get('/borrows/my', requireAuth, borrowController.getMyBorrows);
router.get('/admin/borrows', requireAuth, requireRole('admin'), borrowController.getAllBorrows);

module.exports = router;
