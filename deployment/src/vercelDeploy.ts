#!/usr/bin/env node

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface DeployConfig {
  projectName: string;
  frontendPath: string;
  backendPath: string;
  vercelToken?: string;
}

interface DeployResult {
  success: boolean;
  frontendUrl?: string;
  backendUrl?: string;
  error?: string;
}

export async function deployToVercel(config: DeployConfig): Promise<DeployResult> {
  const result: DeployResult = { success: false };

  try {
    // Check if Vercel CLI is installed
    try {
      execSync('vercel --version', { stdio: 'pipe' });
    } catch {
      console.log('Installing Vercel CLI...');
      execSync('npm install -g vercel', { stdio: 'inherit' });
    }

    // Deploy frontend
    console.log('Deploying frontend...');
    const frontendResult = await deployFrontend(config);
    if (frontendResult.success) {
      result.frontendUrl = frontendResult.url;
    } else {
      throw new Error(`Frontend deployment failed: ${frontendResult.error}`);
    }

    // Deploy backend
    console.log('Deploying backend...');
    const backendResult = await deployBackend(config);
    if (backendResult.success) {
      result.backendUrl = backendResult.url;
    } else {
      throw new Error(`Backend deployment failed: ${backendResult.error}`);
    }

    result.success = true;
    console.log('✅ Deployment successful!');
    console.log(`Frontend: ${result.frontendUrl}`);
    console.log(`Backend: ${result.backendUrl}`);

  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Deployment failed:', result.error);
  }

  return result;
}

async function deployFrontend(config: DeployConfig): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const originalCwd = process.cwd();
    process.chdir(config.frontendPath);

    // Create vercel.json if it doesn't exist
    const vercelConfig = {
      version: 2,
      builds: [
        {
          src: 'package.json',
          use: '@vercel/next'
        }
      ],
      routes: [
        {
          src: '/(.*)',
          dest: '/'
        }
      ]
    };

    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));

    // Deploy to Vercel
    const deployCommand = config.vercelToken 
      ? `vercel --token ${config.vercelToken} --prod`
      : 'vercel --prod';

    const output = execSync(deployCommand, { 
      stdio: 'pipe',
      encoding: 'utf-8'
    });

    // Extract URL from output
    const urlMatch = output.match(/https:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0] : undefined;

    process.chdir(originalCwd);

    return { success: true, url };

  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

async function deployBackend(config: DeployConfig): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const originalCwd = process.cwd();
    process.chdir(config.backendPath);

    // Create vercel.json for backend
    const vercelConfig = {
      version: 2,
      builds: [
        {
          src: 'package.json',
          use: '@vercel/next'
        }
      ],
      functions: {
        'src/app/api/**/*.ts': {
          runtime: 'nodejs18.x'
        }
      }
    };

    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));

    // Deploy to Vercel
    const deployCommand = config.vercelToken 
      ? `vercel --token ${config.vercelToken} --prod`
      : 'vercel --prod';

    const output = execSync(deployCommand, { 
      stdio: 'pipe',
      encoding: 'utf-8'
    });

    // Extract URL from output
    const urlMatch = output.match(/https:\/\/[^\s]+/);
    const url = urlMatch ? urlMatch[0] : undefined;

    process.chdir(originalCwd);

    return { success: true, url };

  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// CLI usage
if (require.main === module) {
  const config: DeployConfig = {
    projectName: process.argv[2] || 'vera-app',
    frontendPath: path.resolve('../frontend'),
    backendPath: path.resolve('../backend'),
    vercelToken: process.env.VERCEL_TOKEN
  };

  deployToVercel(config)
    .then(result => {
      if (result.success) {
        console.log('Deployment completed successfully!');
        process.exit(0);
      } else {
        console.error('Deployment failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Deployment error:', error);
      process.exit(1);
    });
} 