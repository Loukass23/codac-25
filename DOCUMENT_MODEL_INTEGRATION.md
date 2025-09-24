# Document Model Integration

This document explains the new generic `Document` model that replaces the project-specific `summary` field and provides a flexible system for storing Plate.js content across your application.

## Overview

The new `Document` model provides:

1. **Generic Content Storage** - Store any Plate.js content with rich metadata
2. **Flexible Relationships** - Can be linked to projects, community posts, lessons, etc.
3. **Version Control** - Built-in versioning support for document changes
4. **Comment Integration** - Seamless integration with the comment system
5. **Publishing Workflow** - Support for draft/published states

## Database Schema

### Document Model

```prisma
model Document {
  id          String @id @default(cuid())
  content     Json   // Plate.js Value content
  title       String?
  description String?

  // Document metadata
  version     Int    @default(1) // For versioning support
  isPublished Boolean @default(false)
  isArchived  Boolean @default(false)

  // Document type and context
  documentType String // 'project_summary', 'community_post', 'lesson_content', etc.

  // Relations
  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

  // Polymorphic relations - can be linked to various entities
  projectId String? // If this document belongs to a project

  // Relation to project (for summary documents)
  projectSummaryDocument Project? @relation("ProjectSummaryDocument")

  // Document comments
  documentComments DocumentComment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("documents")
}
```

### Updated Project Model

```prisma
model Project {
  // ... existing fields ...

  // Document relation for rich content (replaces summary field)
  summaryDocumentId String? @unique
  summaryDocument   Document? @relation("ProjectSummaryDocument", fields: [summaryDocumentId], references: [id], onDelete: SetNull)

  // ... other relations ...
}
```

### Updated DocumentComment Model

```prisma
model DocumentComment {
  id        String @id @default(cuid())
  content   Json   // Plate.js rich content (Value type)
  discussionId String @unique // Links comments in the same discussion

  // Document reference - now properly linked to Document model
  documentId String
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)

  // ... other fields ...
}
```

## Migration Strategy

### 1. Database Migration

Run the Prisma migration to create the new tables:

```bash
npx prisma db push
# or
npx prisma migrate dev --name add-document-model
```

### 2. Data Migration Script

Create a script to migrate existing project summaries to the new Document model:

```typescript
// scripts/migrate-project-summaries.ts
import { prisma } from '@/lib/db';

async function migrateProjectSummaries() {
  const projects = await prisma.project.findMany({
    where: {
      summary: {
        not: null,
      },
    },
  });

  for (const project of projects) {
    if (project.summary) {
      // Create a new document for the project summary
      const document = await prisma.document.create({
        data: {
          content: project.summary as any,
          title: `${project.title} - Summary`,
          documentType: 'project_summary',
          authorId: project.projectProfile.userId, // You'll need to get this
          projectId: project.id,
          isPublished: project.isPublic,
          version: 1,
        },
      });

      // Link the document to the project
      await prisma.project.update({
        where: { id: project.id },
        data: {
          summaryDocumentId: document.id,
        },
      });
    }
  }

  console.log(`Migrated ${projects.length} project summaries`);
}

migrateProjectSummaries()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

### 3. Update Code References

Replace direct `project.summary` references with `project.summaryDocument?.content`.

## Usage Examples

### Creating a Project Summary Document

```typescript
import { createDocument } from '@/actions/projects/create-document';

// Create a new project summary document
const result = await createDocument({
  content: plateJsValue, // Plate.js Value
  title: 'Project Summary',
  description: 'Detailed project description',
  documentType: 'project_summary',
  projectId: 'project-id',
  isPublished: true,
});

if (result.success) {
  console.log('Document created:', result.data.id);
}
```

### Fetching Project with Summary Document

```typescript
import { getProjectById } from '@/data/projects/get-project-by-id';

const project = await prisma.project.findUnique({
  where: { id: projectId },
  include: {
    summaryDocument: {
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        documentComments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    },
  },
});

