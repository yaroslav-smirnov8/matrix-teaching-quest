#!/usr/bin/env python3
"""
Test PostgreSQL connection and create database if needed
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Database connection parameters
DB_HOST = 'localhost'
DB_PORT = 5432
DB_USER = 'postgres'
DB_PASSWORD = 'upp7ufary'  # From .env file
DB_NAME = 'matrix_quest'

def test_connection():
    try:
        print("Testing PostgreSQL connection...")
        
        # Connect to default postgres database
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database='postgres'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        print("✅ Connected to PostgreSQL successfully!")
        
        # Check if matrix_quest database exists
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (DB_NAME,))
        exists = cursor.fetchone()
        
        if exists:
            print(f"✅ Database '{DB_NAME}' already exists")
        else:
            print(f"Creating database '{DB_NAME}'...")
            cursor.execute(f'CREATE DATABASE {DB_NAME};')
            print(f"✅ Database '{DB_NAME}' created successfully!")
        
        cursor.close()
        conn.close()
        
        # Test connection to matrix_quest database
        print(f"Testing connection to '{DB_NAME}' database...")
        test_conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        test_conn.close()
        print(f"✅ Connection to '{DB_NAME}' database successful!")
        
        return True
        
    except psycopg2.OperationalError as e:
        print(f"❌ Connection failed: {e}")
        print("\nPossible solutions:")
        print("1. Check if PostgreSQL service is running")
        print("2. Verify password in .env file")
        print("3. Check if PostgreSQL is listening on port 5432")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    success = test_connection()
    if success:
        print("\n🎉 Database setup is ready!")
        print("You can now start the backend server.")
    else:
        print("\n💥 Database setup failed!")
        print("Please fix the issues above before starting the backend.")
    
    input("\nPress Enter to continue...")
