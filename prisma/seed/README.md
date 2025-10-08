# CODAC Seeding System

This directory contains all the data and scripts needed to seed the CODAC database with test data or production data.

## 📁 Directory Structure

```
prisma/seed/
├── seed.ts                 # Main seeding script with interactive menu
├── seeders/                # Individual seeder modules
│   ├── production.ts      # Production data (real cohorts & users)
│   ├── attack-on-titan.ts # Development data (themed demo users)
│   ├── chat.ts           # Chat conversations & messages
│   ├── documents.ts      # Demo documents with rich content
│   ├── jobs.ts          # Job postings
│   └── projects.ts      # Demo project showcases
├── dev/                  # Development/Demo seed data
│   ├── attack-on-titan-cohorts.json
│   ├── attack-on-titan-users.json
│   ├── chat-data.json
│   ├── demo-documents.json
│   ├── demo-projects.json
│   ├── jobs.json
│   └── images/          # Development images
└── prod/                # Production seed data
    ├── cohorts.json     # Real CODAC cohorts (Yellow Leopards, Grey Mambas, etc.)
    ├── users.json       # Real CODAC users
    └── images/          # Production images
        ├── cohorts/     # Cohort images
        └── users/       # User avatars
```

## 🚀 Quick Start

### Interactive Mode

Run the seeder in interactive mode to choose what to seed:

```bash
pnpm tsx prisma/seed/seed.ts
```

This will display a menu with options:

1. Production Data - Real cohorts and users from CODAC history
2. Attack on Titan Theme (Dev) - Demo users and cohorts
3. Job Postings - Sample job board data
4. Demo Projects - Project showcase examples
5. Demo Documents - Rich text documents with comments
6. Chat Data - Conversation and message history

### Command Line Mode

Seed all **development** data at once:

```bash
pnpm tsx prisma/seed/seed.ts all   # Seeds Attack on Titan + all features (NOT production)
```

Seed specific options:

```bash
pnpm tsx prisma/seed/seed.ts 1      # Production data only
pnpm tsx prisma/seed/seed.ts 2      # Attack on Titan (dev) only
pnpm tsx prisma/seed/seed.ts 1,3,4  # Production + Jobs + Projects
```

Clean all **development** data:

```bash
pnpm tsx prisma/seed/seed.ts clean  # Cleans dev data (keeps production safe)
```

> **⚠️ Important**: The `all` command seeds **development data only** (Attack on Titan theme). Production data must be seeded explicitly using option 1.

## 📊 Data Types

### Production Data (`prisma/seed/prod/`)

Real data from CODAC's history for production-like testing:

- **35+ cohorts** from Yellow Leopards (2020) to Magenta Capybaras (2026)
- **Real users** with actual cohort assignments
- **Start and end dates** for each cohort
- **User images** from Google Cloud Storage or local files
- **Cohort images** with actual branding

**Key Features:**

- All cohorts include `startDate` and `endDate`
- Users are properly assigned to cohorts via `cohortLegacyId`
- Preserves historical data structure
- Default password: `password123` for all users

### Development Data (`prisma/seed/dev/`)

Themed demo data for development and testing:

- **Attack on Titan themed** users and cohorts
- **Demo documents** with rich Plate.js content
- **Sample projects** with various tech stacks
- **Chat conversations** with realistic message flows
- **Job postings** from various companies

## 🔧 Creating a New Seeder

1. Create a new file in `prisma/seed/seeders/`:

```typescript
// prisma/seed/seeders/my-feature.ts
import { PrismaClient } from '@prisma/client';
import { logger } from '../../../lib/logger';

const prisma = new PrismaClient();

export async function seedMyFeature() {
  try {
    logger.info('🌱 Starting my feature seed...');

    // Your seeding logic here
    await prisma.myModel.createMany({
      data: [
        /* ... */
      ],
    });

    logger.info('✅ My feature seed completed!');
  } catch (error) {
    logger.error('❌ My feature seed failed:', error);
    throw error;
  }
}

export async function cleanMyFeature() {
  try {
    logger.info('🧹 Cleaning my feature data...');
    await prisma.myModel.deleteMany();
    logger.info('✅ My feature data cleaned!');
  } catch (error) {
    logger.error('❌ Failed to clean my feature data:', error);
    throw error;
  }
}
```

2. Add it to `seed.ts`:

