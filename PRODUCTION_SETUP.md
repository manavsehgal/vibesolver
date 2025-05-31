# VibeSolver Production Setup

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env.local`
   - Add your Anthropic API key:
     ```
     ANTHROPIC_API_KEY=your_api_key_here
     ```

3. **Build and run production server:**
   ```bash
   pnpm start:prod
   ```

4. **Access the application:**
   - Main app: http://localhost:3000
   - Health check: http://localhost:3000/api/health
   - API proxy: http://localhost:3000/api/anthropic

## Features

✅ **CORS-Free API Calls** - Server proxies Anthropic API calls, eliminating browser CORS issues
✅ **Local-First Architecture** - Runs entirely on your laptop with SQLite database
✅ **Production Security** - Helmet, compression, and proper CORS configuration
✅ **Graceful Shutdown** - Handles SIGTERM and SIGINT for clean server stops
✅ **Health Monitoring** - Built-in health check endpoint for debugging
✅ **PWA Support** - Service worker and offline capabilities included

## Development vs Production

- **Development** (`pnpm dev`): Uses Vite dev server with direct API calls
- **Production** (`pnpm start:prod`): Uses Express server with API proxy

## Troubleshooting

If you encounter issues:

1. Check that port 3000 is available
2. Verify your API key is set in `.env.local`
3. Check the health endpoint: `curl http://localhost:3000/api/health`
4. Review server logs in the terminal

### Common Issues Fixed:

**✅ Mock AI Issue Resolved**: The app was using Mock AI instead of real Anthropic API because:
- The `useAI.ts` hook only checked for `VITE_ANTHROPIC_API_KEY` 
- In production mode (port 3000), we use the server proxy so `VITE_ANTHROPIC_API_KEY` isn't needed
- **Fix**: Updated the hook to use real AI service when running on port 3000, regardless of client-side API key

**✅ API Proxy 404 Issue Resolved**: 
- Updated proxy endpoint from `/api/anthropic` to `/api/v1/messages`
- Added proper request logging and debugging

### Debug Information:

When running on localhost:3000, you should see in the browser console:
```
🔍 AI Service Debug: { isProduction: true, hasApiKey: true, apiKeySource: 'proxy' }
🚀 Using real AI service { isProduction: true, hasApiKey: false }
```

## Architecture

The production setup includes:
- **Express.js v4** server for stability
- **API proxy** at `/api/anthropic` to handle CORS
- **Static file serving** from `dist/` directory
- **Client-side routing** support for React Router
- **Security middleware** (helmet, CORS, compression)