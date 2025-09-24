# Plate.js Comments Database Integration

This document explains how to integrate Plate.js comments with your database for persistent comment storage and retrieval.

## Overview

The integration consists of several components:

1. **Database Schema** - New `DocumentComment` model for storing Plate.js comments
2. **Server Actions** - CRUD operations for comment management
3. **Data Layer** - Functions for fetching comments from the database
4. **Plate.js Plugin** - Custom plugin for database integration
5. **UI Components** - Updated comment components that work with the database

## Database Schema

The `DocumentComment` model stores:

- Rich content (Plate.js Value format)
- Discussion grouping
- Document references (project summaries, community posts, etc.)
- User relationships
- Threading support (replies)
- Resolution status

```prisma
model DocumentComment {
  id        String @id @default(cuid())
  content   Json   // Plate.js rich content (Value type)
  discussionId String @unique // Links comments in the same discussion

  // Document reference (can be project summary, community post, etc.)
  documentType String // 'project_summary', 'community_post', etc.
  documentId   String // ID of the referenced document

  // Relations
  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

  parentId String?
  parent   DocumentComment?  @relation("DocumentCommentThread", fields: [parentId], references: [id])
  replies  DocumentComment[] @relation("DocumentCommentThread")

  // Plate.js specific fields
  isResolved Boolean @default(false)
  documentContent String? // The text content that was commented on

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("document_comments")
}
```

## Usage

### 1. Database Migration

First, run the Prisma migration to create the new table:

```bash
npx prisma db push
# or
npx prisma migrate dev --name add-document-comments
```

### 2. Using in Project Editor

Here's how to integrate the database comments into your project editor:

```tsx
import { ProjectEditorWithDatabaseComments } from '@/components/editor/project-editor-with-database-comments';

function ProjectEditPage({ projectId }: { projectId: string }) {
  const currentUser = {
    id: 'user-id',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
  };

  const initialValue = [
    {
      type: 'p',
      children: [{ text: 'Your project content here...' }],
    },
  ];

  return (
    <ProjectEditorWithDatabaseComments
      projectId={projectId}
      initialValue={initialValue}
      currentUser={currentUser}
      onSave={value => {
        // Handle saving the editor content
        console.log('Editor content saved:', value);
      }}
    />
  );
}
```

### 3. Custom Integration

For custom integration, use the database plugin directly:

```tsx
import { Plate } from 'platejs/react';
import { EditorKit } from '@/components/editor/editor-kit';
import { CommentKit } from '@/components/editor/plugins/comment-kit';
import {
  DiscussionDatabaseKit,
  discussionDatabaseHelpers,
} from '@/components/editor/plugins/discussion-database-simple';

function MyEditor() {
  const [value, setValue] = useState(initialValue);

  const discussionConfig = {
    currentUserId: user.id,
    currentUser: {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatar,
    },
    documentType: 'project_summary' as const,
    documentId: projectId,
    discussions: [],
    users: {},
  };

  // Load discussions on mount
  useEffect(() => {
    discussionDatabaseHelpers.loadDiscussions(
      'project_summary',
      projectId,
      (key, value) => {
        // Update editor options
      }
    );
  }, [projectId]);

  return (
    <Plate
      value={value}
      onChange={setValue}
      plugins={[...EditorKit, ...CommentKit, ...DiscussionDatabaseKit]}
      options={{
        discussionDatabase: discussionConfig,
      }}
    >
      {/* Your editor components */}
    </Plate>
  );
}
```

## API Reference

### Server Actions

#### `createDocumentComment(input)`

Creates a new document comment.

```typescript
const result = await createDocumentComment({
  content: plateJsValue, // Plate.js Value
  discussionId: 'discussion-id',
  documentType: 'project_summary',
  documentId: 'project-id',
  parentId: 'parent-comment-id', // optional
  documentContent: 'The text that was commented on', // optional
});
```

#### `updateDocumentComment(input)`

Updates an existing comment.

```typescript
const result = await updateDocumentComment({
  id: 'comment-id',
  content: updatedPlateJsValue,
});
```

#### `deleteDocumentComment(input)`

Deletes a comment and all its replies.

```typescript
const result = await deleteDocumentComment({
  id: 'comment-id',
});
```

#### `resolveDocumentDiscussion(input)`

Marks all comments in a discussion as resolved.