```typescript
import { seedMyFeature, cleanMyFeature } from './seeders/my-feature';

const seedOptions: SeedOption[] = [
  // ... existing options
  {
    id: 'my-feature',
    name: 'My Feature',
    description: 'Seeds data for my feature',
    action: seedMyFeature,
    cleanAction: cleanMyFeature,
  },
];
```

## 🖼️ Working with Images

The seeding system supports base64 encoding of images for easy storage and deployment.

### Encoding Images

Use the `encodeSeedImageToBase64` helper:

```typescript
import { encodeSeedImageToBase64 } from '../../../lib/imaging/encode-image-to-base64';

// For dev data (default basePath is 'prisma/seed/dev/')
const devImage = await encodeSeedImageToBase64('images/user-avatar.jpg');

// For production data
const prodImage = await encodeSeedImageToBase64(
  'images/cohorts/black-owls.jpg',
  'prisma/seed/prod/'
);
```

### Supported Formats

- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

## 🗄️ Database Schema

The seeders work with the following main models:

- `User` - Student, Alumni, Mentor, or Admin users
- `Cohort` - Training cohorts with start/end dates
- `Project` - Student project showcases
- `Document` - Rich text documents (Plate.js)
- `Job` - Job board postings
- `Conversation` & `ChatMessage` - Chat system
- `Attendance` - Student attendance tracking

## ⚠️ Important Notes

1. **Production vs Development**:
   - **"Seed all"** uses DEV data (Attack on Titan theme) - safe for development
   - **Production data** must be seeded explicitly (option 1) - use with caution
   - This prevents accidentally overwriting production data

2. **Order Matters**: Seed in the correct order to respect foreign key relationships:
   - Users/Cohorts first (Production OR Attack on Titan)
   - Then content (Projects, Documents, Jobs)
   - Finally, Chat data

3. **Clean Before Seeding**: The seeders automatically clean their own data before inserting new data.

4. **Default Credentials**:
   - Production: `lucas@codeacademyberlin.com` / `password123`
   - Development: `admin@codac.academy` / `password123`

5. **Image Paths**:
   - Dev images: `prisma/seed/dev/images/`
   - Prod images: `prisma/seed/prod/images/cohorts/` and `images/users/`

6. **Missing Properties**: The `endDate` property is now included in all cohort seeds.

## 🔍 Troubleshooting

### "Image file not found"

- Check that images exist in the correct directory
- Verify the path in your JSON data matches the file location
- The seeder will log warnings but continue if images are missing

### "No users found in database"

- Some seeders (like chat) require users to exist first
- Run production or attack-on-titan seeder before chat/documents/projects

### "Foreign key constraint failed"

- Ensure you're seeding in the correct order
- Clean all data and try again with the "seed all" option

### Linting Errors

- Run `pnpm lint` to check for TypeScript issues
- Common issue: Missing `endDate` in cohort creation (now fixed)

## 📝 Schema Changes

If you modify the Prisma schema:

1. Run `pnpm prisma generate` to update the client
2. Update relevant seeders to include new fields
3. Test with `pnpm tsx prisma/seed/seed.ts clean` then seed again

## 🎯 Best Practices

1. **Keep JSON files clean** - Use consistent formatting and valid JSON
2. **Include all required fields** - Check schema for required vs optional fields
3. **Use meaningful data** - Make demo data realistic and useful for testing
4. **Document your changes** - Update this README when adding new seeders
5. **Test thoroughly** - Test both seeding and cleaning operations
6. **Handle errors gracefully** - Log useful error messages

## 📚 Related Files

- `lib/imaging/encode-image-to-base64.ts` - Image encoding utilities
- `lib/logger.ts` - Logging configuration
- `prisma/schema.prisma` - Database schema
- `.cursorrules` - Coding standards and patterns

## 🔗 Useful Commands

```bash
# Generate Prisma client after schema changes
pnpm prisma generate

# Reset database and run migrations
pnpm prisma migrate reset

# View database in Prisma Studio
pnpm prisma studio

# Run seeder in interactive mode
pnpm tsx prisma/seed/seed.ts

# Seed production data only
pnpm tsx prisma/seed/seed.ts 1

# Clean and reseed everything
pnpm tsx prisma/seed/seed.ts clean && pnpm tsx prisma/seed/seed.ts all
```
