# Getting Started with AI Game Builder Platform

## What is AI Game Builder?

AI Game Builder is a comprehensive platform that enables anyone to create full games (2D, 2.5D, 3D) using natural language prompts. The AI system generates all aspects of your game including:

- 🎮 **Game Code**: Complete gameplay mechanics, physics, AI behaviors
- 🎨 **Visual Assets**: 2D sprites, 3D models, textures, animations
- 🎵 **Audio**: Music, sound effects, voice acting
- 🏗️ **Level Design**: Procedural and custom level generation
- 💫 **User Interface**: Menus, HUDs, dialogue systems
- 🚀 **Complete Builds**: Ready-to-deploy games for multiple platforms

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+ installed
- Git installed
- Code editor (VS Code recommended)

### 2. Setup
```bash
# Clone the repository
git clone <your-repo-url>
cd ai-game-builder

# Run the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh

# Configure your environment
cp .env.example .env
# Edit .env with your settings
```

### 3. Start Development
```bash
# Terminal 1: Start backend
npm run server:dev

# Terminal 2: Start mobile app
npm start
```

### 4. Open the App
- **Web**: Visit the URL shown in Terminal 2 (usually http://localhost:19006)
- **Mobile**: Scan QR code with Expo Go app
- **API**: Backend runs at http://localhost:3000

## Your First Game Project

### 1. Create Account
- Open the app and tap "Sign Up"
- Enter your details and create an account
- You'll be logged in automatically

### 2. Create New Project
- Tap "New Game" on the home screen
- Fill in project details:
  - **Name**: "My First Platformer"
  - **Description**: "A fun 2D platformer game"
  - **Type**: Select "2D Game"
  - **Engine**: Choose "Unity" or "Godot"
  - **AI Prompt**: "Create a 2D platformer with a ninja character who can run, jump, wall-jump, and throw shurikens. Include colorful pixel art graphics and upbeat chiptune music."

### 3. Generate Your Game
- Tap "Create Project"
- Navigate to your project page
- Start AI generation:
  - **Generate Code**: Creates game mechanics
  - **Generate Art Assets**: Creates sprites and animations
  - **Generate Audio**: Creates music and sound effects
  - **Generate Level Design**: Creates game levels

### 4. Build and Play
- Once generation is complete, build your game:
  - **Build WebGL Preview**: Play in browser instantly
  - **Export to Unity**: Download Unity project files
  - **Build Mobile App**: Create APK/IPA files

## Key Features

### 🤖 AI-Powered Generation
- **Multiple AI Agents**: Specialized for different aspects (code, art, audio, etc.)
- **Smart Workflows**: Fast preview → user approval → full-quality build
- **User Control**: Override AI decisions, provide feedback, fine-tune results

### 🎮 Multi-Platform Support
- **Game Engines**: Unity and Godot project exports
- **Build Targets**: WebGL, Android, iOS, Windows, Mac, Linux
- **Future**: PlayStation, Xbox, Nintendo Switch support planned

### 🔧 Professional Tools
- **Version Control**: Automatic GitHub integration
- **Real-time Collaboration**: Multiple users can work on same project
- **Asset Management**: Organized file structure with cloud storage
- **Analytics**: Track game performance and user engagement

### 🌐 Community Features
- **Project Sharing**: Share your games with the community
- **Templates**: Use community-created game templates
- **Learning**: See how others built their games

## Understanding the Architecture

### Frontend (Mobile & Web)
- **React Native + Expo**: Single codebase for iOS, Android, and Web
- **Redux**: State management for user data, projects, and AI generations
- **Real-time Updates**: WebSocket connection for live generation progress

### Backend (API & Services)
- **Node.js + Express**: RESTful API with TypeScript
- **PostgreSQL**: User data, projects, generations, builds
- **Redis**: Session management and caching
- **Socket.io**: Real-time communication
- **AWS S3**: Asset storage and CDN

### AI System
- **User API Keys**: You provide your own OpenAI/Anthropic keys (unlimited usage)
- **Specialized Agents**: Different AI models for different tasks
- **Quality Control**: Preview → approval → final generation workflow
- **Parallel Processing**: Multiple generations running simultaneously

## Configuration Options

### AI Services
Currently supports:
- **OpenAI**: GPT-4 for code, DALL-E 3 for art
- **Anthropic**: Claude for complex game logic
- **OpenRouter**: Access to multiple models
- **Future**: Midjourney, ElevenLabs, Stability AI, and more

### Game Engines
- **Unity**: Industry-standard, great for 3D and complex games
- **Godot**: Open-source, excellent for 2D and indie games
- **Future**: Unreal Engine, custom web-based engine

### Export Formats
- **Instant Play**: WebGL builds for immediate testing
- **Mobile**: APK (Android), IPA (iOS) with app store submission
- **Desktop**: Windows, macOS, Linux executables
- **Source Code**: Complete project files for further customization

## Best Practices

### Writing Effective AI Prompts
✅ **Good Prompt**: "Create a 2D side-scrolling platformer where the player is a robot that can double-jump, dash through walls, and shoot energy blasts. Use a retro-futuristic art style with neon colors and synthwave music. Include 5 levels with increasing difficulty."

❌ **Poor Prompt**: "Make a game"

### Project Organization
- Use descriptive project names
- Add detailed descriptions for team collaboration
- Organize assets with clear naming conventions
- Version control important milestones

### Performance Optimization
- Start with simple mechanics, add complexity gradually
- Test on target devices early and often
- Monitor build sizes and performance metrics
- Use analytics to understand player behavior

## Troubleshooting

### Common Issues

**"Failed to connect to backend"**
- Ensure backend server is running (`npm run server:dev`)
- Check if port 3000 is available
- Verify environment variables in `.env`

**"AI Generation failed"**
- Check your API keys in user settings
- Verify API key has sufficient credits
- Try simplifying your prompt
- Check network connection

**"Build failed"**
- Review build logs for specific errors
- Ensure all assets are properly generated
- Check target platform requirements
- Verify disk space available

### Getting Help
- 📖 Check the [API Documentation](./api.md)
- 🚀 Review [Deployment Guide](./deployment.md)
- 💬 Join our Discord community
- 🐛 Report issues on GitHub

## What's Next?

### Phase 1 Features (Available Now)
- ✅ Project creation and management
- ✅ Basic AI generation
- ✅ WebGL builds
- ✅ Unity/Godot export

### Phase 2 (Coming Soon)
- 🔄 Advanced AI agents
- 🔄 Multiplayer game support
- 🔄 Mobile app publishing
- 🔄 Community features

### Phase 3 (Future)
- 🔮 Console publishing
- 🔮 VR/AR game support
- 🔮 Advanced analytics
- 🔮 Marketplace for assets

Ready to build your first AI-generated game? Let's get started! 🚀