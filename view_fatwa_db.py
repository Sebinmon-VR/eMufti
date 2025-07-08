import sqlite3
import os

# Database filename (must be in same folder as this script)
DB_FILE = "fatwa_project.db"

def connect_db():
    if not os.path.exists(DB_FILE):
        print(f"❌ ERROR: Database file '{DB_FILE}' not found in {os.getcwd()}")
        return None
    try:
        print(f"📂 Connecting to DB at: {os.path.abspath(DB_FILE)}")
        conn = sqlite3.connect(DB_FILE)
        print("✅ Connected successfully.")
        return conn
    except sqlite3.Error as e:
        print("❌ Error connecting to database:", e)
        return None

def test_query(cursor):
    try:
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        if not tables:
            print("⚠️ No tables found in the database.")
        else:
            print(f"\n📊 Tables in database: {[t[0] for t in tables]}")
    except Exception as e:
        print("❌ Error fetching table list:", e)

def fetch_all(cursor, table_name):
    try:
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        print(f"\n📄 {table_name.upper()} ({len(rows)} rows):")
        for row in rows:
            print(row)
    except Exception as e:
        print(f"❌ Error reading table '{table_name}':", e)

def main():
    conn = connect_db()
    if conn:
        cursor = conn.cursor()

        # Step 1: Show tables
        test_query(cursor)

        # Step 2: Try fetching each known table
        tables = ["users", "chats", "fatwa", "banned_context"]
        for table in tables:
            fetch_all(cursor, table)

        conn.close()
    else:
        print("❌ Failed to connect to the database.")

if __name__ == "__main__":
    main()
