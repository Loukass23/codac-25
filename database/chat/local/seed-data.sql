-- ============================================================================
-- Local Development Chat Setup
-- ============================================================================
-- Run this against your local PostgreSQL database via Prisma or database tools

-- =================================
-- Sample Users (if none exist)
-- =================================

-- Insert sample users for testing (modify as needed)
INSERT INTO "User" (id, name, email, "emailVerified", image, "createdAt", "updatedAt")
VALUES 
  ('user-1', 'Alice Johnson', 'alice@example.com', NOW(), NULL, NOW(), NOW()),
  ('user-2', 'Bob Smith', 'bob@example.com', NOW(), NULL, NOW(), NOW()),
  ('user-3', 'Carol Davis', 'carol@example.com', NOW(), NULL, NOW(), NOW()),
  ('user-4', 'David Wilson', 'david@example.com', NOW(), NULL, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- =================================
-- Sample Conversations
-- =================================

-- Create a direct message conversation
INSERT INTO "Conversation" (id, type, name, description, "createdAt", "updatedAt")
VALUES 
  ('conv-dm-1', 'DIRECT_MESSAGE', NULL, 'Direct conversation between Alice and Bob', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create a group conversation
INSERT INTO "Conversation" (id, type, name, description, "createdAt", "updatedAt")
VALUES 
  ('conv-group-1', 'GROUP', 'Project Discussion', 'Discussion about the current project', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create a channel conversation
INSERT INTO "Conversation" (id, type, name, description, "createdAt", "updatedAt")
VALUES 
  ('conv-channel-1', 'CHANNEL', 'General', 'General discussion channel', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- =================================
-- Sample Participants
-- =================================

-- Add participants to DM (Alice and Bob)
INSERT INTO "ConversationParticipant" ("conversationId", "userId", role, "joinedAt")
VALUES 
  ('conv-dm-1', 'user-1', 'MEMBER', NOW()),
  ('conv-dm-1', 'user-2', 'MEMBER', NOW())
ON CONFLICT ("conversationId", "userId") DO NOTHING;

-- Add participants to group (Alice as admin, Bob and Carol as members)
INSERT INTO "ConversationParticipant" ("conversationId", "userId", role, "joinedAt")
VALUES 
  ('conv-group-1', 'user-1', 'ADMIN', NOW()),
  ('conv-group-1', 'user-2', 'MEMBER', NOW()),
  ('conv-group-1', 'user-3', 'MEMBER', NOW())
ON CONFLICT ("conversationId", "userId") DO NOTHING;

-- Add participants to channel (Alice as admin, everyone else as members)
INSERT INTO "ConversationParticipant" ("conversationId", "userId", role, "joinedAt")
VALUES 
  ('conv-channel-1', 'user-1', 'ADMIN', NOW()),
  ('conv-channel-1', 'user-2', 'MEMBER', NOW()),
  ('conv-channel-1', 'user-3', 'MEMBER', NOW()),
  ('conv-channel-1', 'user-4', 'MEMBER', NOW())
ON CONFLICT ("conversationId", "userId") DO NOTHING;

-- =================================
-- Sample Messages
-- =================================

-- Messages in DM
INSERT INTO "ChatMessage" (id, content, "userId", "conversationId", "createdAt", "updatedAt")
VALUES 
  ('msg-1', 'Hey Bob, how''s the project going?', 'user-1', 'conv-dm-1', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
  ('msg-2', 'Going well! Just finished the auth setup.', 'user-2', 'conv-dm-1', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
  ('msg-3', 'Awesome! Let me know if you need help with anything.', 'user-1', 'conv-dm-1', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- Messages in group
INSERT INTO "ChatMessage" (id, content, "userId", "conversationId", "createdAt", "updatedAt")
VALUES 
  ('msg-4', 'Welcome to the project discussion group!', 'user-1', 'conv-group-1', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
  ('msg-5', 'Thanks for adding me! Excited to work on this.', 'user-2', 'conv-group-1', NOW() - INTERVAL '2.5 hours', NOW() - INTERVAL '2.5 hours'),
  ('msg-6', 'Looking forward to collaborating with everyone!', 'user-3', 'conv-group-1', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours')
ON CONFLICT (id) DO NOTHING;

-- Messages in channel
INSERT INTO "ChatMessage" (id, content, "userId", "conversationId", "createdAt", "updatedAt")
VALUES 
  ('msg-7', 'Welcome to the general channel! Feel free to discuss anything here.', 'user-1', 'conv-channel-1', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),
  ('msg-8', 'Thanks! This is a great setup.', 'user-2', 'conv-channel-1', NOW() - INTERVAL '3.5 hours', NOW() - INTERVAL '3.5 hours'),
  ('msg-9', 'Agreed! The chat system looks really clean.', 'user-3', 'conv-channel-1', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
  ('msg-10', 'Can''t wait to start using this more!', 'user-4', 'conv-channel-1', NOW() - INTERVAL '2.5 hours', NOW() - INTERVAL '2.5 hours')
ON CONFLICT (id) DO NOTHING;
