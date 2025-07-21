export interface TechStack {
  framework: 'Next.js' | 'React' | 'Vue.js' | 'Svelte' | 'Angular';
  styling: 'Tailwind CSS' | 'CSS Modules' | 'Styled Components' | 'Material-UI' | 'Chakra UI';
  database: 'Prisma + PostgreSQL' | 'MongoDB' | 'Supabase' | 'Firebase' | 'SQLite';
  auth: 'NextAuth.js' | 'Clerk' | 'Auth0' | 'Supabase Auth' | 'Firebase Auth' | 'None';
  payments: 'Stripe' | 'PayPal' | 'Square' | 'None';
  deployment: 'Vercel' | 'Netlify' | 'Railway' | 'Heroku';
}

export interface AppFeature {
  name: string;
  description: string;
  required: boolean;
  implemented: boolean;
}

export interface GeneratedApp {
  name: string;
  description: string;
  techStack: TechStack;
  features: AppFeature[];
  files: GeneratedFile[];
  chatTrace: string[];
  previewCode: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  type: 'page' | 'component' | 'api' | 'config' | 'database' | 'auth' | 'styling' | 'layout';
}

export class AIGenerator {
  private static instance: AIGenerator;
  
  static getInstance(): AIGenerator {
    if (!AIGenerator.instance) {
      AIGenerator.instance = new AIGenerator();
    }
    return AIGenerator.instance;
  }

  async generateApp(prompt: string, config: Partial<TechStack> = {}): Promise<GeneratedApp> {
    const chatTrace: string[] = [];
    
    // Step 1: Analyze the prompt
    chatTrace.push(`🔍 Analyzing your request: "${prompt}"`);
    const analysis = this.analyzePrompt(prompt);
    
    // Step 2: Select optimal tech stack
    chatTrace.push(`⚙️ Selecting optimal tech stack for your use case...`);
    const techStack = this.selectTechStack(analysis, config);
    
    // Step 3: Identify required features
    chatTrace.push(`🎯 Identifying required features...`);
    const features = this.identifyFeatures(analysis);
    
    // Step 4: Generate app structure
    chatTrace.push(`🏗️ Generating application structure...`);
    const files = await this.generateFiles(analysis, techStack, features);
    
    // Step 5: Create preview code
    chatTrace.push(`👀 Creating live preview...`);
    const previewCode = this.generatePreviewCode(analysis, techStack, features);
    
    chatTrace.push(`✅ Your app is ready! Built with ${techStack.framework}, ${techStack.styling}, and ${techStack.database}`);
    
    return {
      name: analysis.appName,
      description: analysis.description,
      techStack,
      features,
      files,
      chatTrace,
      previewCode
    };
  }

  private analyzePrompt(prompt: string) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Determine app type
    let appType = 'web-app';
    let appName = 'My App';
    let description = 'A modern web application';
    
    if (lowerPrompt.includes('blog') || lowerPrompt.includes('post') || lowerPrompt.includes('article')) {
      appType = 'blog';
      appName = 'Blog Platform';
      description = 'A modern blog platform with AI-powered content management';
    } else if (lowerPrompt.includes('ecommerce') || lowerPrompt.includes('shop') || lowerPrompt.includes('store')) {
      appType = 'ecommerce';
      appName = 'E-commerce Store';
      description = 'A complete online store with product catalog and payment processing';
    } else if (lowerPrompt.includes('chat') || lowerPrompt.includes('bot') || lowerPrompt.includes('conversation')) {
      appType = 'chatbot';
      appName = 'AI Chatbot';
      description = 'An intelligent chatbot with conversation memory and AI responses';
    } else if (lowerPrompt.includes('task') || lowerPrompt.includes('todo') || lowerPrompt.includes('kanban')) {
      appType = 'task-manager';
      appName = 'Task Manager';
      description = 'A Kanban-style task management application with team collaboration';
    } else if (lowerPrompt.includes('dashboard') || lowerPrompt.includes('admin')) {
      appType = 'dashboard';
      appName = 'Admin Dashboard';
      description = 'A comprehensive admin dashboard with analytics and user management';
    }
    
