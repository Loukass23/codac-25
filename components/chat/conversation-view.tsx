"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import { ConversationHeader } from "./conversation-header";
import { MessageBubble } from "./message-bubble";
import { MessageInput } from "./message-input";
import { getConversationAction } from "@/actions/chat/get-conversation";
import { useRealtimeConversation } from "@/hooks/use-realtime-conversation";

interface ConversationViewProps {
  conversationId: string;
  currentUserId: string;
  currentUserName?: string;
}

interface ConversationData {
  id: string;
  type: "DIRECT" | "GROUP" | "CHANNEL";
  name: string | null;
  description: string | null;
  participants: Array<{
    id: string;
    role: string;
    userId: string;
    conversationId: string;
    joinedAt: Date;
    user: {
      id: string;
      name: string | null;
      email: string | null;
      avatar: string | null;
    };
  }>;
  messages: Array<{
    id: string;
    content: string;
    createdAt: Date;
    userName: string | null;
    userId: string;
    user?: {
      id: string;
      name: string | null;
      email: string | null;
      avatar: string | null;
    };
  }>;
}

export function ConversationView({
  conversationId,
  currentUserId,
  currentUserName,
}: ConversationViewProps) {
  const [conversation, setConversation] = useState<ConversationData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Use realtime hook for realtime updates only
  const {
    messages: realtimeMessages,
    sendMessage,
    isConnected,
    isSending,
    onlineUsers,
    typingUsers,
    startTyping,
    stopTyping,
  } = useRealtimeConversation({
    conversationId,
    currentUserId,
    currentUserName,
  });

  // Combine conversation messages with realtime messages
  const allMessages = useMemo(() => {
    if (!conversation?.messages) return [];

    // Get conversation message IDs for deduplication
    const conversationMessageIds = new Set(
      conversation.messages.map((m) => m.id)
    );

    // Filter realtime messages to only include new ones not in conversation
    const newRealtimeMessages = realtimeMessages.filter(
      (m) => !conversationMessageIds.has(m.id)
    );

    // Convert realtime messages to match conversation message structure
    const convertedRealtimeMessages = newRealtimeMessages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      createdAt: msg.createdAt,
      userName: msg.userName,
      userId: msg.userId,
      user: msg.user,
    }));

    // Combine and sort by creation date
    return [...conversation.messages, ...convertedRealtimeMessages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [conversation?.messages, realtimeMessages]);

  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getConversationAction({
        conversationId,
      });

      if (response.success) {
        setConversation(response.data);
      } else {
        const errorMessage =
          typeof response.error === "string"
            ? response.error
            : "Failed to load conversation";
        setError(errorMessage);
      }
    } catch (err) {
      setError("Failed to load conversation");
      console.error("Error loading conversation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversation) return;

    // Use the realtime hook's sendMessage function
    const result = await sendMessage(content);

    if (!result.success) {
      console.error("Failed to send message:", result.error);
    }
    // No need to manually reload - realtime will handle the update
  };

  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [date: string]: any[] } = {};

    messages.forEach((message) => {
      // Ensure createdAt is a valid Date object
      const messageDate =
        message.createdAt instanceof Date
          ? message.createdAt
          : new Date(message.createdAt);
      const date = messageDate.toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return groups;
  };

  const shouldShowAvatar = (
    message: ConversationData["messages"][0],
    nextMessage?: ConversationData["messages"][0]
  ) => {
    if (!nextMessage) return true;
    return message.userId !== nextMessage.userId;
  };

  const shouldShowName = (
    message: ConversationData["messages"][0],
    prevMessage?: ConversationData["messages"][0]
  ) => {
    if (!prevMessage) return true;
    return message.userId !== prevMessage.userId;
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadConversation} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Conversation not found</p>
      </div>
    );
  }

  const messageGroups = groupMessagesByDate(allMessages);
  const dates = Object.keys(messageGroups).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ConversationHeader
        conversation={conversation}
        currentUserId={currentUserId}
        onlineUsers={onlineUsers}
      />

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <p className="text-sm text-yellow-700">
            Reconnecting to live chat...
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {dates.map((date) => (
          <div key={date}>
            {/* Date Separator */}
            <div className="flex items-center justify-center mb-4">
              <div className="bg-muted px-3 py-1 rounded-full">
                <span className="text-xs text-muted-foreground font-medium">
                  {new Date(date).toLocaleDateString([], {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Messages for this date */}
            <div className="space-y-1">
              {messageGroups[date].map((message, index) => {
                const prevMessage = messageGroups[date][index - 1];
                const nextMessage = messageGroups[date][index + 1];

                return (
                  <MessageBubble
                    key={message.id || `${date}-${index}`}
                    message={message}
                    isOwnMessage={message.userId === currentUserId}
                    showAvatar={shouldShowAvatar(message, nextMessage)}
                    showName={shouldShowName(message, prevMessage)}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Empty state */}
        {allMessages.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">No messages yet</p>
              <p className="text-sm text-muted-foreground">
                Start the conversation by sending a message below
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicators - Fixed at bottom */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 text-sm text-muted-foreground italic bg-background/95 backdrop-blur animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-2">
              {typingUsers.map((user) => user.username).join(", ")}{" "}
              {typingUsers.length === 1 ? "is" : "are"} typing...
          </div>
        </div>
      )}

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isSending}
        placeholder={`Message ${
          conversation?.type === "DIRECT"
            ? conversation.participants.find((p) => p.user.id !== currentUserId)
                ?.user.name || "user"
            : conversation?.name || "conversation"
        }...`}
        onStartTyping={startTyping}
        onStopTyping={stopTyping}
      />
    </div>
  );
}
