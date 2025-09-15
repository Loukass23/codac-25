"use client";

import { createClient } from "@/lib/supabase/client";
import { sendConversationMessage } from "@/actions/chat/send-conversation-message";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface ConversationMessage {
  id: string;
  content: string;
  createdAt: Date;
  userName: string | null;
  userId: string;
  conversationId: string;
  user?: {
    id: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
  };
}

export interface UserPresence {
  userId: string;
  username: string;
  online_at: string;
}

export interface TypingUser {
  userId: string;
  username: string;
  typing_at: string;
}

interface UseRealtimeConversationProps {
  conversationId: string;
  currentUserId: string;
  currentUserName?: string;
}

export function useRealtimeConversation({
  conversationId,
  currentUserId,
  currentUserName = "User",
}: UseRealtimeConversationProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const supabase = createClient();

  // Load initial messages when conversation changes
  useEffect(() => {
    // Clear messages when conversation changes - let ConversationView handle initial loading
    setMessages([]);
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    if (!currentUserId) {
      return;
    }

    // Create channel for this conversation
    const channel = supabase.channel(`conversation:${conversationId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: currentUserId },
      },
    });

    // Function to handle new message from postgres_changes
    const handleNewMessage = (payload: any) => {
      if (payload.new) {
        // Handle both camelCase (Prisma) and snake_case (raw database) field names
        const rawData = payload.new;

        // Validate that we have required message fields
        if (!rawData.id || !rawData.content) {
          return;
        }

        // Ensure createdAt is properly converted to Date object
        let createdAt: Date;
        const rawCreatedAt = rawData.createdAt || rawData.created_at;
        if (rawCreatedAt instanceof Date) {
          createdAt = rawCreatedAt;
        } else if (typeof rawCreatedAt === "string") {
          createdAt = new Date(rawCreatedAt);
        } else {
          createdAt = new Date(); // fallback
        }

        const newMessage = {
          id: rawData.id,
          content: rawData.content,
          createdAt,
          userName: rawData.userName || rawData.user_name,
          userId: rawData.userId || rawData.user_id,
          conversationId: rawData.conversationId || rawData.conversation_id,
          user: undefined, // Realtime messages don't include user object
        } as ConversationMessage;

        setMessages((prev) => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some((msg) => msg.id === newMessage.id);
          if (exists) {
            return prev;
          }

          return [...prev, newMessage];
        });
      }
    };

    // Listen for ALL new messages and filter in JavaScript (more reliable)
    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          // Filter for our conversation in JavaScript
          const messageConversationId =
            payload.new?.conversationId || payload.new?.conversation_id;
          if (messageConversationId === conversationId) {
            handleNewMessage(payload);
          }
        }
      )
      // Fallback: listen for broadcasted messages (disabled for now since postgres_changes is working)
      // .on("broadcast", { event: "new_message" }, (payload) => {
      //   console.log("📨 New message received via broadcast:", payload);

      //   if (payload.payload) {
      //     const newMessage = payload.payload as ConversationMessage;

      //     // Only process if this message is for this conversation
      //     if (newMessage.conversationId === conversationId) {
      //       console.log("✅ Broadcast message is for this conversation, processing...");
      //       handleNewMessage({ new: newMessage });
      //     } else {
      //       console.log("⏭️ Broadcast message is for different conversation, ignoring:", newMessage.conversationId);
      //     }
      //   }
      // })
      // Listen for typing indicators
      .on("broadcast", { event: "typing" }, (payload) => {
        console.log("⌨️ Typing event received:", payload);

        if (payload.payload) {
          const { userId, username, isTyping: typing } = payload.payload;

          // Don't show own typing indicator
          if (userId === currentUserId) return;

          setTypingUsers((prev) => {
            if (typing) {
              const exists = prev.find((user) => user.userId === userId);
              if (exists) return prev;
              return [
                ...prev,
                { userId, username, typing_at: new Date().toISOString() },
              ];
            } else {
              return prev.filter((user) => user.userId !== userId);
            }
          });
        }
      })
      // Track presence
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const users: UserPresence[] = [];

        Object.keys(state).forEach((key) => {
          const presences = state[key];
          if (presences && presences.length > 0) {
            const presence = presences[0] as any;
            users.push({
              userId: key,
              username: presence.username || presence.userId || "Unknown",
              online_at: new Date().toISOString(),
            });
          }
        });

        setOnlineUsers(users);
      })
      .on("presence", { event: "join" }, () => {
        // User joined - handled by sync event
      })
      .on("presence", { event: "leave" }, () => {
        // User left - handled by sync event
      });

    // Subscribe to the channel
    channel.subscribe(async (status) => {
      setIsConnected(status === "SUBSCRIBED");

      if (status === "SUBSCRIBED") {
        // Track presence
        await channel.track({
          userId: currentUserId,
          username: currentUserName,
          online_at: new Date().toISOString(),
        });
      } else if (status === "CHANNEL_ERROR") {
        setIsConnected(false);
      } else if (status === "TIMED_OUT") {
        setIsConnected(false);
      } else if (status === "CLOSED") {
        setIsConnected(false);
      }
    });

    // Cleanup function
    return () => {
      channel.unsubscribe();
    };
  }, [conversationId, currentUserId, supabase]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!isConnected || isSending) {
        return { success: false, error: "Not connected or already sending" };
      }

      setIsSending(true);

      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        const channel = supabase.channel(`conversation:${conversationId}`);
        channel.send({
          type: "broadcast",
          event: "typing",
          payload: { userId: currentUserId, username: currentUserName, isTyping: false },
        });
      }

      try {
        console.log("📤 Sending message to conversation:", conversationId);

        const result = await sendConversationMessage({
          conversationId,
          content,
        });

        if (!result.success) {
          console.error("❌ Failed to send message:", result.error);
          toast.error(
            typeof result.error === "string"
              ? result.error
              : "Failed to send message"
          );
          return result;
        }

        console.log("✅ Message sent successfully:", (result.data as any)?.id);

        // Broadcast the message as a fallback for realtime
        if (result.data) {
          const channel = supabase.channel(`conversation:${conversationId}`);
          channel.send({
            type: "broadcast",
            event: "new_message",
            payload: result.data,
          });
        }

        return result;
      } catch (error) {
        console.error("❌ Error sending message:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        toast.error(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsSending(false);
      }
    },
    [conversationId, currentUserId, isConnected, isSending, isTyping, supabase]
  );

  const startTyping = useCallback(() => {
    if (!isTyping && isConnected) {
      setIsTyping(true);
      const channel = supabase.channel(`conversation:${conversationId}`);
      channel.send({
        type: "broadcast",
        event: "typing",
        payload: { userId: currentUserId, username: currentUserName, isTyping: true },
      });
    }
  }, [conversationId, currentUserId, isTyping, isConnected, supabase]);

  const stopTyping = useCallback(() => {
    if (isTyping && isConnected) {
      setIsTyping(false);
      const channel = supabase.channel(`conversation:${conversationId}`);
      channel.send({
        type: "broadcast",
        event: "typing",
        payload: { userId: currentUserId, username: currentUserName, isTyping: false },
      });
    }
  }, [conversationId, currentUserId, isTyping, isConnected, supabase]);

  return {
    messages,
    sendMessage,
    onlineUsers,
    typingUsers,
    isConnected,
    isSending,
    isTyping,
    startTyping,
    stopTyping,
  };
}
