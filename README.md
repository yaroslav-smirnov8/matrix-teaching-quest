# Matrix Teaching Quest

Interactive educational quest for English teachers delivered through Telegram Mini App. Matrix-themed narrative-driven experience combining storytelling, branching decisions, analytics, and achievement systems.

## Overview

A full-stack interactive quest application that guides teachers through an immersive learning experience. Features branching narratives, real-time decision consequences, achievement tracking, and comprehensive analytics dashboard with user engagement metrics and funnel analysis.

## Technical Stack

### Backend
- **FastAPI** - Asynchronous web framework with async-first architecture
- **PostgreSQL** - Relational database with async support
- **SQLAlchemy** - ORM for database operations (2.0+ with async)
- **Alembic** - Database migrations management
- **Redis** - Session storage and caching layer
- **Python Telegram Bot** - Telegram Mini App integration

### Frontend
- **React 18** - UI component library with hooks
- **Framer Motion** - Declarative animations and transitions
- **Styled Components** - Component-scoped CSS-in-JS styling
- **React Spring** - Physics-based animations for interactive effects
- **Particles.js** - Matrix-style visual effects and particle systems
- **TypeScript** - Type-safe JavaScript development

## Project Structure

\\\
matrix-teaching-quest/
│
├── backend/                          # FastAPI backend service
│   ├── app/
│   │   ├── api/                      # API route definitions
│   │   │   ├── routes/               # Endpoint handlers
│   │   │   ├── dependencies.py       # Dependency injection
│   │   │   └── responses.py          # Response schemas
│   │   │
│   │   ├── core/                     # Core application configuration
│   │   │   ├── config.py             # Environment configuration
│   │   │   ├── security.py           # JWT/auth utilities
│   │   │   └── constants.py          # Application constants
│   │   │
│   │   ├── db/                       # Database layer
│   │   │   ├── database.py           # Connection management
│   │   │   ├── session.py            # Session factory
│   │   │   └── base.py               # Base model configuration
│   │   │
│   │   ├── models/                   # SQLAlchemy ORM models
│   │   │   ├── user.py               # User/player model
│   │   │   ├── scene.py              # Quest scene model
│   │   │   ├── choice.py             # Player choice tracking
│   │   │   ├── achievement.py        # Achievement model
│   │   │   └── analytics_event.py    # Event tracking model
│   │   │
│   │   ├── schemas/                  # Pydantic request/response models
│   │   │   ├── user_schema.py        # User schemas
│   │   │   ├── scene_schema.py       # Scene schemas
│   │   │   └── analytics_schema.py   # Analytics schemas
│   │   │
│   │   ├── services/                 # Business logic layer
│   │   │   ├── user_service.py       # User management logic
│   │   │   ├── quest_service.py      # Quest progression logic
│   │   │   ├── achievement_service.py # Achievement tracking
│   │   │   ├── analytics_service.py  # Analytics processing
│   │   │   └── promo_service.py      # Promo code generation
│   │   │
│   │   └── main.py                   # FastAPI application entry point
│   │
│   ├── alembic/                      # Database migration scripts
│   │   ├── versions/                 # Migration versions
│   │   ├── env.py                    # Alembic environment configuration
│   │   └── script.py.mako            # Migration template
│   │
│   ├── tests/                        # Backend test suite
│   │   ├── test_api/                 # API endpoint tests
│   │   ├── test_services/            # Service layer tests
│   │   ├── conftest.py               # Pytest configuration/fixtures
│   │   └── test_db.py                # Database tests
│   │
│   ├── requirements.txt              # Python dependencies
│   └── .env.example                  # Environment variables template
│
├── src/                              # Frontend React application
│   ├── components/                   # React components
│   │   ├── scenes/                   # Quest scene components
│   │   │   ├── OpeningScene.tsx      # Quest opening/introduction
│   │   │   ├── MainQuestScene.tsx    # Primary quest narrative
│   │   │   ├── ChoiceScene.tsx       # Decision point components
│   │   │   ├── ResultScene.tsx       # Outcome display
│   │   │   └── FinalScene.tsx        # Quest conclusion
│   │   │
│   │   ├── admin/                    # Admin dashboard components
│   │   │   ├── Dashboard.tsx         # Main admin interface
│   │   │   ├── Analytics.tsx         # Analytics visualization
│   │   │   ├── FunnelAnalysis.tsx    # Funnel analysis component
│   │   │   ├── UserManagement.tsx    # User admin controls
│   │   │   └── PromoManagement.tsx   # Promo code management
│   │   │
│   │   ├── ui/                       # Reusable UI components
│   │   │   ├── Button.tsx            # Button component
│   │   │   ├── Card.tsx              # Card layout component
│   │   │   ├── Modal.tsx             # Modal dialog component
│   │   │   ├── Loading.tsx           # Loading spinner
│   │   │   └── Toast.tsx             # Toast notifications
│   │   │
│   │   ├── effects/                  # Visual effect components
│   │   │   ├── MatrixRain.tsx        # Falling matrix text effect
│   │   │   ├── ParticleBackground.tsx # Particle system background
│   │   │   ├── GlitchEffect.tsx      # Glitch visual effect
│   │   │   └── NeonText.tsx          # Neon text styling
│   │   │
│   │   ├── video/                    # Video components
│   │   │   ├── VideoPlayer.tsx       # Custom video player
│   │   │   └── VideoContainer.tsx    # Video wrapper
│   │   │
│   │   └── audio/                    # Audio components
│   │       └── AudioPlayer.tsx       # Audio playback controls
│   │
│   ├── contexts/                     # React Context providers
│   │   ├── UserContext.tsx           # User state management
│   │   ├── QuestContext.tsx          # Quest progression state
│   │   ├── AnalyticsContext.tsx      # Analytics event tracking
│   │   └── ThemeContext.tsx          # Theme/styling context
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── useQuest.ts               # Quest progression hook
│   │   ├── useUser.ts                # User data hook
│   │   ├── useAnalytics.ts           # Analytics tracking hook
│   │   ├── useWindowSize.ts          # Window resize hook
│   │   └── useTelegram.ts            # Telegram Mini App API hook
│   │
│   ├── utils/                        # Utility functions
│   │   ├── api.ts                    # API client
│   │   ├── telegram.ts               # Telegram integration utilities
│   │   ├── tracking.ts               # Event tracking helpers
│   │   ├── animations.ts             # Animation utilities
│   │   └── storage.ts                # Local storage helpers
│   │
│   ├── styles/                       # Global styles
│   │   ├── global.css                # Global stylesheet
│   │   ├── variables.css             # CSS custom properties
│   │   └── animations.css            # Animation definitions
│   │
│   ├── App.tsx                       # Root component
│   ├── index.tsx                     # React entry point
│   └── types.ts                      # TypeScript type definitions
│
├── public/                           # Static assets
│   ├── index.html                    # HTML template
│   ├── favicon.ico                   # Site icon
│   └── assets/                       # Images, fonts, etc
│
├── docs/                             # Documentation
│   ├── API.md                        # API documentation
│   ├── ARCHITECTURE.md               # Architecture overview
│   ├── DEPLOYMENT.md                 # Deployment guide
│   └── assets/                       # Documentation assets
│
├── package.json                      # Frontend dependencies
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite build configuration
├── README.md                         # This file
└── .gitignore                        # Git ignore rules
\\\

