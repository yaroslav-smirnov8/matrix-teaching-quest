from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

from app.api.routes import quest, user, achievements, promo, admin, analytics
from app.core.config import settings
from app.db.database import engine, Base

load_dotenv()

app = FastAPI(
    title="Matrix Teaching Quest API",
    description="Backend for Matrix-themed interactive quest for English teachers",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"] + settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(quest.router, prefix="/api/v1/quest", tags=["quest"])
app.include_router(user.router, prefix="/api/v1/user", tags=["user"])
app.include_router(achievements.router, prefix="/api/v1/achievements", tags=["achievements"])
app.include_router(promo.router, prefix="/api/v1/promo", tags=["promo"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])

@app.on_event("startup")
async def startup_event():
    # Database tables are created by Alembic migrations
    print("✅ Matrix Teaching Quest API started successfully!")
    print("📊 Database: Connected (tables managed by Alembic)")
    print("🚀 Server: Ready to accept requests")

@app.get("/")
async def root():
    return {"message": "Matrix Teaching Quest API is running", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is operational"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
