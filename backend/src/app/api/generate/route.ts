import { type NextRequest, NextResponse } from 'next/server';

interface RequestBody {
  prompt: string;
  framework?: string;
  styling?: string;
  features?: string[];
  assetUpload?: File | null;
}

interface GeneratedFile {
  path: string;
  content: string;
  type: string;
}

interface GenerationResult {
  success: boolean;
  files: GeneratedFile[];
  errors: string[];
  chatTrace?: string[];
  previewCode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestBody;
    const { prompt, framework = 'nextjs', styling = 'tailwind', features = [] } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Initialize chat trace
    const chatTrace: string[] = [
      `Starting app generation for: "${prompt}"`,
      `Framework: ${framework}`,
      `Styling: ${styling}`,
      `Features: ${features.length > 0 ? features.join(', ') : 'basic functionality'}`
    ];

    // Convert prompt to blueprint using the existing generator
    let blueprint: any; // Placeholder for blueprint, will be populated if promptToBlueprint succeeds
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { promptToBlueprint } = await import('../../../../generator/src/promptToBlueprint');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      blueprint = promptToBlueprint(prompt);
      
      chatTrace.push(`Created blueprint: ${blueprint.name}`);
      chatTrace.push(`Description: ${blueprint.description}`);
    } catch (error) {
      console.warn('Blueprint generation failed, continuing with basic generation:', error);
      chatTrace.push('Using basic app structure');
      blueprint = { // Provide a default blueprint for basic generation
        name: 'Basic App',
        description: 'A basic app structure generated from prompt.',
        models: [],
        apis: [],
        aiBlocks: [],
        features: ['basic']
      };
    }

    // Generate files from blueprint or create basic structure
    let generationResult: GenerationResult;
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { generateFiles } = await import('../../../../generator/src/generateFiles');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      generationResult = await generateFiles(blueprint) as GenerationResult;
      
      chatTrace.push(`Generated ${generationResult.files.length} backend files`);
    } catch (error) {
      console.warn('File generation failed, creating basic structure:', error);
      
      // Create basic file structure
      generationResult = {
        success: true,
        files: generateBasicFiles(prompt, framework, styling, features),
        errors: [],
        chatTrace,
        previewCode: generatePreviewCode(prompt, framework, styling, features)
      };
      
      chatTrace.push('Created basic app structure');
    }

    // Add frontend files based on framework and features
    const frontendFiles = generateFrontendFiles(prompt, framework, styling, features);
    generationResult.files.push(...frontendFiles);
    
    chatTrace.push(`Generated ${frontendFiles.length} frontend files`);
    chatTrace.push('App generation completed successfully!');

    if (!generationResult.success) {
      return NextResponse.json(
        { 
          error: 'Failed to generate files',
          details: generationResult.errors
        },
        { status: 500 }
      );
    }

    // Return the generated files and chat trace
    return NextResponse.json({
      success: true,
      files: generationResult.files.map((file) => ({
        path: file.path,
        content: file.content,
        type: file.type
      })),
      chatTrace: generationResult.chatTrace || chatTrace,
      previewCode: generationResult.previewCode,
      message: `Successfully generated ${generationResult.files.length} files`
    });

  } catch (error) {
    console.error('Backend generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process generation request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function generateBasicFiles(prompt: string, framework: string, styling: string, features: string[]): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  
  // Generate package.json
  files.push({
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
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18"
    ${styling === 'tailwind' ? ',\n    "tailwindcss": "^3.3.0",\n    "autoprefixer": "^10.0.1",\n    "postcss": "^8"' : ''}
    ${features.includes('auth') ? ',\n    "next-auth": "^4.24.0"' : ''}
    ${features.includes('payments') ? ',\n    "stripe": "^14.0.0"' : ''}
    ${features.includes('database') ? ',\n    "prisma": "^5.0.0",\n    "@prisma/client": "^5.0.0"' : ''}
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.0.0"
  }
}`,
    type: 'config'
  });

  // Generate main page
  files.push({
    path: 'src/app/page.tsx',
    content: `import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8">
          Welcome to Your App
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Generated with ${framework} and ${styling}
        </p>
        <p className="text-lg text-gray-400 mb-8">
          {prompt}
        </p>
        <button
          onClick={() => setCount(count + 1)}
          className="bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Count: {count}
        </button>
      </div>
    </div>
  );
}`,
    type: 'page'
  });

  // Generate layout
  files.push({
    path: 'src/app/layout.tsx',
    content: `import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vera Generated App',
  description: 'Generated with VERA AI',
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
    type: 'layout'
  });

  // Generate CSS
  if (styling === 'tailwind') {
    files.push({
      path: 'src/app/globals.css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 255, 255, 255;
  --background-start-rgb: 0, 0, 0;
  --background-end-rgb: 0, 0, 0;
}

body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-start-rgb));
}`,
      type: 'css'
    });

    files.push({
      path: 'tailwind.config.ts',
      content: `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;`,
      type: 'config'
    });
  } else {
    files.push({
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
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

a {
  color: inherit;
  text-decoration: none;
}`,
      type: 'css'
    });
  }

  return files;
}

function generateFrontendFiles(prompt: string, framework: string, styling: string, features: string[]): GeneratedFile[] {
  const files: GeneratedFile[] = [];

  // Generate components based on features
  if (features.includes('auth')) {
    files.push({
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
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
    >
      {isLoggedIn ? 'Logout' : 'Login'}
    </button>
  );
}`,
      type: 'component'
    });
  }

  if (features.includes('payments')) {
    files.push({
      path: 'src/components/PaymentForm.tsx',
      content: `'use client';

import { useState } from 'react';

export function PaymentForm() {
  const [amount, setAmount] = useState('');

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Payment logic would go here
    console.log('Processing payment for:', amount);
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter amount"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Pay Now
      </button>
    </form>
  );
}`,
      type: 'component'
    });
  }

  return files;
}

function generatePreviewCode(prompt: string, framework: string, styling: string, features: string[]): string {
  return `// Generated App Preview
// Based on: ${prompt}
// Framework: ${framework}
// Styling: ${styling}
// Features: ${features.join(', ')}

import { useState } from 'react';

export default function AppPreview() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8">
          Your Generated App
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Built with ${framework} and ${styling}
        </p>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl">
          ${prompt}
        </p>
        <div className="space-y-4">
          <button
            onClick={() => setCount(count + 1)}
            className="bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Count: {count}
          </button>
          ${features.includes('auth') ? `
          <div className="mt-4">
            <AuthButton />
          </div>` : ''}
          ${features.includes('payments') ? `
          <div className="mt-4">
            <PaymentForm />
          </div>` : ''}
        </div>
      </div>
    </div>
  );
}`;
} 