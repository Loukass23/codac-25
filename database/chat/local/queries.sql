-- ============================================================================
-- Local Chat System Queries
-- ============================================================================
-- Run these with your local database tools or via Prisma Studio

-- =================================
-- Quick Data Overview
-- =================================

-- Count all chat-related records
SELECT 
  'conversations' as table_name, 
  COUNT(*) as count 
FROM "Conversation"
UNION ALL
SELECT 
  'participants' as table_name, 
  COUNT(*) as count 
FROM "ConversationParticipant"
UNION ALL
SELECT 
  'messages' as table_name, 
  COUNT(*) as count 
FROM "ChatMessage"
ORDER BY table_name;

-- =================================
-- Sample Conversations
-- =================================

-- Latest conversations with participant count
SELECT 
  c.id,
  c.type,
  c.name,
  c."createdAt",
  COUNT(cp."userId") as participant_count
FROM "Conversation" c
LEFT JOIN "ConversationParticipant" cp ON c.id = cp."conversationId"
GROUP BY c.id, c.type, c.name, c."createdAt"
ORDER BY c."createdAt" DESC
LIMIT 10;

-- =================================
-- Sample Messages
-- =================================

-- Latest messages with conversation info
SELECT 
  cm.id as message_id,
  cm.content,
  cm."createdAt",
  c.type as conversation_type,
  c.name as conversation_name,
  u.name as sender_name,
  u.email as sender_email
FROM "ChatMessage" cm
JOIN "Conversation" c ON cm."conversationId" = c.id
JOIN "User" u ON cm."userId" = u.id
ORDER BY cm."createdAt" DESC
LIMIT 10;

-- =================================
-- User Participation
-- =================================

-- Users with their conversation participation
SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(cp."conversationId") as conversations_count
FROM "User" u
LEFT JOIN "ConversationParticipant" cp ON u.id = cp."userId"
GROUP BY u.id, u.name, u.email
HAVING COUNT(cp."conversationId") > 0
ORDER BY conversations_count DESC;

-- =================================
-- Conversation Details
-- =================================

-- Detailed view of a specific conversation (replace conversation_id)
-- SELECT 
--   c.id,
--   c.type,
--   c.name,
--   c.description,
--   c."createdAt",
--   array_agg(
--     json_build_object(
--       'userId', u.id,
--       'name', u.name,
--       'email', u.email,
--       'role', cp.role
--     )
--   ) as participants
-- FROM "Conversation" c
-- JOIN "ConversationParticipant" cp ON c.id = cp."conversationId"
-- JOIN "User" u ON cp."userId" = u.id
-- WHERE c.id = 'your-conversation-id-here'
-- GROUP BY c.id, c.type, c.name, c.description, c."createdAt";
