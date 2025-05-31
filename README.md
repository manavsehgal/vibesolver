# VibeSolver

<div align="center">

![VibeSolver Logo](https://img.shields.io/badge/VibeSolver-AI%20AWS%20Architect-blue?style=for-the-badge&logo=amazonwebservices&logoColor=white)

**🤖 AI Twin of an AWS Solutions Architect**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![SQLite](https://img.shields.io/badge/SQLite-07405E?style=flat&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Quality Score](https://img.shields.io/badge/Quality_Score-95%2F100-brightgreen)](./reports/)

*Transform your business requirements into production-ready AWS architectures using natural language*

[Features](#-features) • [Quick Start](#-quick-start) • [Demo](#-demo) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🚀 What is VibeSolver?

VibeSolver is an AI-powered AWS Solutions Architect that helps you **reimagine what's possible** for your business by generating production-ready AWS architectures from natural language descriptions. Built using cutting-edge AI and modern web technologies, VibeSolver bridges the gap between business requirements and technical implementation.

### 🎯 Why VibeSolver?

- **🗣️ Natural Language First** - Describe your needs in plain English, get AWS solutions
- **🏗️ Well-Architected Framework** - All solutions follow AWS best practices
- **📊 Visual Architecture** - Interactive diagrams with drag-and-drop editing
- **💡 Learn While You Build** - Generate flashcards to understand your architecture
- **🔍 What-If Analysis** - Compare solutions across cost, performance, and security
- **⚡ Real-time Modifications** - Update solutions using conversational AI

## ✨ Features

### 🎯 Core Capabilities

| Feature | Description | Status |
|---------|-------------|--------|
| **Natural Language Processing** | Convert business requirements to AWS solutions | ✅ AI Services Ready |
| **Architecture Visualization** | Interactive diagrams with infinite canvas and drag-and-drop | ✅ Implemented |
| **Solution Management** | Save, organize, and version your architectures | ✅ Database Ready |
| **Educational Flashcards** | Learn AWS services through generated study materials | 🔧 Backend Ready |
| **What-If Analysis** | Compare architectural alternatives | 🔧 Backend Ready |
| **Solution Modifications** | Update architectures using natural language | 🔧 Backend Ready |

### 🛠️ Technical Highlights

- **🤖 AI-Powered**: Anthropic Claude integration with structured output validation
- **🔒 Type-Safe**: Full TypeScript implementation with strict mode (95/100 quality score)
- **📱 Local-First**: SQLite database with offline PWA capabilities
- **⚡ Modern Stack**: React 18, Vite, Tailwind CSS, Drizzle ORM
- **🏪 State Management**: Zustand + TanStack Query for optimal performance
- **🧪 Well-Tested**: Comprehensive test infrastructure with professional testing utilities
- **📊 Quality Monitoring**: Built-in code quality metrics and automated tracking

## 🏃 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download here](https://nodejs.org/))
- **pnpm** ([Install guide](https://pnpm.io/installation))
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

### Installation

```bash
# Clone the repository
git clone https://github.com/manavsehgal/vibesolver.git
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

### Environment Setup

Create a `.env.local` file in the project root:

```env
ANTHROPIC_API_KEY=your_api_key_here
DATABASE_URL=./src/db/sqlite.db
```

## 📋 Available Scripts

```bash
# Development
pnpm dev              # Start development server with hot reload
pnpm build            # Build for production (includes TypeScript compilation)
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Run ESLint with TypeScript rules
pnpm format           # Format code with Prettier
pnpm test             # Run Vitest test suite
pnpm test:ui          # Run tests with interactive UI

# Database Operations
pnpm db:generate      # Generate Drizzle migrations
pnpm db:push          # Apply schema changes to SQLite database
pnpm db:studio        # Open Drizzle Studio for database inspection

# Quality Metrics
pnpm metrics          # Generate code quality metrics report
pnpm metrics:compare  # Compare metrics changes over time
pnpm metrics:summary  # View quick metrics summary
```

## 🎬 Demo

### Generate AWS Solutions with Natural Language

```bash
# Input: "I need a scalable e-commerce platform for 10,000 users"
# Output: Complete AWS architecture with EC2, RDS, S3, CloudFront, and more
```

### Interactive Architecture Canvas

```bash
# Infinite canvas with smooth zoom and pan
# Drag and drop AWS services with real-time updates
# Advanced component manipulation and connection system
# Professional design tool experience
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
| **Testing** | Vitest + React Testing Library | Comprehensive test coverage |
| **PWA** | Vite PWA Plugin + Workbox | Offline-first capabilities |

### Project Structure

```
src/
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   └── __tests__/     # Component tests
├── hooks/             # Custom React hooks
│   ├── useAI.ts       # AI integration hooks
│   ├── useSolutions.ts # Solution management
│   └── __tests__/     # Hook tests
├── lib/               # Core utilities
│   ├── ai.ts          # AI service layer
│   ├── ai-mock.ts     # Mock AI for development
│   └── react-query.tsx # Query configuration
├── stores/            # Zustand state stores
│   └── solutions.ts   # Solutions state management
├── db/                # Database layer
│   ├── index.ts       # Database connection
│   ├── schema.ts      # Data models & migrations
│   └── browser-mock.ts # Browser-compatible mock
└── types/             # TypeScript definitions
    └── index.ts       # Shared type exports
```

### AI Integration

VibeSolver uses a sophisticated AI service layer featuring:

- **🔄 Structured Output**: Zod schema validation for type-safe AI responses
- **🎯 Multiple AI Functions**: Solution generation, flashcard creation, what-if analysis
- **🛡️ Error Handling**: Robust error management and retry logic
- **📝 Type Safety**: Full TypeScript integration with Anthropic SDK
- **🎭 Mock Services**: Development-friendly mock AI for testing

```typescript
// Example: Generate AWS Solution
const solution = await generateAWSSolution(
  "I need a scalable web application that can handle 10,000 concurrent users"
);

// Returns structured AWS architecture with:
// - Service recommendations
// - Architecture diagrams
// - Cost estimates
// - Best practices
```

## 🎯 Use Cases

### 👩‍💻 For Developers
- **Rapid Prototyping** - Quickly explore AWS architectures for new projects
- **Learning AWS** - Understand service relationships through visual diagrams
- **Cost Estimation** - Get ballpark figures before deep-dive planning
- **Architecture Documentation** - Generate visual documentation for existing systems

### 🏗️ For Solutions Architects  
- **Client Presentations** - Generate professional architectures for stakeholder meetings
- **What-If Scenarios** - Compare different architectural approaches systematically
- **Team Education** - Create learning materials and flashcards for knowledge transfer
- **Rapid Iteration** - Test multiple solutions quickly with natural language modifications

### 👔 For Business Stakeholders
- **Technology Translation** - Convert business requirements to technical solutions
- **Investment Planning** - Understand infrastructure costs and trade-offs
- **Risk Assessment** - Analyze security and availability implications
- **Strategic Planning** - Visualize technical capabilities for business planning

## 🛣️ Development Roadmap

### Phase 1: Foundation ✅ (Sprint 001-002)
- [x] Project scaffold and infrastructure setup
- [x] AI service integration with Anthropic Claude
- [x] Database schema and ORM configuration
- [x] State management architecture
- [x] Core UI components and solution interface
- [x] Architecture visualization foundation
- [x] Comprehensive testing infrastructure (95/100 quality score)

### Phase 2: Enhanced Canvas & UI 🚧 (Sprint 003-004)
- [x] Enhanced architecture visualization with infinite canvas
- [x] Interactive drag-and-drop component manipulation  
- [x] Advanced canvas features (zoom, pan, minimap)
- [ ] Solution generation UI integration
- [ ] Mobile-responsive interface optimization

### Phase 3: Learning Features 📋 (Sprint 005-006)
- [ ] Interactive flashcard system with spaced repetition
- [ ] Study progress tracking and analytics
- [ ] Custom learning paths based on AWS certifications
- [ ] Knowledge assessment and recommendations

### Phase 4: Advanced Features ⚡ (Sprint 007-008)
- [ ] What-if analysis interface with scenario comparison
- [ ] Real-time collaboration for team architectures
- [ ] Solution deployment automation with AWS CDK
- [ ] Cost optimization recommendations with trend analysis
- [ ] Integration with AWS Cost Explorer and Trusted Advisor

## 🧪 Development

### Quality Metrics

VibeSolver maintains high code quality standards:

| Metric | Current | Target |
|--------|---------|--------|
| **Quality Score** | 95/100 | >90/100 |
| **Test Infrastructure** | Professional Setup | >80% Coverage |
| **TypeScript Errors** | 0 | 0 |
| **ESLint Errors** | 0 | 0 |
| **Build Time** | <10s | <15s |

### Development Workflow

1. **Planning** - Features documented in `/specs` and `/sprints` folders
2. **Implementation** - TDD approach with comprehensive testing
3. **Quality Assurance** - ESLint, Prettier, and TypeScript strict mode
4. **Documentation** - Patterns documented in `CLAUDE.md`
5. **Metrics Tracking** - Automated quality reports in `/reports`

### Testing Strategy

```bash
# Run all tests with coverage
pnpm test

# Interactive test UI
pnpm test:ui

# Specific test suites
pnpm test src/components
pnpm test src/hooks
pnpm test src/lib
```

### Code Quality Tools

- **TypeScript Strict Mode** - Complete type safety with zero compilation errors
- **ESLint + Prettier** - Consistent code formatting and style enforcement
- **Vitest** - Fast, modern testing framework with excellent developer experience
- **React Testing Library** - Component testing following best practices
- **Automated Metrics** - Built-in code quality tracking and reporting

## 🤝 Contributing

We welcome contributions from developers, designers, and AWS experts! VibeSolver is designed to be contributor-friendly with clear architecture and comprehensive documentation.

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** - `git clone https://github.com/yourusername/vibesolver.git`
3. **Create a feature branch** - `git checkout -b feature/amazing-feature`
4. **Set up development environment** - Follow the [Quick Start](#-quick-start) guide
5. **Make your changes** - Follow our [coding standards](#development-guidelines)
6. **Add tests** - Ensure your changes are well-tested
7. **Submit a pull request** - Describe your changes clearly

### Development Guidelines

- **Follow CLAUDE.md patterns** - Use established coding patterns and conventions
- **Write comprehensive tests** - Aim for >80% coverage on new features
- **Update documentation** - Keep README and specs in sync with changes
- **Use conventional commits** - Follow [Conventional Commits](https://conventionalcommits.org/) specification
- **Maintain quality score** - Ensure code quality metrics remain >90/100

### Areas for Contribution

- 🎨 **UI/UX Design** - Component library, infinite canvas interface, mobile experience
- 🧠 **AI Features** - Enhanced prompt engineering, new AI capabilities, model integrations
- 📊 **Visualizations** - Advanced architecture diagrams, interactive charts, 3D visualizations
- 🧪 **Testing** - Expanded test coverage, performance testing, accessibility testing
- 📚 **Documentation** - Tutorials, API guides, video content, translation
- 🔧 **Infrastructure** - CI/CD improvements, deployment automation, monitoring
- 🌐 **Integrations** - AWS service integrations, third-party tool connections

### Code of Conduct

VibeSolver follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). Please read and follow it in all interactions.

## 📚 Documentation

- **[Product Specifications](./specs/)** - Detailed product requirements and design decisions
- **[Development Guide](./CLAUDE.md)** - Coding patterns and AI-assisted development guidelines
- **[Sprint Documentation](./sprints/)** - Development progress and feature planning
- **[Architecture Articles](./articles/)** - In-depth technical analysis and evaluations
- **[API Documentation](./docs/api.md)** - API reference and integration guides (Coming Soon)

## 📊 Project Status

### Current Sprint: Phase 2 Implementation  
- **Status**: Enhanced Canvas Complete
- **Focus**: Infinite canvas with drag-and-drop interactions
- **Next Release**: v0.2.0 (Enhanced UI Integration)

### Recent Achievements
- ✅ Achieved 95/100 quality score with professional testing infrastructure
- ✅ Implemented infinite canvas with advanced interaction patterns
- ✅ Established robust AI service layer with structured outputs
- ✅ Created comprehensive development environment and tooling

### Metrics Dashboard

View detailed project metrics and quality trends in the [`/reports`](./reports/) directory:
- **Code Quality Reports** - Automated quality analysis
- **Metrics Comparisons** - Track improvements over time
- **Test Coverage** - Comprehensive testing insights

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Anthropic](https://anthropic.com)** - For Claude AI that powers natural language AWS solution generation
- **[AWS](https://aws.amazon.com)** - For the Well-Architected Framework that guides our solution standards
- **[Vercel](https://vercel.com)** - For the AI SDK that simplifies AI integration and streaming
- **[React Team](https://react.dev)** - For the foundational framework that makes modern UIs possible
- **[Vite Team](https://vitejs.dev)** - For the lightning-fast build tooling that enhances developer experience
- **Open Source Community** - For the incredible tools and libraries that power VibeSolver

## 🚀 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=manavsehgal/vibesolver&type=Date)](https://star-history.com/#manavsehgal/vibesolver&Date)

---

<div align="center">

**Built with ❤️ using AI-assisted development and vibe coding principles**

[⭐ Star this repo](https://github.com/manavsehgal/vibesolver) • [🐛 Report Bug](https://github.com/manavsehgal/vibesolver/issues) • [💡 Request Feature](https://github.com/manavsehgal/vibesolver/issues) • [💬 Discussions](https://github.com/manavsehgal/vibesolver/discussions)

**Made with vibe coding ✨**

</div>