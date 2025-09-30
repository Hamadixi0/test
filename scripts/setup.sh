#!/bin/bash

# AI Game Builder Platform Setup Script

echo "🚀 Setting up AI Game Builder Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install mobile dependencies
echo "📦 Installing mobile dependencies..."
cd mobile && npm install && cd ..

# Check if Expo CLI is installed globally
if ! command -v expo &> /dev/null; then
    echo "📱 Installing Expo CLI globally..."
    npm install -g @expo/cli
fi

# Copy environment file
if [ ! -f .env ]; then
    echo "⚙️ Creating environment file..."
    cp .env.example .env
    echo "✏️ Please edit .env file with your configuration before running the app"
fi

# Generate Prisma client
echo "🗄️ Setting up database schema..."
cd backend && npx prisma generate && cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your configuration"
echo "2. Set up your PostgreSQL and Redis databases"
echo "3. Run database migrations: cd backend && npx prisma db push"
echo "4. Start the backend: npm run server:dev"
echo "5. Start the mobile app: npm start"
echo ""
echo "📖 See README.md for detailed instructions"