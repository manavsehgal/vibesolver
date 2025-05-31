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

*Production-ready desktop application that transforms business requirements into AWS architectures using natural language, featuring interactive canvas editing, AI-powered learning, and local-first deployment*

[Features](#-features) • [Quick Start](#-quick-start) • [Demo](#-demo) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

---

## 🚀 What is VibeSolver?

VibeSolver is a **production-ready desktop application** that functions as an AI twin of an AWS Solutions Architect. It helps you **reimagine what's possible** for your business by generating production-ready AWS architectures from natural language descriptions. Built with cutting-edge AI and modern web technologies using vibe coding principles, VibeSolver eliminates the traditional barriers between business requirements and technical implementation.

Unlike development-only prototypes, VibeSolver runs as a **standalone desktop application** optimized for local laptop execution, featuring secure API proxying, production-grade infrastructure, and professional-level performance.

### 🎯 Why VibeSolver?

- **🗣️ Natural Language First** - Describe your needs in plain English, get AWS solutions instantly
- **🏗️ Well-Architected Framework** - All solutions follow AWS best practices and security standards
- **🎨 Infinite Canvas Editing** - Figma-like interactive diagrams with drag-and-drop, zoom, and professional design tools
- **🧠 AI-Powered Learning** - Generate flashcards and explanations to deeply understand your architecture
- **📊 What-If Analysis** - Multi-criteria analysis across cost, performance, security, and scalability with confidence scores
- **⚡ Real-time Modifications** - Update solutions using conversational AI with instant visual previews
- **🖥️ Production Desktop App** - One-command deployment, secure API proxy, and laptop-optimized performance

## ✨ Features

### 🎯 Core Capabilities

| Feature | Description | Status |
|---------|-------------|--------|
| **Natural Language Processing** | Convert business requirements to AWS solutions with Claude AI | ✅ Fully Implemented |
| **Infinite Canvas Editing** | Interactive diagrams with drag-and-drop, zoom, pan, and component manipulation | ✅ Enhanced Implementation |
| **AI-Powered Learning** | Generate flashcards and explanations for educational understanding | ✅ Fully Implemented |
| **What-If Analysis** | Multi-criteria analysis across cost, security, performance, and scalability | ✅ Fully Implemented |
| **Solution Modifications** | Update architectures using natural language with real-time previews | ✅ Fully Implemented |
| **Solution Management** | Save, organize, search, and manage comprehensive solution libraries | ✅ Professional Implementation |
| **Multi-Format Export** | Export solutions as PDF, JSON, YAML, Terraform, PNG, SVG formats | ✅ Professional Implementation |

### 🛠️ Technical Highlights

- **🤖 AI-Powered**: Anthropic Claude integration with structured output validation
- **🔒 Type-Safe**: Full TypeScript implementation with strict mode (95/100 quality score)
- **📱 Local-First**: SQLite database with offline PWA capabilities
- **⚡ Modern Stack**: React 18, Vite, Tailwind CSS, Drizzle ORM
- **🏪 State Management**: Zustand + TanStack Query for optimal performance
- **🧪 Well-Tested**: Comprehensive test infrastructure with 58 test files and professional testing utilities
- **📊 Quality Monitoring**: Built-in code quality metrics and automated tracking

## 🏃 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download here](https://nodejs.org/))
- **pnpm** ([Install guide](https://pnpm.io/installation))
- **Anthropic API Key** ([Get one here](https://console.anthropic.com/))

### Production Installation (Recommended)

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

# 🚀 Start production application (single command!)
pnpm start:prod
```

Visit `http://localhost:3000` to see VibeSolver production app! 🎉

### Development Mode (Optional)

```bash
# For development with hot reload
pnpm dev
# Visit http://localhost:5173
```

### Environment Setup

Create a `.env.local` file in the project root:

```env
ANTHROPIC_API_KEY=your_api_key_here
DATABASE_URL=./src/db/sqlite.db
```

## 📋 Available Scripts

```bash
# Production (Recommended)
pnpm start:prod       # 🚀 Build and start production server (single command!)
pnpm serve:prod       # Serve pre-built production application
pnpm build            # Build optimized production bundle (118KB gzipped)

# Development
pnpm dev              # Start development server with hot reload
pnpm preview          # Preview production build locally

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

```
Input: "I need a scalable e-commerce platform for 10,000 users with secure payments"

Output: Complete AWS architecture including:
├── Application Load Balancer
├── EC2 Auto Scaling Groups
├── RDS Multi-AZ Database
├── S3 + CloudFront CDN
├── Lambda Payment Processing
├── VPC Security Groups
└── Cost Estimate: $847/month
```

### Interactive Architecture Canvas

```
✨ Infinite Canvas Features (Figma-like Experience):
├── Smooth zoom (0.1x to 5x) and pan navigation
├── Drag-and-drop AWS components with real-time updates
├── Automatic connection line redrawing during component movement
├── Multi-component selection with Ctrl+Click
├── Professional design tool feel with visual feedback
├── 60fps performance even with 20+ components
└── Production-optimized rendering for laptop efficiency
```

### AI-Powered Learning & Analysis

```
📚 Learning Features:
├── Generate 5-10 contextual flashcards from any solution
├── Interactive study interface with progress tracking
├── Detailed solution explanations with component highlighting
├── Difficulty rating and adaptive learning algorithms
└── Educational content tailored to your architecture

📊 What-If Analysis:
├── Multi-criteria analysis (cost, security, performance, scalability)
├── Confidence indicators (85-95% typical accuracy)
├── Actionable recommendations with precise cost impact
├── Visual comparison charts and trade-off visualization
└── Real-time scenario modeling with instant feedback

🛠️ Solution Modifications:
├── Natural language modification requests ("add load balancer")
├── Real-time preview before applying changes
├── Architecture integrity validation with AWS best practices
├── Automatic cost recalculation and impact analysis
└── Undo/redo support for confident experimentation

📁 Solution Management & Export:
├── Persistent solution library with SQLite database
├── Advanced search and filtering across solution collections
├── Professional export formats: PDF, JSON, YAML, Terraform, PNG, SVG
├── Bulk operations for managing large solution collections
├── Tagging and categorization for organization
└── Shareable solution packages for team collaboration
```

## 🏗️ Architecture

VibeSolver is built with a modern, scalable architecture optimized for AI-powered development.

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | Type-safe, component-based UI |
| **Styling** | Tailwind CSS | Utility-first, responsive design |
| **Build Tool** | Vite | Lightning-fast development & builds |
| **Production Server** | Express.js + Security Middleware | Local production deployment with API proxy |
| **State** | Zustand + TanStack Query | Client & server state management |
| **Database** | SQLite + Drizzle ORM | Local-first data persistence |
| **AI** | Anthropic Claude + Vercel AI SDK | Natural language processing with proxy |
| **Testing** | Vitest + React Testing Library | Comprehensive test coverage (58 test files) |
| **PWA** | Vite PWA Plugin + Workbox | Offline-first capabilities |

### Production Architecture

```
VibeSolver Production Setup:
┌─────────────────────────────────────────┐
│ Local Laptop Environment (Port 3000)   │
├─────────────────────────────────────────┤
│ Express.js Production Server            │
│  ├── Static Asset Serving (118KB)      │
│  ├── API Proxy (/api/messages)         │
│  ├── CORS Resolution & Security        │
│  ├── Health Monitoring (/api/health)   │
│  └── Graceful Shutdown Handling        │
├─────────────────────────────────────────┤
│ React Frontend (Optimized Bundle)      │
│  ├── Infinite Canvas (60fps)           │
│  ├── AI Integration (Proxy Mode)       │
│  ├── Local SQLite Database             │
│  └── PWA Offline Capabilities          │
├─────────────────────────────────────────┤
│ External Services                      │
│  └── Anthropic Claude API (Proxied)    │
└─────────────────────────────────────────┘
```

### Project Structure

```
├── server.js                  # Express.js production server
├── src/
│   ├── components/            # React components (14 core components)
│   │   ├── ArchitectureVisualization.tsx  # Infinite canvas
│   │   ├── FlashcardViewer.tsx            # AI learning
│   │   ├── WhatIfAnalysis.tsx             # Multi-criteria analysis
│   │   ├── SolutionLibrary.tsx           # 🆕 Solution management interface
│   │   ├── SolutionCard.tsx              # 🆕 Individual solution display
│   │   ├── ExportModal.tsx               # 🆕 Multi-format export system
│   │   ├── ui/               # Reusable UI components
│   │   └── __tests__/        # Component tests (58 test files)
│   ├── hooks/                # Custom React hooks
│   │   ├── useAI.ts          # AI integration with smart proxy detection
│   │   ├── useSolutions.ts   # Solution management with persistence
│   │   └── __tests__/        # Hook tests
│   ├── lib/                  # Core utilities
│   │   ├── ai.ts             # AI service layer with environment detection
│   │   ├── ai-mock.ts        # Mock AI for development
│   │   ├── export.ts         # 🆕 Multi-format export service
│   │   └── react-query.tsx   # Query configuration
│   ├── stores/               # Zustand state stores
│   │   └── solutions.ts      # Enhanced solutions state management
│   ├── db/                   # Database layer
│   │   ├── index.ts          # Database connection
│   │   ├── schema.ts         # Enhanced data models & migrations
│   │   └── browser-mock.ts   # Browser-compatible mock
│   └── types/                # TypeScript definitions
│       └── index.ts          # Shared type exports
├── reports/                   # Quality metrics and analysis
├── articles/                  # Comprehensive evaluation tutorials
├── sprints/                   # Development sprint documentation
└── specs/                     # Product and technical specifications
```

### AI Integration

VibeSolver uses a sophisticated AI service layer featuring:

- **🔄 Structured Output**: Zod schema validation for type-safe AI responses
- **🎯 Comprehensive AI Functions**: Solution generation, flashcards, what-if analysis, explanations, modifications
- **🛡️ Error Handling**: Robust error management and retry logic
- **📝 Type Safety**: Full TypeScript integration with Anthropic Claude SDK
- **🎭 Mock Services**: Development-friendly mock AI for testing

```typescript
// Available AI Functions
const solution = await generateAWSSolution(requirements);
const flashcards = await generateFlashcards(solutionId, count);
const analysis = await performWhatIfAnalysis(solutionId, criteria);
const explanation = await explainSolution(solutionId, depth);
const modifiedSolution = await modifySolution(solutionId, modifications);

// All functions return structured data with:
// ├── Type-safe responses via Zod schemas
// ├── Comprehensive error handling
// ├── Performance optimization
// └── Real-time streaming support (future)
```

## 🎯 Use Cases

### 👩‍💻 For Developers
- **Rapid Prototyping** - Quickly explore AWS architectures for new projects with interactive canvas
- **Learning AWS** - Understand service relationships through visual diagrams and AI-generated flashcards
- **Cost Estimation** - Get accurate cost estimates with what-if analysis across different scenarios
- **Architecture Documentation** - Generate visual documentation with explanations for existing systems

### 🏗️ For Solutions Architects  
- **Client Presentations** - Generate professional architectures with interactive editing for stakeholder meetings
- **What-If Scenarios** - Compare different architectural approaches across cost, security, and performance
- **Team Education** - Create personalized learning materials and flashcards for knowledge transfer
- **Rapid Iteration** - Test multiple solutions quickly with natural language modifications and real-time preview

### 👔 For Business Stakeholders
- **Technology Translation** - Convert business requirements to technical solutions with clear explanations
- **Investment Planning** - Understand infrastructure costs and trade-offs with detailed analysis
- **Risk Assessment** - Analyze security and availability implications through AI-powered what-if analysis
- **Strategic Planning** - Visualize technical capabilities for business planning with interactive canvas

## 🛣️ Development Roadmap

### Phase 1: Foundation ✅ (Sprint 001-002)
- [x] Project scaffold and infrastructure setup
- [x] AI service integration with Anthropic Claude
- [x] Database schema and ORM configuration
- [x] State management architecture
- [x] Core UI components and solution interface
- [x] Architecture visualization foundation
- [x] Comprehensive testing infrastructure (95/100 quality score)

### Phase 2: Enhanced Canvas & Interactive Editing ✅ (Sprint 003)
- [x] Enhanced architecture visualization with infinite canvas
- [x] Interactive drag-and-drop component manipulation  
- [x] Advanced canvas features (zoom, pan, selection)
- [x] Solution generation UI integration
- [x] Professional design tool experience

### Phase 3: AI-Powered Learning & Analysis ✅ (Sprint 004)
- [x] Interactive flashcard system with progress tracking
- [x] AI-powered solution explanations with component highlighting
- [x] What-if analysis across multiple criteria (cost, security, performance)
- [x] Natural language solution modifications with preview
- [x] Comprehensive learning dashboard and metrics

### Phase 4: Production Infrastructure ✅ (Sprint 005)
- [x] Express.js production server with security middleware
- [x] API proxy solving CORS issues with Anthropic API
- [x] Production build optimization (118KB gzipped bundle)
- [x] Single-command deployment workflow
- [x] Environment-aware configuration management
- [x] Health monitoring and graceful shutdown handling
- [x] Local laptop-optimized performance and resource usage

### Phase 5: Solution Management & Export ✅ (Sprint 007)
- [x] Persistent solution storage with SQLite database and metadata tracking
- [x] Professional export capabilities (PDF, JSON, YAML, Terraform, PNG, SVG)
- [x] Comprehensive solution library with search, filtering, and organization
- [x] Bulk operations for managing large solution collections
- [x] Advanced tagging and categorization system for solution organization
- [x] Professional PDF reports suitable for client presentations and documentation

### Phase 6: Advanced Features & Polish 🔄 (Sprint 008-009)
- [ ] Spaced repetition algorithm for optimized learning
- [ ] Advanced canvas features (grouping, templates, alignment tools)
- [ ] Real-time collaboration for team architectures
- [ ] Mobile-responsive interface optimization
- [ ] Solution version control and history management

### Phase 7: Enterprise & Integration 📋 (Sprint 010-011)
- [ ] Solution deployment automation with AWS CDK
- [ ] Cost optimization recommendations with trend analysis
- [ ] Integration with AWS Cost Explorer and Trusted Advisor
- [ ] Custom learning paths based on AWS certifications
- [ ] Advanced analytics and reporting dashboard

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
- **[Sprint Documentation](./sprints/)** - Development progress and feature planning from initial concept to solution management platform
- **[Architecture Articles](./articles/)** - In-depth technical analysis and multi-perspective evaluations of implemented features
- **[Quality Reports](./reports/)** - Code quality metrics and automated analysis tracking
- **[API Documentation](./docs/api.md)** - API reference and integration guides (Coming Soon)

## 📊 Project Status

### Current Sprint: Phase 5 Complete - Solution Management & Export Platform
- **Status**: Comprehensive AWS architecture management platform with professional export capabilities
- **Focus**: Solution library management, multi-format export, and team collaboration foundations
- **Latest Release**: v0.7.0 (Solution Management & Export Platform)

### Recent Achievements
- ✅ **Solution Management Platform**: Comprehensive solution library with search, filtering, and organization
- ✅ **Professional Export System**: 6 export formats including PDF, Terraform, JSON, YAML, PNG, SVG
- ✅ **Advanced Data Persistence**: Enhanced SQLite schema with metadata tracking and bulk operations
- ✅ **Bulk Operations**: Multi-select and batch processing for large solution collections
- ✅ **Production Infrastructure**: Express.js server with security middleware and API proxy
- ✅ **CORS Resolution**: Complete solution for Anthropic API integration
- ✅ **Build Optimization**: 118KB gzipped bundle with code splitting and asset optimization
- ✅ **Environment Intelligence**: Automatic dev/prod detection and service switching

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