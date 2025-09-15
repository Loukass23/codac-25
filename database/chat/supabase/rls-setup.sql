-- ============================================================================
-- Chat System Row Level Security (RLS) Setup
-- ============================================================================
-- Run this in Supabase SQL Editor to set up RLS and realtime for chat

-- =================================
-- Enable RLS and Realtime
-- =================================

-- Enable RLS for chat_messages table
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Enable realtime for the chat_messages table
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;

-- =================================
-- RLS Policies for chat_messages
-- =================================

-- Allow users to read messages from conversations they participate in
CREATE POLICY "Users can read messages from their conversations" ON chat_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_id = conversationId 
    AND user_id = auth.uid()
  )
);

-- Allow users to insert messages into conversations they participate in
CREATE POLICY "Users can insert messages into their conversations" ON chat_messages
FOR INSERT WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_id = conversationId 
    AND user_id = auth.uid()
  )
);

-- Allow users to update their own messages
CREATE POLICY "Users can update their own messages" ON chat_messages
FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Allow users to delete their own messages
CREATE POLICY "Users can delete their own messages" ON chat_messages
FOR DELETE USING (user_id = auth.uid());

-- =================================
-- Users Table Permissions
-- =================================

-- Grant permissions on users table for the anon role
-- This fixes "permission denied for table users" error
GRANT SELECT ON users TO anon;

-- =================================
-- Verification Queries
-- =================================

-- Check if realtime is enabled for chat_messages
SELECT * FROM pg_publication_tables WHERE tablename = 'chat_messages';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'chat_messages';

-- Verify users table permission
SELECT 
  table_schema,
  table_name,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE grantee = 'anon' 
AND table_name = 'users'
ORDER BY privilege_type;
