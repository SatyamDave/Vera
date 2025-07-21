"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Code, 
  Zap, 
  Rocket, 
  Bot, 
  Cpu, 
  Database, 
  Shield, 
  Globe,
  ArrowRight,
  Play,
  Star,
  CheckCircle,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Navigate to studio with the prompt
    const params = new URLSearchParams({
      prompt: prompt.trim(),
      framework: 'Next.js',
      typescript: 'true',
      tailwind: 'true',
      responsive: 'true',
      auth: 'true',
      database: 'true'
    });
    
    window.location.href = `/studio?${params.toString()}`;
  };

  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: 'AI-Powered Generation',
      description: 'Intelligent code generation based on natural language prompts'
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: 'Full-Stack Apps',
      description: 'Complete applications with frontend, backend, and database'
    },
    {
      icon: <Database className="h-6 w-6" />,
      title: 'Database Integration',
      description: 'Automatic database schema and API generation'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Authentication Ready',
      description: 'Built-in user authentication and authorization'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Deployment Ready',
      description: 'One-click deployment to Vercel, Netlify, and more'
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: 'Modern Tech Stack',
      description: 'Next.js, TypeScript, Tailwind CSS, and Prisma'
    }
  ];

  const examples = [
    {
      title: 'E-commerce Store',
      description: 'Complete online store with product catalog, payments, and user management',
      prompt: 'Build me an e-commerce store with Stripe payments and user accounts'
    },
    {
      title: 'Blog Platform',
      description: 'Modern blog with AI-powered content management and SEO optimization',
      prompt: 'Create a blog platform with AI content summarization and user authentication'
    },
    {
      title: 'Task Manager',
      description: 'Kanban-style task management with team collaboration and AI prioritization',
      prompt: 'Build a task management app with Kanban boards and AI task prioritization'
    },
    {
      title: 'AI Chatbot',
      description: 'Intelligent chatbot with conversation memory and context awareness',
      prompt: 'Create an AI chatbot with conversation history and context memory'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(179,194,203,0.03),transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(179,194,203,0.02),transparent_50%)]"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_100%,rgba(179,194,203,0.01),transparent_50%)]"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between py-6 px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[rgb(179,194,203)] to-white text-slate-950 font-black text-xl tracking-tight shadow-lg shadow-[rgb(179,194,203)]/10">
            V
          </div>
          <div className="text-2xl font-black text-[rgb(179,194,203)] tracking-tight">
            VERA <span className="bg-gradient-to-r from-white to-[rgb(179,194,203)] bg-clip-text text-transparent">AI</span>
          </div>
        </div>
        
        <nav className="flex items-center gap-6">
          <a href="#features" className="text-[rgb(179,194,203)] hover:text-white transition-colors font-light">Features</a>
          <a href="#examples" className="text-[rgb(179,194,203)] hover:text-white transition-colors font-light">Examples</a>
          <Link href="/studio" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[rgb(179,194,203)] hover:bg-white text-slate-950 font-light transition-colors">
            <Play className="h-4 w-4" />
            Try Now
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex items-center justify-center min-h-[80vh] px-8">
        <div className="text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="px-3 py-1 rounded-full bg-[rgb(179,194,203)]/10 border border-[rgb(179,194,203)]/20 text-[rgb(179,194,203)] text-sm font-light">
                <Sparkles className="h-4 w-4 inline mr-2" />
                AI-Powered Code Generation
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-extralight text-[rgb(179,194,203)] mb-6 leading-tight">
              Build Full-Stack Apps
              <br />
              <span className="bg-gradient-to-r from-white to-[rgb(179,194,203)] bg-clip-text text-transparent">
                with AI
              </span>
            </h1>
            
            <p className="text-xl text-[rgb(179,194,203)]/80 mb-8 font-light max-w-2xl mx-auto">
              Transform your ideas into complete, production-ready web applications using natural language. 
              VERA AI generates everything from frontend to backend, database to deployment.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your app idea..."
                className="flex-1 px-6 py-4 rounded-lg bg-slate-900/50 border border-slate-700 text-[rgb(179,194,203)] placeholder-slate-400 font-light focus:outline-none focus:ring-2 focus:ring-[rgb(179,194,203)]/50"
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="px-8 py-4 rounded-lg bg-gradient-to-r from-[rgb(179,194,203)] to-white text-slate-950 font-light hover:from-white hover:to-[rgb(179,194,203)] transition-all shadow-lg shadow-[rgb(179,194,203)]/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Rocket className="h-5 w-5" />
                    Generate App
                  </>
                )}
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex items-center justify-center gap-8 text-sm text-[rgb(179,194,203)]/60"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>No setup required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Deploy instantly</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>Production ready</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extralight text-[rgb(179,194,203)] mb-4">
              Everything You Need to Build
            </h2>
            <p className="text-lg text-[rgb(179,194,203)]/80 font-light max-w-2xl mx-auto">
              VERA AI generates complete, modern web applications with all the features you need for production.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-slate-900/30 border border-slate-700/50 hover:border-[rgb(179,194,203)]/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[rgb(179,194,203)] to-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-slate-950">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-light text-[rgb(179,194,203)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[rgb(179,194,203)]/70 font-light">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="relative z-10 py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-extralight text-[rgb(179,194,203)] mb-4">
              See What You Can Build
            </h2>
            <p className="text-lg text-[rgb(179,194,203)]/80 font-light max-w-2xl mx-auto">
              From simple landing pages to complex SaaS applications, VERA AI can generate it all.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {examples.map((example, index) => (
              <motion.div
                key={example.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg bg-slate-900/30 border border-slate-700/50 hover:border-[rgb(179,194,203)]/30 transition-all group cursor-pointer"
                onClick={() => {
                  const params = new URLSearchParams({
                    prompt: example.prompt,
                    framework: 'Next.js',
                    typescript: 'true',
                    tailwind: 'true',
                    responsive: 'true',
                    auth: 'true',
                    database: 'true'
                  });
                  window.location.href = `/studio?${params.toString()}`;
                }}
              >
                <h3 className="text-xl font-light text-[rgb(179,194,203)] mb-2 group-hover:text-white transition-colors">
                  {example.title}
                </h3>
                <p className="text-[rgb(179,194,203)]/70 font-light mb-4">
                  {example.description}
                </p>
                <div className="flex items-center gap-2 text-[rgb(179,194,203)]/60 text-sm font-light">
                  <span>Click to generate</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extralight text-[rgb(179,194,203)] mb-4">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-lg text-[rgb(179,194,203)]/80 font-light mb-8 max-w-2xl mx-auto">
              Start building your next web application with AI. No coding required, just describe what you want.
            </p>
            <Link 
              href="/studio"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-[rgb(179,194,203)] to-white text-slate-950 font-light hover:from-white hover:to-[rgb(179,194,203)] transition-all shadow-lg shadow-[rgb(179,194,203)]/10"
            >
              <Rocket className="h-5 w-5" />
              Start Building Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[rgb(179,194,203)] to-white text-slate-950 font-black text-sm tracking-tight">
                V
              </div>
              <div className="text-lg font-black text-[rgb(179,194,203)] tracking-tight">
                VERA <span className="bg-gradient-to-r from-white to-[rgb(179,194,203)] bg-clip-text text-transparent">AI</span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-[rgb(179,194,203)]/60">
              <a href="#" className="hover:text-[rgb(179,194,203)] transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[rgb(179,194,203)] transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[rgb(179,194,203)] transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-[rgb(179,194,203)]/40 text-sm font-light">
            <p>&copy; 2024 VERA AI. Built with AI, for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 