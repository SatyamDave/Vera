'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Spinner } from './spinner';
import { toast } from 'sonner';

interface GenerateButtonProps {
  prompt: string;
  onGenerationComplete?: (result: any) => void;
  disabled?: boolean;
}

export function GenerateButton({ prompt, onGenerationComplete, disabled }: GenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Generation failed');
      }

      toast.success(result.message || 'Application generated successfully!');
      
      if (onGenerationComplete) {
        onGenerationComplete(result);
      }

    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate application');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={disabled || isGenerating || !prompt.trim()}
      className="w-full sm:w-auto"
    >
      {isGenerating ? (
        <>
          <Spinner className="mr-2 h-4 w-4" />
          Generating...
        </>
      ) : (
        <>
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Generate App
        </>
      )}
    </Button>
  );
} 