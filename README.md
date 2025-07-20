# VERA (Versatile Engine for Rapid Applications)

A developer tool that turns natural language prompts into full-stack web applications with AI features, live code editing, and deployment support.

## 🚀 Features

- **Natural Language to Code**: Transform prompts into complete applications
- **Live Code Editor**: Monaco + Sandpack-based development environment
- **AI-Powered Generation**: OpenAI, Anthropic, and Together AI integration
- **Full-Stack Templates**: Next.js, tRPC, Prisma, NextAuth stack
- **One-Click Deployment**: Deploy to Vercel, Netlify, or export locally
- **Modular Architecture**: Clean separation of concerns

## 📁 Project Structure

```
vera/
├── frontend/           # UI with Monaco/Sandpack from llamacoder
├── backend/           # tRPC, Auth, Prisma from create-t3-app
├── generator/         # Prompt-to-fileplan logic (WIP)
├── public-apps/       # Example blueprints (blog, chatbot, etc.)
└── deployment/        # Vercel deploy or ZIP exporter
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **Monaco Editor** - VS Code-like code editor
- **Sandpack** - Live code preview and sandbox
- **Tailwind CSS** - Utility-first CSS framework
- **Vercel AI SDK** - AI integration hooks

### Backend
- **tRPC** - End-to-end typesafe APIs
- **Prisma** - Database ORM with SQLite
- **NextAuth.js** - Authentication system
- **Zod** - Schema validation
- **Plop** - Code scaffolding

### AI Integration
- **OpenAI GPT-4** - Primary code generation
- **Anthropic Claude** - Alternative AI provider
- **Together AI** - Open source model support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd VERA
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy frontend environment file
   cp frontend/.example.env frontend/.env
   # Edit frontend/.env with your API keys
   
   # Backend environment is auto-created
   ```

4. **Initialize database**
   ```bash
   npm run db:setup
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 📖 Usage

### 1. Create a New Application

1. Open the VERA frontend
2. Enter your prompt describing the application you want to build
3. VERA will analyze your requirements and generate a blueprint
4. Review and customize the generated code
5. Deploy or export your application

### 2. Example Prompts

```
"Create a blog application with user authentication, 
post creation, and commenting system"

"Build an e-commerce store with product catalog, 
shopping cart, and Stripe payment integration"

"Make a task management app with Kanban boards, 
drag-and-drop, and team collaboration"
```

### 3. Using Plop for Backend Scaffolding

```bash
cd backend
npm run plop api    # Generate new API route
npm run plop model  # Generate new Prisma model
```

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev          # Start development server
npm run db:studio    # Open Prisma Studio
npm run db:push      # Push schema changes
npm run plop         # Run code generators
```

### Database Management
```bash
cd backend
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations
npm run db:studio    # Open database GUI
```

## 🎯 Example Applications

### Blog Application
- User authentication with NextAuth
- Create, edit, and delete blog posts
- Comment system with real-time updates
- Rich text editor with markdown support
- Tags and categories

### E-commerce Store
- Product catalog with search and filtering
- Shopping cart with persistent storage
- User accounts and order history
- Stripe payment integration
- Admin dashboard

### Task Management App
- Kanban-style task organization
- Drag-and-drop interface
- Team collaboration features
- Due dates and priority levels
- Progress tracking

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically on push

### Local Export
1. Click "Export Project" in VERA
2. Download the ZIP file
3. Extract and run locally
4. Follow the setup instructions

### Other Platforms
- **Netlify**: Static site hosting with serverless functions
- **Railway**: Full-stack deployment with database hosting
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [llamacoder](https://github.com/Nutlope/llamacoder) - Frontend inspiration
- [create-t3-app](https://github.com/t3-oss/create-t3-app) - Backend stack
- [plop](https://github.com/plopjs/plop) - Code scaffolding
- [Vercel AI SDK](https://github.com/vercel/ai) - AI integration

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/vera/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/vera/discussions)
- **Documentation**: [Wiki](https://github.com/your-username/vera/wiki)

---

**VERA** - Building the future of rapid application development, one prompt at a time. 🚀 