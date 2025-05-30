# VibeSolver

<div align="center">

**🤖 AI Twin of an AWS Solutions Architect**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

*Transform your business requirements into production-ready AWS architectures using natural language*

[Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [Contributing](#contributing)

</div>

---

## ✨ Features

VibeSolver leverages AWS cloud expertise to help reimagine what's possible for your business by generating AWS solutions that drive growth and follow the AWS Well-Architected Framework.

### 🎯 Core Capabilities

- **🗣️ Natural Language Processing** - Describe your business technology requirements in plain English
- **🏗️ Architecture Generation** - Get complete AWS solutions following Well-Architected principles
- **📊 Visual Diagrams** - Interactive deployment architecture and runtime workflow visualizations  
- **💡 Interactive Learning** - Generate flashcards to educate yourself on solutions and AWS services
- **🔍 What-If Analysis** - Analyze solutions based on latency, scalability, cost, availability, and security
- **⚡ Real-time Modifications** - Query, change, and deploy solutions using natural language

### 🛠️ Technical Highlights

- **AI-Powered**: Anthropic Claude integration with structured output validation
- **Type-Safe**: Full TypeScript implementation with strict mode
- **Local-First**: SQLite database with offline capabilities
- **Modern Stack**: React 18, Vite, Tailwind CSS, Drizzle ORM
- **State Management**: Zustand + TanStack Query for optimal performance
- **PWA Ready**: Offline-first with Workbox caching strategies

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **pnpm** (recommended) or npm
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/vibesolver.git
cd vibesolver

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local

# Initialize database
pnpm db:push

# Start development server
pnpm dev
```

Visit `http://localhost:5173` to see VibeSolver in action! 🎉

## 📋 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint with TypeScript
pnpm format           # Format code with Prettier
pnpm test             # Run Vitest tests
pnpm test:ui          # Run tests with Vitest UI

# Database
pnpm db:generate      # Generate Drizzle migrations
pnpm db:push          # Apply schema changes to SQLite
pnpm db:studio        # Open Drizzle Studio for database inspection
```

## 🏗️ Architecture

VibeSolver is built with a modern, scalable architecture optimized for AI-powered development.

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | Type-safe, component-based UI |
| **Styling** | Tailwind CSS | Utility-first, responsive design |
| **Build Tool** | Vite | Lightning-fast development & builds |
| **State** | Zustand + TanStack Query | Client & server state management |
| **Database** | SQLite + Drizzle ORM | Local-first data persistence |
| **AI** | Anthropic Claude + Vercel AI SDK | Natural language processing |
| **Testing** | Vitest + React Testing Library | Unit & integration testing |

### Project Structure

```
src/
├── components/         # React components
├── hooks/             # Custom React hooks
│   └── useAI.ts       # AI integration hooks
├── lib/               # Core utilities
│   ├── ai.ts          # AI service layer
│   └── react-query.tsx # Query configuration
├── stores/            # Zustand state stores
│   └── solutions.ts   # Solutions state management
├── db/                # Database layer
│   ├── index.ts       # Database connection
│   └── schema.ts      # Data models & migrations
└── types/             # TypeScript definitions
    └── index.ts       # Shared type exports
```

### AI Integration

VibeSolver uses a sophisticated AI service layer with:

- **Structured Output**: Zod schema validation for type-safe AI responses
- **Multiple AI Functions**: Solution generation, flashcard creation, what-if analysis
- **Error Handling**: Robust error management and retry logic
- **Type Safety**: Full TypeScript integration with Anthropic SDK

```typescript
// Example: Generate AWS Solution
const solution = await generateAWSSolution(
  "I need a scalable web application that can handle 10,000 concurrent users"
);
```

## 🎯 Use Cases

### For Developers
- **Rapid Prototyping** - Quickly explore AWS architectures for new projects
- **Learning AWS** - Understand service relationships through visual diagrams
- **Cost Estimation** - Get ballpark figures before deep-dive planning

### For Solutions Architects  
- **Client Presentations** - Generate visual architectures for stakeholder meetings
- **What-If Scenarios** - Compare different architectural approaches
- **Documentation** - Create educational materials and flashcards

### For Business Stakeholders
- **Technology Translation** - Convert business requirements to technical solutions
- **Investment Planning** - Understand infrastructure costs and trade-offs
- **Risk Assessment** - Analyze security and availability implications

## 🛣️ Roadmap

### Phase 1: Foundation ✅
- [x] Project scaffold and infrastructure
- [x] AI service integration
- [x] Database schema and ORM setup
- [x] State management architecture

### Phase 2: Core Features 🚧
- [ ] Solution generation UI
- [ ] Architecture visualization
- [ ] Solution management dashboard
- [ ] Export and sharing capabilities

### Phase 3: Learning Features 📋
- [ ] Interactive flashcard system
- [ ] Study progress tracking
- [ ] Spaced repetition algorithm
- [ ] Custom learning paths

### Phase 4: Advanced Features ⚡
- [ ] What-if analysis interface
- [ ] Real-time collaboration
- [ ] Solution deployment automation
- [ ] Cost optimization recommendations

## 🧪 Development

VibeSolver follows modern development practices with a focus on code quality and developer experience.

### Development Workflow

1. **Planning** - All features are documented in `/specs` and `/sprints` 
2. **Implementation** - TDD approach with comprehensive testing
3. **Quality Assurance** - ESLint, Prettier, and TypeScript strict mode
4. **Documentation** - Code patterns documented in `CLAUDE.md`

### Testing Strategy

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test --coverage
```

### Code Quality

- **TypeScript Strict Mode** - Full type safety
- **ESLint + Prettier** - Consistent code formatting
- **Vitest** - Fast, modern testing framework
- **React Testing Library** - Component testing best practices

## 🤝 Contributing

We welcome contributions! VibeSolver is designed to be contributor-friendly with clear architecture and comprehensive documentation.

### Getting Started

1. **Fork the repository**
2. **Create a feature branch** - `git checkout -b feature/amazing-feature`
3. **Make your changes** - Follow our coding standards
4. **Add tests** - Ensure your changes are well-tested
5. **Submit a pull request** - Describe your changes clearly

### Development Guidelines

- Follow the coding patterns in `CLAUDE.md`
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages

### Areas for Contribution

- 🎨 **UI/UX Design** - Component library and user interface
- 🧠 **AI Features** - Enhanced prompt engineering and AI workflows  
- 📊 **Visualizations** - Architecture diagrams and interactive charts
- 🧪 **Testing** - Expand test coverage and testing utilities
- 📚 **Documentation** - Tutorials, guides, and API documentation

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Anthropic** - For the powerful Claude AI that makes natural language AWS solutions possible
- **AWS** - For the Well-Architected Framework that guides our solution generation
- **Vercel** - For the excellent AI SDK that simplifies AI integration
- **Open Source Community** - For the amazing tools and libraries that power VibeSolver

---

<div align="center">

**Built with ❤️ using AI-assisted development and vibe coding principles**

[⭐ Star this repo](https://github.com/yourusername/vibesolver) • [🐛 Report Bug](https://github.com/yourusername/vibesolver/issues) • [💡 Request Feature](https://github.com/yourusername/vibesolver/issues)

</div>