"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Code, 
  Play, 
  ExternalLink, 
  Share2, 
  Zap, 
  Send, 
  Bot,
  Settings,
  Palette,
  FileText,
  Layers,
  Database,
  CreditCard,
  Users,
  Bell,
  Search,
  X,
  CheckCircle,
  Loader2,
  Command,
  Plus,
  Download,
  Globe,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Clock,
  Terminal,
  GitBranch,
  Package,
  ChevronRight,
  ChevronLeft,
  Wand2,
  Cpu,
  Rocket
} from "lucide-react";
import MonacoEditor from "../../components/studio/monaco-editor";
import { AIGenerator, GeneratedApp, TechStack } from "../../lib/ai-generator";

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface File {
  name: string;
  path: string;
  content: string;
  language: string;
}

interface AppConfig {
  prompt: string;
  framework: string;
  includeAuth: boolean;
  useTypeScript: boolean;
  useTailwind: boolean;
  responsive: boolean;
  adminPanel: boolean;
  includePayments: boolean;
  includeDatabase: boolean;
  includeNotifications: boolean;
  includeSearch: boolean;
  includeUserManagement: boolean;
  includeAPI: boolean;
}

// Typing animation component
const TypingAnimation = () => (
  <div className="flex items-center gap-1">
    <div className="w-2 h-2 bg-[rgb(179,194,203)] rounded-full animate-bounce" style={{ animationDelay: '0ms' } as React.CSSProperties}></div>
    <div className="w-2 h-2 bg-[rgb(179,194,203)] rounded-full animate-bounce" style={{ animationDelay: '150ms' } as React.CSSProperties}></div>
    <div className="w-2 h-2 bg-[rgb(179,194,203)] rounded-full animate-bounce" style={{ animationDelay: '300ms' } as React.CSSProperties}></div>
  </div>
);

// Loading shimmer component
const LoadingShimmer = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-slate-800 rounded mb-2"></div>
    <div className="h-4 bg-slate-800 rounded mb-2 w-3/4"></div>
    <div className="h-4 bg-slate-800 rounded mb-2 w-1/2"></div>
    <div className="h-4 bg-slate-800 rounded mb-2 w-5/6"></div>
    <div className="h-4 bg-slate-800 rounded mb-2 w-2/3"></div>
  </div>
);

