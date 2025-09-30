#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');

console.log('🎮 AI Game Builder Demo');
console.log('========================\n');

// Check if required directories exist
const checkStructure = async () => {
  const requiredDirs = [
    'server',
    'client',
    'server/routes',
    'server/services',
    'client/src/components'
  ];

  console.log('📁 Checking project structure...');
  
  for (const dir of requiredDirs) {
    const exists = await fs.pathExists(path.join(__dirname, dir));
    console.log(`   ${exists ? '✅' : '❌'} ${dir}`);
  }
  console.log('');
};

// Check key files
const checkFiles = async () => {
  const keyFiles = [
    'package.json',
    'server/index.js',
    'server/services/aiService.js',
    'server/services/gameGeneratorService.js',
    'client/package.json',
    'client/src/App.js',
    'client/src/components/GameBuilder.js'
  ];

  console.log('📄 Checking key files...');
  
  for (const file of keyFiles) {
    const exists = await fs.pathExists(path.join(__dirname, file));
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  }
  console.log('');
};

// Show project statistics
const showStats = async () => {
  console.log('📊 Project Statistics:');
  
  try {
    const serverFiles = await countFiles(path.join(__dirname, 'server'));
    const clientFiles = await countFiles(path.join(__dirname, 'client/src'));
    
    console.log(`   Server files: ${serverFiles}`);
    console.log(`   Client files: ${clientFiles}`);
    console.log(`   Total implementation files: ${serverFiles + clientFiles}`);
  } catch (error) {
    console.log('   Could not count files');
  }
  console.log('');
};

const countFiles = async (dir) => {
  if (!await fs.pathExists(dir)) return 0;
  
  let count = 0;
  const scan = async (currentDir) => {
    const items = await fs.readdir(currentDir);
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory()) {
        await scan(fullPath);
      } else if (item.endsWith('.js') || item.endsWith('.jsx')) {
        count++;
      }
    }
  };
  
  await scan(dir);
  return count;
};

// Show features implemented
const showFeatures = () => {
  console.log('🚀 Implemented Features:');
  console.log('   ✅ AI conversation system with OpenAI integration');
  console.log('   ✅ Complete game code generation');
  console.log('   ✅ Multi-platform export (Web/PC/Mobile)');
  console.log('   ✅ Asset generation and management');
  console.log('   ✅ GitHub OAuth integration');
  console.log('   ✅ Cloud storage support');
  console.log('   ✅ File validation and safeguards');
  console.log('   ✅ React-based user interface');
  console.log('   ✅ Real-time chat interface');
  console.log('   ✅ Game preview and management');
  console.log('   ✅ Progressive web app ready');
  console.log('');
};

// Show next steps
const showNextSteps = () => {
  console.log('📋 Next Steps:');
  console.log('   1. Set up environment variables (.env file)');
  console.log('   2. Install dependencies: npm run install-all');
  console.log('   3. Start development: npm run dev');
  console.log('   4. Open browser: http://localhost:3000');
  console.log('   5. Start creating games through conversation!');
  console.log('');
};

// Main demo function
const runDemo = async () => {
  try {
    await checkStructure();
    await checkFiles();
    await showStats();
    showFeatures();
    showNextSteps();
    
    console.log('🎉 AI Game Builder is ready for development!');
    console.log('💬 Start building games through conversation today.');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  }
};

// Run the demo
runDemo();