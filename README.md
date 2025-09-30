# AI Game Builder Platform

A cross-platform AI game builder that lets anyone create full games (2D, 2.5D, 3D) by text prompt.

## 🎮 Vision

The AI Game Builder Platform empowers creators to build complete games through natural language prompts. The system generates:

- **Assets**: 2D art, 3D models, textures, audio, music, voices
- **Code**: Game logic, physics, AI behaviors
- **Levels**: Procedural generation and custom level design
- **UI**: Menus, HUDs, dialogue systems
- **Complete Projects**: Engine-ready Unity/Godot projects
- **Deployable Builds**: WebGL, mobile apps, PC/console games

## 🏗️ Architecture

### Frontend
- **Mobile App**: React Native with Expo (iOS & Android)
- **Web App**: Same codebase via Expo Web
- **Cross-platform**: Single codebase, multiple targets

### Backend
- **API**: Node.js + Express
- **Real-time**: Socket.io for multiplayer and live updates
- **Database**: PostgreSQL + Redis cache
- **Storage**: AWS S3 + CloudFront, GitHub integration

### AI System
- **Specialized Agents**: Code, art, audio, level design, physics
- **Workflow**: Fast preview → approval → full-quality build
- **API Integration**: User-provided keys (OpenAI, OpenRouter, etc.)
- **Parallel Processing**: Multiple agents working simultaneously

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo CLI
- Git

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-game-builder

# Install all dependencies
npm run install:all

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
```

### Development

```bash
# Start the mobile app
npm start

# Start the backend server
npm run server:dev

# Run on specific platforms
npm run android  # Android
npm run ios      # iOS
npm run web      # Web browser
```

## 📱 Supported Platforms

### Target Platforms
- **Mobile**: iOS, Android (React Native)
- **Web**: All modern browsers (React Native Web)
- **Desktop**: Windows, macOS, Linux (via WebGL or native builds)

### Game Export Formats
- **Unity Projects**: Complete Unity packages
- **Godot Projects**: Godot project files
- **WebGL**: Browser-playable games
- **Mobile Apps**: APK (Android), IPA (iOS)
- **Desktop**: Windows, macOS, Linux executables
- **Console**: PlayStation, Xbox, Nintendo Switch (future)

## 🛠️ Development Phases

### Phase 1: MVP (0-3 months)
- ✅ Project structure and configuration
- 🔄 React Native app with authentication
- 🔄 Backend API and database setup
- 🔄 GitHub integration for project repos
- 🔄 Basic AI orchestration
- 🔄 Fast preview generation

### Phase 2: Core Features (3-6 months)
- Unity/Godot export functionality
- Multiplayer infrastructure
- Asset generation (2D/3D/audio)
- Advanced AI agents
- Mobile notifications

### Phase 3: Advanced Features (6-9 months)
- QA automation with AI bots
- Adaptive music and difficulty
- Analytics dashboard
- Performance optimization

### Phase 4: Community (9-12 months)
- Community feed and sharing
- Social features (likes, comments)
- Content moderation
- Project suggestions

### Phase 5: Console & Scale (12-18 months)
- Console export pipelines
- Massive scaling infrastructure
- Advanced anti-cheat systems

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/ai_game_builder
REDIS_URL=redis://localhost:6379

# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your-s3-bucket
AWS_CLOUDFRONT_DOMAIN=your-cloudfront-domain

# GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# AI Services (Users provide their own keys)
DEFAULT_OPENAI_API_KEY=your_default_key
DEFAULT_OPENROUTER_API_KEY=your_default_key

# Security
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
cd backend && npm test

# Run mobile tests
cd mobile && npm test

# Lint code
npm run lint
npm run lint:fix
```

## 📝 API Documentation

The API documentation is available at `/docs` when running the development server.

Key endpoints:
- `POST /api/auth/login` - User authentication
- `POST /api/projects` - Create new game project
- `POST /api/projects/:id/generate` - Generate game assets
- `GET /api/projects/:id/preview` - Get game preview
- `POST /api/projects/:id/export` - Export game project

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React Native and Expo
- Powered by OpenAI and other AI services
- Game engines: Unity, Godot
- Cloud infrastructure: AWS