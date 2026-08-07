"""Main Flask application – all REST endpoints for the library system."""

from flask import Flask, request, jsonify
from flask_cors import CORS
from db import execute_query, init_database
from datetime import datetime, timedelta

app = Flask(__name__)
app.secret_key = "libflow_super_secret_2026"
CORS(app, supports_credentials=True)

# ----------------------------------------------------------------------
# AUTH (login / logout)
# ----------------------------------------------------------------------
@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.json or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    user, _ = execute_query(
        "SELECT id, name, email, password_hash, role, avatar_url, department "
        "FROM users WHERE LOWER(email) = %s",
        (email,),
        fetchone=True,
    )
    if not user or user["password_hash"] != password:
        return jsonify({"error": "Invalid credentials"}), 401

    token = f"session_token_user_{user['id']}_libflow"
    user_data = {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "avatar_url": user["avatar_url"],
        "department": user.get("department", ""),
        "token": token,
    }
    return jsonify({"message": f"Welcome back, {user['name']}!", "user": user_data}), 200


@app.route("/api/auth/logout", methods=["POST"])
def logout():
    return jsonify({"message": "Signed out successfully"}), 200


# ----------------------------------------------------------------------
# HEALTH CHECK
# ----------------------------------------------------------------------
@app.route("/api/health", methods=["GET"])
def health_check():
    engine = init_database()
    return (
        jsonify(
            {
                "status": "healthy",
                "database_engine": engine,
                "timestamp": datetime.now().isoformat(),
            }
        ),
        200,
    )


# ----------------------------------------------------------------------
# DASHBOARD – summary + recent activity
# ----------------------------------------------------------------------
@app.route("/api/dashboard/stats", methods=["GET"])
def dashboard_stats():
    total_books, _ = execute_query(
        "SELECT SUM(total_copies) AS total FROM books", fetchone=True
    )
    total_books = total_books["total"] or 0

    active_loans, _ = execute_query(
        "SELECT COUNT(*) AS cnt FROM transactions WHERE status = %s",
        ("ISSUED",),
        fetchone=True,
    )
    active_loans = active_loans["cnt"]

    total_fines, _ = execute_query(
        "SELECT COALESCE(SUM(fine_amount),0) AS total FROM transactions WHERE status = %s",
        ("RETURNED",),
        fetchone=True,
    )
    total_fines = total_fines["total"]

    recent, _ = execute_query(
        """
        SELECT t.id,
               b.title AS book_title,
               m.name  AS member_name,
               t.issue_date,
               t.due_date,
               t.return_date,
               t.fine_amount,
               t.status
        FROM transactions t
        JOIN books b ON t.book_id = b.id
        JOIN members m ON t.member_id = m.id
        ORDER BY t.id DESC
        LIMIT 5
        """,
        fetchall=True,
    )
    recent = [dict(r) for r in recent]

    stats = {
        "total_book_copies": total_books,
        "active_loans": active_loans,
        "total_fines_collected": total_fines,
    }
    return jsonify({"stats": stats, "recent_activity": recent}), 200


# ----------------------------------------------------------------------
# BOOKS CRUD
# ----------------------------------------------------------------------
@app.route("/api/books", methods=["GET"])
def get_books():
    filters = []
    params = []

    title = request.args.get("title")
    author = request.args.get("author")
    isbn = request.args.get("isbn")
    category = request.args.get("category")
    dept = request.args.get("department")

    if title:
        filters.append("title LIKE %s")
        params.append(f"%{title}%")
    if author:
        filters.append("author LIKE %s")
        params.append(f"%{author}%")
    if isbn:
        filters.append("isbn = %s")
        params.append(isbn)
    if category:
        filters.append("category = %s")
        params.append(category)
    if dept:
        filters.append("department = %s")
        params.append(dept)

    where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""
    query = f"SELECT * FROM books {where_clause} ORDER BY title ASC"
    rows, _ = execute_query(query, tuple(params), fetchall=True)
    books = [dict(r) for r in rows]
    return jsonify({"books": books}), 200


