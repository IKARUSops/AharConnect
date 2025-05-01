// controllers/expenseController.js
const Expense = require('../models/Expense');
const moment = require('moment');
const mongoose = require('mongoose');

// Get expenses with time range filter
exports.getExpenses = async (req, res) => {
  try {
    const { timeRange } = req.query;
    const userId = req.user._id; // Assuming you have authentication middleware

    let dateFilter = {};
    const today = moment().startOf('day');

    switch (timeRange) {
      case 'daily':
        dateFilter = { $gte: today.toDate() };
        break;
      case 'weekly':
        dateFilter = { $gte: today.startOf('week').toDate() };
        break;
      case 'monthly':
        dateFilter = { $gte: today.startOf('month').toDate() };
        break;
      default:
        dateFilter = {}; // All time
    }

    const expenses = await Expense.find({
      user: userId,
      date: dateFilter
    }).sort({ date: -1 });

    res.json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create new expense
exports.createExpense = async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;
    const userId = req.user._id;
    console.log('Authenticated User ID:', req.user._id);
    const expense = new Expense({
      user: userId,
      amount,
      category,
      description,
      date: date || new Date()
      
    });

    await expense.save();
    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, description, date } = req.body;
    const userId = req.user._id;

    const expense = await Expense.findOneAndUpdate(
      { _id: id, user: userId },
      { amount, category, description, date },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    res.json({ success: true, data: expense });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const expense = await Expense.findOneAndDelete({ _id: id, user: userId });

    if (!expense) {
      return res.status(404).json({ success: false, error: 'Expense not found' });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get expense statistics
exports.getStatistics = async (req, res) => {
  try {
    const { timeRange } = req.query;
    const userId = req.user._id;

    let dateFilter = {};
    const today = moment().startOf('day');

    switch (timeRange) {
      case 'daily':
        dateFilter = { $gte: today.toDate(), $lte: today.endOf('day').toDate() };
        break;
      case 'weekly':
        dateFilter = { $gte: today.startOf('week').toDate(), $lte: today.endOf('week').toDate() };
        break;
      case 'monthly':
        dateFilter = { $gte: today.startOf('month').toDate(), $lte: today.endOf('month').toDate() };
        break;
      default:
        dateFilter = {};
    }

    console.log('User ID:', userId);
    console.log('Date Filter:', dateFilter);

    // Get total expenses
    const totalExpenses = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), date: dateFilter } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    console.log('Total Expenses:', totalExpenses);

    // Get expenses by category
    const categoryBreakdown = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), date: dateFilter } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);

    console.log('Category Breakdown:', categoryBreakdown);

    // Get daily trends
    const dailyTrends = await Expense.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), date: dateFilter } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log('Daily Trends:', dailyTrends);

    res.json({
      success: true,
      data: {
        totalExpenses: totalExpenses[0]?.total || 0,
        categoryBreakdown,
        dailyTrends
      }
    });
  } catch (error) {
    console.error('Error in getStatistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};