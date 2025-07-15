# Trading Hub - Professional Trading Platform

A comprehensive trading platform with automated strategies, social features, real-time market analysis, and trading execution capabilities.

## 🚀 Features

### Core Trading Features
- **📊 Advanced Strategy Builder**: Create long-term and short-term trading strategies with technical analysis
- **🔔 Smart Alerts**: Real-time notifications via email and SMS when conditions are met
- **🤖 Automated Trading**: Execute trades automatically on popular platforms (Coinbase, Alpaca)
- **💹 Market Analysis**: Real-time market data with technical indicators
- **📈 Portfolio Management**: Track performance across multiple assets
- **📱 Multiple Asset Support**: Stocks, crypto, and other financial instruments

### Social Features
- **👥 Trading Community**: Twitter-like social platform for traders
- **💬 Discussion Threads**: Share ideas and strategies with other traders
- **📸 Media Sharing**: Post charts, screenshots, and analysis
- **👤 User Profiles**: Follow other traders and see their performance
- **💡 Strategy Sharing**: Share and discover trading strategies

### Authentication & Security
- **🔐 Multiple Login Options**: Google, Apple, and email/password
- **🔒 Secure API Integration**: Encrypted storage of trading platform credentials
- **✉️ Email Verification**: Secure account verification process
- **🔑 Two-Factor Authentication**: Enhanced security for trading accounts

### Technical Features
- **⚡ Real-time Updates**: Live market data and notifications via WebSocket
- **📊 Advanced Charts**: Interactive charts with technical indicators
- **🎯 Risk Management**: Built-in risk management tools
- **📈 Performance Analytics**: Detailed performance tracking and reporting
- **🌐 Multi-Platform**: Web-based with mobile-responsive design

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Query** for data fetching and caching
- **React Router** for navigation
- **Recharts** for data visualization
- **Socket.io Client** for real-time updates
- **Framer Motion** for animations

### Backend
- **Node.js** with Express and TypeScript
- **PostgreSQL** with Prisma ORM
- **Redis** for caching and sessions
- **Socket.io** for real-time communication
- **Passport.js** for authentication
- **JWT** for token-based auth
- **Nodemailer** for email services
- **Twilio** for SMS notifications

### Trading & Market Data
- **Alpha Vantage API** for stock market data
- **Coinbase Pro API** for cryptocurrency trading
- **Alpaca API** for stock trading
- **Finnhub API** for additional market data
- **Technical Indicators** library for analysis

### Infrastructure
- **Docker** for containerization
- **Nginx** for reverse proxy (production)
- **PM2** for process management
- **Cloudinary** for image storage

## 🚦 Prerequisites

- **Node.js** >= 18.0.0
- **PostgreSQL** >= 13
- **Redis** >= 6
- **npm** or **yarn**

## 📦 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd trading-hub
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install client and server dependencies
npm run setup
```

### 3. Environment Setup

#### Server Environment (.env)
```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/trading_hub"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d

# Session
SESSION_SECRET=your_session_secret_here

# Redis
REDIS_URL=redis://localhost:6379

# OAuth Providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Financial APIs
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key
FINNHUB_API_KEY=your_finnhub_api_key
COINBASE_API_KEY=your_coinbase_api_key
COINBASE_API_SECRET=your_coinbase_api_secret
COINBASE_PASSPHRASE=your_coinbase_passphrase
COINBASE_SANDBOX=true

# Alpaca Trading API
ALPACA_API_KEY=your_alpaca_api_key
ALPACA_SECRET_KEY=your_alpaca_secret_key
ALPACA_BASE_URL=https://paper-api.alpaca.markets

# CORS
CORS_ORIGIN=http://localhost:3000
```

### 4. Database Setup
```bash
cd server

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Seed database
npm run db:seed
```

### 5. Start Services

#### Development Mode
```bash
# Start both client and server
npm run dev

# Or start individually
npm run dev:client  # Frontend on http://localhost:3000
npm run dev:server  # Backend on http://localhost:5000
```

#### Production Mode
```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### API Keys Setup

1. **Alpha Vantage**: Get free API key from [alphavantage.co](https://www.alphavantage.co/)
2. **Coinbase Pro**: Create sandbox account at [pro.coinbase.com](https://pro.coinbase.com/)
3. **Alpaca**: Get paper trading keys from [alpaca.markets](https://alpaca.markets/)
4. **Google OAuth**: Setup at [console.cloud.google.com](https://console.cloud.google.com/)
5. **Twilio**: Get credentials from [twilio.com](https://www.twilio.com/)

### Database Configuration

The application uses PostgreSQL with Prisma. The database schema includes:
- User management and authentication
- Trading strategies and rules
- Market data and alerts
- Social features (posts, comments, follows)
- Trading history and portfolio tracking

## 📱 Usage

### Getting Started

1. **Register Account**: Create account with email or use Google/Apple login
2. **Verify Email**: Check email for verification link
3. **Setup Profile**: Complete your trading profile and risk preferences
4. **Connect Trading Accounts**: Add API keys for trading platforms
5. **Create Strategy**: Build your first automated trading strategy
6. **Set Alerts**: Configure price and technical indicator alerts
7. **Join Community**: Follow other traders and share insights

### Creating Trading Strategies

1. Navigate to **Strategies** → **Create New**
2. Choose strategy type (Long-term, Short-term, Swing, Day Trade, Scalp)
3. Select tickers to monitor
4. Define entry conditions using technical indicators
5. Set exit rules and risk management parameters
6. Test strategy with historical data
7. Deploy for live monitoring

### Setting Up Alerts

1. Go to **Alerts** page
2. Choose ticker symbol
3. Set conditions (price, volume, technical indicators)
4. Configure notification preferences (email, SMS, push)
5. Activate alert

### Social Features

1. **Create Posts**: Share market insights, charts, and analysis
2. **Follow Traders**: Follow successful traders to see their strategies
3. **Engage**: Like, comment, and discuss trading ideas
4. **Share Media**: Upload charts and screenshots

## 🔐 Security

- All API keys are encrypted before storage
- JWT tokens for secure authentication
- Rate limiting on all API endpoints
- Input validation and sanitization
- CORS protection
- Helmet.js for security headers
- Session management with Redis

## 🧪 Testing

```bash
# Run client tests
cd client && npm test

# Run server tests
cd server && npm test

# Run e2e tests
npm run test:e2e
```

## 📊 Monitoring

The application includes built-in monitoring:
- Real-time performance metrics
- Trading strategy analytics
- User engagement tracking
- Error logging and reporting
- Market data quality monitoring

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment
1. Set up PostgreSQL and Redis servers
2. Configure environment variables for production
3. Build the application: `npm run build`
4. Start with PM2: `pm2 start ecosystem.config.js`
5. Configure Nginx reverse proxy

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@tradinghub.com
- Documentation: [docs.tradinghub.com](https://docs.tradinghub.com)

## 🙏 Acknowledgments

- Alpha Vantage for market data API
- Coinbase and Alpaca for trading APIs
- All open source contributors
- Trading community for feedback and testing

---

**⚠️ Disclaimer**: This software is for educational and testing purposes. Always use paper trading mode and consult with financial advisors before making real investment decisions.