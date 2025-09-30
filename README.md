# AI Game Builder Platform

🎮 A cross-platform AI game builder that lets anyone create full games (2D, 2.5D, 3D) by text prompt.

## 🏆 Vision

The AI Game Builder Platform empowers anyone to create professional-quality games using AI assistance. Simply describe your game concept, and our specialized AI agents will generate:

- **Complete game projects** for Unity and Godot
- **Art assets** (2D sprites, 3D models, textures)
- **Audio content** (music, sound effects, voices)
- **Game code** and logic
- **Level designs** and environments
- **User interfaces** and menus
- **Ready-to-deploy builds** for multiple platforms

## 🚀 Features

### Core Capabilities
- **Multi-Platform Support**: React Native app (iOS/Android) + Web interface
- **AI-Powered Generation**: Specialized agents for different game development tasks
- **Real-Time Collaboration**: Live project updates and team features
- **GitHub Integration**: Automatic repository creation and version control
- **Multiple Game Engines**: Unity and Godot support
- **Cross-Platform Deployment**: WebGL, Mobile (APK/IPA), Desktop, Console

### AI Agents System
- **Code Generator**: Creates game scripts and logic
- **2D Artist**: Generates sprites, textures, and 2D assets
- **3D Artist**: Creates 3D models, animations, and environments
- **Audio Designer**: Produces music, sound effects, and voices
- **Shader Artist**: Develops visual effects and shaders
- **Level Designer**: Designs game levels and layouts
- **UI Designer**: Creates user interfaces and menus
- **Lighting Artist**: Sets up lighting and atmosphere
- **Physics Engineer**: Implements physics and interactions
- **Cutscene Director**: Creates cinematic sequences

### Game Features
- **Game Types**: 2D, 2.5D, and full 3D games
- **Advanced Graphics**: AI shaders, cinematic lighting, dynamic environments
- **Physics Systems**: Ragdolls, soft bodies, destruction, advanced interactions
- **Audio Systems**: Adaptive music, spatial audio, dynamic sound effects
- **Multiplayer Support**: Co-op, PvP, PvE up to 16 players with cross-platform play
- **AI NPCs**: Intelligent non-player characters with adaptive behavior
- **Procedural Content**: Dynamic level generation and adaptive difficulty

## 📱 Technology Stack

### Frontend (React Native/Expo)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: Context API with useReducer
- **Real-time Updates**: Socket.io client
- **Authentication**: Expo Auth Session with GitHub OAuth
- **Storage**: Expo Secure Store

### Backend (Node.js)
- **Framework**: Express.js
- **Real-time Communication**: Socket.io
- **Database**: PostgreSQL with Redis caching
- **Authentication**: JWT with GitHub OAuth
- **File Storage**: AWS S3 with CloudFront CDN
- **AI Integration**: Multiple AI service providers
- **Version Control**: GitHub API integration

### Infrastructure
- **Cloud Platform**: AWS (S3, CloudFront, EC2)
- **Database**: PostgreSQL + Redis
- **Real-time**: Socket.io
- **CI/CD**: GitHub Actions
- **Monitoring**: Winston logging

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Expo CLI (`npm install -g @expo/cli`)
- PostgreSQL (optional for full backend)
- Redis (optional for full backend)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hamadixi0/test.git
   cd test
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Setup environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

4. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start individually
   npm run dev:backend  # Starts backend on http://localhost:3000
   npm run dev:frontend # Starts Expo dev server
   ```

5. **Access the application**
   - **Web**: Open Expo dev server and select "Run in web browser"
   - **Mobile**: Use Expo Go app to scan QR code
   - **API**: Backend runs on http://localhost:3000

### Backend API Endpoints

```
Authentication:
POST /api/auth/demo-login       # Demo login
GET  /api/auth/github           # GitHub OAuth
GET  /api/auth/me              # Get current user

Projects:
GET    /api/projects           # List user projects
POST   /api/projects           # Create new project
GET    /api/projects/:id       # Get project details
PUT    /api/projects/:id       # Update project
DELETE /api/projects/:id       # Delete project

AI Generation:
GET  /api/ai/agents           # List available AI agents
POST /api/ai/generate         # Start AI generation
GET  /api/ai/jobs/:id         # Get generation status
GET  /api/ai/analytics        # AI usage analytics

GitHub Integration:
POST /api/github/create-repo  # Create repository
POST /api/github/push         # Push project files
POST /api/github/release      # Create release
GET  /api/github/repo/:name   # Get repository info
```

## 🎯 Usage

### Creating Your First Game

1. **Login**: Use demo login or GitHub OAuth
2. **Create Project**: 
   - Enter project name and description
   - Select game type (2D, 2.5D, 3D)
   - Choose engine (Unity or Godot)
   - Describe your game concept in detail
3. **AI Generation**: Watch as AI agents create your game
4. **Review & Iterate**: Preview the generated content
5. **Deploy**: Export to multiple platforms

### Example Game Prompts

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

## 🧪 Development & Testing

### Running Tests
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# Run all tests
npm test
```

### Building for Production
```bash
# Build frontend
npm run build

# The backend runs directly from source in production
```

## 📋 Project Structure

```
ai-game-builder-platform/
├── frontend/                 # React Native/Expo app
│   ├── src/
│   │   ├── screens/         # App screens
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React Context providers
│   │   ├── services/        # API services
│   │   └── utils/           # Utility functions
│   ├── assets/              # Static assets
│   └── app.json             # Expo configuration
├── backend/                 # Node.js API server
│   ├── src/
│   │   ├── routes/          # API route handlers
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Data models
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # External services
│   │   ├── ai-agents/       # AI agent implementations
│   │   └── utils/           # Utility functions
│   ├── config/              # Configuration files
│   └── logs/                # Application logs
├── docs/                    # Documentation
├── assets/                  # Shared assets
└── README.md               # This file
```

## 🔮 Roadmap

### Phase 1: MVP (Current)
- [x] Basic React Native app with authentication
- [x] Project creation and management
- [x] Mock AI generation system
- [x] Real-time updates via Socket.io
- [x] GitHub integration placeholders

### Phase 2: Core Features (3-6 months)
- [ ] Actual AI agent implementations
- [ ] Unity/Godot export pipelines
- [ ] Real GitHub repository creation
- [ ] Asset generation and management
- [ ] Multiplayer infrastructure

### Phase 3: Advanced Features (6-9 months)
- [ ] Quality assurance bots
- [ ] Advanced analytics dashboard
- [ ] Community features and sharing
- [ ] Mobile app store deployment

### Phase 4: Scale & Polish (9-12 months)
- [ ] Console platform support
- [ ] Enterprise features
- [ ] Advanced anti-cheat systems
- [ ] Performance optimizations

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with React Native and Expo
- Powered by Node.js and Express
- AI integration ready for multiple providers
- Inspired by the democratization of game development

---

**AI Game Builder Platform** - Where imagination meets AI to create amazing games! 🎮✨