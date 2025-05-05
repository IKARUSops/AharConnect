import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Layout from '@/components/layout/Layout';
import { MessageThread } from '@/components/customer/MessageThread';
import { Message } from '@/lib/types';

// Mock event space data
const mockEventSpace = {
  id: '1',
  name: 'Grand Hall',
  restaurantId: '1',
  restaurantName: 'The Italian Place',
  image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2370&auto=format&fit=crop',
};

// Mock messages
const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'user123',
    receiverId: 'restaurant1',
    content: 'Hi, I\'m interested in booking your Grand Hall for a corporate event. Do you offer any audio-visual equipment?',
    timestamp: '2025-04-26T14:30:00',
    isRead: true,
    senderType: 'customer'
  },
  {
    id: '2',
    senderId: 'restaurant1',
    receiverId: 'user123',
    content: 'Hello! Yes, we do offer audio-visual equipment including projectors, screens, and a sound system. We can also arrange for additional equipment if needed. When are you planning to hold your event?',
    timestamp: '2025-04-26T15:10:00',
    isRead: true,
    senderType: 'restaurant'
  },
  {
    id: '3',
    senderId: 'user123',
    receiverId: 'restaurant1',
    content: 'Thanks for the quick response. We\'re looking at hosting the event on May 15th. Would that date be available? We\'ll need the space from around 9 AM to 5 PM.',
    timestamp: '2025-04-26T15:25:00',
    isRead: true,
    senderType: 'customer'
  },
  {
    id: '4',
    senderId: 'restaurant1',
    receiverId: 'user123',
    content: 'Let me check our calendar. Yes, May 15th is available for the full day. Would you like me to tentatively reserve it for you? We can also discuss your catering needs if you\'d like.',
    timestamp: '2025-04-26T16:00:00',
    isRead: true,
    senderType: 'restaurant'
  },
];

const EventMessagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [subject, setSubject] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hasStartedConversation, setHasStartedConversation] = useState(mockMessages.length > 0);

  // Fetch event space details
  const { data: eventSpace = mockEventSpace } = useQuery({
    queryKey: ['eventSpace', id],
    queryFn: async () => {
      // In a real app, this would be an API call
      return mockEventSpace;
    }
  });

  const handleSendMessage = () => {
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

      setHasStartedConversation(true);
    }

    // Create a new message
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'user123',
      receiverId: 'restaurant1',
      content: messageText,
      timestamp: new Date().toISOString(),
      isRead: false,
      senderType: 'customer'
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessageText('');
    
    toast.success('Message sent successfully!');
    
    // In a real app, this would be an API call to send the message
    
    // Simulate restaurant response after a delay (for demo purposes)
    if (!hasStartedConversation) {
      setTimeout(() => {
        const responseMessage: Message = {
          id: `msg-${Date.now() + 1}`,
          senderId: 'restaurant1',
          receiverId: 'user123',
          content: `Hello ${name}, thanks for your message about "${subject}". A member of our events team will get back to you shortly.`,
          timestamp: new Date(Date.now() + 60000).toISOString(),
          isRead: false,
          senderType: 'restaurant'
        };
        
        setMessages(prevMessages => [...prevMessages, responseMessage]);
      }, 5000);
    }
  };

  return (
    <Layout>
      <div className="ahar-container py-12">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <img 
                    src={eventSpace.image} 
                    alt={eventSpace.name}
                    className="h-16 w-16 rounded-md object-cover mr-3"
                  />
                  <div>
                    <h3 className="font-medium">{eventSpace.name}</h3>
                    <p className="text-sm text-gray-600">{eventSpace.restaurantName}</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">(123) 456-7890</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">events@{eventSpace.restaurantName.toLowerCase().replace(/\s+/g, '')}.com</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Average Response Time</p>
                    <p className="text-sm text-gray-600">Within 2 hours</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div>
                  <p className="text-sm text-gray-600">
                    Have questions about the venue, packages, or want to discuss custom arrangements? Send us a message and our event team will assist you.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Message {eventSpace.restaurantName}</CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow flex flex-col">
                {!hasStartedConversation ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="(123) 456-7890"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Event inquiry, question about packages, etc."
                        required
                      />
                    </div>
                    
                    <div className="flex-grow">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea
                        id="message"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type your message here..."
                        rows={5}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSendMessage}>Send Message</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <MessageThread messages={messages} currentUserId="user123" />
                    
                    <div className="mt-auto pt-4">
                      <div className="flex items-end gap-2">
                        <Textarea 
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          placeholder="Type your message here..."
                          className="flex-grow"
                          rows={3}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button onClick={handleSendMessage}>Send</Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventMessagePage;