    return {
      appType,
      appName,
      description,
      hasAuth: lowerPrompt.includes('auth') || lowerPrompt.includes('login') || lowerPrompt.includes('user'),
      hasPayments: lowerPrompt.includes('payment') || lowerPrompt.includes('stripe') || lowerPrompt.includes('checkout'),
      hasAI: lowerPrompt.includes('ai') || lowerPrompt.includes('artificial intelligence'),
      hasDatabase: lowerPrompt.includes('database') || lowerPrompt.includes('data') || lowerPrompt.includes('store'),
      isResponsive: lowerPrompt.includes('responsive') || lowerPrompt.includes('mobile'),
      hasSearch: lowerPrompt.includes('search') || lowerPrompt.includes('filter'),
      hasUpload: lowerPrompt.includes('upload') || lowerPrompt.includes('file') || lowerPrompt.includes('image')
    };
  }

  private selectTechStack(analysis: any, userConfig: Partial<TechStack>): TechStack {
    return {
      framework: userConfig.framework || 'Next.js',
      styling: userConfig.styling || 'Tailwind CSS',
      database: userConfig.database || (analysis.hasDatabase ? 'Prisma + PostgreSQL' : 'SQLite'),
      auth: userConfig.auth || (analysis.hasAuth ? 'NextAuth.js' : 'None'),
      payments: userConfig.payments || (analysis.hasPayments ? 'Stripe' : 'None'),
      deployment: userConfig.deployment || 'Vercel'
    };
  }

  private identifyFeatures(analysis: any): AppFeature[] {
    const features: AppFeature[] = [
      {
        name: 'User Authentication',
        description: 'Secure user login and registration system',
        required: analysis.hasAuth,
        implemented: false
      },
      {
        name: 'Payment Processing',
        description: 'Secure payment integration with Stripe',
        required: analysis.hasPayments,
        implemented: false
      },
      {
        name: 'AI Integration',
        description: 'Artificial intelligence features and automation',
        required: analysis.hasAI,
        implemented: false
      },
      {
        name: 'Database Management',
        description: 'Data persistence and management',
        required: analysis.hasDatabase,
        implemented: false
      },
      {
        name: 'Responsive Design',
        description: 'Mobile-first responsive layout',
        required: analysis.isResponsive,
        implemented: false
      },
      {
        name: 'Search & Filter',
        description: 'Advanced search and filtering capabilities',
        required: analysis.hasSearch,
        implemented: false
      },
      {
        name: 'File Upload',
        description: 'Secure file and image upload system',
        required: analysis.hasUpload,
        implemented: false
      }
    ];
    
    return features.filter(f => f.required);
  }

  private async generateFiles(analysis: any, techStack: TechStack, features: AppFeature[]): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];
    
    // Generate package.json
    files.push(this.generatePackageJson(techStack, features));
    
    // Generate main page
    files.push(this.generateMainPage(analysis, techStack));
    
    // Generate layout
    files.push(this.generateLayout(analysis, techStack));
    
    // Generate styling
    files.push(this.generateStyling(techStack));
    
    // Generate components based on features
    features.forEach(feature => {
      if (feature.name === 'User Authentication') {
        files.push(this.generateAuthComponent(techStack));
      }
      if (feature.name === 'Payment Processing') {
        files.push(this.generatePaymentComponent(techStack));
      }
      if (feature.name === 'AI Integration') {
        files.push(this.generateAIComponent(analysis));
      }
    });
    
    // Generate API routes
    files.push(this.generateAPIRoutes(analysis, features));
    
    // Generate database schema
    if (techStack.database.includes('Prisma')) {
      files.push(this.generatePrismaSchema(analysis));
    }
    
    return files;
  }

  private generatePackageJson(techStack: TechStack, features: AppFeature[]): GeneratedFile {
    const dependencies: string[] = [
      '"next": "14.0.0"',
      '"react": "^18"',
      '"react-dom": "^18"'
    ];
    
    const devDependencies: string[] = [
      '"typescript": "^5"',
      '"@types/node": "^20"',
      '"@types/react": "^18"',
      '"@types/react-dom": "^18"',
      '"eslint": "^8"',
      '"eslint-config-next": "14.0.0"'
    ];
    
    if (techStack.styling === 'Tailwind CSS') {
      dependencies.push('"tailwindcss": "^3.3.0"', '"autoprefixer": "^10.0.1"', '"postcss": "^8"');
    }
    
    if (techStack.auth === 'NextAuth.js') {
      dependencies.push('"next-auth": "^4.24.0"');
    }
    
    if (techStack.payments === 'Stripe') {
      dependencies.push('"stripe": "^14.0.0"');
    }
    
    if (techStack.database.includes('Prisma')) {
      dependencies.push('"prisma": "^5.0.0"', '"@prisma/client": "^5.0.0"');
    }
    
    return {
      path: 'package.json',
      content: `{
  "name": "vera-generated-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    ${dependencies.join(',\n    ')}
  },
  "devDependencies": {
    ${devDependencies.join(',\n    ')}
  }
}`,
      language: 'json',
      type: 'config'
    };
  }

  private generateMainPage(analysis: any, techStack: TechStack): GeneratedFile {
    return {
      path: 'src/app/page.tsx',
      content: `import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-extralight text-[rgb(179,194,203)] mb-8">
          Welcome to ${analysis.appName}
        </h1>
        <p className="text-xl text-[rgb(179,194,203)] mb-8 font-light">
          Built with ${techStack.framework}${techStack.styling ? `, ${techStack.styling}` : ''}
        </p>
        <p className="text-lg text-[rgb(179,194,203)] mb-8 font-extralight max-w-2xl">
          ${analysis.description}
        </p>
        <button
          onClick={() => setCount(count + 1)}
          className="bg-[rgb(179,194,203)] hover:bg-white text-slate-950 px-8 py-3 rounded-lg font-light transition-colors"
        >
          Count: {count}
        </button>
      </div>
    </div>
  );
}`,
      language: 'typescript',
      type: 'page'
    };
  }

  private generateLayout(analysis: any, techStack: TechStack): GeneratedFile {
    return {
      path: 'src/app/layout.tsx',
      content: `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '${analysis.appName}',
  description: '${analysis.description}',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}`,
      language: 'typescript',
      type: 'layout'
    };
  }

  private generateStyling(techStack: TechStack): GeneratedFile {
    if (techStack.styling === 'Tailwind CSS') {
      return {
        path: 'src/app/globals.css',
        content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 179, 194, 203;
  --background-start-rgb: 2, 6, 23;
  --background-end-rgb: 2, 6, 23;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-start-rgb));
}`,
        language: 'css',
        type: 'styling'
      };
    }
    
    return {
      path: 'src/app/globals.css',
      content: `* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
}

