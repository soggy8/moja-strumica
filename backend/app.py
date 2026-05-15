from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from pathlib import Path

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "applications.db"


def get_db_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    connection = get_db_connection()

    connection.execute("""
         CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            surname TEXT NOT NULL,
            company_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        """)

    connection.commit()
    connection.close()


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"message": "Backend is running"}), 200


@app.route("/api/applications", methods=["POST"])
def create_application():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    name = data.get("name", "").strip()
    surname = data.get("surname", "").strip()
    company_name = data.get("company_name", "").strip()
    email = data.get("email", "").strip()
    phone = data.get("phone", "").strip()

    if not name or not surname or not company_name or not email or not phone:
        return jsonify({"error": "All fields are required"}), 400

    try:
        connections = get_db_connection()

        connections.execute(
            """
            INSERT INTO applications (name, surname, company_name, email, phone)
            VALUES (?, ?, ?, ?, ?)
            """,
            (name, surname, company_name, email, phone),
        )

        connections.commit()
        connections.close()

        return jsonify({"message": "Application submitted successfully"}), 201

    except sqlite3.IntegrityError as error:
        error_message = str(error)
        if "applications.email" in error_message:
            return jsonify({"error": "Email already used in previous application"}), 409

        if "applications.phone" in error_message:
            return (
                jsonify({"error": "Phone number already used in previous application"}),
                409,
            )

        return jsonify({"error": "This application already exists"}), 409

    except Exception:
        return (
            jsonify({"error": "An error occurred while processing the application"}),
            500,
        )


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
