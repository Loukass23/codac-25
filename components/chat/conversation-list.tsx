"use client";

import { useEffect, useCallback } from "react";
import { Users, User, Hash, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import { useRealtimeConversationList } from "@/hooks/use-realtime-conversation-list";
import { markConversationReadAction } from "@/actions/chat/mark-conversation-read";
import type { ConversationWithParticipants } from "@/data/chat/get-conversations";

interface ConversationListProps {
  currentUserId: string;
  selectedConversationId?: string | null;
  onConversationSelect: (conversationId: string) => void;
  refreshRef?: React.MutableRefObject<(() => Promise<void>) | null>;
  pendingConversationId?: string | null;
  onPendingConversationHandled?: () => void;
  activeTab: "all" | "direct" | "group" | "channel";
}

export function ConversationList({
  currentUserId,
  selectedConversationId,
  onConversationSelect,
  refreshRef,
  pendingConversationId,
  onPendingConversationHandled,
  activeTab,
}: ConversationListProps) {
  const {
    loading,
    error,
    conversations,
    getFilteredConversations,
    refreshConversations,
    getUnreadCount: getConversationUnreadCount,
    markAsRead: markConversationReadLocally,
  } = useRealtimeConversationList({
    currentUserId,
    selectedConversationId,
  });

  // Get unread count for a conversation using the hook's method
  const getUnreadCount = (conversationId: string) => {
    return getConversationUnreadCount(conversationId);
  };

  // Mark conversation as read both on server and locally
  const markAsRead = useCallback(
    async (conversationId?: string) => {
      if (!conversationId) return;

      try {
        // Immediately update the UI to remove the unread badge
        markConversationReadLocally(conversationId);

        // Then update on the server
        await markConversationReadAction({ conversationId });
      } catch (error) {
        console.error("Error marking conversation as read:", error);
        // On error, you might want to refresh to get the correct state
        // refreshConversations();
      }
    },
    [markConversationReadLocally]
  );

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedConversationId) {
      markAsRead(selectedConversationId);
    }
  }, [selectedConversationId, markAsRead]);

  // Expose refresh function to parent
  useEffect(() => {
    if (refreshRef) {
      refreshRef.current = refreshConversations;
    }
  }, [refreshConversations, refreshRef]);

  // Handle pending conversation selection
  useEffect(() => {
    if (pendingConversationId && !loading) {
      // Check if the pending conversation is now available in the list
      const pendingConversation = conversations.find(
        (c) => c.id === pendingConversationId
      );
      if (pendingConversation) {
        onConversationSelect(pendingConversationId);
        onPendingConversationHandled?.();
      }
    }
  }, [
    pendingConversationId,
    conversations,
    loading,
    onConversationSelect,
    onPendingConversationHandled,
  ]);

  const getConversationIcon = (type: string) => {
    switch (type) {
      case "DIRECT":
        return <User className="h-4 w-4" />;
      case "GROUP":
        return <Users className="h-4 w-4" />;
      case "CHANNEL":
        return <Hash className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getConversationName = (conversation: ConversationWithParticipants) => {
    if (conversation.name) {
      return conversation.name;
    }

    if (conversation.type === "DIRECT") {
      // Find the other participant
      const otherParticipant = conversation.participants.find(
        (p: any) => p.user.id !== currentUserId
      );
      return (
        otherParticipant?.user.name ||
        otherParticipant?.user.email ||
        "Unknown User"
      );
    }

    return `${conversation.type} Conversation`;
  };

  const getLastMessagePreview = (
    conversation: ConversationWithParticipants
  ) => {
    if (!conversation.lastMessage) {
      return "No messages yet";
    }

    const maxLength = 50;
    const content = conversation.lastMessage.content;
    return content.length > maxLength
      ? content.substring(0, maxLength) + "..."
      : content;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const filteredConversations = getFilteredConversations(activeTab);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center text-destructive text-sm">
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshConversations}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (filteredConversations.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">
          {activeTab === "all"
            ? "No conversations yet"
            : `No ${activeTab} conversations`}
        </p>
        <p className="text-xs">Start a new conversation to get started</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="space-y-1 p-2">
        {filteredConversations.map((conversation) => {
          const unreadCount = getUnreadCount(conversation.id);
          const hasUnread = unreadCount > 0;

          return (
            <Button
              key={conversation.id}
              variant="ghost"
              className={cn(
                "w-full h-auto p-3 justify-start flex-col items-start gap-2 transition-colors",
                selectedConversationId === conversation.id && "bg-muted",
                hasUnread &&
                  selectedConversationId !== conversation.id &&
                  "bg-blue-50 hover:bg-blue-100 border-l-2 border-l-blue-500"
              )}
              onClick={() => onConversationSelect(conversation.id)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {getConversationIcon(conversation.type)}
                  <span
                    className={cn(
                      "text-sm truncate",
                      hasUnread ? "font-bold" : "font-medium"
                    )}
                  >
                    {getConversationName(conversation)}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {getUnreadCount(conversation.id) > 0 && (
                    <Badge
                      variant="destructive"
                      className="text-xs h-5 min-w-5 justify-center"
                    >
                      {getUnreadCount(conversation.id)}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs h-5">
                    {conversation.participants.length}
                  </Badge>
                  {conversation.lastMessage && (
                    <span className="text-xs text-muted-foreground">
                      {getTimeAgo(
                        conversation.lastMessage.createdAt.toString()
                      )}
                    </span>
                  )}
                </div>
              </div>

              {conversation.lastMessage && (
                <div className="w-full text-left">
                  <p className="text-xs text-muted-foreground truncate">
                    {getLastMessagePreview(conversation)}
                  </p>
                </div>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
