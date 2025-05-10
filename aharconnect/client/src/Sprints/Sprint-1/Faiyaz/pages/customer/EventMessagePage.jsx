import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import Textarea from '../../components/ui/textarea';
import Label from '../../components/ui/label';
import Separator from '../../components/ui/separator';
import { toast } from 'sonner';
import Layout from '../../components/layout/Layout';
import { MessageThread } from '../../components/customer/MessageThread';
import { sendMessage, getConversation, markMessagesAsRead } from '../../api/messages';
import { getEventSpace } from '../../api/eventSpaces';

const EventMessagePage = () => {
  const { id: eventSpaceId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [messageText, setMessageText] = useState('');
  const [subject, setSubject] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hasStartedConversation, setHasStartedConversation] = useState(false);

  // Fetch event space details
  const { data: eventSpace, isLoading: isLoadingEventSpace } = useQuery({
    queryKey: ['eventSpace', eventSpaceId],
    queryFn: () => getEventSpace(eventSpaceId)
  });

  // Fetch conversation
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', eventSpaceId],
    queryFn: () => getConversation(eventSpaceId),
    enabled: !!eventSpaceId
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', eventSpaceId]);
      setMessageText('');
      if (!hasStartedConversation) {
        setHasStartedConversation(true);
      }
      toast.success('Message sent successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send message');
    }
  });

  // Mark messages as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: markMessagesAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', eventSpaceId]);
    }
  });

  useEffect(() => {
    // Mark unread messages as read when they are viewed
    const unreadMessageIds = messages
      .filter(msg => !msg.isRead && msg.receiverId === localStorage.getItem('userId'))
      .map(msg => msg._id);

    if (unreadMessageIds.length > 0) {
      markAsReadMutation.mutate(unreadMessageIds);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    // For new conversation, validate inputs
    if (!hasStartedConversation) {
      if (!name.trim() || !email.trim() || !subject.trim()) {
        toast.error('Please fill in all required fields');
        return;
      }
    }

    if (!eventSpace?.restaurantId) {
      console.error('No restaurant ID found for event space');
      toast.error('Could not determine restaurant for this event space');
      return;
    }

    try {
      const messageData = {
        eventSpaceId,
        content: messageText.trim(),
        subject: hasStartedConversation ? messages[0]?.subject : subject.trim(),
        receiverId: eventSpace.restaurantId,
        senderName: name.trim(),
        senderEmail: email.trim(),
        senderPhone: phone.trim(),
        messageType: 'event'
      };

      console.log('Sending message with data:', messageData);
      await sendMessageMutation.mutateAsync(messageData);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  if (isLoadingEventSpace) {
    return <div>Loading event space details...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Message Thread - {eventSpace?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {!hasStartedConversation && (
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter message subject"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Your Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Your Phone (Optional)</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                </div>
                <Separator />
              </div>
            )}

            {isLoadingMessages ? (
              <div>Loading messages...</div>
            ) : (
              <MessageThread messages={messages} />
            )}

            <div className="mt-4">
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
              />
              <div className="mt-2 flex justify-end">
                <Button
                  onClick={handleSendMessage}
                  disabled={sendMessageMutation.isLoading}
                >
                  {sendMessageMutation.isLoading ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EventMessagePage;
