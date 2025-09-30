# AI Game Builder 🎮🤖

A revolutionary chat-only AI game builder that lets users create full 2D, 2.5D, or 3D games through conversation. The AI guides users through all aspects of game creation including genre selection, mechanics design, story development, art style choices, target audience definition, and multiple ending scenarios.

## ✨ Features

### 🤖 AI-Powered Game Creation
- **Conversational Interface**: Create games by simply describing your ideas
- **Intelligent Guidance**: AI guides you through every step of game development
- **Multiple Genres**: Support for RPG, Platformer, Puzzle, Action, Strategy, and more
- **Dimension Support**: Build 2D, 2.5D, or 3D games

### 🎨 Complete Game Generation
- **Game Code**: Automatically generates complete, playable game code
- **Asset Creation**: Generates sprites, models, sounds, and music assets
- **Map Design**: Creates level layouts and game world maps
- **Story Writing**: Develops narrative, characters, and dialogue
- **Logic Validation**: Ensures game mechanics work correctly

### 🚀 Multi-Platform Export
- **Web Games**: HTML5/Canvas games that run in browsers
- **PC Builds**: Downloadable desktop applications
- **Mobile Optimized**: Touch-friendly mobile game versions
- **Instant Play**: Games are immediately playable after generation

### ☁️ Cloud Integration
- **Cloud Storage**: Save projects to cloud storage with auto-sync
- **GitHub Integration**: Push games directly to GitHub repositories
- **OAuth Authentication**: Secure GitHub integration with automatic repo creation
- **Version Control**: Update existing repositories with new game versions

### 🛡️ Built-in Safeguards
- **File Validation**: Prevents broken paths and missing files
- **Logic Checking**: Validates game mechanics and flow
- **Asset Verification**: Ensures all required assets are present
- **Quality Assurance**: Automated testing of generated games

## 🏗️ Architecture

### Backend (Node.js + Express)
- **AI Service**: OpenAI integration for conversational game creation
- **Game Generator**: Complete game code and asset generation system
- **Build System**: Multi-platform export functionality
- **GitHub Integration**: OAuth and repository management
- **File Management**: Secure file handling and validation

### Frontend (React)
- **Modern UI**: Clean, responsive interface built with styled-components
- **Real-time Chat**: Interactive conversation interface with the AI
- **Game Preview**: Live preview of game specifications
- **Progress Tracking**: Visual progress indicators for game creation
- **Game Management**: Browse, play, and manage created games

### AI Integration
- **OpenAI GPT-4**: Advanced language model for game design
- **Context Awareness**: Maintains conversation context throughout creation
- **Specification Generation**: Converts conversations into detailed game specs
- **Code Generation**: Transforms specifications into working game code

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- OpenAI API key
- (Optional) GitHub OAuth app for repository integration

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hamadixi0/test.git
   cd test
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

### Environment Configuration

Create a `.env` file with the following variables:

```env
# AI Configuration (Required)
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4

# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# GitHub OAuth (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:3000/auth/github/callback

# Cloud Storage (Optional)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=ai-game-builder-storage
```

## 📖 How to Use

### 1. Start a Conversation
- Navigate to the "Build Game" section
- Begin describing the type of game you want to create
- The AI will ask clarifying questions to understand your vision

### 2. Design Your Game
The AI will guide you through:
- **Genre Selection**: Choose from various game types
- **Core Mechanics**: Define how the game plays
- **Story Elements**: Create characters, plot, and world
- **Art Direction**: Select visual style and aesthetics
- **Target Audience**: Define who will play your game
- **Ending Scenarios**: Design multiple possible outcomes

### 3. Generate Your Game
- Review the complete game specification
- Click "Build Game" to generate all files
- The system creates code, assets, maps, and story content

### 4. Play and Share
- **Instant Play**: Test your game immediately in the browser
- **Download**: Get a complete game package
- **GitHub**: Push to a repository for sharing and collaboration
- **Export**: Build for different platforms (Web/PC/Mobile)

## 🎯 Example Game Creation Flow

