"use client";

import { useRef } from "react";
import Editor from "@monaco-editor/react";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  theme?: string;
  path?: string;
  readOnly?: boolean;
}

export default function MonacoEditor({
  value,
  onChange,
  language,
  theme = "vs-dark",
  path,
  readOnly = false,
}: MonacoEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    
    // Add custom theme for better syntax highlighting
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'function', foreground: 'DCDCAA' },
      ],
      colors: {
        'editor.background': '#0F0F23',
        'editor.foreground': '#CCCCCC',
        'editor.lineHighlightBackground': '#1E1E3F',
        'editor.selectionBackground': '#264F78',
        'editor.inactiveSelectionBackground': '#3A3D41',
      }
    });
  };

  const currentTheme = theme === 'vs-dark' ? 'custom-dark' : 'vs-light';

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        value={value}
        onChange={(value) => onChange(value || "")}
        theme={currentTheme}
        path={path}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: 'JetBrains Mono, Fira Code, Consolas, monospace',
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'always',
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          parameterHints: {
            enabled: true,
          },
          hover: {
            enabled: true,
          },
          contextmenu: true,
          mouseWheelZoom: true,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          renderWhitespace: 'selection',
          guides: {
            indentation: true,
            bracketPairs: true,
          },
          bracketPairColorization: {
            enabled: true,
          },
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
} 