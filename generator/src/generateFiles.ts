import { execSync } from 'child_process';
import { ApplicationBlueprint, BlueprintModel, BlueprintAPI } from './promptToBlueprint';
import * as fs from 'fs';
import * as path from 'path';

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'model' | 'api' | 'component' | 'page';
}

export interface GenerationResult {
  success: boolean;
  files: GeneratedFile[];
  errors: string[];
  blueprint: ApplicationBlueprint;
}

export async function generateFiles(blueprint: ApplicationBlueprint, outputDir: string = '../backend'): Promise<GenerationResult> {
  const result: GenerationResult = {
    success: true,
    files: [],
    errors: [],
    blueprint
  };

  try {
    // Change to backend directory for Plop execution
    const originalCwd = process.cwd();
    const backendPath = path.resolve(outputDir);
    
    if (!fs.existsSync(backendPath)) {
      throw new Error(`Backend directory not found: ${backendPath}`);
    }

    process.chdir(backendPath);

    // Generate Prisma models
    for (const model of blueprint.models) {
      try {
        await generatePrismaModel(model);
        result.files.push({
          path: `prisma/models/${model.name}.prisma`,
          content: generatePrismaModelContent(model),
          type: 'model'
        });
      } catch (error) {
        result.errors.push(`Failed to generate model ${model.name}: ${error}`);
        result.success = false;
      }
    }

    // Generate tRPC API routes
    for (const api of blueprint.apis) {
      try {
        await generateAPIRoute(api);
        result.files.push({
          path: `src/server/api/routers/${api.name}.ts`,
          content: generateAPIContent(api),
          type: 'api'
        });
      } catch (error) {
        result.errors.push(`Failed to generate API ${api.name}: ${error}`);
        result.success = false;
      }
    }

    // Generate AI integration files
    for (const aiBlock of blueprint.aiBlocks) {
      try {
        const aiFile = generateAIIntegration(aiBlock);
        result.files.push(aiFile);
      } catch (error) {
        result.errors.push(`Failed to generate AI block ${aiBlock.name}: ${error}`);
        result.success = false;
      }
    }

    // Update root router
    try {
      updateRootRouter(blueprint.apis);
    } catch (error) {
      result.errors.push(`Failed to update root router: ${error}`);
      result.success = false;
    }

    process.chdir(originalCwd);

  } catch (error) {
    result.errors.push(`Generation failed: ${error}`);
    result.success = false;
  }

  return result;
}

