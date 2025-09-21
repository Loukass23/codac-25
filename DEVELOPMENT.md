# Development Guidelines

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run all checks
pnpm check-all
```

## 📋 Pre-commit Checklist

Before committing, ensure:

1. **TypeScript**: `pnpm type-check` passes
2. **Linting**: `pnpm lint` passes
3. **Formatting**: `pnpm format:check` passes
4. **Tests**: `pnpm test` passes

## 🔧 Code Quality Standards

### TypeScript

- **No `any` types**: Use proper TypeScript types
- **Strict mode**: All strict TypeScript options enabled
- **Unused variables**: Must be prefixed with `_` or removed

### React Components

- **Display names**: All components must have display names
- **Props typing**: Use proper TypeScript interfaces
- **Hook dependencies**: Include all dependencies in useEffect

### Imports

- **Order**: Built-in → External → Internal → Relative
- **Grouping**: Separate groups with blank lines
- **Alphabetical**: Within each group, sort alphabetically

### Code Style

- **Prettier**: Automatic formatting on save
- **ESLint**: Automatic fixing where possible
- **Console**: Only `console.warn` and `console.error` allowed

## 🛠️ Available Scripts

```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format with Prettier
pnpm format:check     # Check formatting
pnpm type-check       # TypeScript type checking
pnpm check-all        # Run all checks

# Testing
pnpm test             # Run all tests
pnpm test:unit        # Unit tests only
pnpm test:e2e         # E2E tests only

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema changes
pnpm db:seed          # Seed database
```

## 🔄 Pre-commit Hooks

The project uses Husky and lint-staged to automatically:

1. **Format code** with Prettier
2. **Fix ESLint issues** where possible
3. **Type check** TypeScript files
4. **Run tests** for changed files

## 🎯 Common Issues & Solutions

### Import Order Issues

```bash
# Auto-fix import order
pnpm lint:fix
```

### TypeScript Errors

```bash
# Check types
pnpm type-check

# Common fixes:
# - Add proper types instead of 'any'
# - Prefix unused variables with '_'
# - Add missing return statements
```

### React Component Issues

```bash
# Add display names to components
const MyComponent = () => { ... };
MyComponent.displayName = 'MyComponent';
```

### Console Statements

```bash
# Replace console.log with:
console.warn('message');  // For warnings
console.error('message'); // For errors
```

## 📁 Project Structure

```
├── app/                 # Next.js app router
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature components
├── lib/                # Utility libraries
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── prisma/             # Database schema and migrations
└── tests/              # Test files
```

## 🔍 IDE Setup

### VSCode Extensions

Install recommended extensions from `.vscode/extensions.json`:

- Prettier (code formatting)
- ESLint (linting)
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prisma

### Settings

VSCode settings are configured in `.vscode/settings.json` for:

- Format on save
- Auto-fix ESLint issues
- Import organization
- TypeScript preferences

## 🚨 Troubleshooting

### Build Failures

1. Run `pnpm check-all` to identify issues
2. Fix TypeScript errors first
3. Fix ESLint errors second
4. Ensure all tests pass

### Pre-commit Hook Failures

1. Check the error message in terminal
2. Run `pnpm lint:fix` to auto-fix issues
3. Manually fix remaining issues
4. Try committing again

### Import Issues

1. Check import order with `pnpm lint`
2. Use `pnpm lint:fix` to auto-organize
3. Ensure all imports are used (no unused imports)

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Tailwind CSS](https://tailwindcss.com/docs)
