"use client";

import { useState } from "react";
import { ChevronRightIcon, ChevronDownIcon, FolderIcon, DocumentIcon } from "@heroicons/react/24/outline";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  children?: FileNode[];
}

interface FileTreeProps {
  files: FileNode[];
  onFileSelect: (filePath: string) => void;
  selectedFile: string | null;
  isDarkMode: boolean;
}

export function FileTree({ files, onFileSelect, selectedFile, isDarkMode }: FileTreeProps) {
  return (
    <div className={`h-full overflow-y-auto ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
      <div className="p-4">
        <h3 className="text-sm font-semibold mb-2">Project Files</h3>
        <div className="space-y-1">
          {files.map((file) => (
            <FileTreeNode
              key={file.path}
              file={file}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface FileTreeNodeProps {
  file: FileNode;
  onFileSelect: (filePath: string) => void;
  selectedFile: string | null;
  isDarkMode: boolean;
  level?: number;
}

function FileTreeNode({ file, onFileSelect, selectedFile, isDarkMode, level = 0 }: FileTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const isSelected = selectedFile === file.path;

  const handleClick = () => {
    if (file.type === "directory") {
      setIsExpanded(!isExpanded);
    } else {
      onFileSelect(file.path);
    }
  };

  return (
    <div>
      <div
        onClick={handleClick}
        className={`flex items-center gap-1 px-2 py-1 rounded cursor-pointer text-sm hover:bg-opacity-50 ${
          isSelected
            ? isDarkMode
              ? 'bg-blue-600 bg-opacity-20 text-blue-300'
              : 'bg-blue-100 text-blue-700'
            : isDarkMode
            ? 'hover:bg-gray-700'
            : 'hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {file.type === "directory" ? (
          <>
            {isExpanded ? (
              <ChevronDownIcon className="h-3 w-3 flex-shrink-0" />
            ) : (
              <ChevronRightIcon className="h-3 w-3 flex-shrink-0" />
            )}
            <FolderIcon className="h-4 w-4 flex-shrink-0 text-yellow-500" />
          </>
        ) : (
          <DocumentIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
        )}
        <span className="truncate">{file.name}</span>
      </div>
      
      {file.type === "directory" && isExpanded && file.children && (
        <div className="space-y-1">
          {file.children.map((child) => (
            <FileTreeNode
              key={child.path}
              file={child}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
              isDarkMode={isDarkMode}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
} 