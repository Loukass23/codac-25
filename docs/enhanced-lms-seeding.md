# Enhanced LMS Content Seeding

This document describes the enhanced LMS content seeding system that maintains folder structure and uses Plate MCP for improved markdown processing.

## Overview

The enhanced seeding system provides:

1. **Folder Structure Management**: Automatically creates document folders that mirror the markdown file structure
2. **Enhanced Markdown Processing**: Uses Plate MCP with rehype plugins for better markdown parsing
3. **Improved Navigation**: Maintains proper prev/next links within folder hierarchies
4. **Better Organization**: Groups content by modules/categories with proper metadata

## Architecture

### Components

#### 1. Enhanced Markdown Parser (`lib/plate/enhanced-markdown-parser.ts`)

- **Class**: `EnhancedMarkdownParser`
- **Features**:
  - GitHub Flavored Markdown support via `remark-gfm`
  - Math support via `remark-math`
  - HTML generation via `remark-rehype` and `rehype-stringify`
  - Plate.js value conversion
  - Folder structure awareness

#### 2. Folder Structure Manager (`lib/plate/folder-structure-manager.ts`)

- **Class**: `FolderStructureManager`
- **Features**:
  - Automatic folder creation based on markdown structure
  - Hierarchical folder organization
  - Color-coded folders by category
  - Icon assignment based on content type
  - Empty folder cleanup

#### 3. Enhanced Seeding Script (`scripts/seed-lms-content.ts`)

- **Main Function**: `seedLMSContent()`
- **Features**:
  - Processes markdown files with folder structure
  - Creates document folders automatically
  - Maintains navigation links within folders
  - Provides detailed logging and statistics

## Usage

### Running the Enhanced Seeding

```bash
# Run the enhanced seeding script
npx tsx scripts/seed-lms-content.ts

# Test the enhanced processing without database changes
npx tsx scripts/test-enhanced-seeding.ts
```

### Folder Structure

The system automatically creates folders based on your markdown file structure:

```
content/
├── welcome.md          → LMS Content/Welcome
├── guidelines.md       → LMS Content/Guidelines
├── career/
│   ├── job-search.md   → LMS Content/Career/Job Search
│   └── interviews.md   → LMS Content/Career/Interviews
├── data/
│   ├── python.md       → LMS Content/Data/Python
│   └── sql.md          → LMS Content/Data/SQL
└── web/
    ├── html.md         → LMS Content/Web/HTML
    └── css.md          → LMS Content/Web/CSS
```

### Folder Colors and Icons

The system automatically assigns colors and icons based on folder names:

| Folder     | Color            | Icon           | Description                      |
| ---------- | ---------------- | -------------- | -------------------------------- |
| Welcome    | Blue (#3B82F6)   | hand-wave      | Welcome and introduction content |
| Guidelines | Red (#EF4444)    | clipboard-list | Guidelines and best practices    |
| Career     | Green (#10B981)  | briefcase      | Career development resources     |
| Data       | Purple (#8B5CF6) | chart-bar      | Data science content             |
| Web        | Amber (#F59E0B)  | code           | Web development materials        |

## Markdown Processing Features

### Enhanced Parsing

The enhanced parser supports:

- **Frontmatter**: YAML-style metadata extraction
- **GitHub Flavored Markdown**: Tables, strikethrough, task lists, etc.
- **Math**: LaTeX math expressions
- **HTML**: Safe HTML rendering
- **Plate.js**: Structured content conversion

### Frontmatter Support

```yaml
---
title: 'Introduction to Data Science'
navTitle: 'Data Science Intro'
metaTitle: 'Data Science Course - Introduction'
metaDescription: 'Learn the fundamentals of data science'
access: 'public'
order: 1
folder: 'data'
icon: 'chart-bar'
color: '#8B5CF6'
---
```

### Supported Metadata Fields

- `title`: Document title
- `navTitle`: Navigation display title
- `metaTitle`: SEO meta title
- `metaDescription`: SEO meta description
- `access`: Access level (public, all, web, data, admin)
- `order`: Display order within folder
- `folder`: Override folder assignment
- `icon`: Custom folder icon
- `color`: Custom folder color

## Database Schema

### Document Folders

The system creates `DocumentFolder` records with:

- Hierarchical structure (parent/child relationships)
- Color and icon customization
- Sort order management
- Document count tracking

### Documents

Documents are linked to folders via `folderId` and include:

- Enhanced content (Plate.js + HTML)
- Folder-based organization
- Improved navigation links
- Rich metadata

## API Reference

### EnhancedMarkdownParser

```typescript
class EnhancedMarkdownParser {
  // Parse a markdown file
  async parseMarkdownFile(filePath: string): Promise<ParsedMarkdown>;

  // Parse markdown content string
  async parseMarkdownContent(
    content: string,
    filePath?: string
  ): Promise<ParsedMarkdown>;

  // Get all markdown files with folder structure
  getAllMarkdownFiles(): Array<{
    filePath: string;
    folderPath: string;
    folderName: string;
  }>;

  // Get LMS content structure organized by folders
  getLMSContentStructure(): Record<
    string,
    Array<{ filePath: string; folderPath: string; folderName: string }>
  >;
}
```

### FolderStructureManager

```typescript
class FolderStructureManager {
  // Create or get folder structure for LMS content
  async createLMSFolderStructure(
    authorId: string,
    folderStructure: Record<string, any[]>
  ): Promise<LMSFolderMapping>;

  // Get folder ID for a document based on its path
  getFolderIdForDocument(
    filePath: string,
    folderMapping: LMSFolderMapping
  ): string | null;

  // Clean up empty folders
  async cleanupEmptyFolders(authorId: string): Promise<void>;
}
```

## Migration from Legacy System

The enhanced system is backward compatible. To migrate:

1. **Backup**: Always backup your database before running enhanced seeding
2. **Run Enhanced Seeding**: The system will clear existing LMS documents and recreate them with folder structure
3. **Verify**: Check that all content is properly organized in folders
4. **Update UI**: Update your LMS UI to display folder structure

## Troubleshooting

### Common Issues

1. **Missing Dependencies**: Ensure all Plate MCP dependencies are installed
2. **Permission Errors**: Check database permissions for folder creation
3. **Memory Issues**: For large content sets, consider processing in smaller batches

### Debug Mode

Enable detailed logging by setting environment variables:

```bash
DEBUG=plate:* npx tsx scripts/seed-lms-content.ts
```

## Future Enhancements

Planned improvements include:

- **Real-time Sync**: Watch for markdown file changes and auto-update
- **Content Validation**: Validate markdown structure and metadata
- **Import/Export**: Bulk import/export of content with folder structure
- **Version Control**: Track changes to LMS content over time
- **Search Integration**: Enhanced search with folder context
