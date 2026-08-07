import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "library_db.sqlite"


def init_database():
    """Create tables if they don't exist."""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Users (for login)
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT,
            avatar_url TEXT,
            department TEXT
        )
        """
    )

    # Books
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            isbn TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            category TEXT NOT NULL,
            department TEXT,
            shelf_location TEXT,
            edition TEXT,
            rating REAL,
            total_copies INTEGER,
            available_copies INTEGER,
            publisher TEXT,
            publish_year INTEGER
        )
        """
    )

    # Members
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS members (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            member_code TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT,
            department TEXT,
            role_type TEXT,
            status TEXT,
            joined_date TEXT
        )
        """
    )

    # Transactions
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            book_id INTEGER,
            member_id INTEGER,
            issue_date TEXT,
            due_date TEXT,
            return_date TEXT,
            fine_amount REAL,
            status TEXT,
            notes TEXT,
            FOREIGN KEY(book_id) REFERENCES books(id),
            FOREIGN KEY(member_id) REFERENCES members(id)
        )
        """
    )

    conn.commit()
    conn.close()
    return "sqlite"


def execute_query(query, params=None, fetchone=False, fetchall=False, commit=False):
    """Utility wrapper around SQLite execution."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(query, params or ())
    result = None
    if fetchone:
        result = cur.fetchone()
    if fetchall:
        result = cur.fetchall()
    if commit:
        conn.commit()
    conn.close()
    return result, "sqlite"
