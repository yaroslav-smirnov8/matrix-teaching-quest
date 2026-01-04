"""
Simplified FastAPI backend for localhost development
Works without database and complex dependencies
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import string
from typing import Optional, List

app = FastAPI(
    title="Matrix Teaching Quest API (Simple)",
    description="Simplified backend for localhost development",
    version="1.0.0-simple"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple data models
class QuestChoice(BaseModel):
    telegram_id: str
    scene_id: str
    choice_id: str
    choice_text: str

class QuestResponse(BaseModel):
    next_scene_id: str
    scene_content: Optional[dict] = None
    achievements_earned: List[str] = []
    promo_code: Optional[str] = None

# In-memory storage for demo
user_progress = {}
achievements = [
    "Первые шаги в Матрице",
    "Исследователь реальности", 
    "Собиратель кроликов",
    "Мастер выбора",
    "Пробуждение завершено"
]

def generate_promo_code():
    """Generate a simple promo code"""
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"MATRIX{suffix}"

@app.get("/")
async def root():
    return {"message": "Matrix Teaching Quest API (Simple) is running", "status": "active"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Simple API is operational"}

@app.post("/api/v1/quest/choice", response_model=QuestResponse)
async def make_choice(choice: QuestChoice):
    """Handle quest choices with simple logic"""
    
    user_id = choice.telegram_id
    scene_id = choice.scene_id
    choice_id = choice.choice_id
    
    # Initialize user progress if not exists
    if user_id not in user_progress:
        user_progress[user_id] = {
            "current_scene": "scene1",
            "choices_made": [],
            "achievements": [],
            "promo_generated": False
        }
    
    # Add choice to history
    user_progress[user_id]["choices_made"].append({
        "scene": scene_id,
        "choice": choice_id
    })
    
    # Simple scene progression logic
    next_scene_map = {
        "scene1": "scene2",
        "scene2": "scene3a", 
        "scene3a": "challenge1",
        "challenge1": "challenge2",
        "challenge2": "final_choice",
        "final_choice": "epilogue"
    }
    
    next_scene = next_scene_map.get(scene_id, "epilogue")
    user_progress[user_id]["current_scene"] = next_scene
    
    # Random achievement generation
    earned_achievements = []
    if random.random() > 0.6:  # 40% chance
        available_achievements = [a for a in achievements if a not in user_progress[user_id]["achievements"]]
        if available_achievements:
            new_achievement = random.choice(available_achievements)
            user_progress[user_id]["achievements"].append(new_achievement)
            earned_achievements.append(new_achievement)
    
    # Generate promo code for final choice
    promo_code = None
    if scene_id == "final_choice" and not user_progress[user_id]["promo_generated"]:
        promo_code = generate_promo_code()
        user_progress[user_id]["promo_generated"] = True
    
    return QuestResponse(
        next_scene_id=next_scene,
        scene_content={"message": f"Moving to {next_scene}"},
        achievements_earned=earned_achievements,
        promo_code=promo_code
    )

@app.get("/api/v1/user/{user_id}/progress")
async def get_user_progress(user_id: str):
    """Get user progress"""
    return user_progress.get(user_id, {
        "current_scene": "scene1",
        "choices_made": [],
        "achievements": [],
        "promo_generated": False
    })

@app.get("/api/v1/achievements")
async def get_achievements():
    """Get all available achievements"""
    return {"achievements": achievements}

if __name__ == "__main__":
    import uvicorn
    print("Starting Matrix Teaching Quest Simple Backend...")
    print("API will be available at: http://localhost:8000")
    print("API Documentation: http://localhost:8000/docs")
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    uvicorn.run("simple_main:app", host="0.0.0.0", port=8000, reload=True)