## Key Components

### Backend Services

**QuestService** - Manages quest progression
- Scene navigation and state management
- Choice consequences and branching logic
- Quest completion and restart handling

**AnalyticsService** - Event tracking and analytics
- User journey funnel tracking
- Engagement metrics calculation
- Conversion analysis and reporting

**AchievementService** - Achievement system
- Achievement unlocking logic
- Badge assignment and tracking
- Leaderboard calculations

**PromoService** - Promotional code generation
- Code generation and validation
- Discount application logic
- Usage tracking and expiration

### Frontend Features

**Interactive Scenes** - Narrative-driven story progression with:
- Branching storyline with multiple outcomes
- Real-time consequence visualization
- Animated transitions between scenes

**Admin Dashboard** - Comprehensive analytics interface:
- Real-time user activity tracking
- Funnel analysis with drop-off points
- User segmentation and filtering
- Promo code management and generation

**Achievement System**:
- Progressive achievement unlock
- Badge collection and display
- Leaderboard ranking

## Installation and Setup

### Prerequisites
- Python 3.9+
- Node.js 16+ with npm
- PostgreSQL 12+
- Redis

### Backend Setup

1. Create and activate virtual environment:
\\\ash
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
\\\

2. Install dependencies:
\\\ash
cd backend
pip install -r requirements.txt
\\\

