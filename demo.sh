#!/bin/bash

# Trading Hub Demo Setup Script
# This script sets up the trading platform with demo data

set -e

echo "🚀 Setting up Trading Hub Demo..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version check passed: $(node -v)"

# Check if Docker is installed (optional)
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    print_status "Docker and Docker Compose detected"
    DOCKER_AVAILABLE=true
else
    print_warning "Docker not detected. Will use local PostgreSQL and Redis."
    DOCKER_AVAILABLE=false
fi

# Install dependencies
print_info "Installing dependencies..."
npm install

print_info "Installing client dependencies..."
cd client && npm install && cd ..

print_info "Installing server dependencies..."
cd server && npm install && cd ..

print_status "Dependencies installed"

# Setup environment files
print_info "Setting up environment configuration..."

# Create server .env file
if [ ! -f "server/.env" ]; then
    cp server/.env.example server/.env
    
    # Generate random secrets
    JWT_SECRET=$(openssl rand -hex 32)
    SESSION_SECRET=$(openssl rand -hex 32)
    ENCRYPTION_KEY=$(openssl rand -hex 32)
    
    # Update .env with generated secrets
    sed -i.bak "s/your_jwt_secret_here/$JWT_SECRET/g" server/.env
    sed -i.bak "s/your_session_secret_here/$SESSION_SECRET/g" server/.env
    sed -i.bak "s/your_32_character_encryption_key_here/$ENCRYPTION_KEY/g" server/.env
    
    # Set demo API keys
    sed -i.bak "s/your_alpha_vantage_api_key/demo/g" server/.env
    sed -i.bak "s/your_finnhub_api_key/demo/g" server/.env
    
    rm server/.env.bak
    print_status "Server environment file created with demo configuration"
else
    print_info "Server environment file already exists"
fi

# Ask user about Docker setup
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo ""
    echo "Setup Options:"
    echo "1. Docker (Recommended) - Automatically sets up PostgreSQL and Redis"
    echo "2. Local - Use existing PostgreSQL and Redis installations"
    echo ""
    read -p "Choose setup option (1 or 2): " SETUP_OPTION
    
    if [ "$SETUP_OPTION" = "1" ]; then
        print_info "Starting services with Docker..."
        
        # Start PostgreSQL and Redis with Docker
        docker-compose up -d postgres redis
        
        # Wait for services to be ready
        print_info "Waiting for database to be ready..."
        sleep 10
        
        # Update database URL for Docker
        sed -i.bak 's|DATABASE_URL=.*|DATABASE_URL="postgresql://trading_user:trading_password@localhost:5432/trading_hub"|g' server/.env
        sed -i.bak 's|REDIS_URL=.*|REDIS_URL=redis://localhost:6379|g' server/.env
        rm server/.env.bak
        
        print_status "Docker services started"
    fi
fi

# Setup database
print_info "Setting up database..."
cd server

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:push

# Create demo data
print_info "Creating demo data..."