// Access the content
const summaryContent = project.summaryDocument?.content;
```

### Using the Document Editor

```tsx
import { DocumentEditorWithComments } from '@/components/editor/document-editor-with-comments';

function ProjectEditPage({ projectId }: { projectId: string }) {
  const currentUser = {
    id: 'user-id',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
  };

  // In a real implementation, you would fetch the document ID
  const documentId = 'document-id';

  const initialValue = [
    {
      type: 'p',
      children: [{ text: 'Your project content here...' }],
    },
  ];

  return (
    <DocumentEditorWithComments
      documentId={documentId}
      initialValue={initialValue}
      currentUser={currentUser}
      onSave={value => {
        // Handle saving the document content
        console.log('Document saved:', value);
      }}
    />
  );
}
```

## API Reference

### Document Server Actions

#### `createDocument(input)`

Creates a new document.

```typescript
const result = await createDocument({
  content: plateJsValue, // Plate.js Value
  title: 'Document Title',
  description: 'Document description',
  documentType: 'project_summary',
  projectId: 'project-id', // optional
  isPublished: true,
});
```

#### `updateDocument(input)`

Updates an existing document.

```typescript
const result = await updateDocument({
  id: 'document-id',
  content: updatedPlateJsValue,
  title: 'Updated Title',
  isPublished: true,
});
```

#### `deleteDocument(input)`

Deletes a document and all related data.

```typescript
const result = await deleteDocument({
  id: 'document-id',
});
```

### Document Data Functions

#### `getDocumentById(documentId)`

Fetches a document by ID.

```typescript
const document = await getDocumentById('document-id');
```

#### `getDocumentsByProject(projectId)`

Fetches all documents for a project.

```typescript
const documents = await getDocumentsByProject('project-id');
```

#### `getDocumentsByType(documentType, limit?, offset?)`

Fetches published documents by type.

```typescript
const documents = await getDocumentsByType('project_summary', 10, 0);
```

#### `getProjectSummaryDocument(projectId)`

Fetches the summary document for a project.

```typescript
const summaryDoc = await getProjectSummaryDocument('project-id');
```

## Document Types

The `documentType` field supports various content types:

- `project_summary` - Project detailed descriptions
- `community_post` - Community forum posts
- `lesson_content` - Educational content
- `blog_post` - Blog articles
- `documentation` - Technical documentation
- `announcement` - System announcements

## Benefits of the Document Model

### 1. **Consistency**

- All Plate.js content uses the same storage format
- Consistent API across different content types
- Unified comment system

### 2. **Flexibility**

- Easy to add new content types
- Polymorphic relationships with various entities
- Extensible metadata fields

### 3. **Version Control**

- Built-in version tracking
- Easy to implement content history
- Rollback capabilities

### 4. **Publishing Workflow**

- Draft/published states
- Archive functionality
- Content lifecycle management

### 5. **Performance**

- Optimized queries with proper indexing
- Efficient comment loading
- Scalable architecture

## Security Considerations

1. **Access Control**: Documents inherit permissions from their parent entities
2. **Content Validation**: All Plate.js content is validated
3. **Audit Trail**: Version tracking provides content history
4. **Data Integrity**: Proper foreign key relationships

## Performance Considerations

1. **Indexing**: Ensure proper database indexes on frequently queried fields
2. **Caching**: Consider caching frequently accessed documents
3. **Pagination**: Implement pagination for document lists
4. **Lazy Loading**: Load document content only when needed

## Migration Checklist

- [ ] Update Prisma schema
- [ ] Run database migration
- [ ] Create data migration script
- [ ] Update server actions
- [ ] Update data fetching functions
- [ ] Update UI components
- [ ] Update TypeScript types
- [ ] Test all functionality
- [ ] Update documentation

This new Document model provides a robust, scalable foundation for storing and managing all Plate.js content in your application while maintaining backward compatibility and providing a clear migration path.
