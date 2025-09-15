"use client";

import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageCircle, Users, Hash, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ConversationList } from "./conversation-list";
import { ConversationView } from "./conversation-view";
import { CreateConversationDialog } from "./create-conversation-dialog";

interface ChatLayoutProps {
  currentUserId: string;
  currentUserName?: string;
}

export function ChatLayout({ currentUserId, currentUserName }: ChatLayoutProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "direct" | "group" | "channel"
  >("all");

  // Store the ID of a conversation we want to navigate to after creation
  const [pendingConversationId, setPendingConversationId] = useState<
    string | null
  >(null);

  // Ref to access conversation list refresh function
  const refreshConversationsRef = useRef<(() => Promise<void>) | null>(null);

  // Check for conversation parameter in URL and auto-select it
  useEffect(() => {
    const conversationParam = searchParams.get("conversation");
    if (conversationParam && conversationParam !== selectedConversationId) {
      setSelectedConversationId(conversationParam);

      // Clear the URL parameter after selecting the conversation
      // to keep the URL clean and prevent re-triggering on refresh
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("conversation");
      router.replace(newUrl.pathname, { scroll: false });
    }
  }, [searchParams, selectedConversationId, router]);

  // Temporarily disable unread counts for debugging
  const getTotalUnreadCount = (_tab: string) => 0;

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handlePendingConversationHandled = () => {
    setPendingConversationId(null);
  };

  const handleConversationCreated = async (conversationId: string) => {
    // Set the pending conversation ID so we can select it once it appears
    setPendingConversationId(conversationId);

    // Manual refresh as fallback to ensure new conversation appears
    // The realtime subscription should handle it, but this ensures reliability
    if (refreshConversationsRef.current) {
      await refreshConversationsRef.current();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] w-full bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Conversations Sidebar */}
        <ResizablePanel defaultSize={30} minSize={25} maxSize={45}>
          <div className="flex flex-col h-full border-r">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Messages</h2>
              <div className="flex items-center gap-2">
                <CreateConversationDialog
                  currentUserId={currentUserId}
                  onConversationCreated={handleConversationCreated}
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Start new conversation"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  }
                />
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Conversation Types Tabs */}
            <div className="flex items-center gap-1 p-2 border-b">
              <Button
                variant={activeTab === "all" ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setActiveTab("all")}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">All</span>
                {getTotalUnreadCount("all") > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-xs h-4 min-w-4 justify-center p-0"
                  >
                    {getTotalUnreadCount("all")}
                  </Badge>
                )}
              </Button>
              <Button
                variant={activeTab === "direct" ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setActiveTab("direct")}
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">Direct</span>
                {getTotalUnreadCount("direct") > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-xs h-4 min-w-4 justify-center p-0"
                  >
                    {getTotalUnreadCount("direct")}
                  </Badge>
                )}
              </Button>
              <Button
                variant={activeTab === "group" ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setActiveTab("group")}
              >
                <Users className="h-4 w-4" />
                <span className="text-sm">Groups</span>
                {getTotalUnreadCount("group") > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-xs h-4 min-w-4 justify-center p-0"
                  >
                    {getTotalUnreadCount("group")}
                  </Badge>
                )}
              </Button>
              <Button
                variant={activeTab === "channel" ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setActiveTab("channel")}
              >
                <Hash className="h-4 w-4" />
                <span className="text-sm">Channels</span>
                {getTotalUnreadCount("channel") > 0 && (
                  <Badge
                    variant="destructive"
                    className="text-xs h-4 min-w-4 justify-center p-0"
                  >
                    {getTotalUnreadCount("channel")}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Conversations List */}
            <ConversationList
              currentUserId={currentUserId}
              selectedConversationId={selectedConversationId}
              onConversationSelect={handleConversationSelect}
              refreshRef={refreshConversationsRef}
              pendingConversationId={pendingConversationId}
              onPendingConversationHandled={handlePendingConversationHandled}
              activeTab={activeTab}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* Main Chat Area */}
        <ResizablePanel defaultSize={70}>
          <div className="flex flex-col h-full">
            {selectedConversationId ? (
              // Active conversation view
              <ConversationView
                conversationId={selectedConversationId}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
              />
            ) : (
              // Empty state
              <div className="flex-1 flex items-center justify-center bg-muted/10">
                <div className="text-center">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                  <CreateConversationDialog
                    currentUserId={currentUserId}
                    onConversationCreated={handleConversationCreated}
                    trigger={
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Start New Conversation
                      </Button>
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
