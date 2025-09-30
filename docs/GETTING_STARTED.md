# Getting Started with AI Game Builder Platform

Welcome to the AI Game Builder Platform! This guide will help you get up and running quickly.

## 🎯 What You Can Do

With the AI Game Builder Platform, you can:

- **Create Games by Description**: Simply describe your game idea in natural language
- **AI-Powered Generation**: Specialized AI agents create code, art, audio, and levels
- **Multiple Platforms**: Deploy to Web, Mobile, PC, and potentially consoles
- **Real-time Collaboration**: Work with teams and see updates live
- **Professional Tools**: Export to Unity and Godot projects

## 🚀 Quick Start

### Option 1: Demo Backend (Recommended for Testing)

The fastest way to try the platform:

1. **Start the demo backend**:
   ```bash
   cd /home/runner/work/test/test
   node demo/simple-backend.js
   ```

2. **In another terminal, start the frontend**:
   ```bash
   cd /home/runner/work/test/test/frontend
   npx expo start
   ```

3. **Access the app**:
   - **Web**: Press `w` in the Expo terminal
   - **Mobile**: Scan QR code with Expo Go app
   - **iOS Simulator**: Press `i` (requires Xcode)
   - **Android Emulator**: Press `a` (requires Android Studio)

### Option 2: Full Development Setup

For full development with all features:

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Set up environment**:
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your settings
   ```

3. **Start development servers**:
   ```bash
   npm run dev
   ```

## 📱 Using the App

### 1. Login
- Use **Demo Login** with any username (minimum 3 characters)
- Or set up GitHub OAuth for production use

### 2. Create Your First Game

Click the **Create** tab and fill out:

- **Project Name**: Something descriptive like "Space Adventure"
- **Game Type**: Choose 2D, 2.5D, or 3D
- **Engine**: Unity or Godot
- **Game Idea**: Describe your game in detail

**Example prompts:**

```
2D Platformer:
"A retro-style platformer where the player controls a ninja cat 
collecting fish while avoiding robot enemies. The game should have 
pixel art graphics, chiptune music, and smooth jumping mechanics."

3D Adventure:
"An open-world adventure game set in a mystical forest where the 
player is a young wizard learning spells. Include magical creatures, 
spell-casting mechanics, and beautiful nature environments."

Puzzle Game:
"A physics-based puzzle game where players stack colorful blocks 
to reach target heights. Include particle effects, satisfying 
sound design, and increasingly challenging levels."
```

### 3. Watch AI Generate Your Game

- Real-time progress updates show AI agents working
- Different agents handle code, art, audio, etc.
- Typical generation time: 2-5 minutes

### 4. Review and Play

- View generated assets in the project detail screen
- Play the game directly in your browser
- Download project files for further development

## 🎮 Game Creation Tips

### Writing Effective Prompts

**Be Specific**: Instead of "make a game," try:
- "A side-scrolling shooter with power-ups and boss battles"
- "A puzzle platformer with gravity-switching mechanics"
- "A farming simulation with seasonal crops and animal care"

**Include Details**:
- Art style (pixel art, realistic, cartoon, minimalist)
- Audio style (chiptune, orchestral, electronic, ambient)
- Gameplay mechanics (jumping, shooting, puzzle-solving)
- Theme/setting (space, medieval, modern, fantasy)

**Specify Scope**:
- Number of levels or areas
- Types of enemies or obstacles
- UI/menu requirements
- Multiplayer needs

### Game Types Guide

**2D Games**:
- Platformers, side-scrollers, top-down games
- Faster generation, smaller file sizes
- Great for mobile deployment
- Examples: Super Mario Bros, Pac-Man, Tetris

**2.5D Games**:
- 3D graphics with 2D gameplay
- Modern look with classic feel
- Good performance on most devices
- Examples: Paper Mario, Klonoa, New Super Mario Bros

**3D Games**:
- Full 3D worlds and gameplay
- Most complex but most impressive
- Requires more powerful devices
- Examples: Super Mario Odyssey, Minecraft, Portal

## 🛠️ Development Workflow

### 1. Iterate on Your Idea
- Start with a simple concept
- Test and refine
- Add complexity gradually

### 2. Use AI Agents Effectively
- **Code Agent**: Focus on gameplay mechanics
- **Art Agents**: Specify style and mood
- **Audio Agent**: Describe atmosphere and energy
- **Level Designer**: Outline progression and difficulty

### 3. Export and Customize
- Download Unity/Godot projects
- Customize in your preferred editor
- Add your own assets or modifications
- Deploy to your target platforms

## 🔧 Configuration

### Environment Variables

Create `backend/.env` with:

```env
# Basic Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:19006

# JWT Secret (change in production)
JWT_SECRET=your-secret-key-here

# AI Service Keys (user-provided)
OPENAI_API_KEY=your-key-here
ANTHROPIC_API_KEY=your-key-here

# GitHub OAuth (optional)
GITHUB_CLIENT_ID=your-client-id
GITHUB_CLIENT_SECRET=your-client-secret

# AWS for asset storage (optional)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=your-bucket-name
```

### Expo Configuration

Update `frontend/app.json` for your app:

```json
{
  "expo": {
    "name": "Your Game Builder",
    "slug": "your-game-builder",
    "scheme": "yourgamebuilder"
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**"Cannot find module" errors**:
```bash
rm -rf node_modules package-lock.json
npm install
```

**Expo connection issues**:
- Make sure devices are on same network
- Try clearing Expo cache: `npx expo start -c`
- Check firewall settings

**Backend won't start**:
- Check if port 3000 is available
- Verify environment variables
- Check logs for specific errors

**AI generation not working**:
- Verify API keys are set correctly
- Check rate limits on AI services
- Monitor network connectivity

### Getting Help

1. **Check the logs**: Both frontend and backend log helpful information
2. **Review documentation**: Check `/docs` folder for detailed guides
3. **Test with demo data**: Use the simple backend to isolate issues
4. **Start simple**: Begin with basic projects before complex ones

## 🚢 Deployment

### Frontend (Expo/React Native)

**Web deployment**:
```bash
cd frontend
npx expo export -p web
# Deploy dist/ folder to your web host
```

**Mobile app stores**:
```bash
# iOS
npx expo build:ios

# Android
npx expo build:android
```

### Backend (Node.js)

**Basic deployment**:
```bash
# Set production environment
NODE_ENV=production

# Start the server
npm start
```

**Docker deployment**:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🎉 What's Next?

Once you've created your first game:

1. **Experiment with different prompts** to see what AI can create
2. **Try different game types and engines** to find your preference
3. **Export projects** and customize them in Unity/Godot
4. **Share your creations** with the community
5. **Provide feedback** to help improve the platform

Welcome to the future of game development! 🎮✨