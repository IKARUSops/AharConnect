import React from 'react';
import { format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { cn } from '../../lib/utils';

export const MessageThread = ({ messages }) => {
  const userId = localStorage.getItem('userId');

  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto p-4">
      {messages.map((message) => {
        const isOwnMessage = message.senderId === userId;
        const initials = isOwnMessage ? 'You' : 'RS';

        return (
          <div
            key={message._id}
            className={cn(
              "flex gap-3",
              isOwnMessage ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${
                  isOwnMessage ? "You" : "Restaurant"
                }`}
                alt={isOwnMessage ? "Your avatar" : "Restaurant staff avatar"}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div
              className={cn(
                "rounded-lg p-4 max-w-[70%]",
                isOwnMessage
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">
                  {isOwnMessage ? "You" : "Restaurant Staff"}
                </span>
                <span className="text-xs opacity-70">
                  {format(new Date(message.createdAt), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