@app.route("/api/books", methods=["POST"])
def create_book():
    data = request.json or {}
    required = ["isbn", "title", "author", "category", "total_copies"]
    missing = [k for k in required if not data.get(k)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    query = """
        INSERT INTO books (isbn, title, author, category, department,
                          shelf_location, edition, rating,
                          total_copies, available_copies, publisher,
                          publish_year)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (
        data["isbn"],
        data["title"],
        data["author"],
        data["category"],
        data.get("department"),
        data.get("shelf_location"),
        data.get("edition"),
        data.get("rating"),
        data["total_copies"],
        data["total_copies"],  # all copies are initially available
        data.get("publisher"),
        data.get("publish_year"),
    )
    execute_query(query, params, commit=True)
    return jsonify({"message": "Book created"}), 201


@app.route("/api/books/<int:book_id>", methods=["PUT"])
def update_book(book_id):
    data = request.json or {}
    set_clauses = []
    params = []
    for field in [
        "isbn",
        "title",
        "author",
        "category",
        "department",
        "shelf_location",
        "edition",
        "rating",
        "total_copies",
        "available_copies",
        "publisher",
        "publish_year",
    ]:
        if field in data:
            set_clauses.append(f"{field} = %s")
            params.append(data[field])

    if not set_clauses:
        return jsonify({"error": "No fields to update"}), 400

    params.append(book_id)
    query = f"UPDATE books SET {', '.join(set_clauses)} WHERE id = %s"
    execute_query(query, tuple(params), commit=True)
    return jsonify({"message": "Book updated"}), 200


@app.route("/api/books/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    execute_query("DELETE FROM books WHERE id = %s", (book_id,), commit=True)
    return jsonify({"message": "Book deleted"}), 200


# ----------------------------------------------------------------------
# MEMBERS CRUD
# ----------------------------------------------------------------------
@app.route("/api/members", methods=["GET"])
def get_members():
    filters = []
    params = []

    name = request.args.get("name")
    email = request.args.get("email")
    dept = request.args.get("department")
    role = request.args.get("role_type")
    status = request.args.get("status")

    if name:
        filters.append("name LIKE %s")
        params.append(f"%{name}%")
    if email:
        filters.append("email LIKE %s")
        params.append(f"%{email}%")
    if dept:
        filters.append("department = %s")
        params.append(dept)
    if role:
        filters.append("role_type = %s")
        params.append(role)
    if status:
        filters.append("status = %s")
        params.append(status)

    where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""
    query = f"SELECT * FROM members {where_clause} ORDER BY name ASC"
    rows, _ = execute_query(query, tuple(params), fetchall=True)
    members = [dict(r) for r in rows]
    return jsonify({"members": members}), 200


@app.route("/api/members", methods=["POST"])
def create_member():
    data = request.json or {}
    required = ["member_code", "name", "email", "role_type", "status"]
    missing = [k for k in required if not data.get(k)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    query = """
        INSERT INTO members (member_code, name, email, phone,
                            department, role_type, status, joined_date)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    params = (
        data["member_code"],
        data["name"],
        data["email"],
        data.get("phone"),
        data.get("department"),
        data["role_type"],
        data["status"],
        data.get("joined_date", datetime.now().date().isoformat()),
    )
    execute_query(query, params, commit=True)
    return jsonify({"message": "Member created"}), 201


@app.route("/api/members/<int:member_id>", methods=["PUT"])
def update_member(member_id):
    data = request.json or {}
    set_clauses = []
    params = []

    for field in [
        "member_code",
        "name",
        "email",
        "phone",
        "department",
        "role_type",
        "status",
    ]:
        if field in data:
            set_clauses.append(f"{field} = %s")
            params.append(data[field])

    if not set_clauses:
        return jsonify({"error": "No fields to update"}), 400

    params.append(member_id)
    query = f"UPDATE members SET {', '.join(set_clauses)} WHERE id = %s"
    execute_query(query, tuple(params), commit=True)
    return jsonify({"message": "Member updated"}), 200


@app.route("/api/members/<int:member_id>", methods=["DELETE"])
def delete_member(member_id):
    execute_query("DELETE FROM members WHERE id = %s", (member_id,), commit=True)
    return jsonify({"message": "Member deleted"}), 200


# ----------------------------------------------------------------------
# TRANSACTION – Issue & Return
# ----------------------------------------------------------------------
@app.route("/api/transactions/issue", methods=["POST"])
def issue_book():
    data = request.json or {}
    required = ["book_id", "member_id"]
    missing = [k for k in required if not data.get(k)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    book_row, _ = execute_query(
        "SELECT available_copies FROM books WHERE id = %s",
        (data["book_id"],),
        fetchone=True,
    )
    if not book_row:
        return jsonify({"error": "Book not found"}), 404
    if book_row["available_copies"] <= 0:
        return jsonify({"error": "No copies available"}), 400

    issue_date = datetime.now().date()
    due_date = issue_date + timedelta(days=14)

    query = """
        INSERT INTO transactions (book_id, member_id, issue_date,
                                 due_date, status, notes)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    params = (
        data["book_id"],
        data["member_id"],
        issue_date.isoformat(),
        due_date.isoformat(),
        "ISSUED",
        data.get("notes"),
    )
    execute_query(query, params, commit=True)

    # decrement available copies
    execute_query(
        "UPDATE books SET available_copies = available_copies - 1 WHERE id = %s",
        (data["book_id"],),
        commit=True,
    )
    return jsonify({"message": "Book issued", "due_date": due_date.isoformat()}), 201


@app.route("/api/transactions/return", methods=["POST"])
def return_book():
    data = request.json or {}
    required = ["transaction_id"]
    missing = [k for k in required if not data.get(k)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    txn, _ = execute_query(
        "SELECT * FROM transactions WHERE id = %s", (data["transaction_id"],), fetchone=True
    )
    if not txn:
        return jsonify({"error": "Transaction not found"}), 404
    if txn["status"] != "ISSUED":
        return jsonify({"error": "Transaction already returned"}), 400

    return_date = datetime.now().date()
    overdue_days = (return_date - datetime.fromisoformat(txn["due_date"]).date()).days
    fine_amount = max(0, overdue_days) * 1.0  # $1 per day overdue

    execute_query(
        """
        UPDATE transactions
        SET return_date = %s,
            fine_amount = %s,
            status = %s
        WHERE id = %s
        """,
        (return_date.isoformat(), fine_amount, "RETURNED", data["transaction_id"]),
        commit=True,
    )

    # increment available copies
    execute_query(
        "UPDATE books SET available_copies = available_copies + 1 WHERE id = %s",
        (txn["book_id"],),
        commit=True,
    )
    return (
        jsonify(
            {
                "message": "Book returned",
                "fine_amount": fine_amount,
                "overdue_days": overdue_days,
            }
        ),
        200,
    )


# ----------------------------------------------------------------------
# Run the app
# ----------------------------------------------------------------------
if __name__ == "__main__":
    init_database()
    print("Starting Flask API on http://0.0.0.0:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)
