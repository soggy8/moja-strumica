"""WSGI entry point for gunicorn (main:app)."""
from app import app, init_db

init_db()
