-- ============================================================================
-- Chat System Diagnostics for Supabase
-- ============================================================================
-- Run these queries in Supabase SQL Editor to troubleshoot chat issues

-- =================================
-- Database Schema Check
-- =================================
-- Check if chat tables exist and have correct structure

-- 1. Check table existence
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('conversations', 'conversation_participants', 'chat_messages', 'users')
ORDER BY table_name;

-- 2. Check chat_messages table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'chat_messages'
ORDER BY ordinal_position;

-- 3. Check conversations table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'conversations'
ORDER BY ordinal_position;

-- 4. Check conversation_participants table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'conversation_participants'
ORDER BY ordinal_position;

-- =================================
-- Data State Check
-- =================================
-- Check current data in chat tables

-- 1. Count records in each table
SELECT 'conversations' as table_name, COUNT(*) as record_count FROM conversations
UNION ALL
SELECT 'conversation_participants' as table_name, COUNT(*) as record_count FROM conversation_participants
UNION ALL
SELECT 'chat_messages' as table_name, COUNT(*) as record_count FROM chat_messages
UNION ALL
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
ORDER BY table_name;

-- 2. Check conversation types and participant roles
SELECT 
  c.type as conversation_type,
  COUNT(*) as count
FROM conversations c
GROUP BY c.type
ORDER BY c.type;

SELECT DISTINCT role 
FROM conversation_participants 
ORDER BY role;

-- 3. Sample data from each table (latest 5 records)
SELECT 'Latest Conversations:' as info;
SELECT id, type, name, created_at 
FROM conversations 
ORDER BY created_at DESC 
LIMIT 5;

SELECT 'Latest Messages:' as info;
SELECT id, conversation_id, content, created_at 
FROM chat_messages 
ORDER BY created_at DESC 
LIMIT 5;

-- =================================
-- Permissions Check
-- =================================
-- Check RLS and permissions status

-- 1. Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('chat_messages', 'conversations', 'conversation_participants', 'users')
ORDER BY tablename;

-- 2. Check table privileges for anon role
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
-- Realtime Check
-- =================================
-- Check realtime publication status

SELECT 
  pt.schemaname,
  pt.tablename,
  p.pubname as publication_name
FROM pg_publication_tables pt
JOIN pg_publication p ON p.oid = pt.pubid
WHERE pt.schemaname = 'public' 
AND pt.tablename IN ('chat_messages', 'conversations', 'conversation_participants')
ORDER BY pt.tablename;

-- =================================
-- Performance Check
-- =================================
-- Check indexes on chat tables

SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('chat_messages', 'conversations', 'conversation_participants')
ORDER BY tablename, indexname;
