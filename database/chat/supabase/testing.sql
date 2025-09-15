-- ============================================================================
-- Chat System Testing & Validation
-- ============================================================================
-- Run these in Supabase SQL Editor to test your chat setup

-- =================================
-- Table Structure Validation
-- =================================

-- Check chat_messages table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'chat_messages' 
ORDER BY ordinal_position;

-- Check conversations table structure  
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'conversations' 
ORDER BY ordinal_position;

-- Check conversation_participants table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'conversation_participants' 
ORDER BY ordinal_position;

-- Check ConversationType enum values
SELECT enumlabel 
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'ConversationType';

-- =================================
-- Permissions & Security Testing
-- =================================

-- Check if RLS is properly configured
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN 'RLS is ENABLED - policies will apply'
    ELSE 'RLS is DISABLED - no policies enforced'
  END as status
FROM pg_tables 
WHERE tablename IN ('chat_messages', 'conversations', 'conversation_participants')
ORDER BY tablename;

-- Check table permissions for anon role
SELECT 
  table_schema,
  table_name,
  privilege_type,
  is_grantable
FROM information_schema.role_table_grants 
WHERE grantee = 'anon' 
AND table_name IN ('chat_messages', 'conversations', 'conversation_participants', 'users')
ORDER BY table_name, privilege_type;

-- Check if realtime is enabled
SELECT * FROM pg_publication_tables 
WHERE tablename IN ('chat_messages', 'conversations', 'conversation_participants');

-- =================================
-- Data Validation
-- =================================

-- Check current conversations with participant and message counts
SELECT c.id, c.type, c.name, c.description, 
       COUNT(DISTINCT cp.id) as participant_count,
       COUNT(DISTINCT cm.id) as message_count
FROM conversations c
LEFT JOIN conversation_participants cp ON c.id = cp.conversation_id
LEFT JOIN chat_messages cm ON c.id = cm.conversation_id
GROUP BY c.id, c.type, c.name, c.description
ORDER BY c.created_at DESC;

-- Check recent messages with conversation info
SELECT cm.id, cm.content, cm.user_name, cm.created_at, 
       c.type as conversation_type, c.name as conversation_name
FROM chat_messages cm
JOIN conversations c ON cm.conversation_id = c.id
ORDER BY cm.created_at DESC
LIMIT 10;

-- Check participant role data
SELECT DISTINCT role 
FROM conversation_participants 
ORDER BY role;

-- =================================
-- Connection Testing
-- =================================

-- Check current database user and permissions
SELECT current_user, session_user;

-- Check if tables are accessible
SELECT 
  table_name,
  table_type,
  is_insertable_into,
  is_typed
FROM information_schema.tables 
WHERE table_name IN ('chat_messages', 'conversations', 'conversation_participants')
ORDER BY table_name;
