import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  prompt: string;
  framework: string;
  styling: string;
  features: string[];
  assetUpload?: File | null;
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, framework, styling, features, assetUpload } = await request.json() as GenerateRequest;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Construct a comprehensive system prompt for LLaMA
    const systemPrompt = `Generate a full-stack web app using ${framework}, ${styling}, and the following features: ${features.join(', ')}. 
    
    Requirements:
    - Framework: ${framework}
    - Styling: ${styling}
    - Features: ${features.join(', ')}
    - User request: ${prompt}
    
    Generate a complete application with:
    1. All necessary files and folder structure
    2. Proper imports and dependencies
    3. Working components and pages
    4. Database models if needed
    5. API routes if needed
    6. Authentication setup if requested
    7. Payment integration if requested
    8. Responsive design if requested
    
    Return the response as a JSON object with:
    {
      "files": [
        {
          "path": "string",
          "content": "string"
        }
      ],
      "chatTrace": [
        "string" // Array of assistant messages showing the generation process
      ],
      "previewCode": "string" // Optional preview code for the app
    }`;

    // Send to backend for processing
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        prompt: systemPrompt,
        framework,
        styling,
        features,
        assetUpload
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const result = await response.json();

    // Transform the backend response to match our expected format
    const transformedResult = {
      files: result.files || [],
      chatTrace: [
        `Starting generation for: ${prompt}`,
        `Framework: ${framework}`,
        `Styling: ${styling}`,
        `Features: ${features.join(', ')}`,
        `Generated ${result.files?.length || 0} files successfully`,
        'Your app is ready! You can now view and edit the code in the studio.'
      ],
      previewCode: result.blueprint ? `// Generated app based on: ${prompt}\n// Framework: ${framework}\n// Features: ${features.join(', ')}` : undefined
    };

    return NextResponse.json({
      success: true,
      data: transformedResult,
    });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate application',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 