"""
Скрипт для массовой рассылки сообщений пользователям через Telegram Bot API
"""
import asyncio
import csv
import os
from typing import List, Dict
import aiohttp
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

if not BOT_TOKEN:
    print("❌ TELEGRAM_BOT_TOKEN не найден в .env файле!")
    print("Добавьте: TELEGRAM_BOT_TOKEN=your_bot_token")
    exit(1)

async def send_message(session: aiohttp.ClientSession, telegram_id: str, message: str) -> bool:
    """Отправить сообщение одному пользователю"""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    
    data = {
        "chat_id": telegram_id,
        "text": message,
        "parse_mode": "HTML"  # Поддержка HTML форматирования
    }
    
    try:
        async with session.post(url, json=data) as response:
            if response.status == 200:
                return True
            else:
                error = await response.json()
                print(f"❌ Ошибка отправки {telegram_id}: {error}")
                return False
    except Exception as e:
        print(f"❌ Исключение при отправке {telegram_id}: {e}")
        return False

async def send_bulk_messages(users: List[Dict], message_template: str, delay: float = 0.5):
    """Массовая рассылка с задержкой"""
    
    async with aiohttp.ClientSession() as session:
        success_count = 0
        fail_count = 0
        
        for i, user in enumerate(users, 1):
            telegram_id = user['telegram_id']
            username = user.get('username', 'User')
            first_name = user.get('first_name', '')
            
            # Персонализация сообщения
            message = message_template.format(
                username=username,
                first_name=first_name,
                telegram_id=telegram_id
            )
            
            print(f"[{i}/{len(users)}] Отправка {username} ({telegram_id})...", end=" ")
            
            success = await send_message(session, telegram_id, message)
            
            if success:
                print("✅")
                success_count += 1
            else:
                print("❌")
                fail_count += 1
            
            # Задержка чтобы не забанили
            await asyncio.sleep(delay)
        
        print("\n" + "="*50)
        print(f"✅ Успешно отправлено: {success_count}")
        print(f"❌ Ошибок: {fail_count}")
        print("="*50)

async def get_users_from_api() -> List[Dict]:
    """Получить пользователей из API"""
    url = "http://localhost:8000/api/v1/admin/export/users?format=json"
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.json()
                return data['data']
            else:
                print(f"❌ Ошибка получения пользователей: {response.status}")
                return []

def load_users_from_csv(filename: str) -> List[Dict]:
    """Загрузить пользователей из CSV файла"""
    users = []
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                users.append({
                    'telegram_id': row['Telegram ID'],
                    'username': row['Username'],
                    'first_name': row['First Name']
                })
        return users
    except FileNotFoundError:
        print(f"❌ Файл {filename} не найден!")
        return []

async def main():
    print("="*50)
    print("📧 МАССОВАЯ РАССЫЛКА TELEGRAM")
    print("="*50)
    print()
    
    # Выбор источника данных
    print("Выберите источник пользователей:")
    print("1. Из API (требует запущенный backend)")
    print("2. Из CSV файла")
    
    choice = input("\nВыбор (1/2): ").strip()
    
    if choice == "1":
        print("\n📥 Получение пользователей из API...")
        users = await get_users_from_api()
    elif choice == "2":
        filename = input("Введите имя CSV файла: ").strip()
        print(f"\n📥 Загрузка пользователей из {filename}...")
        users = load_users_from_csv(filename)
    else:
        print("❌ Неверный выбор!")
        return
    
    if not users:
        print("❌ Пользователи не найдены!")
        return
    
    print(f"✅ Загружено пользователей: {len(users)}")
    print()
    
    # Фильтрация
    print("Фильтровать пользователей?")
    print("1. Всем пользователям")
    print("2. Только завершившим квест")
    print("3. Только не завершившим квест")
    
    filter_choice = input("\nВыбор (1/2/3): ").strip()
    
    # TODO: Реализовать фильтрацию через API
    
    print()
    print("="*50)
    print("ШАБЛОН СООБЩЕНИЯ")
    print("="*50)
    print("Доступные переменные:")
    print("  {username} - username пользователя")
    print("  {first_name} - имя пользователя")
    print("  {telegram_id} - Telegram ID")
    print()
    print("Пример:")
    print("Привет, {first_name}! 🎯")
    print("Спасибо за прохождение Matrix Quest!")
    print()
    
    message_template = input("Введите текст сообщения:\n").strip()
    
    if not message_template:
        print("❌ Сообщение не может быть пустым!")
        return
    
    print()
    print("="*50)
    print("ПОДТВЕРЖДЕНИЕ")
    print("="*50)
    print(f"Пользователей: {len(users)}")
    print(f"Сообщение: {message_template[:50]}...")
    print()
    
    confirm = input("Начать рассылку? (yes/no): ").strip().lower()
    
    if confirm != "yes":
        print("❌ Рассылка отменена")
        return
    
    print()
    print("="*50)
    print("🚀 НАЧАЛО РАССЫЛКИ")
    print("="*50)
    print()
    
    await send_bulk_messages(users, message_template)

if __name__ == "__main__":
    asyncio.run(main())
