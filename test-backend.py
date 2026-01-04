#!/usr/bin/env python3
"""
Quick test to check if backend dependencies work
"""

try:
    print("Testing FastAPI import...")
    from fastapi import FastAPI
    print("✅ FastAPI imported successfully")
    
    print("Testing Pydantic import...")
    from pydantic import BaseModel
    print("✅ Pydantic imported successfully")
    
    print("Testing Uvicorn import...")
    import uvicorn
    print("✅ Uvicorn imported successfully")
    
    print("Testing SQLAlchemy import...")
    from sqlalchemy import create_engine
    print("✅ SQLAlchemy imported successfully")
    
    print("\n🎉 All backend dependencies work!")
    print("You can now run: deploy\\start-simple-fullstack.bat")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Please run: deploy\\install-python310.bat")

input("\nPress Enter to continue...")
