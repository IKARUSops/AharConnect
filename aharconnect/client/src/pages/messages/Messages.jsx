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
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { format } from 'date-fns';
import { getUnreadMessageCount, getConversation, sendMessage, markMessagesAsRead } from '../../api/messages';

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
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    const storedUserId = localStorage.getItem('userId');
    setUserType(storedUserType);
    setUserId(storedUserId);
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // The endpoint will be different based on user type
      const endpoint = userType === 'restaurant' ? '/api/messages/restaurant' : '/api/messages/user';
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = async (conversation) => {
    try {
      setSelectedConversation(conversation);
      // Mark messages as read
      if (conversation.unreadCount > 0) {
        await markMessagesAsRead(conversation.messages
          .filter(m => !m.isRead && m.receiverId === userId)
          .map(m => m._id)
        );
        // Update conversations list
        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv._id === conversation._id
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      }
    } catch (error) {
      console.error('Error selecting conversation:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!replyText.trim() || !selectedConversation) return;

    try {
      const messageData = {
        receiverId: selectedConversation.otherPartyId,
        content: replyText.trim(),
        subject: selectedConversation.subject
      };

      await sendMessage(messageData);
      setReplyText('');
      
      // Refresh conversation
      const updatedConversation = await getConversation(selectedConversation._id);
      setSelectedConversation(updatedConversation);
      
      // Update conversations list
      await fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography>Loading messages...</Typography>
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
                    <React.Fragment key={conversation._id}>
                      <ListItem
                        button
                        selected={selectedConversation?._id === conversation._id}
                        onClick={() => handleConversationSelect(conversation)}
                      >
                        <ListItemText
                          primary={conversation.otherPartyName}
                          secondary={
                            <>
                              <Typography variant="caption" display="block">
                                {format(new Date(conversation.lastMessageDate), 'MMM d, yyyy')}
                              </Typography>
                              {conversation.lastMessage}
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
                        {selectedConversation.otherPartyName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {selectedConversation.subject}
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
                      {selectedConversation.messages.map((message) => (
                        <MessageBubble
                          key={message._id}
                          isOwn={message.senderId === userId}
                        >
                          <Typography variant="subtitle2">
                            {message.senderId === userId ? 'You' : message.senderName}
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