async function generatePrismaModel(model: BlueprintModel): Promise<void> {
  const fields = model.fields.join(', ');
  
  try {
    execSync(`npx plop model --name ${model.name} --fields "${fields}"`, {
      stdio: 'pipe'
    });
  } catch (error) {
    // If Plop fails, create the model manually
    const modelContent = generatePrismaModelContent(model);
    const modelPath = `prisma/models/${model.name}.prisma`;
    
    // Ensure directory exists
    const dir = path.dirname(modelPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(modelPath, modelContent);
  }
}

function generatePrismaModelContent(model: BlueprintModel): string {
  const fields = model.fields.map(field => {
    if (field === 'id') return 'id String @id @default(cuid())';
    if (field === 'createdAt') return 'createdAt DateTime @default(now())';
    if (field === 'updatedAt') return 'updatedAt DateTime @updatedAt';
    if (field.endsWith('Id')) {
      const relationName = field.replace('Id', '');
      return `${field} String\n    ${relationName} ${relationName.charAt(0).toUpperCase() + relationName.slice(1)} @relation(fields: [${field}], references: [id])`;
    }
    if (field === 'title' || field === 'name') return `${field} String`;
    if (field === 'content' || field === 'description') return `${field} String`;
    if (field === 'email') return `${field} String @unique`;
    if (field === 'price') return `${field} Float`;
    if (field === 'stock') return `${field} Int`;
    if (field === 'status') return `${field} String`;
    if (field === 'tags') return `${field} String[]`;
    if (field === 'images') return `${field} String[]`;
    if (field === 'metadata') return `${field} Json`;
    return `${field} String`;
  }).join('\n    ');

  return `model ${model.name} {
    ${fields}
}`;
}

async function generateAPIRoute(api: BlueprintAPI): Promise<void> {
  try {
    execSync(`npx plop api --name ${api.name} --description "${api.description}"`, {
      stdio: 'pipe'
    });
  } catch (error) {
    // If Plop fails, create the API manually
    const apiContent = generateAPIContent(api);
    const apiPath = `src/server/api/routers/${api.name}.ts`;
    
    // Ensure directory exists
    const dir = path.dirname(apiPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(apiPath, apiContent);
  }
}

function generateAPIContent(api: BlueprintAPI): string {
  const method = api.method.toLowerCase();
  const isGet = method === 'get';
  const isPost = method === 'post';
  const isPut = method === 'put';
  const isDelete = method === 'delete';

  return `import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";

export const ${api.name}Router = createTRPCRouter({
  ${method}: ${isGet ? 'publicProcedure' : 'protectedProcedure'}(
    ${isGet ? '' : 'z.object({\n      // Add your input validation here\n    }),'}
  ).${isGet ? 'query' : 'mutation'}(async ({ ctx, input }) => {
    // TODO: Implement ${api.description}
    return {
      success: true,
      message: "${api.description}",
      data: null
    };
  }),
});
`;
}

function generateAIIntegration(aiBlock: any): GeneratedFile {
  const content = `import { openai } from 'openai';
import { together } from 'together-ai';

export class ${aiBlock.name.charAt(0).toUpperCase() + aiBlock.name.slice(1)}Service {
  private model = 'gpt-4';
  
  async process(input: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant specialized in ${aiBlock.description}.'
          },
          {
            role: 'user',
            content: input
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      return response.choices[0]?.message?.content || 'No response generated';
    } catch (error) {
      console.error('AI processing error:', error);
      throw new Error('Failed to process with AI');
    }
  }
}

export const ${aiBlock.name}Service = new ${aiBlock.name.charAt(0).toUpperCase() + aiBlock.name.slice(1)}Service();
`;

  return {
    path: `src/server/ai/${aiBlock.name}.ts`,
    content,
    type: 'api'
  };
}

function updateRootRouter(apis: BlueprintAPI[]): void {
  const rootRouterPath = 'src/server/api/root.ts';
  
  if (!fs.existsSync(rootRouterPath)) {
    throw new Error('Root router not found');
  }

  let content = fs.readFileSync(rootRouterPath, 'utf-8');
  
  // Add imports
  const imports = apis.map(api => `import { ${api.name}Router } from "~/server/api/routers/${api.name}";`).join('\n');
  
  // Add to router
  const routerEntries = apis.map(api => `    ${api.name}: ${api.name}Router,`).join('\n');
  
  // Update the file
  content = content.replace(
    /(\/\/ Add new routers here)/,
    `$1\n${imports}`
  );
  
  content = content.replace(
    /(appRouter: createTRPCRouter\({)/,
    `$1\n${routerEntries}`
  );
  
  fs.writeFileSync(rootRouterPath, content);
}

export function generateFrontendFiles(blueprint: ApplicationBlueprint): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  
  // Generate main page
  files.push({
    path: 'src/app/page.tsx',
    content: generateMainPageContent(blueprint),
    type: 'page'
  });
  
  // Generate components
  for (const model of blueprint.models) {
    files.push({
      path: `src/components/${model.name}List.tsx`,
      content: generateComponentContent(model),
      type: 'component'
    });
  }
  
  return files;
}

function generateMainPageContent(blueprint: ApplicationBlueprint): string {
  return `import { ${blueprint.models.map(m => m.name).join(', ')} } from '~/components';

export default function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">${blueprint.name}</h1>
      <p className="text-gray-600 mb-8">${blueprint.description}</p>
      
      <div className="grid gap-6">
        ${blueprint.models.map(model => `
        <section>
          <h2 className="text-xl font-semibold mb-4">${model.name}s</h2>
          <${model.name}List />
        </section>
        `).join('')}
      </div>
    </div>
  );
}`;
}

function generateComponentContent(model: BlueprintModel): string {
  return `import { useState, useEffect } from 'react';
import { api } from '~/utils/api';

export function ${model.name}List() {
  const { data: ${model.name.toLowerCase()}s, isLoading, error } = api.${model.name.toLowerCase()}.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      {${model.name.toLowerCase()}s?.map((${model.name.toLowerCase()}) => (
        <div key={${model.name.toLowerCase()}.id} className="border rounded-lg p-4">
          <h3 className="font-semibold">${model.name.toLowerCase()}.title || ${model.name.toLowerCase()}.name}</h3>
          <p className="text-gray-600">${model.name.toLowerCase()}.description || ${model.name.toLowerCase()}.content}</p>
        </div>
      ))}
    </div>
  );
}`;
} 