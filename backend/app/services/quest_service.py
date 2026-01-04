from typing import Dict, Any, Optional
import json

class QuestService:
    """Service for managing quest scenes and progression logic"""
    
    def __init__(self):
        self.scenes = self._load_scenes()
    
    def _load_scenes(self) -> Dict[str, Dict[str, Any]]:
        """Load all quest scenes with their content and choices"""
        return {
            "loading": {
                "type": "story",
                "title": "LOADING TEACHING_REALITY.EXE...",
                "content": {
                    "text": [
                        "LOADING TEACHING_REALITY.EXE...",
                        "ERROR 404: WORK_LIFE_BALANCE NOT FOUND",
                        "DETECTING ANOMALY...",
                        "TEACHER_BURNOUT_LEVEL: CRITICAL",
                        "",
                        "INCOMING MESSAGE..."
                    ],
                    "effects": ["matrix_code", "glitch", "typing"],
                    "audio": "notification_ping"
                },
                "auto_advance": True,
                "next_scene": "scene1",
                "delay": 5000
            },
            
            "scene1": {
                "type": "choice",
                "title": "GLITCH IN THE SYSTEM",
                "content": {
                    "text": [
                        "Do you feel it?",
                        "This endless loop...",
                        "Lesson plans → Grading → Preparation → Plans again...",
                        "",
                        "Are you tired of living in this simulation?",
                        "",
                        "SYSTEM: Message detected from Unknown_User",
                        "",
                        "Follow the white rabbit 🐰"
                    ],
                    "effects": ["screen_flicker", "terminal_cursor"],
                    "pov": "laptop_scene"
                },
                "choices": [
                    {
                        "id": "follow_rabbit",
                        "text": "🐰 Follow the rabbit",
                        "icon": "🐰",
                        "next_scene": "scene2"
                    },
                    {
                        "id": "close_message",
                        "text": "❌ Close message",
                        "icon": "❌",
                        "next_scene": "scene1_2"
                    }
                ]
            },
            
            "scene1_2": {
                "type": "story",
                "title": "LOOP DETECTED",
                "content": {
                    "text": [
                        "The screen goes dark. Turns on again.",
                        "You see yourself doing the same thing.",
                        "",
                        "You chose to stay. But the Matrix won't let go that easily..."
                    ],
                    "effects": ["groundhog_day", "screen_off_on", "glitch"],
                    "voice_over": "distorted"
                },
                "auto_advance": True,
                "next_scene": "scene1",
                "delay": 3000
            },
            
            "scene2": {
                "type": "story_choice",
                "title": "DIGITAL CORRIDOR",
                "content": {
                    "text": [
                        "Finally. You felt the glitch in the system.",
                        "",
                        "My name is AI-M. I'm your guide out of this reality.",
                        "",
                        "Do you know why you're here? Because you're asking the right questions:",
                        "",
                        "• Why do I spend 4 hours preparing one lesson?",
                        "• Why are my students yawning when I try so hard?",
                        "• Why are we in 2024 with methods from the 1990s?",
                        "",
                        "The choice is yours..."
                    ],
                    "effects": ["digital_corridor", "ai_avatar"],
                    "character": "ai_morpheus"
                },
                "choices": [
                    {
                        "id": "red_pill",
                        "text": "🔴 Red pill",
                        "description": "See the truth",
                        "next_scene": "scene3a"
                    },
                    {
                        "id": "blue_pill",
                        "text": "🔵 Blue pill",
                        "description": "Return to comfortable lies",
                        "next_scene": "scene3b"
                    },
                    {
                        "id": "purple_pill",
                        "text": "🟣 Purple pill",
                        "description": "What if...?",
                        "next_scene": "scene3c",
                        "hidden": True,
                        "unlock_delay": 30000
                    }
                ]
            },
            
            "scene3a": {
                "type": "story",
                "title": "AWAKENING",
                "content": {
                    "text": [
                        "Welcome to reality.",
                        "",
                        "What you saw before was a program. The Matrix of Traditional Teaching.",
                        "",
                        "It feeds on your energy, time, passion for teaching.",
                        "But there's another way. The Digital Teacher's Path.",
                        "",
                        "Ready for training?"
                    ],
                    "effects": ["digital_explosion", "white_room"],
                    "character": "ai_morpheus"
                },
                "auto_advance": True,
                "next_scene": "challenge1",
                "delay": 4000
            },
            
            "challenge1": {
                "type": "challenge",
                "title": "PROMPT-FU",
                "content": {
                    "text": [
                        "First skill - the art of prompting.",
                        "It's like martial arts. Requires precision, understanding, practice.",
                        "",
                        "Situation: Student yawning over textbook",
                        "Data: 14 years old, B1 level, topic: Present Perfect",
                        "",
                        "Choose the right prompt strike!"
                    ],
                    "effects": ["dojo", "holographic_student"],
                    "student_data": {
                        "age": 14,
                        "level": "B1",
                        "topic": "Present Perfect",
                        "state": "BORED.exe"
                    }
                },
                "choices": [
                    {
                        "id": "basic_prompt",
                        "text": "Create an exercise on Present Perfect",
                        "correct": False,
                        "feedback": "Too generic. No context."
                    },
                    {
                        "id": "better_prompt",
                        "text": "Make an interesting Present Perfect task for a teenager",
                        "correct": False,
                        "feedback": "Better, but still not specific enough."
                    },
                    {
                        "id": "perfect_prompt",
                        "text": "Create an interactive Present Perfect challenge for a 14-year-old B1 student. Format: detective story where they investigate 'Who has stolen the Wi-Fi password?' using Present Perfect for clues. Include: 5 suspects, evidence timeline, final reveal. Make it gen-Z relatable.",
                        "correct": True,
                        "feedback": "Excellent! You understand the power of context.",
                        "next_scene": "challenge2"
                    }
                ]
            },
            
            "challenge2": {
                "type": "challenge",
                "title": "BATTLE WITH AGENTS",
                "content": {
                    "text": [
                        "Careful! Agents of the Old System.",
                        "They will try to convince you to return."
                    ],
                    "effects": ["agents_appear", "matrix_fight"],
                    "agents": [
                        {
                            "id": "agent1",
                            "message": "AI is a fraud! A real teacher does everything themselves!",
                            "responses": [
                                {"text": "AI is a tool, like a calculator for a mathematician", "correct": True},
                                {"text": "I remain the creative director, AI is my assistant", "correct": True},
                                {"text": "More time for students, less for routine", "correct": True}
                            ]
                        }
                    ]
                },
                "next_scene": "challenge3"
            },
            
            "final_choice": {
                "type": "final_choice",
                "title": "POINT OF NO RETURN",
                "content": {
                    "text": [
                        "You've walked the path I walked two years ago.",
                        "",
                        "Now I have 23 students instead of 15.",
                        "I work 5 hours instead of 12.",
                        "Students are happy. So am I.",
                        "",
                        "Are you ready to become the architect of your reality?"
                    ],
                    "effects": ["city_view", "neo_yaroslav"],
                    "character": "neo_yaroslav"
                },
                "portals": [
                    {
                        "id": "the_one",
                        "title": "THE ONE",
                        "description": "Full immersion. 4 weeks intensive. Become a master.",
                        "promo_code": "REDPILL40",
                        "discount": 40,
                        "preview": "confident_ai_teacher"
                    },
                    {
                        "id": "chosen",
                        "title": "CHOSEN",
                        "description": "Support and mentorship. Grow gradually.",
                        "promo_code": "MORPHEUS25",
                        "discount": 25,
                        "preview": "learning_teacher"
                    },
                    {
                        "id": "awakened",
                        "title": "AWAKENED",
                        "description": "Basic knowledge. Start the journey.",
                        "promo_code": "RABBIT15",
                        "discount": 15,
                        "preview": "first_steps"
                    }
                ]
            }
        }
    
    def get_scene_content(self, scene_id: str) -> Optional[Dict[str, Any]]:
        """Get scene content by ID"""
        return self.scenes.get(scene_id)
    
    def get_next_scene(self, current_scene: str, choice_id: str) -> str:
        """Determine next scene based on current scene and choice"""
        scene = self.scenes.get(current_scene)
        if not scene:
            return "error"
        
        # Handle auto-advance scenes
        if scene.get("auto_advance"):
            return scene.get("next_scene", "error")
        
        # Handle choice-based scenes
        if "choices" in scene:
            for choice in scene["choices"]:
                if choice["id"] == choice_id:
                    return choice.get("next_scene", "error")
        
        # Handle portal choices
        if "portals" in scene:
            return "epilogue"
        
        return "error"
    
    def get_available_choices(self, scene_id: str, user_context: Dict = None) -> list:
        """Get available choices for a scene, considering user context"""
        scene = self.scenes.get(scene_id)
        if not scene or "choices" not in scene:
            return []
        
        choices = []
        for choice in scene["choices"]:
            # Check if choice is hidden and should be unlocked
            if choice.get("hidden") and user_context:
                # Add logic for unlocking hidden choices
                pass
            choices.append(choice)
        
        return choices
