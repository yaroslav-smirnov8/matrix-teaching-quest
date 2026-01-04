# MATRIX TEACHING: AWAKENING

Interactive quest for English teachers in Telegram Mini App format.

## 🚀 Description

Matrix-themed interactive application that guides teachers through an exciting quest, showcasing AI capabilities in education. Users go through various scenes, make decisions, and receive promo codes for courses.

## 🛠 Технологический стек

### Backend
- **FastAPI** - асинхронный веб-фреймворк
- **PostgreSQL** - база данных
- **SQLAlchemy** - ORM
- **Alembic** - миграции БД
- **Redis** - кэширование и сессии
- **Python Telegram Bot** - интеграция с Telegram

### Frontend
- **React 18** - UI библиотека
- **Framer Motion** - анимации
- **Styled Components** - стилизация
- **React Spring** - физические анимации
- **Particles.js** - Matrix эффекты

## 📁 Структура проекта

```
Matrix Teaching Quest 🎯

## 📊 Admin Dashboard & Analytics/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── services/
│   ├── alembic/
│   └── main.py
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── scenes/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── styles/
│   └── package.json
├── requirements.txt
└── README.md
```

## 🎮 Features

- **Interactive storyline** with multiple endings
- **Achievement system** and leaderboard
- **Promo codes** with various discounts
- **Easter eggs** and secret mechanics
- **Matrix-style** visual effects
- **Telegram Mini App** integration

## 🚀 Installation and Launch

### Backend

1. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env file
```

4. Run migrations:
```bash
alembic upgrade head
```

5. Start server:
```bash
uvicorn backend.main:app --reload
```

### Frontend

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

## 🎯 Game Mechanics

### Promo Codes
- **REDPILL40** - 40% discount (full immersion)
- **MORPHEUS25** - 25% discount (with mentorship)
- **RABBIT15** - 15% discount (basic knowledge)
- **TRINITY** - +10% bonus (for collecting all rabbits)
- **BULLET_TIME** - quick start (speedrun bonus)

### Achievements
- **Glitch Hunter** - find all glitches
- **Speed Runner** - complete in < 5 minutes
- **Perfect Code** - no mistakes
- **Evangelist** - share with friends

## 🔧 API Endpoints

- `POST /api/v1/quest/start` - start quest
- `POST /api/v1/quest/choice` - make choice
- `GET /api/v1/user/progress` - user progress
- `GET /api/v1/achievements` - achievements
- `POST /api/v1/promo/generate` - generate promo code

## 📊 Database

### Main tables:
- `users` - Telegram users
- `quest_progress` - completion progress
- `choices` - choices made
- `achievements` - achievements earned
- `promo_codes` - generated promo codes

## 🎨 Design

Application uses Matrix theme with:
- Green code flowing down
- Glitch effects
- Futuristic UI
- Animated transitions
- Sound effects

## 🚀 Deployment

Application ready for deployment on:
- **Backend**: Heroku, DigitalOcean, AWS
- **Frontend**: Netlify, Vercel
- **Database**: PostgreSQL (Heroku Postgres, AWS RDS)
- **Cache**: Redis Cloud

## 📝 License

MIT License
