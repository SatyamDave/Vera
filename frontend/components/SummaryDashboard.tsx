'use client';

import { useState, useEffect } from 'react';
import Spinner from './spinner';
import { toast } from 'sonner';

interface Blueprint {
  name: string;
  description: string;
  models: Array<{ name: string; fields: string[] }>;
  apis: Array<{ name: string; method: string; description: string }>;
  aiBlocks: Array<{ name: string; type: string; description: string }>;
  features: string[];
}

interface SummaryDashboardProps {
  blueprint?: Blueprint;
  lastGenerated?: string;
  onRegenerate?: () => void;
  onReset?: () => void;
}

export function SummaryDashboard({ 
  blueprint, 
  lastGenerated, 
  onRegenerate, 
  onReset 
}: SummaryDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegenerate = async () => {
    if (!onRegenerate) return;
    
    setIsLoading(true);
    try {
      await onRegenerate();
      toast.success('Application regenerated successfully!');
    } catch (error) {
      toast.error('Failed to regenerate application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (!onReset) return;
    
    if (confirm('Are you sure you want to reset the application? This will clear all generated files.')) {
      onReset();
      toast.success('Application reset successfully!');
    }
  };

  if (!blueprint) {
    return (
      <div className="w-full border rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Spinner className="h-4 w-4" />
          <h2 className="text-xl font-semibold">No Active Application</h2>
        </div>
        <p className="text-gray-600">
          Generate an application to see the dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Application Overview */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{blueprint.name}</h2>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
              onClick={handleRegenerate}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Regenerating...
                </>
              ) : (
                'Regenerate'
              )}
            </button>
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{blueprint.description}</p>
        
        {lastGenerated && (
          <div className="text-sm text-gray-500">
            Last generated: {new Date(lastGenerated).toLocaleString()}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Features</h3>
        <div className="flex flex-wrap gap-2">
          {blueprint.features.map((feature, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
              {feature}
            </span>
          ))}
        </div>
      </div>

      {/* Models */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Database Models</h3>
        <div className="space-y-4">
          {blueprint.models.map((model, index) => (
            <div key={index} className="border rounded-lg p-3">
              <h4 className="font-semibold mb-2">{model.name}</h4>
              <div className="flex flex-wrap gap-1">
                {model.fields.map((field, fieldIndex) => (
                  <span key={fieldIndex} className="px-2 py-1 text-xs border rounded">
                    {field}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* APIs */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
        <div className="space-y-3">
          {blueprint.apis.map((api, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{api.name}</div>
                <div className="text-sm text-gray-600">{api.description}</div>
              </div>
              <span className="px-2 py-1 text-xs border rounded">{api.method}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Blocks */}
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold mb-4">AI Integration</h3>
        <div className="space-y-3">
          {blueprint.aiBlocks.map((block, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{block.name}</div>
                <div className="text-sm text-gray-600">{block.description}</div>
              </div>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">{block.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 