import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Alert,
  Switch,
  FormControlLabel,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Star as StarIcon,
  Edit as EditIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  MenuBook as MenuBookIcon,
  EventSeat as EventSeatIcon,
  Assessment as AssessmentIcon,
  AccountBalanceWallet as WalletIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
  Message as MessageIcon,
  ArrowBack
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import MenuDashboard from '../../Sprint-1/Menu/Menuedit';
import ExpenseTrackingDashboard from '../../Sprint-1/Expenses/expenses_entry';
import EditProfileDialog from './EditProfileDialog';
import API from '../../../api/auth';
import axios from 'axios';
import { getRestaurantEventBookings, approveEventBooking, deleteEventBooking } from '../../../api/eventBookings';
import { toast } from 'sonner';
import { getUnreadMessageCount, getConversation, sendMessage, markMessagesAsRead, getRestaurantConversations } from '../../../api/messages';
import { useNavigate } from 'react-router-dom';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const RestaurantDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reservationSettings, setReservationSettings] = useState(null);
  const [eventRate, setEventRate] = useState('');
  const [eventBookings, setEventBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuMessages, setMenuMessages] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [menuMessageReplyText, setMenuMessageReplyText] = useState('');
  const [senderMessages, setSenderMessages] = useState(null);
  const [selectedSender, setSelectedSender] = useState(null);
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'sender'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const navigate = useNavigate();

  // Mock data for when no profile exists
  const mockData = {
    name: "Your Restaurant",
    rating: 0,
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
    popularItems: [],
    recentOrders: [],
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('[RestaurantDashboard] No auth token found');
      toast.error('Please log in again');
      navigate('/sign-in');
      return;
    }
    fetchRestaurantProfile();
  }, []);

  const fetchRestaurantProfile = async () => {
    console.log('[RestaurantDashboard] Fetching restaurant profile');
    try {
      const response = await API.get('/restaurants/profile');
      console.log('[RestaurantDashboard] Profile data received:', response.data);
      setProfileData(response.data);
      setError('');
    } catch (error) {
      console.error('[RestaurantDashboard] Error fetching restaurant profile:', error);
      const errorMessage = error.response?.data?.error || 'Failed to fetch restaurant profile';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfileDialogOpen = () => {
    setOpenProfileDialog(true);
  };

  const handleProfileDialogClose = () => {
    setOpenProfileDialog(false);
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfileData(updatedProfile);
    setOpenProfileDialog(false);
  };

  const handleReservationToggle = async () => {
    try {
      const response = await API.post('/reservations/toggle');
      setReservationSettings(response.data);
    } catch (error) {
      console.error('Error toggling reservations:', error);
      setError('Failed to toggle reservations');
    }
  };

  useEffect(() => {
    const fetchReservationSettings = async () => {
      try {
        const response = await API.get('/reservations/settings');
        setReservationSettings(response.data);
      } catch (error) {
        console.error('Error fetching reservation settings:', error);
      }
    };

    fetchReservationSettings();
  }, []);

  useEffect(() => {
    if (profileData?._id) {
      console.log('[RestaurantDashboard] Restaurant profile loaded, initializing message features');
      fetchUnreadMessageCount();
      if (activeTab === 5) { // Messages tab
        fetchConversations();
      }
      if (activeTab === 1) { // Orders tab
        fetchOrders();
      }
    } else if (profileData === null && !loading) {
      console.warn('[RestaurantDashboard] No restaurant profile found');
      toast.error('Please complete your restaurant profile first');
    }
  }, [profileData, activeTab]);

  // Add this new useEffect for fetching orders
  useEffect(() => {
    if (profileData?._id && activeTab === 1) {
      console.log('[RestaurantDashboard] Fetching orders for restaurant:', profileData._id);
      fetchOrders();
    }
  }, [activeTab, profileData?._id]);

  const fetchEventBookings = async () => {
    try {
      setLoadingBookings(true);
      const bookings = await getRestaurantEventBookings(profileData._id);
      setEventBookings(bookings);
    } catch (error) {
      console.error('Error fetching event bookings:', error);
      toast.error('Failed to fetch event bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      setLoadingBookings(true);
      await approveEventBooking(bookingId);
      toast.success('Booking approved successfully');
      await fetchEventBookings(); // Refresh the list
    } catch (error) {
      console.error('Error approving booking:', error);
      toast.error(error.message || 'Failed to approve booking');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleDeleteClick = (booking) => {
    setSelectedBooking(booking);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteEventBooking(selectedBooking._id);
      toast.success('Booking deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedBooking(null);
      fetchEventBookings(); // Refresh the list
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const fetchUnreadMessageCount = async () => {
    if (!profileData?._id) {
      console.warn('[RestaurantDashboard] Cannot fetch unread count without profile');
      return;
    }

    try {
      console.log('[RestaurantDashboard] Fetching unread message count');
      const count = await getUnreadMessageCount();
      console.log('[RestaurantDashboard] Unread count received:', count);
      setUnreadCount(count);
    } catch (error) {
      console.error('[RestaurantDashboard] Error fetching unread count:', error);
      toast.error('Failed to fetch unread messages');
    }
  };

  const handleConversationSelect = async (eventSpaceId) => {
    if (!profileData?._id) {
      console.warn('[RestaurantDashboard] Cannot select conversation without profile');
      return;
    }

    console.log('[RestaurantDashboard] Selecting conversation:', eventSpaceId);
    try {
      setLoadingMessages(true);
      const conversation = await getConversation(eventSpaceId);
      
      if (!conversation || conversation.length === 0) {
        console.warn('[RestaurantDashboard] No messages found for conversation');
        toast.warning('No messages found in this conversation');
        return;
      }

      console.log('[RestaurantDashboard] Conversation loaded:', {
        messageCount: conversation.length,
        eventSpaceId
      });

      setSelectedConversation({
        eventSpaceId,
        messages: conversation
      });

      // Mark messages as read
      const unreadMessageIds = conversation
        .filter(msg => !msg.isRead && msg.receiverId === profileData._id)
        .map(msg => msg._id);

      if (unreadMessageIds.length > 0) {
        console.log('[RestaurantDashboard] Marking messages as read:', unreadMessageIds.length);
        await markMessagesAsRead(unreadMessageIds);
        await fetchUnreadMessageCount(); // Refresh unread count
      }
    } catch (error) {
      console.error('[RestaurantDashboard] Error selecting conversation:', error);
      toast.error('Failed to load conversation');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendReply = async () => {
    if (!profileData?._id) {
      console.warn('[RestaurantDashboard] Cannot send reply without profile');
      toast.error('Please complete your restaurant profile first');
      return;
    }

    if (!replyText.trim() || !selectedConversation) {
      console.warn('[RestaurantDashboard] Invalid reply attempt:', {
        hasText: !!replyText.trim(),
        hasConversation: !!selectedConversation
      });
      toast.error('Please enter a message and select a conversation');
      return;
    }

    console.log('[RestaurantDashboard] Sending reply:', {
      eventSpaceId: selectedConversation.eventSpaceId,
      length: replyText.length
    });

    try {
      const messageData = {
        eventSpaceId: selectedConversation.eventSpaceId,
        content: replyText.trim(),
        receiverId: selectedConversation.messages[0].senderId,
        subject: selectedConversation.messages[0].subject
      };

      await sendMessage(messageData);
      console.log('[RestaurantDashboard] Reply sent successfully');
      
      setReplyText('');
      toast.success('Reply sent successfully');
      
      // Refresh conversation
      await handleConversationSelect(selectedConversation.eventSpaceId);
    } catch (error) {
      console.error('[RestaurantDashboard] Error sending reply:', error);
      toast.error('Failed to send reply. Please try again.');
    }
  };

  const fetchConversations = async () => {
    if (!profileData?._id) {
      console.warn('[RestaurantDashboard] Cannot fetch conversations without profile');
      return;
    }

    console.log('[RestaurantDashboard] Fetching conversations');
    try {
      setLoadingMessages(true);
      const conversations = await getRestaurantConversations();
      
      console.log('[RestaurantDashboard] Conversations loaded:', {
        count: conversations.length
      });

      setMessages(conversations);
    } catch (error) {
      console.error('[RestaurantDashboard] Error fetching conversations:', error);
      const errorMessage = error.response?.data?.error || 'Failed to load conversations';
      toast.error(errorMessage);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleMenuMessageSelect = async (menuItemId) => {
    if (!profileData?._id) {
      console.warn('[RestaurantDashboard] Cannot select menu message without profile');
      return;
    }

    console.log('[RestaurantDashboard] Selecting menu message:', menuItemId);
    try {
      setLoadingMessages(true);
      const conversation = await getConversation(menuItemId, 'menu');
      
      if (!conversation || conversation.length === 0) {
        console.warn('[RestaurantDashboard] No messages found for menu item');
        toast.warning('No messages found for this menu item');
        return;
      }

      setSelectedMenuItem({
        menuItemId,
        messages: conversation
      });

      // Mark messages as read
      const unreadMessageIds = conversation
        .filter(msg => !msg.isRead && msg.receiverId === profileData._id)
        .map(msg => msg._id);

      if (unreadMessageIds.length > 0) {
        await markMessagesAsRead(unreadMessageIds);
        await fetchUnreadMessageCount();
      }
    } catch (error) {
      console.error('[RestaurantDashboard] Error selecting menu message:', error);
      toast.error('Failed to load menu messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleMenuMessageReply = async () => {
    if (!profileData?._id || !selectedMenuItem) {
      console.warn('[RestaurantDashboard] Cannot send menu message reply');
      return;
    }

    try {
      const messageData = {
        menuItemId: selectedMenuItem.menuItemId,
        messageType: 'menu',
        content: menuMessageReplyText.trim(),
        receiverId: selectedMenuItem.messages[0].senderId,
        subject: selectedMenuItem.messages[0].subject
      };

      await sendMessage(messageData);
      setMenuMessageReplyText('');
      toast.success('Reply sent successfully');
      
      // Refresh conversation
      await handleMenuMessageSelect(selectedMenuItem.menuItemId);
    } catch (error) {
      console.error('[RestaurantDashboard] Error sending menu message reply:', error);
      toast.error('Failed to send reply');
    }
  };

  // Add this new function to get messages by sender
  const getMessagesBySender = async (senderId) => {
    try {
      const response = await axios.get(`/api/messages/sender/${senderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sender messages:', error);
      throw error;
    }
  };

  const handleSenderSelect = async (senderId, senderName) => {
    try {
      setLoadingMessages(true);
      const data = await getMessagesBySender(senderId);
      setSenderMessages(data);
      setSelectedSender({ id: senderId, name: senderName });
      setViewMode('sender');
    } catch (error) {
      console.error('Error fetching sender messages:', error);
      toast.error('Failed to load sender messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchOrders = async () => {
    if (!profileData?._id) {
      console.warn('[RestaurantDashboard] Cannot fetch orders without profile');
      return;
    }

    try {
      setLoadingOrders(true);
      console.log('[RestaurantDashboard] Fetching orders for restaurant:', profileData._id);
      
      const response = await API.get(`/orders/restaurant/${profileData._id}`);
      console.log('[RestaurantDashboard] Orders fetched:', response.data);
      
      if (!Array.isArray(response.data)) {
        console.error('[RestaurantDashboard] Invalid orders data:', response.data);
        toast.error('Received invalid orders data from server');
        return;
      }
      
      setOrders(response.data);
    } catch (error) {
      console.error('[RestaurantDashboard] Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Add this function to handle order status updates
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('[RestaurantDashboard] Updating order status:', {
        orderId,
        newStatus
      });

      await API.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated successfully');
      await fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('[RestaurantDashboard] Error updating order status:', error.response || error);
      const errorMessage = error.response?.data?.error || 'Failed to update order status';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome back, {profileData?.name || mockData.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {profileData ? "Here's what's happening with your restaurant today" : "Set up your restaurant profile to get started"}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={profileData ? <EditIcon /> : <AddIcon />}
          onClick={handleProfileDialogOpen}
        >
          {profileData ? 'Edit Profile' : 'Create Profile'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Profile Edit Dialog */}
      <EditProfileDialog
        open={openProfileDialog}
        onClose={handleProfileDialogClose}
        initialData={profileData}
        onSuccess={handleProfileUpdate}
      />

      {/* Reservation Settings Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Reservation Settings
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={reservationSettings?.isEnabled ?? false}
                  onChange={handleReservationToggle}
                  color="primary"
                />
              }
              label="Enable Reservations"
            />
            {reservationSettings && (
              <>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Max Capacity: {reservationSettings.maxCapacity} people
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Booking Duration: {reservationSettings.bookingDuration} minutes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Advance Booking: {reservationSettings.advanceBookingDays} days
                </Typography>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ReceiptIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Orders</Typography>
              </Box>
              <Typography variant="h4">{profileData?.totalOrders || mockData.totalOrders}</Typography>
              <Typography variant="body2" color="text.secondary">
                All time orders
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Orders</Typography>
              </Box>
              <Typography variant="h4">{profileData?.activeOrders || mockData.activeOrders}</Typography>
              <Typography variant="body2" color="text.secondary">
                Current orders
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WalletIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Revenue</Typography>
              </Box>
              <Typography variant="h4">${profileData?.totalRevenue || mockData.totalRevenue}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total revenue
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StarIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Rating</Typography>
              </Box>
              <Typography variant="h4">{profileData?.rating || mockData.rating}</Typography>
              <Typography variant="body2" color="text.secondary">
                Customer rating
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      {/* Activity Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="restaurant activities">
          <Tab icon={<ReceiptIcon />} label="Orders" />
          <Tab icon={<MenuBookIcon />} label="Menu" />
          <Tab icon={<WalletIcon />} label="Expenses" />
          <Tab icon={<EventSeatIcon />} label="Reservations" />
          <Tab icon={<AssessmentIcon />} label="Analytics" />
          <Tab icon={<MessageIcon />} label={`Messages ${unreadCount > 0 ? `(${unreadCount})` : ''}`} />
        </Tabs>
      </Box>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Orders
            </Typography>
            {loadingOrders ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography>Loading orders...</Typography>
              </Box>
            ) : orders.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>
                          {order._id.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{order.userId?.name || 'Anonymous'}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.deliveryAddress ? 
                                `${order.deliveryAddress.address}, ${order.deliveryAddress.city}, ${order.deliveryAddress.postalCode}` : 
                                'No address provided'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <List dense>
                            {order.items.map((item, index) => (
                              <ListItem key={index} disablePadding>
                                <ListItemText
                                  primary={`${item.quantity}x ${item.menuItem?.item_name}`}
                                  secondary={item.specialInstructions}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </TableCell>
                        <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={order.status.toUpperCase()}
                            color={
                              order.status === 'delivered' ? 'success' :
                              order.status === 'preparing' ? 'warning' :
                              order.status === 'cancelled' ? 'error' : 'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            {order.status !== 'delivered' && order.status !== 'cancelled' && (
                              <>
                                {order.status === 'pending' && (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleUpdateOrderStatus(order._id, 'confirmed')}
                                  >
                                    Confirm
                                  </Button>
                                )}
                                {order.status === 'confirmed' && (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="warning"
                                    onClick={() => handleUpdateOrderStatus(order._id, 'preparing')}
                                  >
                                    Prepare
                                  </Button>
                                )}
                                {order.status === 'preparing' && (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleUpdateOrderStatus(order._id, 'ready')}
                                  >
                                    Mark Ready
                                  </Button>
                                )}
                                {order.status === 'ready' && (
                                  <Button
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                                  >
                                    Mark Delivered
                                  </Button>
                                )}
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  onClick={() => handleUpdateOrderStatus(order._id, 'cancelled')}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Typography color="text.secondary">
                  No orders yet. They will appear here when customers place orders.
                </Typography>
              </Box>
            )}
          </StyledPaper>
        )}
        {activeTab === 1 && (
          <StyledPaper>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <MenuDashboard />
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Menu Messages
                    </Typography>
                    {selectedMenuItem ? (
                      <>
                        <Box sx={{ height: '400px', overflowY: 'auto', mb: 2 }}>
                          {selectedMenuItem.messages.map((message) => (
                            <Box
                              key={message._id}
                              sx={{
                                display: 'flex',
                                flexDirection: message.senderId === profileData._id ? 'row-reverse' : 'row',
                                mb: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  maxWidth: '70%',
                                  backgroundColor: message.senderId === profileData._id ? 'primary.main' : 'grey.100',
                                  color: message.senderId === profileData._id ? 'white' : 'text.primary',
                                  borderRadius: 2,
                                  p: 2,
                                }}
                              >
                                <Typography variant="subtitle2">
                                  {message.senderId === profileData._id ? 'You' : message.senderName}
                                </Typography>
                                <Typography>{message.content}</Typography>
                                <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                                  {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={menuMessageReplyText}
                            onChange={(e) => setMenuMessageReplyText(e.target.value)}
                            placeholder="Type your reply..."
                            variant="outlined"
                            disabled={loadingMessages}
                          />
                          <Button
                            variant="contained"
                            onClick={handleMenuMessageReply}
                            disabled={!menuMessageReplyText.trim() || loadingMessages}
                          >
                            Send
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Typography color="text.secondary" align="center">
                        Select a menu item to view messages
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </StyledPaper>
        )}
        {activeTab === 2 && <ExpenseTrackingDashboard />}
        {activeTab === 3 && (
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Event Space Bookings
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" gutterBottom>
                Update Event Rates
              </Typography>
              <TextField
                label="Event Rate ($/hour)"
                type="number"
                variant="outlined"
                value={eventRate}
                onChange={(e) => setEventRate(e.target.value)}
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('authToken');
                    await axios.put('/api/reservations/settings', {
                      eventRate
                    }, {
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                    });
                    toast.success('Event rates updated successfully');
                  } catch (error) {
                    console.error('Error updating event rates:', error);
                    toast.error('Failed to update event rates');
                  }
                }}
              >
                Update Rates
              </Button>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Time</TableCell>
                    <TableCell>Package</TableCell>
                    <TableCell>Guests</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingBookings ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">Loading bookings...</TableCell>
                    </TableRow>
                  ) : eventBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">No event bookings found</TableCell>
                    </TableRow>
                  ) : (
                    eventBookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{booking.customerName}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {booking.customerEmail}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {format(new Date(booking.startDateTime), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {`${format(new Date(booking.startDateTime), 'h:mm a')} - ${format(new Date(booking.endDateTime), 'h:mm a')}`}
                        </TableCell>
                        <TableCell>{booking.eventPackage?.name || 'N/A'}</TableCell>
                        <TableCell>{booking.numberOfGuests}</TableCell>
                        <TableCell>
                          <Chip
                            label={booking.status}
                            color={
                              booking.status === 'confirmed' ? 'success' :
                              booking.status === 'pending' ? 'warning' :
                              'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {booking.status === 'pending' && (
                            <IconButton
                              color="success"
                              onClick={() => handleApproveBooking(booking._id)}
                              title="Approve booking"
                            >
                              <CheckIcon />
                            </IconButton>
                          )}
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(booking)}
                            title="Delete booking"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                Are you sure you want to delete this booking?
                {selectedBooking && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">
                      Customer: {selectedBooking.customerName}
                    </Typography>
                    <Typography variant="body2">
                      Date: {format(new Date(selectedBooking.startDateTime), 'MMM d, yyyy')}
                    </Typography>
                    <Typography variant="body2">
                      Time: {format(new Date(selectedBooking.startDateTime), 'h:mm a')}
                    </Typography>
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </StyledPaper>
        )}
        {activeTab === 4 && (
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Analytics
            </Typography>
            <Typography color="text.secondary">
              Analytics dashboard coming soon.
            </Typography>
          </StyledPaper>
        )}
        {activeTab === 5 && (
          <StyledPaper>
            {!profileData?._id ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Complete Your Profile
                </Typography>
                <Typography color="text.secondary" paragraph>
                  Please complete your restaurant profile to access messages.
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleProfileDialogOpen}
                  startIcon={<EditIcon />}
                >
                  Complete Profile
                </Button>
              </Box>
            ) : (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">
                    Message Center {loadingMessages && '(Loading...)'}
                  </Typography>
                  {viewMode === 'sender' && (
                    <Button
                      startIcon={<ArrowBack />}
                      onClick={() => {
                        setViewMode('all');
                        setSenderMessages(null);
                        setSelectedSender(null);
                      }}
                    >
                      Back to All Messages
                    </Button>
                  )}
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Recent Conversations {messages.length > 0 ? `(${messages.length})` : ''}
                        </Typography>
                        {loadingMessages ? (
                          <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography color="text.secondary">Loading conversations...</Typography>
                          </Box>
                        ) : messages.length === 0 ? (
                          <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography color="text.secondary">No conversations yet</Typography>
                          </Box>
                        ) : viewMode === 'all' ? (
                          <List>
                            {messages.map((thread) => (
                              <ListItem
                                key={thread.customerId}
                                button
                                onClick={() => handleSenderSelect(thread.customerId, thread.customerName)}
                              >
                                <ListItemText
                                  primary={thread.customerName}
                                  secondary={
                                    <>
                                      <Typography variant="caption" display="block" color="text.secondary">
                                        {format(new Date(thread.lastMessageDate), 'MMM d, yyyy')}
                                      </Typography>
                                      {thread.messages[0]?.content && (
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                          sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: 'vertical',
                                          }}
                                        >
                                          {thread.messages[0].content}
                                        </Typography>
                                      )}
                                    </>
                                  }
                                />
                                {thread.unreadCount > 0 && (
                                  <Chip
                                    size="small"
                                    color="primary"
                                    label={thread.unreadCount}
                                  />
                                )}
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <List>
                            {senderMessages?.conversations.map((conversation) => (
                              <ListItem
                                key={conversation.eventSpace?.id || 'direct'}
                                button
                                selected={selectedConversation?.eventSpaceId === conversation.eventSpace?.id}
                                onClick={() => handleConversationSelect(conversation.eventSpace?.id)}
                              >
                                <ListItemText
                                  primary={conversation.eventSpace?.name || 'Direct Message'}
                                  secondary={
                                    <>
                                      <Typography variant="caption" display="block" color="text.secondary">
                                        {format(new Date(conversation.messages[0].createdAt), 'MMM d, yyyy')}
                                      </Typography>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          display: '-webkit-box',
                                          WebkitLineClamp: 1,
                                          WebkitBoxOrient: 'vertical',
                                        }}
                                      >
                                        {conversation.messages[0].content}
                                      </Typography>
                                    </>
                                  }
                                />
                                {conversation.messages.filter(m => !m.isRead).length > 0 && (
                                  <Chip
                                    size="small"
                                    color="primary"
                                    label={conversation.messages.filter(m => !m.isRead).length}
                                  />
                                )}
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={8}>
                    {selectedSender ? (
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Conversations with {selectedSender.name}
                          </Typography>
                          {selectedConversation ? (
                            <>
                              <Box sx={{ height: '400px', overflowY: 'auto', mb: 2 }}>
                                {selectedConversation.messages.map((message) => (
                                  <Box
                                    key={message._id}
                                    sx={{
                                      display: 'flex',
                                      flexDirection: message.senderId === profileData._id ? 'row-reverse' : 'row',
                                      mb: 2,
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        maxWidth: '70%',
                                        backgroundColor: message.senderId === profileData._id ? 'primary.main' : 'grey.100',
                                        color: message.senderId === profileData._id ? 'white' : 'text.primary',
                                        borderRadius: 2,
                                        p: 2,
                                      }}
                                    >
                                      <Typography variant="subtitle2">
                                        {message.senderId === profileData._id ? 'You' : message.senderName}
                                      </Typography>
                                      <Typography>{message.content}</Typography>
                                      <Typography variant="caption" color="inherit" sx={{ opacity: 0.8 }}>
                                        {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                                      </Typography>
                                    </Box>
                                  </Box>
                                ))}
                              </Box>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                  fullWidth
                                  multiline
                                  rows={2}
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Type your reply..."
                                  variant="outlined"
                                  disabled={loadingMessages}
                                />
                                <Button
                                  variant="contained"
                                  onClick={handleSendReply}
                                  disabled={!replyText.trim() || loadingMessages}
                                >
                                  Send
                                </Button>
                              </Box>
                            </>
                          ) : (
                            <Typography color="text.secondary" align="center">
                              Select a conversation to view messages
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent sx={{ textAlign: 'center', py: 8 }}>
                          <MessageIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                          <Typography variant="h6" color="text.secondary">
                            Select a sender to view their messages
                          </Typography>
                        </CardContent>
                      </Card>
                    )}
                  </Grid>
                </Grid>
              </>
            )}
          </StyledPaper>
        )}
      </Box>
    </Container>
  );
};

export default RestaurantDashboard; 