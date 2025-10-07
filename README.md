# codac - Code Academy Berlin community

[![Next.js](https://img.shields.io/badge/Next.js-15.3.3-000000?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.9.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

A comprehensive, production-ready learning management system built with Next.js 15, TypeScript, and modern web technologies. CODAC provides a complete educational platform with advanced content management, community features, and career services.

## ✨ Key Features

### 📚 **Learning Management System**

- **Course Management**: Create and organize multi-module courses with lessons and projects
- **Progress Tracking**: Monitor student progress through comprehensive analytics
- **Enrollment System**: Flexible enrollment management with role-based access
- **Quiz System**: Interactive quizzes with multiple difficulty levels and automated scoring

### 📝 **Advanced Content Editor**

- **Unified Editor**: Plate.js-powered rich text editor with auto-save functionality
- **Media Support**: Image, video, and file upload integration via Supabase Storage
- **Document Management**: Hierarchical folder structure for organizing content
- **Export Options**: Multiple format exports including Markdown and DOCX
- **AI-Powered Features**: AI integration for content generation and assistance

### 👥 **Community & Collaboration**

- **Student Cohorts**: Organize learners into cohorts with dedicated spaces
- **Real-time Chat**: Built-in messaging system for direct and group conversations
- **Project Comments**: Discussion features on student projects
- **User Profiles**: Comprehensive user profiles with avatar management
- **Attendance Tracking**: Monitor student attendance with interactive management

### 💼 **Career Services & Projects**

- **Job Board**: Integrated job posting and application system
- **Project Portfolios**: Showcase student projects with GitHub integration
- **Career Tracking**: Monitor job applications and career progress
- **GitHub Integration**: Connect GitHub accounts and import repositories
- **Project Comments & Likes**: Community engagement on projects

### 🔐 **Security & Authentication**

- **NextAuth.js Integration**: Secure authentication with multiple providers (Google, GitHub)
- **Role-Based Access**: Granular permissions for STUDENT, MENTOR, ADMIN, ALUMNI roles
- **Data Protection**: Comprehensive validation using Zod schemas
- **Session Management**: Secure session handling with proper token management

## 🛠️ Technology Stack

### **Core Framework**

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router and Server Components
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript with strict mode enabled
- **[React 19](https://react.dev/)** - Latest React with concurrent features

### **Database & Backend**

- **[PostgreSQL 13+](https://www.postgresql.org/)** - Robust relational database
- **[Prisma 6.9](https://www.prisma.io/)** - Type-safe database client and ORM
- **[NextAuth.js v5](https://authjs.dev/)** - Comprehensive authentication solution
- **Server Actions** - Modern data mutations without API routes

### **UI & Design System**

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Shadcn/UI](https://ui.shadcn.com/)** - High-quality component library
- **[Radix UI](https://www.radix-ui.com/)** - Low-level UI primitives
- **[Lucide Icons](https://lucide.dev/)** - Beautiful open-source icons

### **Content & Editor**

- **[Plate.js 49](https://platejs.org/)** - Rich text editor with plugins
- **[Supabase Storage](https://supabase.com/docs/guides/storage)** - File upload and management
- **Auto-save System** - Real-time content persistence
- **Media Support** - Images, videos, and documents

### **Development & Quality**

- **[Vitest](https://vitest.dev/)** - Fast unit testing framework
- **[React Testing Library](https://testing-library.com/react)** - Component testing utilities
- **[Playwright](https://playwright.dev/)** - End-to-end testing framework
- **[ESLint 9](https://eslint.org/)** - Code linting and formatting
- **[Zod](https://zod.dev/)** - Schema validation and type inference
- **[pnpm](https://pnpm.io/)** - Fast, efficient package manager

### **AI & Integrations**

- **[Vercel AI SDK](https://sdk.vercel.ai/)** - AI integration toolkit
- **OpenAI API** - AI-powered features and content generation
- **[Resend](https://resend.com/)** - Transactional email service

## 📋 Prerequisites

- Node.js 18+
- pnpm 8+ (package manager)
- Git
- PostgreSQL 13+ (database server)

## 🚀 Quick Start

### Automated Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd codac-25

# Run automated setup
pnpm setup
```

### Manual Setup

```bash
# Install dependencies
pnpm install

# Setup environment
cp env.template .env

# Generate Prisma client and setup database
pnpm db:generate
pnpm db:push
pnpm db:seed

# Start development server
pnpm dev
```

## 📝 Scripts

```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm dev:safe         # Setup + dev (recommended for first run)

# Building
pnpm build            # Create production build
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:seed          # Seed database with sample data
pnpm db:studio        # Open Prisma Studio
pnpm db:reset         # Reset database with fresh data

# Code Quality & Testing
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm ts:check         # TypeScript type checking
pnpm test:unit        # Run unit tests (Vitest)
pnpm test:unit:watch  # Run unit tests in watch mode
pnpm test:unit:ui     # Interactive unit test debugging
pnpm test             # Run Playwright E2E tests
pnpm test:ui          # Run E2E tests with interactive UI
pnpm test:headed      # Run E2E tests in headed browser mode

# Content Management
pnpm import:lms       # Import LMS content from markdown
pnpm export:docs      # Export documents to markdown
```

## 🏗️ Project Structure

```
codac-25/
├── app/                   # Next.js app router pages
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── home/          # Dashboard homepage
│   │   ├── attendance/    # Attendance management
│   │   ├── chat/          # Messaging system
│   │   ├── community/     # User profiles and community
│   │   ├── docs/          # Document management
│   │   ├── lms/           # Learning management system
│   │   ├── projects/      # Project portfolios
│   │   └── career/        # Job board and applications
│   ├── auth/              # Authentication pages
│   └── api/               # API routes
├── actions/               # Server actions (Create, Update, Delete)
│   ├── attendance/        # Attendance mutations
│   ├── auth/              # Authentication actions
│   ├── chat/              # Chat operations
│   ├── documents/         # Document mutations
│   ├── job/               # Job posting actions
│   ├── projects/          # Project mutations
│   └── user/              # User management
├── data/                  # Data access layer (Read operations)
│   ├── attendance/        # Attendance queries
│   ├── chat/              # Chat queries
│   ├── cohort/            # Cohort queries
│   ├── documents/         # Document queries
│   ├── projects/          # Project queries
│   └── user/              # User queries
├── components/            # React components
│   ├── ui/                # Base UI components (Shadcn/UI)
│   ├── editor/            # Plate.js editor components
│   ├── attendance/        # Attendance components
│   ├── auth/              # Authentication components
│   ├── chat/              # Chat and messaging
│   ├── community/         # Community features
│   ├── documents/         # Document management
│   ├── projects/          # Project portfolio components
│   ├── career/            # Job board components
│   └── lms/               # LMS components
├── lib/                   # Utility libraries
│   ├── auth/              # Auth utilities and helpers
│   ├── db/                # Database connection
│   ├── validation/        # Zod schemas
│   ├── plate/             # Plate.js configuration
│   └── utils/             # Shared utilities
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── tests/                 # Test suites
│   ├── integration/       # Integration tests
│   └── e2e/               # End-to-end tests
└── prisma/                # Database schema and migrations
    ├── schema.prisma      # Database schema
    └── seed/              # Seed data
```

### Authentication & Authorization

- Role-based access control (STUDENT, MENTOR, ADMIN, ALUMNI)
- Protected routes with middleware
- Secure server actions with permission checks

### Database Design

- PostgreSQL with Prisma ORM for development
- Comprehensive schema covering:
  - User management with cohorts and roles
  - Document system with folders and permissions
  - Project portfolios with GitHub integration
  - Job board and career tracking
  - Real-time chat and conversations
  - Attendance tracking system
- Efficient queries with proper indexing and relations

## 🧪 Testing & Quality Assurance

CODAC includes comprehensive testing infrastructure to ensure reliability and code quality.

### **Testing Stack**

- **[Vitest](https://vitest.dev/)**: Fast unit testing with TypeScript support
- **[React Testing Library](https://testing-library.com/react)**: Component testing utilities
- **[Playwright](https://playwright.dev/)**: End-to-end testing with cross-browser support
- **[ESLint](https://eslint.org/)**: Code linting with Next.js and TypeScript rules

### **Test Types**

- **Unit Tests**: Functions, components, and server actions (`*.test.ts/tsx`)
- **Integration Tests**: Multi-component workflows and forms
- **E2E Tests**: Complete user journeys and accessibility (`tests/e2e/`)

### **Running Tests**

```bash
# Unit Tests
pnpm test:unit        # Run all unit tests
pnpm test:unit:watch  # Watch mode for development

# E2E Tests
pnpm test             # Run Playwright E2E tests
pnpm test:ui          # Interactive E2E debugging

# Coverage & Reports
pnpm test:unit:coverage  # Unit test coverage
pnpm test:report         # E2E test reports
```

### **Development Workflow**

1. **Code Quality**: Always run `pnpm lint` and `pnpm ts:check` before committing
2. **Unit Testing**: Write tests for new components and functions (`pnpm test:unit:watch`)
3. **Database Updates**: Use `pnpm db:generate` after schema changes
4. **Testing**: Run relevant tests for your changes
5. **Build Verification**: Use `pnpm build` to ensure production compatibility

## 🔧 Environment Configuration

Create a `.env` file in the root directory with the following variables:

### **Database Configuration**

```env
# PostgreSQL Connection (Required)
DATABASE_URL=
```

### **Authentication Setup**

```env
# NextAuth Configuration (Required)
AUTH_SECRET="your-very-secure-secret-key-minimum-32-characters"
AUTH_URL="http://localhost:3000"

# Google OAuth (Required for full functionality)
AUTH_GOOGLE_ID="your-google-oauth-client-id"
AUTH_GOOGLE_SECRET="your-google-oauth-client-secret"

# GitHub OAuth (For repository integration)
AUTH_GITHUB_ID="your-github-oauth-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-client-secret"

# Email Provider (Required for magic links)
AUTH_RESEND_KEY="re_your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"
```

### **GitHub OAuth Setup**

To enable GitHub repository integration:

1. **Create GitHub OAuth App**:
   - Go to GitHub Settings → Developer settings → OAuth Apps
   - Click "New OAuth App"
   - Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
   - For production: `https://yourdomain.com/api/auth/callback/github`

2. **Configure Environment Variables**:

   ```env
   AUTH_GITHUB_ID="your-github-client-id"
   AUTH_GITHUB_SECRET="your-github-client-secret"
   ```

3. **Features Enabled**:
   - Connect GitHub account via OAuth
   - Import repositories as projects
   - Access private repositories (with user permission)
   - Automatic tech stack detection
   - Repository metadata extraction

## 🤝 Contributing

We welcome contributions to CODAC! Please follow these steps:

1. **Fork & Clone**: Fork the repository and clone your fork
2. **Branch**: Create a feature branch (`git checkout -b feature/amazing-feature`)
3. **Develop**: Make your changes following the project conventions
4. **Quality Checks**: Run `pnpm lint`, `pnpm ts:check`, and relevant tests
5. **Commit**: Use conventional commit messages
6. **Push**: Push to your branch (`git push origin feature/amazing-feature`)
7. **Pull Request**: Open a PR with a clear description of changes

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
