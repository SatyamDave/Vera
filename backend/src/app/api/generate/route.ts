import { NextRequest, NextResponse } from 'next/server';
import { promptToBlueprint } from '../../../../generator/src/promptToBlueprint';
import { generateFiles } from '../../../../generator/src/generateFiles';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Convert prompt to blueprint
    const blueprint = promptToBlueprint(prompt);

    // Generate files from blueprint
    const generationResult = await generateFiles(blueprint);

    if (!generationResult.success) {
      return NextResponse.json(
        { 
          error: 'Failed to generate files',
          details: generationResult.errors
        },
        { status: 500 }
      );
    }

    // Return the generated blueprint and file information
    return NextResponse.json({
      success: true,
      blueprint: {
        name: blueprint.name,
        description: blueprint.description,
        models: blueprint.models,
        apis: blueprint.apis,
        aiBlocks: blueprint.aiBlocks,
        features: blueprint.features
      },
      files: generationResult.files.map(file => ({
        path: file.path,
        type: file.type
      })),
      message: `Successfully generated ${generationResult.files.length} files for ${blueprint.name}`
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