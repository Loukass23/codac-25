# 🔒 Seed All Behavior - Production Safety

## Change Summary

**Updated**: `seedAll()` function to use **development data only**, protecting production data from accidental overwriting.

## 🎯 Rationale

Production data should be seeded **explicitly** and **intentionally**. The "seed all" command is typically used for:

- Setting up development environments
- Running automated tests
- Quick database resets during development

It should NOT accidentally seed or overwrite production data.

## ✅ New Behavior

### `pnpm tsx prisma/seed/seed.ts all`

**Seeds**:

- ✅ Attack on Titan themed users and cohorts (dev data)
- ✅ Chat conversations and messages
- ✅ Job postings
- ✅ Demo projects
- ✅ Demo documents

**Does NOT seed**:

- ❌ Production cohorts (Yellow Leopards, Grey Mambas, etc.)
- ❌ Production users (real CODAC users)

### `pnpm tsx prisma/seed/seed.ts clean`

**Cleans**:

- ✅ Attack on Titan data
- ✅ Chat data
- ✅ Job postings
- ✅ Demo projects
- ✅ Demo documents

**Does NOT clean**:

- ❌ Production data (must be cleaned explicitly via menu option)

## 📊 How to Seed Production Data

### Method 1: Interactive Menu

```bash
pnpm tsx prisma/seed/seed.ts
# Then select option 1: "Production Data"
```

### Method 2: Direct Command

```bash
pnpm tsx prisma/seed/seed.ts 1
```

### Method 3: Combined Seeding

```bash
# Seed production data + jobs + projects
pnpm tsx prisma/seed/seed.ts 1,3,4
```

## 🔐 Default Credentials

After seeding:

**Development Data** (seed all):

- Email: `admin@codac.academy`
- Password: `password123`

**Production Data** (option 1):

- Email: `lucas@codeacademyberlin.com`
- Password: `password123`

## ⚠️ Important Notes

1. **Explicit is Better**: Production data requires explicit selection (option 1)
2. **Safe Defaults**: "Seed all" and "clean all" use development data
3. **No Accidents**: Prevents accidental production data seeding
4. **Clear Output**: Seeding output clearly indicates which data was seeded

## 📝 Updated Files

- ✅ `prisma/seed/seed.ts` - Updated `seedAll()` and `cleanAll()` functions
- ✅ `prisma/seed/README.md` - Updated documentation with warnings
- ✅ `SEEDING_CHANGES_SUMMARY.md` - Updated examples and notes

## 🎉 Result

The seeding system now has **production safety built-in**:

- Development work uses safe, themed demo data
- Production data requires explicit, intentional action
- Clear documentation prevents confusion
- Helpful tips guide users to correct commands

This follows the principle: **Make the safe thing easy, and the dangerous thing explicit!** 🛡️