# Create a simple demo data script
cat > demo-data.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDemoData() {
  console.log('Creating demo user...');
  
  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123456', 12);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@tradinghub.com' },
    update: {},
    create: {
      email: 'demo@tradinghub.com',
      username: 'demo_trader',
      firstName: 'Demo',
      lastName: 'Trader',
      password: hashedPassword,
      verified: true,
      riskProfile: 'MODERATE',
    },
  });

  console.log('Creating demo strategy...');
  
  // Create demo strategy
  await prisma.strategy.upsert({
    where: { id: 'demo-strategy-1' },
    update: {},
    create: {
      id: 'demo-strategy-1',
      name: 'Demo Buy Low Sell High Strategy',
      description: 'A simple demo strategy that buys when RSI is below 30 and sells when above 70',
      type: 'SWING',
      status: 'ACTIVE',
      tickers: ['AAPL', 'TSLA', 'BTC-USD'],
      timeframe: '1h',
      entryRules: {
        conditions: [
          { indicator: 'RSI', operator: 'LESS_THAN', value: 30 }
        ]
      },
      exitRules: {
        conditions: [
          { indicator: 'RSI', operator: 'GREATER_THAN', value: 70 }
        ]
      },
      riskMgmt: {
        stopLoss: 5,
        takeProfit: 10,
        maxPositionSize: 1000
      },
      isPublic: true,
      userId: demoUser.id,
    },
  });

  console.log('Creating demo watchlist...');
  
  // Create demo watchlist
  await prisma.watchlist.upsert({
    where: { id: 'demo-watchlist-1' },
    update: {},
    create: {
      id: 'demo-watchlist-1',
      name: 'Tech Stocks',
      tickers: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA'],
      isPublic: true,
      userId: demoUser.id,
    },
  });

  console.log('Creating demo alerts...');
  
  // Create demo alerts
  await prisma.alert.upsert({
    where: { id: 'demo-alert-1' },
    update: {},
    create: {
      id: 'demo-alert-1',
      ticker: 'AAPL',
      condition: {
        type: 'price',
        operator: 'GREATER_THAN',
        value: 200
      },
      message: 'AAPL has crossed $200!',
      isActive: true,
      userId: demoUser.id,
    },
  });

  console.log('Creating demo posts...');
  
  // Create demo social posts
  await prisma.post.upsert({
    where: { id: 'demo-post-1' },
    update: {},
    create: {
      id: 'demo-post-1',
      content: '🚀 Just set up my new swing trading strategy! Looking for RSI oversold conditions in tech stocks. What do you think about this approach? #trading #strategy',
      tickers: ['AAPL', 'TSLA'],
      userId: demoUser.id,
    },
  });

  console.log('Demo data created successfully!');
}

createDemoData()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
EOF

node demo-data.js

cd ..

print_status "Database setup completed with demo data"

# Create startup script
print_info "Creating startup script..."

cat > start-demo.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Trading Hub Demo..."

# Start the development servers
echo "Starting backend server..."
cd server && npm run dev &
SERVER_PID=$!

echo "Starting frontend client..."
cd ../client && npm run dev &
CLIENT_PID=$!

echo ""
echo "🎉 Trading Hub is starting up!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "📊 Database: PostgreSQL on localhost:5432"
echo "💾 Cache: Redis on localhost:6379"
echo ""
echo "Demo Account:"
echo "📧 Email: demo@tradinghub.com"
echo "🔑 Password: demo123456"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $SERVER_PID 2>/dev/null
    kill $CLIENT_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for processes
wait
EOF

chmod +x start-demo.sh

print_status "Setup completed successfully!"

echo ""
echo "🎉 Trading Hub Demo is ready!"
echo "=========================="
echo ""
echo "To start the demo:"
echo "  ./start-demo.sh"
echo ""
echo "Or manually:"
echo "  npm run dev"
echo ""
echo "Demo Credentials:"
echo "  📧 Email: demo@tradinghub.com"
echo "  🔑 Password: demo123456"
echo ""
echo "Features to explore:"
echo "  📊 Dashboard with market overview"
echo "  🎯 Create and manage trading strategies"
echo "  🔔 Set up price and technical alerts"
echo "  💹 View market data and charts"
echo "  👥 Social trading community"
echo "  📈 Portfolio tracking"
echo ""
echo "URLs:"
echo "  🌐 Frontend: http://localhost:3000"
echo "  🔧 Backend API: http://localhost:5000/api"
echo "  📋 API Health: http://localhost:5000/api/health"
echo ""
print_warning "Note: This is a demo environment with simulated data."
print_warning "For production use, configure real API keys in server/.env"
echo ""

# Ask if user wants to start now
read -p "Start the demo now? (y/n): " START_NOW
if [ "$START_NOW" = "y" ] || [ "$START_NOW" = "Y" ]; then
    print_info "Starting Trading Hub Demo..."
    ./start-demo.sh
fi