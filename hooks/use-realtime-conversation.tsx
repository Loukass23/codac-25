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

  // Cleanup stale optimistic messages periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      setMessages((prev) => {
        const now = Date.now();
        const cleaned = prev.filter((msg) => {
          // Remove optimistic messages older than 10 seconds
          if (msg.id.startsWith('temp-')) {
            const messageAge = now - new Date(msg.createdAt).getTime();
            if (messageAge > 10000) {
              console.log("🧹 Removing stale optimistic message:", msg.id);
              return false;
            }
          }
          return true;
        });
        
        return cleaned.length !== prev.length ? cleaned : prev;
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(cleanup);
  }, []);

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
        
        console.log("📅 Processing timestamp from WebSocket:", {
          rawCreatedAt,
          type: typeof rawCreatedAt,
          isDate: rawCreatedAt instanceof Date
        });
        
        if (rawCreatedAt instanceof Date) {
          createdAt = rawCreatedAt;
        } else if (typeof rawCreatedAt === "string") {
          // CRITICAL FIX: Ensure proper UTC handling
          // If the string doesn't have timezone info, it might be treated as local time
          // Always ensure we're parsing as UTC
          let timeString = rawCreatedAt;
          
          // If string doesn't end with Z or have timezone offset, assume it's UTC
          if (!timeString.includes('Z') && !timeString.includes('+') && !timeString.includes('-', 10)) {
            timeString = timeString + 'Z';
          }
          
          createdAt = new Date(timeString);
          
          console.log("📅 Converted string to Date:", {
            original: rawCreatedAt,
            processed: timeString,
            converted: createdAt,
            iso: createdAt.toISOString(),
            display: createdAt.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
            wasFixed: timeString !== rawCreatedAt
          });
        } else {
          console.warn("❌ No valid timestamp found, using fallback");
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

          // Check if this is a real message that should replace an optimistic one
          // Look for optimistic messages with the same content, userId, and recent timestamp
          const potentialOptimisticIndex = prev.findIndex((msg) => 
            msg.id.startsWith('temp-') && 
            msg.content === newMessage.content && 
            msg.userId === newMessage.userId &&
            Math.abs(new Date(msg.createdAt).getTime() - new Date(newMessage.createdAt).getTime()) < 10000 // Within 10 seconds
          );

          if (potentialOptimisticIndex !== -1) {
            console.log("🔄 Replacing optimistic message with real WebSocket message:", {
              optimisticId: prev[potentialOptimisticIndex].id,
              realId: newMessage.id
            });
            // Replace the optimistic message
            const updatedMessages = [...prev];
            updatedMessages[potentialOptimisticIndex] = newMessage;
            return updatedMessages.sort((a, b) => {
              const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
              const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
              return dateA.getTime() - dateB.getTime();
            });
          }

          // Add message and sort by date to maintain proper order
          const updatedMessages = [...prev, newMessage];
          return updatedMessages.sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
            const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
            return dateA.getTime() - dateB.getTime();
          });
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

      // Create optimistic message for immediate UI update
      // IMPORTANT: Use server-compatible timestamp to avoid timezone issues
      // We'll create a timestamp that should closely match what the server will return
      const optimisticMessage: ConversationMessage = {
        id: `temp-${crypto.randomUUID()}`, // Temporary ID
        content,
        createdAt: new Date(Date.now()), // Use UTC timestamp that matches server expectation
        userName: currentUserName,
        userId: currentUserId,
        conversationId,
        user: {
          id: currentUserId,
          name: currentUserName,
          email: null,
          avatar: null,
        },
      };
      
      console.log("📝 Created optimistic message:", {
        id: optimisticMessage.id,
        createdAt: optimisticMessage.createdAt,
        iso: optimisticMessage.createdAt.toISOString(),
        display: optimisticMessage.createdAt.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      });

      try {
        console.log("📤 Sending message to conversation:", conversationId);

        // Add optimistic message immediately for the sender
        setMessages((prev) => [...prev, optimisticMessage]);

        const result = await sendConversationMessage({
          conversationId,
          content,
        });

        console.log("📤 Server response structure:", {
          result,
          success: result.success,
          hasData: result.success ? !!result.data : false,
          dataType: result.success ? typeof result.data : 'error response',
          dataKeys: result.success && result.data ? Object.keys(result.data) : 'no data',
          hasOk: result.success && result.data ? 'ok' in result.data : false,
          okValue: result.success && result.data ? result.data.ok : undefined,
          hasDataData: result.success && result.data && result.data.data ? 'data nested' : 'no nested data',
          dataDataKeys: result.success && result.data && result.data.data ? Object.keys(result.data.data) : 'no nested keys'
        });

        if (!result.success) {
          // Remove optimistic message on failure
          setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
          
          console.error("❌ Failed to send message:", result.error);
          toast.error(
            typeof result.error === "string"
              ? result.error
              : "Failed to send message"
          );
          return result;
        }

        console.log("✅ Message sent successfully:", result.success && result.data.data?.id);

        // Replace optimistic message with real message
        console.log("🔍 Checking replacement conditions:", {
          success: result.success,
          hasData: !!result.data,
          hasOk: result.data?.ok,
          hasDataData: !!result.data?.data,
          hasId: !!result.data?.data?.id,
          fullCondition: result.success && result.data?.ok && !!result.data.data?.id
        });

        if (result.success && result.data?.ok && result.data.data?.id) {
          console.log("🎯 REPLACEMENT CONDITIONS MET - Starting replacement");
          const realMessage = result.data.data;
          
          console.log("📝 Replacing optimistic message:", {
            optimisticId: optimisticMessage.id,
            realId: realMessage.id,
            optimisticTime: optimisticMessage.createdAt,
            realTime: realMessage.createdAt
          });
          
          // GUARANTEED REPLACEMENT: Always remove the specific optimistic message
          // This ensures we don't have stale optimistic messages lingering
          setMessages((prev) => {
            console.log("🔄 Current messages before replacement:", prev.length);
            console.log("🔍 Looking for optimistic message to remove:", optimisticMessage.id);
            
            const withoutOptimistic = prev.filter((m) => {
              const shouldRemove = m.id === optimisticMessage.id;
              if (shouldRemove) {
                console.log("✂️ Removing optimistic message:", m.id);
              }
              return !shouldRemove;
            });
            
            console.log("🔄 Messages after optimistic removal:", withoutOptimistic.length);
            
            const realMessageData = {
              id: realMessage.id,
              content: realMessage.content,
              createdAt: new Date(realMessage.createdAt), // Ensure it's always a Date object
              userName: realMessage.userName,
              userId: realMessage.userId,
              conversationId: realMessage.conversationId,
              user: optimisticMessage.user,
            };
            
            // Check if real message already exists (from WebSocket)
            const realMessageExists = withoutOptimistic.some(m => m.id === realMessage.id);
            
            if (realMessageExists) {
              console.log("✅ Real message already exists from WebSocket, just removing optimistic");
              return withoutOptimistic;
            } else {
              console.log("➕ Adding real message from server response");
              const updatedMessages = [...withoutOptimistic, realMessageData];
              return updatedMessages.sort((a, b) => {
                const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
                const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
                return dateA.getTime() - dateB.getTime();
              });
            }
          });

          // Broadcast the message as a fallback for realtime
          const channel = supabase.channel(`conversation:${conversationId}`);
          channel.send({
            type: "broadcast",
            event: "new_message",
            payload: realMessage,
          });
        } else {
          console.error("❌ REPLACEMENT CONDITIONS NOT MET - Optimistic message will remain!", {
            success: result.success,
            hasData: !!result.data,
            hasOk: result.data?.ok,
            hasDataData: !!result.data?.data,
            hasId: result.data?.data?.id,
            optimisticMessageId: optimisticMessage.id
          });
        }

        return result;
      } catch (error) {
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
        
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
