
import React, { useEffect, useRef } from 'react';
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  senderType: 'customer' | 'restaurant';
}

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
}

export const MessageThread: React.FC<MessageThreadProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = format(new Date(message.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedMessages).sort();

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-md">
      {sortedDates.map(date => (
        <div key={date} className="mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
              {format(new Date(date), 'EEEE, MMMM d, yyyy')}
            </div>
          </div>
          
          {groupedMessages[date].map(message => {
            const isOwn = message.senderId === currentUserId;
            return (
              <div 
                key={message.id} 
                className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isOwn 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white border rounded-tl-none'
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/80' : 'text-gray-500'}`}>
                    {format(new Date(message.timestamp), 'h:mm a')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};
