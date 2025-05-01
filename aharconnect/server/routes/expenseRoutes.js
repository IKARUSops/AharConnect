const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/authMiddleware'); // Authentication middleware

router.get('/', auth, expenseController.getExpenses);
router.post('/', auth, expenseController.createExpense);
router.put('/:id', auth, expenseController.updateExpense);
router.delete('/:id', auth, expenseController.deleteExpense);
router.get('/statistics', auth, expenseController.getStatistics);

module.exports = router;