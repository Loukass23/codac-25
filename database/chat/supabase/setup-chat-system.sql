-- ============================================================================
-- Chat System Setup for Supabase (Production)
-- ============================================================================
-- Run this in Supabase SQL Editor to set up chat realtime and permissions
-- This consolidates: enable-chat-realtime.sql + fix-nextauth-supabase.sql

-- =================================
-- Step 1: Disable RLS (NextAuth Setup)
-- =================================
-- Since this app uses NextAuth (not Supabase Auth), RLS policies with auth.uid() won't work
-- We disable RLS and rely on server actions for security

ALTER TABLE chat_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop any existing RLS policies
DROP POLICY IF EXISTS "Users can see their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can insert their own messages" ON chat_messages;
DROP POLICY IF EXISTS "Users can see conversations they participate in" ON conversations;
DROP POLICY IF EXISTS "Users can see their own participation" ON conversation_participants;

-- =================================
-- Step 2: Grant Permissions
-- =================================
-- Grant necessary permissions for anon role (used by NextAuth)

GRANT SELECT ON users TO anon;
GRANT SELECT, INSERT, UPDATE ON chat_messages TO anon;
GRANT SELECT, INSERT, UPDATE ON conversations TO anon;
GRANT SELECT, INSERT, UPDATE ON conversation_participants TO anon;

-- =================================
-- Step 3: Enable Realtime
-- =================================
-- Enable realtime for chat tables

-- Check current realtime status first
SELECT 
  schemaname, 
  tablename,
  'Currently enabled' as status
FROM pg_publication_tables 
WHERE schemaname = 'public' 
AND tablename IN ('chat_messages', 'conversations', 'conversation_participants')
ORDER BY tablename;

-- Enable realtime publication for chat tables
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE conversation_participants;

-- =================================
-- Step 4: Verify Setup
-- =================================
-- Check that everything is set up correctly

-- Verify realtime is enabled
SELECT 
  pt.schemaname,
  pt.tablename,
  'Realtime enabled' as status
FROM pg_publication_tables pt
WHERE pt.schemaname = 'public' 
AND pt.tablename IN ('chat_messages', 'conversations', 'conversation_participants')
ORDER BY pt.tablename;

-- Verify permissions
SELECT 
  table_schema,
  table_name,
  privilege_type,
  grantee
FROM information_schema.table_privileges 
WHERE table_schema = 'public' 
AND table_name IN ('chat_messages', 'conversations', 'conversation_participants', 'users')
AND grantee = 'anon'
ORDER BY table_name, privilege_type;

-- =================================
-- Success Message
-- =================================
SELECT 'Chat system setup completed successfully!' as message;
