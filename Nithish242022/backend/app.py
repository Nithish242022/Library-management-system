from flask import Flask, request, jsonify
from flask_cors import CORS
from db import execute_query, init_database
from datetime import datetime, date, timedelta

app = Flask(__name__)
app.secret_key = "libflow_super_secret_session_key_2026"
CORS(app, supports_credentials=True)

# ---- AUTH ENDPOINTS -------------------------------------------------
@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user, _ = execute_query(
        "SELECT id, name, email, password_hash, role, avatar_url, department FROM users WHERE LOWER(email) = %s",
        (email,),
        fetchone=True,
    )
    if not user or user["password_hash"] != password:
        return jsonify({"error": "Invalid credentials"}), 401

    user_data = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "avatar_url": user["avatar_url"],
        "department": user.get("department", ""),
        "token": f"session_token_user_{user['id']}_libflow",
    }
    return jsonify({"message": f"Welcome back, {user['name']}!", "user": user_data}), 200

@app.route("/api/auth/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Signed out successfully"}), 200

# ---- HEALTH ---------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health_check():
    engine = init_database()
    return jsonify({"status": "healthy", "database_engine": engine, "timestamp": datetime.now().isoformat()}), 200

# ---- DASHBOARD -------------------------------------------------------
@app.route("/api/dashboard/stats", methods=["GET"])
def get_dashboard_stats():
    # (implementation omitted for brevity – already present in your code)
    pass

# ---- BOOKS CRUD -------------------------------------------------------
# (GET /api/books, POST /api/books, etc. – all already in app.py)

# ---- MEMBERS CRUD ------------------------------------------------------
# (similar pattern to books)

# ---- TRANSACTIONS ----------------------------------------------------
# (issue, return, list, etc.)

if __name__ == "__main__":
    init_database()
    print("Starting Flask API on http://0.0.0.0:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
