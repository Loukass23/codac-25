# Database Scripts Organization

This directory contains all database-related scripts organized by environment and purpose.

## Directory Structure

```
database/
├── chat/
│   ├── local/           # Scripts for local development
│   │   ├── queries.sql  # Development queries and data inspection
│   │   └── seed-data.sql # Sample data for testing
│   └── supabase/        # Scripts for Supabase SQL Editor
│       ├── setup-chat-system.sql  # Initial chat system setup
│       ├── rls-setup.sql          # Row Level Security configuration
│       ├── testing.sql            # Testing and validation queries
│       └── diagnostics.sql        # Troubleshooting and diagnostics
```

## Usage Guide

### Local Development (`local/`)

**seed-data.sql**

- Creates sample users, conversations, and messages
- Safe to run multiple times (uses `ON CONFLICT DO NOTHING`)
- Run via Prisma Studio or your local PostgreSQL client

**queries.sql**

- Useful development queries for inspecting data
- Includes conversation overviews, message lists, user participation stats
- Run against your local database for debugging

### Supabase Production (`supabase/`)

**setup-chat-system.sql** (Run First)

- Disables RLS initially for setup
- Grants necessary permissions to `anon` role
- Enables realtime subscriptions
- Includes verification queries

**rls-setup.sql** (Run Second)

- Enables Row Level Security (RLS)
- Creates security policies for chat tables
- Sets up user permissions for secure access

**testing.sql**

- Validates table structures and permissions
- Tests realtime configuration
- Checks data integrity and relationships

**diagnostics.sql**

- Comprehensive troubleshooting queries
- Performance monitoring
- Schema drift detection
- Permission debugging

## Execution Order

For new Supabase projects:

1. `setup-chat-system.sql` - Basic system setup
2. `rls-setup.sql` - Security configuration
3. `testing.sql` - Validate everything works

For local development:

1. Ensure Prisma migrations are applied
2. `seed-data.sql` - Add test data
3. `queries.sql` - Inspect and debug

## Notes

- All scripts are idempotent where possible
- Supabase scripts should be run in the Supabase SQL Editor
- Local scripts can be run via Prisma Studio or direct PostgreSQL connection
- Always test scripts in development before running in production
