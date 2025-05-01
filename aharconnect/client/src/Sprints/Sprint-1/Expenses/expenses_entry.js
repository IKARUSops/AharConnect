import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  AccountBalanceWallet as WalletIcon,
  TrendingUp as TrendingUpIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getExpenses, createExpense, updateExpense, deleteExpense, getExpenseStatistics } from '../../../api/auth';

const categories = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other'];

const ExpenseTrackingDashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [statistics, setStatistics] = useState({
    totalExpenses: 0,
    categoryBreakdown: [],
    dailyTrends: []
  });
  const [timeRange, setTimeRange] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchExpenses();
    fetchStatistics();
  }, [timeRange]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await getExpenses(timeRange);
      setExpenses(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch expenses');
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await getExpenseStatistics(timeRange);
      setStatistics(response.data.data);
    } catch (err) {
      setError('Failed to fetch statistics');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await updateExpense(editingExpense._id, formData);
        setSuccess('Expense updated successfully!');
      } else {
        await createExpense(formData);
        setSuccess('Expense added successfully!');
      }
      setOpenDialog(false);
      setEditingExpense(null);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: '',
        description: ''
      });
      fetchExpenses();
      fetchStatistics();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save expense');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      date: expense.date.split('T')[0],
      amount: expense.amount,
      category: expense.category,
      description: expense.description
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(id);
        setSuccess('Expense deleted successfully!');
        fetchExpenses();
        fetchStatistics();
      } catch (err) {
        setError('Failed to delete expense');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Expense Tracker Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingExpense(null);
            setFormData({
              date: new Date().toISOString().split('T')[0],
              amount: '',
              category: '',
              description: ''
            });
            setOpenDialog(true);
          }}
        >
          Add Expense
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Time Range Selector */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarIcon sx={{ mr: 1 }} />
            <ToggleButtonGroup
              value={timeRange}
              exclusive
              onChange={(e, newRange) => newRange && setTimeRange(newRange)}
              aria-label="time range"
            >
              <ToggleButton value="daily" aria-label="daily">
                Daily
              </ToggleButton>
              <ToggleButton value="weekly" aria-label="weekly">
                Weekly
              </ToggleButton>
              <ToggleButton value="monthly" aria-label="monthly">
                Monthly
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>
        </Grid>

        {/* Total Expenses Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WalletIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Total Expenses</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ color: 'primary.main' }}>
                ${statistics.totalExpenses.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} expenses
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Average Per Day Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">Average Per Day</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ color: 'success.main' }}>
                ${(statistics.totalExpenses / (expenses.length || 1)).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Based on {expenses.length} entries
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Number of Transactions Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', backgroundColor: '#f5f5f5' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Transactions</Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ color: 'secondary.main' }}>
                {expenses.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Total transactions
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Expense Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Expense Trend</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statistics.dailyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 300 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Category Breakdown</Typography>
            <Box sx={{ overflowY: 'auto', height: 'calc(100% - 40px)' }}>
              {statistics.categoryBreakdown.map((item) => (
                <Box key={item._id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{item._id}</Typography>
                    <Typography variant="body2">${item.total.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 8, bgcolor: '#f0f0f0', borderRadius: 4 }}>
                    <Box
                      sx={{
                        width: `${(item.total / statistics.totalExpenses) * 100}%`,
                        height: '100%',
                        bgcolor: 'primary.main',
                        borderRadius: 4
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
        {/* Expense Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Expenses</Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense._id}>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell>{expense.description}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell align="right">${expense.amount.toFixed(2)}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" color="primary" onClick={() => handleEdit(expense)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDelete(expense._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>



      {/* Add/Edit Expense Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  InputProps={{ startAdornment: '$' }}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleInputChange}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingExpense ? 'Save Changes' : 'Add Expense'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ExpenseTrackingDashboard;