body {
  color: rgb(179, 194, 203);
  background: rgb(2, 6, 23);
}

a {
  color: inherit;
  text-decoration: none;
}`,
      language: 'css',
      type: 'styling'
    };
  }

  private generateAuthComponent(techStack: TechStack): GeneratedFile {
    return {
      path: 'src/components/AuthButton.tsx',
      content: `'use client';

import { useState } from 'react';

export function AuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <button
      onClick={handleAuth}
      className="bg-[rgb(179,194,203)] hover:bg-white text-slate-950 px-4 py-2 rounded-lg transition-colors font-light"
    >
      {isLoggedIn ? 'Logout' : 'Login'}
    </button>
  );
}`,
      language: 'typescript',
      type: 'component'
    };
  }

  private generatePaymentComponent(techStack: TechStack): GeneratedFile {
    return {
      path: 'src/components/PaymentForm.tsx',
      content: `'use client';

import { useState } from 'react';

export function PaymentForm() {
  const [amount, setAmount] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Processing payment for:', amount);
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <div>
        <label className="block text-sm font-light text-[rgb(179,194,203)]">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-[rgb(179,194,203)] bg-slate-900 text-[rgb(179,194,203)] shadow-sm focus:border-white focus:ring-white"
          placeholder="Enter amount"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-[rgb(179,194,203)] hover:bg-white text-slate-950 px-4 py-2 rounded-lg transition-colors font-light"
      >
        Pay Now
      </button>
    </form>
  );
}`,
      language: 'typescript',
      type: 'component'
    };
  }

  private generateAIComponent(analysis: any): GeneratedFile {
    return {
      path: 'src/components/AIFeature.tsx',
      content: `'use client';

import { useState } from 'react';

export function AIFeature() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleAIProcess = async () => {
    // AI processing logic would go here
    setOutput('AI processed: ' + input);
  };

  return (
    <div className="space-y-4">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full rounded-md border-[rgb(179,194,203)] bg-slate-900 text-[rgb(179,194,203)] p-3"
        placeholder="Enter text for AI processing..."
        rows={3}
      />
      <button
        onClick={handleAIProcess}
        className="bg-[rgb(179,194,203)] hover:bg-white text-slate-950 px-4 py-2 rounded-lg transition-colors font-light"
      >
        Process with AI
      </button>
      {output && (
        <div className="p-3 bg-slate-900 border border-[rgb(179,194,203)] rounded-md">
          <p className="text-[rgb(179,194,203)]">{output}</p>
        </div>
      )}
    </div>
  );
}`,
      language: 'typescript',
      type: 'component'
    };
  }

  private generateAPIRoutes(analysis: any, features: AppFeature[]): GeneratedFile {
    return {
      path: 'src/app/api/hello/route.ts',
      content: `import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Hello from ${analysis.appName}!',
    features: ${JSON.stringify(features.map(f => f.name))}
  });
}`,
      language: 'typescript',
      type: 'api'
    };
  }

  private generatePrismaSchema(analysis: any): GeneratedFile {
    return {
      path: 'prisma/schema.prisma',
      content: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`,
      language: 'prisma',
      type: 'database'
    };
  }

  private generatePreviewCode(analysis: any, techStack: TechStack, features: AppFeature[]): string {
    return `// Generated App Preview
// Based on: ${analysis.appName}
// Framework: ${techStack.framework}
// Styling: ${techStack.styling}
// Features: ${features.map(f => f.name).join(', ')}

import { useState } from 'react';

export default function AppPreview() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-extralight text-[rgb(179,194,203)] mb-8">
          ${analysis.appName}
        </h1>
        <p className="text-xl text-[rgb(179,194,203)] mb-8 font-light">
          Built with ${techStack.framework} and ${techStack.styling}
        </p>
        <p className="text-lg text-[rgb(179,194,203)] mb-8 font-extralight max-w-2xl">
          ${analysis.description}
        </p>
        <div className="space-y-4">
          <button
            onClick={() => setCount(count + 1)}
            className="bg-[rgb(179,194,203)] hover:bg-white text-slate-950 px-8 py-3 rounded-lg font-light transition-colors"
          >
            Count: {count}
          </button>
          ${features.map(feature => `
          <div className="mt-4">
            <h3 className="text-lg font-light text-[rgb(179,194,203)] mb-2">${feature.name}</h3>
            <p className="text-sm text-[rgb(179,194,203)] opacity-70">${feature.description}</p>
          </div>`).join('')}
        </div>
      </div>
    </div>
  );
}`;
  }
} 