export default function StudioPage() {
  const searchParams = useSearchParams();
  const aiGenerator = AIGenerator.getInstance();
  
  // Get configuration from URL parameters
  const config: AppConfig = {
    prompt: searchParams.get('prompt') || "",
    framework: searchParams.get('framework') || "Next.js",
    includeAuth: searchParams.get('auth') === 'true',
    useTypeScript: searchParams.get('typescript') === 'true',
    useTailwind: searchParams.get('tailwind') === 'true',
    responsive: searchParams.get('responsive') === 'true',
    adminPanel: searchParams.get('admin') === 'true',
    includePayments: searchParams.get('payments') === 'true',
    includeDatabase: searchParams.get('database') === 'true',
    includeNotifications: searchParams.get('notifications') === 'true',
    includeSearch: searchParams.get('search') === 'true',
    includeUserManagement: searchParams.get('userManagement') === 'true',
    includeAPI: searchParams.get('api') === 'true'
  };
  
  const [selectedFile, setSelectedFile] = useState('/src/app/page.tsx');
  const [appName, setAppName] = useState("My App");
  const [isEditingAppName, setIsEditingAppName] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);
  const [showBuildLog, setShowBuildLog] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [generatedApp, setGeneratedApp] = useState<GeneratedApp | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const initializationRef = useRef(false);

  // Initialize with configuration and generated data
  useEffect(() => {
    if (config.prompt && !initializationRef.current) {
      initializeApp();
    }
  }, [config.prompt, searchParams]);

  const initializeApp = async () => {
    if (initializationRef.current) return;
    
    initializationRef.current = true;
    setIsGenerating(true);
    
    // Add initial message
    const initialMessage: ChatMessage = {
      id: 'initial',
      type: 'ai',
      content: `🎯 Starting VERA AI generation for: "${config.prompt}"`,
      timestamp: new Date()
    };
    setChatMessages([initialMessage]);

    try {
      // Convert config to tech stack
      const techStack: Partial<TechStack> = {
        framework: config.framework as any,
        styling: config.useTailwind ? 'Tailwind CSS' : 'CSS Modules',
        auth: config.includeAuth ? 'NextAuth.js' : 'None',
        payments: config.includePayments ? 'Stripe' : 'None',
        database: config.includeDatabase ? 'Prisma + PostgreSQL' : 'SQLite'
      };

      // Generate the app
      const app = await aiGenerator.generateApp(config.prompt, techStack);
      setGeneratedApp(app);
      setAppName(app.name);

      // Convert generated files to our File format
      const convertedFiles: File[] = app.files.map(file => ({
        name: file.path.split('/').pop() || file.path,
        path: file.path,
        content: file.content,
        language: file.language
      }));
      setFiles(convertedFiles);

      // Set initial selected file
      if (convertedFiles.length > 0) {
        const mainFile = convertedFiles.find(f => f.path.includes('page.tsx') || f.path.includes('App.tsx') || f.path.includes('index.tsx'));
        setSelectedFile(mainFile?.path || convertedFiles[0].path);
      }

      // Add chat trace messages with delays
      app.chatTrace.forEach((message, index) => {
        setTimeout(() => {
          setChatMessages(prev => [...prev, {
            id: `trace-${index}`,
            type: 'ai',
            content: message,
            timestamp: new Date()
          }]);
          setCurrentStep(index + 1);
        }, (index + 1) * 1500);
      });

      // Complete the generation
      setTimeout(() => {
        setPreviewLoading(false);
        setChatMessages(prev => [...prev, {
          id: 'complete',
          type: 'ai',
          content: '🎉 App generation completed! Your full-stack application is ready to use.',
          timestamp: new Date()
        }]);
        setIsGenerating(false);
        setCurrentStep(app.chatTrace.length);
      }, (app.chatTrace.length + 1) * 1500);

    } catch (error) {
      console.error('Generation error:', error);
      setChatMessages(prev => [...prev, {
        id: 'error',
        type: 'ai',
        content: '❌ Sorry, there was an error generating your app. Please try again.',
        timestamp: new Date()
      }]);
      setIsGenerating(false);
    }
  };

  const getLanguageFromPath = (path: string): string => {
    if (path.endsWith('.tsx') || path.endsWith('.ts')) return 'typescript';
    if (path.endsWith('.jsx') || path.endsWith('.js')) return 'javascript';
    if (path.endsWith('.css')) return 'css';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.md')) return 'markdown';
    if (path.endsWith('.html')) return 'html';
    if (path.endsWith('.prisma')) return 'prisma';
    return 'typescript';
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // TODO: Open command palette
      }
      
      // Escape to blur inputs
      if (e.key === 'Escape') {
        setIsEditingAppName(false);
        textareaRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentFile = files.find(f => f.path === selectedFile);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isGenerating) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I'll help you modify your app! Let me update the code to ${newMessage.toLowerCase()}.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleRefreshPreview = () => {
    setPreviewLoading(true);
    setPreviewError(false);
    setTimeout(() => {
      setPreviewLoading(false);
    }, 2000);
  };

  const handleDeploy = () => {
    // TODO: Implement deployment logic
    console.log('Deploying app...');
  };

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Modern background with subtle gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,rgba(179,194,203,0.02),transparent_50%)]"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(179,194,203,0.01),transparent_50%)]"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_100%,rgba(179,194,203,0.005),transparent_50%)]"></div>
      </div>
      
      {/* Sticky Header */}
      <header className="relative mx-auto flex w-full shrink-0 items-center justify-between py-6 px-8 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[rgb(179,194,203)] to-white text-slate-950 font-black text-2xl tracking-tight shadow-lg shadow-[rgb(179,194,203)]/10">
            V
          </div>
          <div className="text-3xl font-black text-[rgb(179,194,203)] tracking-tight">
            VERA <span className="bg-gradient-to-r from-white to-[rgb(179,194,203)] bg-clip-text text-transparent">AI</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* App Name */}
          <div className="flex items-center gap-3">
            {isEditingAppName ? (
              <input
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                onBlur={() => setIsEditingAppName(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingAppName(false)}
                className="text-xl font-light text-[rgb(179,194,203)] bg-transparent border-none outline-none px-3 py-2 rounded"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingAppName(true)}
                className="text-xl font-light text-[rgb(179,194,203)] hover:text-white transition-colors px-3 py-2 rounded hover:bg-white/5"
              >
                {appName}
              </button>
            )}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-green-300 font-light">Live</span>
          </div>

          {/* Action Buttons */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm border border-slate-700 text-[rgb(179,194,203)] hover:text-white hover:bg-white/10 transition-all duration-200 font-light">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button 
            onClick={handleDeploy}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-[rgb(179,194,203)] to-white text-slate-950 font-light hover:from-white hover:to-[rgb(179,194,203)] transition-all shadow-lg shadow-[rgb(179,194,203)]/10"
          >
            <Rocket className="h-4 w-4" />
            Deploy
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-88px)]">
        {/* Left Panel - AI Chat & Instructions */}
        <motion.div 
          className={`${sidebarCollapsed ? 'w-16' : 'w-80'} border-r border-slate-800 bg-slate-950/50 backdrop-blur-sm transition-all duration-300`}
          initial={{ x: -320 }}
          animate={{ x: 0 }}
        >
          <div className="h-full flex flex-col">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[rgb(179,194,203)] to-white flex items-center justify-center">
                  <Bot className="h-5 w-5 text-slate-950" />
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <h2 className="text-lg font-light text-[rgb(179,194,203)]">AI Assistant</h2>
                    <p className="text-sm text-slate-400 font-extralight">Building your app</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 rounded hover:bg-white/10 transition-colors"
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4 text-slate-400" /> : <ChevronLeft className="h-4 w-4 text-slate-400" />}
              </button>
            </div>

            {!sidebarCollapsed && (
              <>
                {/* Generation Progress */}
                {isGenerating && (
                  <div className="p-6 border-b border-slate-800">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-light text-[rgb(179,194,203)]">Building Progress</span>
                        <span className="text-xs text-slate-400">{currentStep}/5</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <motion.div 
                          className="bg-gradient-to-r from-[rgb(179,194,203)] to-white h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${(currentStep / 5) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Wand2 className="h-3 w-3" />
                        <span>AI is crafting your application...</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chat Messages */}
                <div className="flex-1 p-6 overflow-y-auto">
                  <AnimatePresence>
                    <div className="space-y-4">
                      {chatMessages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}
                        >
                          {message.type === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[rgb(179,194,203)] to-white flex items-center justify-center flex-shrink-0">
                              <Bot className="h-4 w-4 text-slate-950" />
                            </div>
                          )}
                          <div className={`max-w-[85%] rounded-lg p-4 text-sm font-light ${
                            message.type === 'user' 
                              ? 'bg-[rgb(179,194,203)] text-slate-950' 
                              : 'bg-slate-900/50 text-[rgb(179,194,203)]'
                          }`}>
                            {message.isTyping ? <TypingAnimation /> : message.content}
                          </div>
                          {message.type === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-xs font-light">U</span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                </div>

                {/* Chat Input */}
                <div className="p-6 border-t border-slate-800">
                  <form onSubmit={handleChatSubmit} className="space-y-4">
                    <textarea
                      ref={textareaRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Ask me to modify your app..."
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[rgb(179,194,203)]/50 text-[rgb(179,194,203)] placeholder-slate-400 font-light"
                      rows={2}
                      disabled={isGenerating}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-extralight">Press Enter to send</span>
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || isGenerating}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-[rgb(179,194,203)] hover:bg-white text-slate-950 disabled:bg-slate-800 disabled:text-slate-500 font-light"
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Center Panel - Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[rgb(179,194,203)] to-white flex items-center justify-center">
                <Code className="h-5 w-5 text-slate-950" />
              </div>
              <div>
                <h2 className="text-lg font-light text-[rgb(179,194,203)]">Code Editor</h2>
                <p className="text-sm text-slate-400 font-extralight">Live AI Build Environment</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 text-[rgb(179,194,203)] hover:text-white transition-colors text-sm font-light">
                <GitBranch className="h-4 w-4" />
                Git
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 text-[rgb(179,194,203)] hover:text-white transition-colors text-sm font-light">
                <Package className="h-4 w-4" />
                Dependencies
              </button>
            </div>
          </div>

          {/* File Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950/30 overflow-x-auto">
            {files.map((file) => (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file.path)}
                className={`px-6 py-3 text-sm font-light transition-colors flex items-center gap-2 flex-shrink-0 ${
                  selectedFile === file.path
                    ? 'text-[rgb(179,194,203)] bg-slate-900/50 border-b-2 border-[rgb(179,194,203)]'
                    : 'text-slate-400 hover:text-[rgb(179,194,203)] hover:bg-slate-900/30'
                }`}
              >
                <FileText className="h-4 w-4" />
                {file.name}
              </button>
            ))}
          </div>

          {/* Editor Content */}
          <div className="flex-1 p-6">
            <div className="h-full bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
              {currentFile && (
                <MonacoEditor
                  value={currentFile.content}
                  onChange={(value: string) => {
                    // Update file content
                    const updatedFiles = files.map(f => 
                      f.path === currentFile.path ? { ...f, content: value } : f
                    );
                    setFiles(updatedFiles);
                  }}
                  language={currentFile.language}
                  theme="vs-dark"
                  path={currentFile.path}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - App Preview */}
        <div className="w-1/2 bg-slate-950/30 backdrop-blur-sm">
          <div className="h-full flex flex-col">
            {/* Preview Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/30">
              <div className="flex items-center gap-3">
                <ExternalLink className="h-5 w-5 text-green-400" />
                <span className="font-light text-[rgb(179,194,203)]">Live Preview</span>
                {previewLoading && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-[rgb(179,194,203)] rounded-full animate-bounce" style={{ animationDelay: '0ms' } as React.CSSProperties}></div>
                    <div className="w-2 h-2 bg-[rgb(179,194,203)] rounded-full animate-bounce" style={{ animationDelay: '150ms' } as React.CSSProperties}></div>
                    <div className="w-2 h-2 bg-[rgb(179,194,203)] rounded-full animate-bounce" style={{ animationDelay: '300ms' } as React.CSSProperties}></div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleRefreshPreview}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 text-[rgb(179,194,203)] hover:text-white transition-colors text-sm font-light"
                >
                  <Zap className="h-4 w-4" />
                  Refresh
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/50 hover:bg-slate-800/50 text-[rgb(179,194,203)] hover:text-white transition-colors text-sm font-light">
                  <Eye className="h-4 w-4" />
                  Toggle
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 p-6">
              <AnimatePresence mode="wait">
                {previewLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full bg-slate-900/50 rounded-lg border border-slate-700 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[rgb(179,194,203)] to-white flex items-center justify-center"
                      >
                        <Sparkles className="h-8 w-8 text-slate-950" />
                      </motion.div>
                      <h3 className="text-xl font-light text-[rgb(179,194,203)] mb-2">Loading Preview...</h3>
                      <p className="text-slate-400 mb-4 font-extralight">Setting up your app environment</p>
                      <LoadingShimmer />
                    </div>
                  </motion.div>
                ) : previewError ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full bg-slate-900/50 rounded-lg border border-slate-700 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                        <X className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-light text-[rgb(179,194,203)] mb-2">Preview Error</h3>
                      <p className="text-slate-400 mb-4 font-extralight">Something went wrong loading the preview</p>
                      <button
                        onClick={handleRefreshPreview}
                        className="bg-[rgb(179,194,203)] hover:bg-white text-slate-950 px-6 py-3 rounded-lg transition-colors font-light"
                      >
                        Try Again
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full bg-white rounded-lg shadow-2xl border border-slate-200/20 overflow-hidden"
                  >
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-100">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-950 to-slate-800 flex items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-[rgb(179,194,203)]" />
                        </div>
                        <h3 className="text-2xl font-light text-slate-800 mb-2">Welcome to {appName}</h3>
                        <p className="text-slate-600 mb-4 font-extralight">Built with {config.framework}{config.useTypeScript ? ', TypeScript' : ''}{config.useTailwind ? ', and Tailwind CSS' : ''}</p>
                        <p className="text-slate-500 mb-4 font-extralight max-w-md">{config.prompt}</p>
                        <button className="bg-slate-950 hover:bg-slate-800 text-[rgb(179,194,203)] px-6 py-3 rounded-lg font-light transition-colors">
                          Count: 0
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Build Log Toggle Button */}
      <button
        onClick={() => setShowBuildLog(!showBuildLog)}
        className="fixed bottom-6 left-6 p-4 rounded-lg bg-slate-950/80 backdrop-blur-xl border border-slate-700 text-[rgb(179,194,203)] hover:bg-slate-900/80 transition-all shadow-lg"
      >
        <Terminal className="h-5 w-5" />
      </button>

      {/* Build Log Panel */}
      <AnimatePresence>
        {showBuildLog && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 h-64 bg-slate-950/95 backdrop-blur-xl border-t border-slate-700 shadow-2xl"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <div className="flex items-center gap-3">
                  <Terminal className="h-5 w-5 text-green-400" />
                  <span className="font-light text-[rgb(179,194,203)]">Build Log</span>
                </div>
                <button
                  onClick={() => setShowBuildLog(false)}
                  className="p-2 rounded hover:bg-white/10 transition-colors"
                >
                  <X className="h-4 w-4 text-slate-400" />
                </button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-2 text-sm font-mono font-light">
                  <div className="text-green-400">✓ Initializing workspace...</div>
                  <div className="text-green-400">✓ Installing dependencies...</div>
                  <div className="text-green-400">✓ Building application...</div>
                  <div className="text-blue-400">→ Starting development server...</div>
                  <div className="text-green-400">✓ Server running on http://localhost:3000</div>
                  <div className="text-slate-400">Ready for development!</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-6 right-6 text-xs text-slate-400 bg-slate-950/80 backdrop-blur-xl border border-slate-700 px-4 py-2 rounded-lg font-extralight">
        Press <kbd className="px-2 py-1 bg-slate-800 rounded text-[rgb(179,194,203)]">⌘</kbd> + <kbd className="px-2 py-1 bg-slate-800 rounded text-[rgb(179,194,203)]">K</kbd> for commands
      </div>
    </div>
  );
} 