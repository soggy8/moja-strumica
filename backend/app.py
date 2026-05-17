from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from pathlib import Path

app = Flask(__name__)
CORS(app)

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.getenv("DATABASE_PATH", BASE_DIR / "applications.db"))
ADMIN_PASSWORD = os.getenv(
    "ADMIN_PASSWORD", "admin123"
)  # Default password for admin access
SHOW_API_ERRORS = os.getenv("SHOW_API_ERRORS", "").lower() in {"1", "true", "yes"}


def server_error(message, error=None, status=500):
    if error is not None:
        app.logger.exception("%s: %s", message, error)

    payload = {"error": message}
    if SHOW_API_ERRORS and error is not None:
        payload["detail"] = str(error)

    return jsonify(payload), status


def get_db_connection():
    connection = sqlite3.connect(DB_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

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

    columns = {
        row[1]
        for row in connection.execute("PRAGMA table_info(applications)")
    }
    if columns and "company_name" not in columns:
        connection.execute(
            "ALTER TABLE applications ADD COLUMN company_name TEXT NOT NULL DEFAULT ''"
        )

    init_promo_spots_table(connection)

    connection.commit()
    connection.close()


def init_promo_spots_table(connection):
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS promo_spots (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            founder_spots_left INTEGER NOT NULL DEFAULT 3,
            early_bird_spots_left INTEGER NOT NULL DEFAULT 7,
            updated_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    connection.execute(
        """
        INSERT OR IGNORE INTO promo_spots (id, founder_spots_left, early_bird_spots_left)
        VALUES (1, 3, 7)
        """
    )


def database_error_response(error):
    message = str(error).lower()

    if "readonly" in message or "read-only" in message:
        return server_error(
            "Database is read-only. Grant the API service user write access to the database file and its directory.",
            error,
        )

    if "unable to open" in message:
        return server_error(
            "Database file could not be opened. Check DATABASE_PATH and directory permissions.",
            error,
        )

    if "no such table" in message or "no such column" in message:
        return server_error(
            "Database schema is outdated. Restart the API service or remove the old applications.db so it can be recreated.",
            error,
        )

    return server_error("Database error occurred", error)


@app.route("/api/health", methods=["GET"])
def health_check():
    try:
        connection = get_db_connection()
        connection.execute("SELECT 1")
        connection.close()
        return (
            jsonify(
                {
                    "message": "Backend is running",
                    "database": str(DB_PATH),
                    "database_writable": os.access(DB_PATH.parent, os.W_OK),
                }
            ),
            200,
        )
    except Exception as error:
        app.logger.exception("Health check database error: %s", error)
        return (
            jsonify(
                {
                    "message": "Backend is running",
                    "database": str(DB_PATH),
                    "database_error": str(error),
                }
            ),
            503,
        )


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
        connection = get_db_connection()

        connection.execute(
            """
            INSERT INTO applications (name, surname, company_name, email, phone)
            VALUES (?, ?, ?, ?, ?)
            """,
            (name, surname, company_name, email, phone),
        )

        connection.commit()
        connection.close()

        return jsonify({"message": "Application submitted successfully"}), 201

    except sqlite3.IntegrityError as error:
        error_message = str(error).lower()
        if "email" in error_message:
            return jsonify({"error": "Email already used in previous application"}), 409

        if "phone" in error_message:
            return (
                jsonify({"error": "Phone number already used in previous application"}),
                409,
            )

        return jsonify({"error": "This application already exists"}), 409

    except sqlite3.OperationalError as error:
        return database_error_response(error)

    except Exception as error:
        return server_error(
            "An error occurred while processing the application",
            error,
        )


@app.route("/api/promo-spots", methods=["GET"])
def get_promo_spots():
    try:
        connection = get_db_connection()
        init_promo_spots_table(connection)
        connection.commit()
        row = connection.execute(
            """
            SELECT founder_spots_left, early_bird_spots_left
            FROM promo_spots
            WHERE id = 1
            """
        ).fetchone()
        connection.close()

        if not row:
            return (
                jsonify({"founderSpotsLeft": 3, "earlyBirdSpotsLeft": 7}),
                200,
            )

        return (
            jsonify(
                {
                    "founderSpotsLeft": int(row["founder_spots_left"]),
                    "earlyBirdSpotsLeft": int(row["early_bird_spots_left"]),
                }
            ),
            200,
        )

    except sqlite3.OperationalError as error:
        return database_error_response(error)

    except Exception as error:
        return server_error("Could not load promo spots", error)


@app.route("/api/admin/promo-spots", methods=["PUT"])
def update_promo_spots():
    admin_password = request.headers.get("X-Admin-Password", "")

    if admin_password != ADMIN_PASSWORD:
        return jsonify({"error": "Unauthorized access"}), 401

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        founder = int(data.get("founderSpotsLeft"))
        early_bird = int(data.get("earlyBirdSpotsLeft"))
    except (TypeError, ValueError):
        return jsonify({"error": "founderSpotsLeft and earlyBirdSpotsLeft must be integers"}), 400

    if founder < 0 or early_bird < 0 or founder > 100 or early_bird > 100:
        return jsonify({"error": "Values must be between 0 and 100"}), 400

    try:
        connection = get_db_connection()
        init_promo_spots_table(connection)
        connection.execute(
            """
            UPDATE promo_spots
            SET founder_spots_left = ?,
                early_bird_spots_left = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = 1
            """,
            (founder, early_bird),
        )
        connection.commit()
        connection.close()

        return (
            jsonify(
                {
                    "founderSpotsLeft": founder,
                    "earlyBirdSpotsLeft": early_bird,
                }
            ),
            200,
        )

    except sqlite3.OperationalError as error:
        return database_error_response(error)

    except Exception as error:
        return server_error("Could not update promo spots", error)


@app.route("/api/admin/applications", methods=["GET"])
def get_all_applications():
    admin_password = request.headers.get("X-Admin-Password", "")

    if admin_password != ADMIN_PASSWORD:
        return jsonify({"error": "Unauthorized access"}), 401

    try:
        connection = get_db_connection()

        applications = connection.execute("""
            SELECT id, name, surname, company_name, email, phone, created_at
            FROM applications
            ORDER BY created_at DESC                """).fetchall()

        connection.close()

        applications_list = [dict(row) for row in applications]

        return jsonify({"applications": applications_list}), 200

    except sqlite3.OperationalError as error:
        return database_error_response(error)

    except Exception as error:
        return server_error("An error occurred while loading applications", error)


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
