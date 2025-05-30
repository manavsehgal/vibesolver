# VibeSolver - Claude Code Guidelines

## Project Overview

VibeSolver is an AI twin of an AWS Solutions Architect built with React 18, TypeScript, Tailwind CSS, and the Vercel AI SDK. It helps users generate AWS solutions using natural language, visualize architectures, and learn through interactive flashcards.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Build Tool**: Vite
- **State Management**: Zustand + TanStack Query
- **Database**: SQLite + Drizzle ORM
- **AI Integration**: Vercel AI SDK + Anthropic Claude
- **Testing**: Vitest + React Testing Library
- **PWA**: Vite PWA Plugin + Workbox

## Code Generation Guidelines

### File Structure

```
src/
├── components/        # React components
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries and configurations
├── stores/           # Zustand stores
├── db/               # Database schema and connection
├── types/            # TypeScript type definitions
└── test/             # Test utilities and setup
```

### Import Patterns

Always use path aliases:

```typescript
import { Component } from '@/components/Component';
import { useStore } from '@/stores/store';
import { db } from '@/db';
```

### State Management

- Use **Zustand** for client state
- Use **TanStack Query** for server state and caching
- Keep stores focused and domain-specific

### Database Operations

- Use Drizzle ORM for all database operations
- Define schemas in `src/db/schema.ts`
- Use Zod schemas for validation

### AI Integration

- All AI functions are in `src/lib/ai.ts`
- Use structured output with Zod schemas
- Implement proper error handling for API calls

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript types
- Follow Tailwind CSS patterns for styling
- Keep components focused and reusable

### Testing

- Test components using React Testing Library
- Mock external dependencies in test setup
- Use custom render function from `src/test/utils.tsx`

## Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI

# Database
pnpm db:generate      # Generate migrations
pnpm db:push          # Apply schema to database
pnpm db:studio        # Open Drizzle Studio
```

## Environment Setup

Create `.env.local`:

```
ANTHROPIC_API_KEY=your_api_key_here
DATABASE_URL=./src/db/sqlite.db
```

## PWA Features

The app is configured as a Progressive Web App with:

- Offline caching via Workbox
- App manifest for installation
- Service worker for background updates

## Best Practices

1. **Type Safety**: Use TypeScript strict mode, define proper types
2. **Error Handling**: Implement comprehensive error boundaries and API error handling
3. **Performance**: Use React Query for caching, implement proper loading states
4. **Accessibility**: Follow accessibility best practices in components
5. **Testing**: Write tests for critical user flows and business logic
6. **Code Quality**: All code must pass ESLint and Prettier checks

## AI Service Integration

The app integrates with Anthropic's Claude API for:

- AWS solution generation
- Flashcard creation
- What-if analysis
- Solution modifications
- Architecture explanations

All AI interactions use structured output with Zod validation for type safety.

## Development Workflow

1. Create feature branches from main
2. Write tests before implementation (TDD)
3. Implement features following established patterns
4. Run linting and tests before committing
5. Use semantic commit messages
6. Update documentation as needed

This project is optimized for Claude Code generation with clear patterns, strong typing, and comprehensive tooling.
