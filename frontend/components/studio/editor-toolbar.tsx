"use client";

import { ArrowDownTrayIcon, PlayIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface EditorToolbarProps {
  selectedFile: string | null;
  onSave: () => void;
  isDarkMode: boolean;
}

export function EditorToolbar({ selectedFile, onSave, isDarkMode }: EditorToolbarProps) {
  return (
    <div className={`flex items-center justify-between p-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center space-x-4">
        <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {selectedFile ? `Editing: ${selectedFile}` : 'No file selected'}
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onSave}
          disabled={!selectedFile}
          className={`flex items-center gap-1 px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
            isDarkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Save
        </button>
        
        <button
          disabled={!selectedFile}
          className={`flex items-center gap-1 px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed ${
            isDarkMode 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          <PlayIcon className="h-4 w-4" />
          Run
        </button>
        
        <button
          className={`flex items-center gap-1 px-3 py-1 rounded text-sm ${
            isDarkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          <ArrowPathIcon className="h-4 w-4" />
          Reload
        </button>
      </div>
    </div>
  );
} 