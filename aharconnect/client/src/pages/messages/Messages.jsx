import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Chip,
  Card,
  CardContent,
  Divider,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { getUnreadMessageCount, getConversation, sendMessage, markMessagesAsRead, getRestaurantConversations, getUserConversations } from '../../api/messages';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
}));

const MessageBubble = styled(Box)(({ theme, isOwn }) => ({
  maxWidth: '70%',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: isOwn ? theme.palette.primary.main : theme.palette.grey[100],
  color: isOwn ? theme.palette.primary.contrastText : theme.palette.text.primary,
  alignSelf: isOwn ? 'flex-end' : 'flex-start',
}));

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    const storedUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('Please log in to view messages');
      return;
    }

    setUserType(storedUserType);
    setUserId(storedUserId);
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError('');

      // Use different endpoints based on user type
      let data;
      if (userType === 'restaurant') {
        data = await getRestaurantConversations();
      } else {
        data = await getUserConversations();
      }

      console.log('Fetched conversations:', data);
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError(error.message || 'Failed to load conversations');
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = async (conversation) => {
    try {
      setLoading(true);
      setError('');
      console.log('Selecting conversation:', conversation);

      // Fetch messages for this conversation
      const messages = await getConversation(conversation.eventSpaceId);
      console.log('Fetched messages:', messages);

      setSelectedConversation(conversation);
      setSelectedMessages(messages);

      // Mark messages as read
      const unreadMessageIds = messages
        .filter(m => !m.isRead && m.receiverId === userId)
        .map(m => m._id);

      if (unreadMessageIds.length > 0) {
        await markMessagesAsRead(unreadMessageIds);
        // Update conversations list to reflect read status
        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv.eventSpaceId === conversation.eventSpaceId
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error selecting conversation:', error);
      setError('Failed to load messages');
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!replyText.trim() || !selectedConversation) {
      toast.error('Please enter a message');
      return;
    }

    try {
      const messageData = {
        eventSpaceId: selectedConversation.eventSpaceId,
        content: replyText.trim(),
        subject: selectedMessages[0]?.subject || 'Re: Event Space Inquiry',
        receiverId: selectedConversation.customerId
      };

      console.log('Sending message:', messageData);
      await sendMessage(messageData);
      setReplyText('');
      toast.success('Message sent successfully');
      
      // Refresh conversation
      await handleConversationSelect(selectedConversation);
      // Refresh conversations list
      await fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  if (loading && conversations.length === 0) {
    return (
      <Container maxWidth="lg">
        <Typography sx={{ mt: 4 }}>Loading messages...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <StyledPaper>
        <Typography variant="h4" gutterBottom>
          Messages
        </Typography>
        <Grid container spacing={3}>
          {/* Conversations List */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Conversations
                </Typography>
                <List>
                  {conversations.map((conversation) => (
                    <React.Fragment key={conversation.eventSpaceId}>
                      <ListItem
                        button
                        selected={selectedConversation?.eventSpaceId === conversation.eventSpaceId}
                        onClick={() => handleConversationSelect(conversation)}
                      >
                        <ListItemText
                          primary={conversation.customerName}
                          secondary={
                            <>
                              <Typography variant="caption" display="block">
                                {format(new Date(conversation.lastMessageDate), 'MMM d, yyyy')}
                              </Typography>
                              {conversation.messages[0]?.content}
                            </>
                          }
                        />
                        {conversation.unreadCount > 0 && (
                          <Chip
                            label={conversation.unreadCount}
                            color="primary"
                            size="small"
                          />
                        )}
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                  {conversations.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="No messages"
                        secondary="Your conversations will appear here"
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Message Thread */}
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                {selectedConversation ? (
                  <>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6">
                        {selectedConversation.customerName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedMessages[0]?.subject}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        height: '400px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        mb: 2,
                        p: 2
                      }}
                    >
                      {selectedMessages.map((message) => (
                        <MessageBubble
                          key={message._id}
                          isOwn={message.senderId === userId}
                        >
                          <Typography variant="subtitle2">
                            {message.senderId === userId ? 'You' : message.senderName || 'Customer'}
                          </Typography>
                          <Typography>{message.content}</Typography>
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>
                            {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                          </Typography>
                        </MessageBubble>
                      ))}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Type your message..."
                        variant="outlined"
                      />
                      <Button
                        variant="contained"
                        onClick={handleSendMessage}
                        disabled={!replyText.trim()}
                      >
                        Send
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography color="text.secondary">
                      Select a conversation to view messages
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </StyledPaper>
    </Container>
  );
};

export default Messages; 