```
User: "I want to create a 2D platformer game"

AI: "Great choice! Let me help you design a 2D platformer. What's the setting or theme you have in mind? For example:
- Fantasy world with magic
- Sci-fi space adventure  
- Modern urban environment
- Retro pixel art style"

User: "A fantasy world with a brave knight"

AI: "Excellent! A fantasy knight platformer sounds engaging. Let's develop this further:

1. What's the main quest or goal for your knight?
2. What enemies or obstacles should they face?
3. What special abilities or weapons should the knight have?
4. Should there be collectible items or power-ups?"

[Conversation continues until complete game specification is built]
```

## 🛠️ Technical Details

### Generated Game Structure
```
generated-game/
├── index.html          # Main game file
├── package.json        # Game metadata
├── game.json          # Complete game specification
├── src/               # Game source code
│   ├── game.js        # Main game logic
│   ├── player.js      # Player character
│   ├── enemy.js       # Enemy AI
│   ├── ui.js          # User interface
│   └── style.css      # Game styling
├── assets/            # Game assets
│   ├── images/        # Sprites and graphics
│   ├── sounds/        # Sound effects
│   └── music/         # Background music
├── maps/              # Level data
└── story/             # Narrative content
```

### API Endpoints

#### AI Endpoints
- `POST /api/ai/conversation/start` - Initialize AI conversation
- `POST /api/ai/conversation/message` - Send message to AI
- `POST /api/ai/generate-specification` - Generate game specification

#### Game Endpoints
- `POST /api/games/generate` - Generate complete game
- `GET /api/games` - List all games
- `GET /api/games/:id` - Get specific game
- `GET /api/games/:id/play` - Play game in browser
- `GET /api/games/:id/download` - Download game package

#### Build Endpoints
- `POST /api/build/:gameId` - Build for specific platforms
- `GET /api/build/:gameId/download/:platform` - Download platform build

#### GitHub Endpoints
- `GET /api/github/auth` - Start GitHub OAuth
- `POST /api/github/create-repo` - Create repository
- `POST /api/github/push-updates` - Update repository

## 🎮 Supported Game Types

### 2D Games
- **Platformers**: Side-scrolling adventure games
- **Top-down RPGs**: Classic role-playing experiences  
- **Puzzle Games**: Logic and problem-solving challenges
- **Arcade Games**: Fast-paced action experiences

### 2.5D Games
- **Isometric RPGs**: Depth with 2D sprites
- **Side-scrolling with depth**: Layered 2D experiences
- **Pseudo-3D racing**: Classic arcade racing style

### 3D Games
- **First-person adventures**: Immersive exploration
- **Third-person action**: Character-focused gameplay
- **3D platformers**: Spatial jumping challenges
- **Simple 3D worlds**: Accessible 3D experiences

## 🔧 Development

### Project Structure
```
ai-game-builder/
├── server/             # Backend Node.js application
│   ├── routes/         # API route handlers
│   ├── services/       # Business logic services
│   └── utils/          # Utility functions
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API client services
│   │   └── styles/     # Styling and themes
└── generated-games/    # Created game files
```

### Available Scripts

```bash
# Development
npm run dev          # Start both client and server
npm run server       # Start only the backend server
npm run client       # Start only the frontend client

# Production
npm start           # Start production server
npm run build       # Build client for production

# Maintenance
npm test            # Run test suite
npm run lint        # Check code style
npm run install-all # Install all dependencies
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **Issues**: Report bugs on [GitHub Issues](https://github.com/Hamadixi0/test/issues)
- **Discussions**: Join conversations in [GitHub Discussions](https://github.com/Hamadixi0/test/discussions)
- **Documentation**: Full docs available in the `/docs` folder

## 🚀 Future Roadmap

- [ ] Advanced 3D game support with Three.js
- [ ] Multiplayer game generation
- [ ] Custom asset upload and integration
- [ ] Advanced scripting and logic systems
- [ ] Mobile app for game creation
- [ ] Marketplace for sharing created games
- [ ] Collaborative game development features
- [ ] AI-powered playtesting and feedback

---

**Built with ❤️ using OpenAI GPT-4, React, Node.js, and the power of conversation.**