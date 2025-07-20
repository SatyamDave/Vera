#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';

interface ExportConfig {
  frontendPath: string;
  backendPath: string;
  outputPath: string;
  projectName: string;
}

interface ExportResult {
  success: boolean;
  filePath?: string;
  error?: string;
}

export async function exportToZip(config: ExportConfig): Promise<ExportResult> {
  const result: ExportResult = { success: false };

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${config.projectName}-${timestamp}.zip`;
    const outputPath = path.join(config.outputPath, fileName);

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Create write stream
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Listen for events
    output.on('close', () => {
      console.log(`✅ Export completed: ${archive.pointer()} total bytes`);
    });

    archive.on('error', (err) => {
      throw err;
    });

    // Pipe archive data to the file
    archive.pipe(output);

    // Add frontend files
    console.log('Adding frontend files...');
    await addDirectoryToArchive(archive, config.frontendPath, 'frontend', [
      'node_modules',
      '.next',
      '.git',
      'dist',
      'build'
    ]);

    // Add backend files
    console.log('Adding backend files...');
    await addDirectoryToArchive(archive, config.backendPath, 'backend', [
      'node_modules',
      '.next',
      '.git',
      'dist',
      'build'
    ]);

    // Add deployment files
    console.log('Adding deployment files...');
    await addDirectoryToArchive(archive, path.resolve('../deployment'), 'deployment', [
      'node_modules',
      'dist'
    ]);

    // Add generator files
    console.log('Adding generator files...');
    await addDirectoryToArchive(archive, path.resolve('../generator'), 'generator', [
      'node_modules',
      'dist'
    ]);

    // Add public apps
    console.log('Adding public apps...');
    await addDirectoryToArchive(archive, path.resolve('../public-apps'), 'public-apps', []);

    // Add root files
    console.log('Adding root files...');
    archive.file(path.resolve('../README.md'), { name: 'README.md' });
    archive.file(path.resolve('../package.json'), { name: 'package.json' });

    // Create setup instructions
    const setupInstructions = generateSetupInstructions(config.projectName);
    archive.append(setupInstructions, { name: 'SETUP.md' });

    // Finalize the archive
    await archive.finalize();

    result.success = true;
    result.filePath = outputPath;

    console.log(`✅ Export successful: ${outputPath}`);

  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Export failed:', result.error);
  }

  return result;
}

async function addDirectoryToArchive(
  archive: archiver.Archiver, 
  sourcePath: string, 
  archivePath: string,
  excludePatterns: string[]
): Promise<void> {
  if (!fs.existsSync(sourcePath)) {
    console.warn(`Warning: Directory not found: ${sourcePath}`);
    return;
  }

  const addFile = (filePath: string, relativePath: string) => {
    // Check if file should be excluded
    const shouldExclude = excludePatterns.some(pattern => 
      relativePath.includes(pattern) || filePath.includes(pattern)
    );

    if (!shouldExclude) {
      archive.file(filePath, { name: `${archivePath}/${relativePath}` });
    }
  };

  const addDirectory = (dirPath: string, relativePath: string) => {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      const newRelativePath = path.join(relativePath, file);
      
      if (fs.statSync(fullPath).isDirectory()) {
        // Check if directory should be excluded
        const shouldExclude = excludePatterns.some(pattern => 
          newRelativePath.includes(pattern) || fullPath.includes(pattern)
        );

        if (!shouldExclude) {
          addDirectory(fullPath, newRelativePath);
        }
      } else {
        addFile(fullPath, newRelativePath);
      }
    }
  };

  addDirectory(sourcePath, '');
}

function generateSetupInstructions(projectName: string): string {
  return `# ${projectName} Setup Instructions

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## Quick Start

1. **Extract the ZIP file**
   \`\`\`bash
   unzip ${projectName}-*.zip
   cd ${projectName}
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   # Frontend (.env)
   cd frontend
   cp .example.env .env
   # Edit .env with your API keys
   
   # Backend (.env)
   cd ../backend
   # Create .env with DATABASE_URL and NEXTAUTH_SECRET
   \`\`\`

4. **Initialize database**
   \`\`\`bash
   cd backend
   npx prisma db push
   npm run db:seed
   \`\`\`

5. **Start development servers**
   \`\`\`bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   \`\`\`

6. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Features

- AI-powered code generation
- Type-safe APIs with tRPC
- Database with Prisma
- Authentication with NextAuth
- Modern UI with Tailwind CSS

## Deployment

See \`deployment/README.md\` for deployment instructions.

## Support

For issues and questions, please refer to the main README.md file.
`;
}

// CLI usage
if (require.main === module) {
  const config: ExportConfig = {
    projectName: process.argv[2] || 'vera-app',
    frontendPath: path.resolve('../frontend'),
    backendPath: path.resolve('../backend'),
    outputPath: path.resolve('./exports')
  };

  exportToZip(config)
    .then(result => {
      if (result.success) {
        console.log('Export completed successfully!');
        console.log(`File: ${result.filePath}`);
        process.exit(0);
      } else {
        console.error('Export failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Export error:', error);
      process.exit(1);
    });
} 