3. Configure environment:
\\\ash
cp .env.example .env
# Edit .env with your database credentials and API keys
\\\

4. Run database migrations:
\\\ash
alembic upgrade head
\\\

5. Start backend server:
\\\ash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
\\\

### Frontend Setup

1. Install dependencies:
\\\ash
npm install
\\\

2. Create .env file:
\\\ash
VITE_API_URL=http://localhost:8000/api
VITE_TELEGRAM_BOT_TOKEN=your_token_here
\\\

3. Start development server:
\\\ash
npm run dev
\\\

4. Build for production:
\\\ash
npm run build
\\\

## Database Schema

### Core Tables
- **users** - Player accounts with Telegram integration
- **scenes** - Quest scenes/chapters with narrative content
- **player_choices** - Track user decisions and branching
- **achievements** - Achievement definitions and unlocks
- **analytics_events** - User interaction tracking

## API Endpoints

### Quest Endpoints
- GET /api/quest/current-scene - Get current scene
- POST /api/quest/choose - Submit choice and progress
- GET /api/quest/status - Get quest completion status

### Analytics Endpoints
- GET /api/analytics/funnel - Funnel analysis data
- GET /api/analytics/user-journey/{user_id} - User journey tracking
- GET /api/analytics/metrics - Overall metrics

### Achievement Endpoints
- GET /api/achievements - List all achievements
- GET /api/achievements/user/{user_id} - User achievements

### Admin Endpoints
- GET /api/admin/users - List all users
- POST /api/admin/promos - Generate promo code
- DELETE /api/admin/promos/{code} - Deactivate promo

## Testing

### Backend Tests
\\\ash
cd backend
pip install -r requirements-test.txt
pytest
\\\

### Frontend Tests
\\\ash
npm run test
\\\

## Architecture Highlights

### Analytics & Tracking
- Browser fingerprinting for anonymous user tracking
- Event-driven analytics pipeline
- Real-time funnel analysis with drop-off detection
- User segmentation and cohort analysis

### Performance
- Redis caching for frequently accessed data
- Connection pooling for database efficiency
- Lazy-loaded components for frontend optimization
- CDN-ready asset serving

### Security
- JWT-based authentication
- Input validation and sanitization
- CORS configuration for Telegram Mini App
- Rate limiting on API endpoints

## Deployment

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for:
- Docker containerization
- Environment configuration
- Production deployment checklist
- Scaling strategies

## Development Workflow

1. Backend changes: Update models → Create migration → Update services
2. Frontend changes: Update components → Update contexts/hooks → Test
3. Schema changes: Create Alembic migration → Update models → Update ORM
4. Analytics: Define event → Create event handler → Add to analytics dashboard

## Performance Characteristics

- **Backend**: Async FastAPI handles 1000+ concurrent connections
- **Database**: Connection pooling with 20-50 simultaneous connections
- **Frontend**: Initial load <2s, interactive within 3s
- **Analytics**: Event processing with <100ms latency

## Known Limitations

- Telegram Mini App limited to 100MB total bundle size (solved via code splitting)
- Single server deployment (horizontal scaling requires session management)
- Real-time features require Redis (not included in basic setup)
- Browser fingerprinting has limitations with VPN/proxy users

## Contributing

Follow these patterns:
- Backend: Service layer pattern, no business logic in routes
- Frontend: Container/presentational component split
- Database: Always create migrations, never modify production schemas directly
- Tests: Minimum 70% coverage for critical paths

## License

Proprietary - See LICENSE file for details
