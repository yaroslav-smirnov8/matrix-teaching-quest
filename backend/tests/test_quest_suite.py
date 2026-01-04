import pytest
import sys
import os
import json
from unittest.mock import MagicMock, AsyncMock, patch
from datetime import datetime

# Add the backend directory to sys.path to ensure imports work
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi.testclient import TestClient
from main import app
from app.services.quest_service import QuestService
from app.models.user import User
from app.db.database import get_db

# ==========================================
# 1. UNIT TESTS FOR QuestService
# ==========================================

class TestQuestService:
    @pytest.fixture
    def service(self):
        return QuestService()

    def test_load_scenes_structure(self, service):
        """Test that scenes are loaded and have correct structure"""
        scenes = service.scenes
        assert "loading" in scenes
        assert "scene1" in scenes
        assert scenes["loading"]["type"] == "story"
        assert scenes["scene1"]["type"] == "choice"

    def test_get_scene_content_valid(self, service):
        """Test retrieving valid scene content"""
        content = service.get_scene_content("scene1")
        assert content is not None
        assert content["title"] == "GLITCH IN THE SYSTEM"
        assert "choices" in content

    def test_get_scene_content_invalid(self, service):
        """Test retrieving invalid scene content returns None"""
        content = service.get_scene_content("non_existent_scene")
        assert content is None

    def test_get_next_scene_valid_choice(self, service):
        """Test transitioning to next scene with valid choice"""
        # scene1 -> follow_rabbit -> scene2
        next_scene = service.get_next_scene("scene1", "follow_rabbit")
        assert next_scene == "scene2"

    def test_get_next_scene_auto_advance(self, service):
        """Test auto-advance scenes"""
        # loading -> auto -> scene1
        next_scene = service.get_next_scene("loading", "any_id")
        assert next_scene == "scene1"

    def test_get_next_scene_invalid_choice(self, service):
        """Test invalid choice returns error or default"""
        # scene1 has no choice "invalid_choice"
        next_scene = service.get_next_scene("scene1", "invalid_choice")
        assert next_scene == "error"

    def test_get_available_choices(self, service):
        """Test retrieving available choices"""
        choices = service.get_available_choices("scene1")
        assert len(choices) == 2
        choice_ids = [c["id"] for c in choices]
        assert "follow_rabbit" in choice_ids
        assert "close_message" in choice_ids


# ==========================================
# 2. INTEGRATION / API TESTS
# ==========================================

# Mock DB Session
class MockAsyncSession:
    def __init__(self):
        self.execute_result = MagicMock()
        self.execute_result.scalar_one_or_none.return_value = None
        self.added = []
        self.committed = False

    async def execute(self, query):
        return self.execute_result

    def add(self, obj):
        self.added.append(obj)

    async def commit(self):
        self.committed = True

    async def refresh(self, obj):
        if hasattr(obj, 'id') and obj.id is None:
            obj.id = 1

# Dependency Override
async def override_get_db():
    yield MockAsyncSession()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

class TestQuestAPI:
    
    def test_health_check(self):
        """Test API health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy", "message": "API is operational"}

    @patch("app.api.routes.quest.select")
    def test_start_quest_new_user(self, mock_select):
        """Test starting quest for a new user"""
        payload = {
            "telegram_id": "123456",
            "username": "test_neo",
            "language_code": "en"
        }
        
        response = client.post("/api/v1/quest/start", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["scene_id"] == "loading"
        assert "Welcome to the Matrix" in data["message"]

    @patch("app.api.routes.quest.QuestService") 
    def test_make_choice(self, MockQuestService):
        """Test making a choice in the quest"""
        # Mock QuestService behavior
        mock_service = MockQuestService.return_value
        mock_service.get_next_scene.return_value = "scene2"
        mock_service.get_scene_content.return_value = {"title": "Scene 2", "text": "..."}
        
        payload = {
            "telegram_id": "123456",
            "scene_id": "scene1",
            "choice_id": "follow_rabbit",
            "choice_text": "Follow the white rabbit"
        }
        
        response = client.post("/api/v1/quest/choice", json=payload)
        
        assert response.status_code == 200
        data = response.json()
        assert data["next_scene_id"] == "scene2"


# ==========================================
# 3. END-TO-END (SIMULATED) SCENARIO
# ==========================================

def test_full_quest_flow():
    """
    Simulates a user going through the quest:
    Start -> Loading -> Scene1 -> Scene2 -> Scene3a
    """
    # 1. Start Quest
    start_payload = {"telegram_id": "999", "username": "e2e_user", "language_code": "en"}
    response = client.post("/api/v1/quest/start", json=start_payload)
    assert response.status_code == 200
    current_scene = response.json()["scene_id"]
    assert current_scene == "loading"
    
    # 2. Scene1: Choose "Follow Rabbit"
    choice_payload = {
        "telegram_id": "999",
        "scene_id": "scene1",
        "choice_id": "follow_rabbit",
        "choice_text": "Rabbit"
    }
    response = client.post("/api/v1/quest/choice", json=choice_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["next_scene_id"] == "scene2"
    
    # 3. Scene2: Choose "Red Pill"
    choice_payload = {
        "telegram_id": "999",
        "scene_id": "scene2",
        "choice_id": "red_pill",
        "choice_text": "Red Pill"
    }
    response = client.post("/api/v1/quest/choice", json=choice_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["next_scene_id"] == "scene3a"

# ==========================================
# 4. EDGE CASES
# ==========================================

def test_invalid_scene_access():
    """Test accessing a non-existent scene via API"""
    response = client.get("/api/v1/quest/scene/invalid_scene_id_999")
    assert response.status_code == 404

def test_missing_payload_field():
    """Test sending incomplete payload"""
    # Missing choice_id
    payload = {
        "telegram_id": "123456",
        "scene_id": "scene1"
    }
    response = client.post("/api/v1/quest/choice", json=payload)
    assert response.status_code == 422