```typescript
const result = await resolveDocumentDiscussion({
  discussionId: 'discussion-id',
  documentType: 'project_summary',
  documentId: 'project-id',
});
```

### Data Functions

#### `getDocumentComments(documentType, documentId)`

Fetches all comments for a document.

```typescript
const comments = await getDocumentComments('project_summary', 'project-id');
```

#### `getDocumentCommentsByDiscussion(discussionId)`

Fetches all comments in a specific discussion.

```typescript
const comments = await getDocumentCommentsByDiscussion('discussion-id');
```

#### `getDocumentCommentStats(documentType, documentId)`

Gets comment statistics for a document.

```typescript
const stats = await getDocumentCommentStats('project_summary', 'project-id');
// Returns: { totalComments: number, resolvedDiscussions: number, activeDiscussions: number }
```

### Helper Functions

#### `discussionDatabaseHelpers.loadDiscussions(documentType, documentId, setOption)`

Loads discussions from the database and updates the editor state.

#### `discussionDatabaseHelpers.createDiscussion(documentContent, commentContent, ...)`

Creates a new discussion with the first comment.

#### `discussionDatabaseHelpers.addReply(discussionId, commentContent, ...)`

Adds a reply to an existing discussion.

#### `discussionDatabaseHelpers.updateComment(commentId, commentContent, ...)`

Updates an existing comment.

#### `discussionDatabaseHelpers.deleteComment(commentId, ...)`

Deletes a comment.

#### `discussionDatabaseHelpers.resolveDiscussion(discussionId, ...)`

Resolves a discussion.

## Features

### ✅ Implemented

- ✅ Database schema for document comments
- ✅ Server actions for CRUD operations
- ✅ Data fetching functions
- ✅ Plate.js plugin integration
- ✅ UI components with database persistence
- ✅ Comment threading (replies)
- ✅ Discussion resolution
- ✅ User authentication and authorization
- ✅ Rich content support (Plate.js Value format)
- ✅ Real-time UI updates

### 🔄 Future Enhancements

- [ ] Real-time synchronization (WebSocket/Server-Sent Events)
- [ ] Comment notifications
- [ ] Comment mentions (@username)
- [ ] File attachments in comments
- [ ] Comment reactions (like, thumbs up, etc.)
- [ ] Comment moderation tools
- [ ] Comment search and filtering
- [ ] Comment analytics and reporting

## Security Considerations

1. **Authentication**: All server actions require user authentication
2. **Authorization**: Users can only edit/delete their own comments
3. **Input Validation**: All inputs are validated using Zod schemas
4. **SQL Injection Protection**: Using Prisma ORM prevents SQL injection
5. **Rate Limiting**: Consider implementing rate limiting for comment creation
6. **Content Moderation**: Consider adding content moderation for inappropriate comments

## Performance Considerations

1. **Pagination**: For documents with many comments, implement pagination
2. **Caching**: Consider caching frequently accessed comments
3. **Database Indexes**: Ensure proper indexes on frequently queried fields
4. **Lazy Loading**: Load discussions only when needed
5. **Optimistic Updates**: Update UI immediately, sync with database in background

## Troubleshooting

### Common Issues

1. **Comments not loading**: Check if the document exists and user has access
2. **Comments not saving**: Verify user authentication and input validation
3. **UI not updating**: Ensure proper state management and revalidation
4. **Type errors**: Make sure Plate.js Value types are properly imported

### Debug Mode

Enable debug logging by setting the log level in your environment:

```env
LOG_LEVEL=debug
```

This will provide detailed logs for comment operations.

## Migration from Existing System

If you have existing comments in a different format:

1. Create a migration script to convert existing comments to the new format
2. Update your UI components to use the new database plugin
3. Test thoroughly with existing data
4. Consider a gradual rollout with feature flags

## Example Migration Script

```typescript
// scripts/migrate-comments.ts
import { prisma } from '@/lib/db';

async function migrateExistingComments() {
  const existingComments = await prisma.projectComment.findMany();

  for (const comment of existingComments) {
    await prisma.documentComment.create({
      data: {
        content: [{ type: 'p', children: [{ text: comment.content }] }],
        discussionId: `migrated-${comment.id}`,
        documentType: 'project_summary',
        documentId: comment.projectId,
        authorId: comment.authorId,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      },
    });
  }
}
```

This integration provides a robust, scalable solution for storing and managing Plate.js comments in your database while maintaining the rich editing experience that Plate.js provides.
