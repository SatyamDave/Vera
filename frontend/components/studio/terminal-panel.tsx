"use client";

import { useState, useRef, useEffect } from "react";
import { CommandLineIcon } from "@heroicons/react/24/outline";

interface TerminalPanelProps {
  isDarkMode: boolean;
}

export function TerminalPanel({ isDarkMode }: TerminalPanelProps) {
  const [output, setOutput] = useState<string[]>([
    "VERA Studio Terminal v1.0.0",
    "Type 'help' for available commands",
    "",
  ]);
  const [input, setInput] = useState<string>("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const executeCommand = (cmd: string) => {
    const newOutput = [...output, `$ ${cmd}`];
    
    switch (cmd.toLowerCase().trim()) {
      case 'help':
        newOutput.push(
          "Available commands:",
          "  help     - Show this help message",
          "  clear    - Clear terminal output",
          "  status   - Show project status",
          "  build    - Build the project",
          "  dev      - Start development server",
          "  test     - Run tests",
          "  exit     - Close terminal",
          ""
        );
        break;
      
      case 'clear':
        setOutput([]);
        return;
      
      case 'status':
        newOutput.push(
          "Project Status:",
          "  Frontend: Running on http://localhost:3000",
          "  Backend:  Not running",
          "  Database: Connected",
          "  Files:    42 files in project",
          ""
        );
        break;
      
      case 'build':
        newOutput.push(
          "Building project...",
          "✓ Frontend build completed",
          "✓ Backend build completed",
          "✓ All builds successful",
          ""
        );
        break;
      
      case 'dev':
        newOutput.push(
          "Starting development servers...",
          "✓ Frontend server started on http://localhost:3000",
          "✓ Backend server started on http://localhost:3001",
          "✓ Development environment ready",
          ""
        );
        break;
      
      case 'test':
        newOutput.push(
          "Running tests...",
          "✓ 15 tests passed",
          "✓ 0 tests failed",
          "✓ Test coverage: 87%",
          ""
        );
        break;
      
      case 'exit':
        newOutput.push("Terminal closed");
        break;
      
      default:
        if (cmd.trim()) {
          newOutput.push(`Command not found: ${cmd}. Type 'help' for available commands.`, "");
        }
    }
    
    setOutput(newOutput);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    executeCommand(input);
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-900 text-green-400' : 'bg-gray-100 text-gray-800'}`}>
      <div className={`flex items-center gap-2 p-2 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-200'}`}>
        <CommandLineIcon className="h-4 w-4" />
        <span className="text-sm font-semibold">Terminal</span>
      </div>
      
      <div 
        ref={outputRef}
        className={`flex-1 overflow-y-auto p-2 font-mono text-sm ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
      >
        {output.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit} className={`p-2 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-200'}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`flex-1 bg-transparent outline-none text-sm ${isDarkMode ? 'text-green-400' : 'text-gray-800'}`}
            placeholder="Enter command..."
            autoFocus
          />
        </div>
      </form>
    </div>
  );
} 