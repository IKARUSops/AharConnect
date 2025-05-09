import axios from 'axios';

export const sendMessage = async (messageData) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post('/api/messages', messageData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to send message';
  }
};

export const getConversation = async (eventSpaceId) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`/api/messages/event-space/${eventSpaceId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch conversation';
  }
};

export const markMessagesAsRead = async (messageIds) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post('/api/messages/mark-read', { messageIds }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to mark messages as read';
  }
};

export const getUnreadMessageCount = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get('/api/messages/unread-count', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data.unreadCount;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to get unread message count';
  }
}; 