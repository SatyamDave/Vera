"use client";

import { useState, useEffect } from "react";

interface PreviewPanelProps {
  filePath: string | null;
  content: string;
  isDarkMode: boolean;
}

export function PreviewPanel({ filePath, content, isDarkMode }: PreviewPanelProps) {
  const [previewContent, setPreviewContent] = useState<string>("");

  useEffect(() => {
    if (!filePath || !content) {
      setPreviewContent("");
      return;
    }

    // Generate preview based on file type
    const fileExt = filePath.split('.').pop()?.toLowerCase();
    
    switch (fileExt) {
      case 'tsx':
      case 'jsx':
        // For React components, show a basic preview
        setPreviewContent(`
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h3>Preview: ${filePath}</h3>
            <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0; background: #f9f9f9;">
              <p><strong>Component Preview:</strong></p>
              <p>This would render the actual React component.</p>
            </div>
            <details>
              <summary>Code Preview</summary>
              <pre style="background: #f4f4f4; padding: 10px; overflow-x: auto; font-size: 12px;">
                ${content.substring(0, 500)}${content.length > 500 ? '...' : ''}
              </pre>
            </details>
          </div>
        `);
        break;
      
      case 'css':
        setPreviewContent(`
          <div style="padding: 20px;">
            <h3>CSS Preview: ${filePath}</h3>
            <div style="border: 1px solid #ccc; padding: 10px; margin: 10px 0;">
              <p><strong>Styles would be applied here:</strong></p>
              <div style="padding: 10px; background: #f9f9f9;">
                <p>Sample styled content</p>
              </div>
            </div>
            <pre style="background: #f4f4f4; padding: 10px; overflow-x: auto; font-size: 12px;">
              ${content.substring(0, 300)}${content.length > 300 ? '...' : ''}
            </pre>
          </div>
        `);
        break;
      
      case 'json':
        try {
          const parsed = JSON.parse(content);
          setPreviewContent(`
            <div style="padding: 20px;">
              <h3>JSON Preview: ${filePath}</h3>
              <pre style="background: #f4f4f4; padding: 10px; overflow-x: auto; font-size: 12px;">
                ${JSON.stringify(parsed, null, 2)}
              </pre>
            </div>
          `);
        } catch {
          setPreviewContent(`
            <div style="padding: 20px;">
              <h3>JSON Preview: ${filePath}</h3>
              <p style="color: red;">Invalid JSON</p>
              <pre style="background: #f4f4f4; padding: 10px; overflow-x: auto; font-size: 12px;">
                ${content}
              </pre>
            </div>
          `);
        }
        break;
      
      default:
        setPreviewContent(`
          <div style="padding: 20px;">
            <h3>File Preview: ${filePath}</h3>
            <pre style="background: #f4f4f4; padding: 10px; overflow-x: auto; font-size: 12px; max-height: 400px;">
              ${content}
            </pre>
          </div>
        `);
    }
  }, [filePath, content]);

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className={`p-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <h3 className="text-sm font-semibold">Preview</h3>
      </div>
      
      <div className="flex-1 overflow-auto">
        {filePath ? (
          <div 
            className="h-full"
            dangerouslySetInnerHTML={{ __html: previewContent }}
          />
        ) : (
          <div className={`flex items-center justify-center h-full ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Select a file to see preview
          </div>
        )}
      </div>
    </div>
  );
} 