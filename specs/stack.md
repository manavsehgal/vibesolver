# Vibe Coding Friendly Stack

## Prompt Used To Generate the Stack Definition

Ultrathink to recommend a minimal technical stack for an app which meets the following criteria:

1. The stack is vibe coding friendly using Claude 4 which means the model knows the stack technologies really well and can generate and iterate high quality code with simply natural language instructions
2. The app can run local-first on a mac laptop and can connect to APIs for online services
3. The stack can use latest AI frameworks, libraries, SDKs with ease
4. The stack uses minimal lines of code to generate same functionality compared to alternative stacks
5. The stack uses stable and well documented frameworks, libraries, and packages
6. The stack is easy and fast to test, build, run, and debug

## Technology Stack

### Core Stack

**Runtime & Build:**

- **Node.js** (latest LTS) + **pnpm** - Excellent Claude support, vast ecosystem, fast package management
- **Vite** - Lightning-fast dev server, minimal config, excellent TypeScript support
- **TypeScript** (strict mode) - Type safety with minimal overhead, Claude generates high-quality TS code
- **Express.js** - Production server with API proxy capabilities for local-first deployment

**Frontend:**

- **React 18+** with hooks - Claude has deep React knowledge, minimal boilerplate with modern patterns
- **Tailwind CSS** - Utility-first, extremely concise styling, Claude excels at Tailwind generation

**Local Data:**

- **SQLite** with **better-sqlite3** - Perfect for local-first, zero-config, excellent performance
- **Drizzle ORM** - Type-safe, minimal SQL abstraction that Claude handles beautifully

### AI Integration Layer

**AI SDK:**

- **Vercel AI SDK** - Unified interface for multiple providers, streaming support, React hooks
- **Express API Proxy** - Local proxy server to solve CORS issues with Anthropic API calls

### State & Data Management

**Client State:**

- **Zustand** - Minimal Redux alternative, ~100 lines vs 1000+ with Redux
- **TanStack Query** - Server state management, caching, background updates

**Offline/Sync:**

- **Workbox** (for PWA) - Local-first capabilities

### Development Tools

**Testing:**

- **Vitest** - Fast Vite-native testing, Jest-compatible API
- **React Testing Library** - Component testing with minimal setup

**Code Quality:**

- **ESLint** + **Prettier** - Automated formatting and linting
- **TypeScript strict mode** - Compile-time error catching

### Why This Stack Excels:

1. **Claude-Friendly**: I have extensive knowledge of React/TS/Tailwind patterns and can generate production-quality code
2. **Local-First**: SQLite + Workbox/Tauri enables true offline functionality
3. **AI-Ready**: Vercel AI SDK provides seamless integration with all major AI providers
4. **Minimal Code**: Tailwind utilities, React hooks, and Zustand reduce boilerplate by 60-80%
5. **Battle-Tested**: Every component is mature with excellent documentation
6. **Developer Experience**: Vite's HMR, TypeScript intellisense, and Vitest's speed create a smooth development flow

### Starter Command:

```bash
pnpm create vite my-app --template react-ts
cd my-app
pnpm add ai @ai-sdk/openai @anthropic-ai/sdk zustand @tanstack/react-query better-sqlite3 drizzle-orm
pnpm add -D tailwindcss postcss autoprefixer vite-plugin-pwa workbox-window npx tailwindcss init -p
```

This stack lets you build complex AI-powered applications with surprisingly few lines of code while maintaining excellent type safety and developer experience. Claude can iterate on this stack extremely effectively due to its deep familiarity with these technologies.

### Key Additions for Your Requirements

Vercel AI SDK:

ai - Core Vercel AI SDK with React hooks (useChat, useCompletion)
@ai-sdk/openai & @anthropic-ai/sdk - Provider integrations

PWA with Workbox:

vite-plugin-pwa - Seamless Vite integration for PWA generation
workbox-window - Client-side Workbox utilities for service worker management

Quick Setup After Install:

1. Configure PWA in vite.config.ts:
   typescriptimport { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
plugins: [
react(),
VitePWA({
registerType: 'autoUpdate',
workbox: {
globPatterns: ['**/*.{js,css,html,ico,png,svg}']
}
})
],
}) 2. Add manifest in index.html:
html<link rel="manifest" href="/manifest.json">
This setup gives you:

✅ Local-first PWA with offline caching via Workbox
✅ AI-ready with Vercel AI SDK's React hooks
✅ Minimal config - Vite handles the build complexity
✅ Claude-optimized - I can generate excellent code for this entire stack

The PWA will automatically cache your app for offline use, while the Vercel AI SDK provides clean React hooks for streaming AI responses - perfect for local-first AI applications!
