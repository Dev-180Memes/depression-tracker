from flask import request, jsonify
from app import app, db
from app.models import User, MoodEntry
from app.services.user_service import create_user, add_mood_entry, get_user_mood_entries
from app.utils.health_check import health_check
from flask_login import login_user, current_user


@app.route("/login", methods=["POST"])
def login():
    args = request.json
    user = User.query.filter_by(username=args["username"]).first()
    if not user:
        user = create_user(args["username"], args["email"], args["password"])
        return jsonify({"msg": f"User {user.username} created", "User": user.asdict()}), 201

    if not user.check_password(args["password"]):
        return jsonify({"msg": "Invalid password"}), 401

    login_user(user, remember=True)
    return jsonify({"msg": f"Logged in as {user.username}", "User": user.asdict()}), 200


@app.route("/getuser/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({"User": user.asdict()}), 200


@app.route("/mood", methods=["POST"])
def post_mood():
    args = request.json
    user_id = args["user_id"]
    mood_score = args["mood_score"]
    mood_entry = add_mood_entry(user_id, mood_score)
    return jsonify({"msg": "Mood entry added", "MoodEntry": mood_entry.asdict()}), 201


@app.route("/mood/<int:user_id>", methods=["GET"])
def get_user_moods(user_id):
    entries = get_user_mood_entries(user_id)
    if not entries:
        return jsonify({"msg": "No mood entries found for this user."}), 404

    return jsonify({"MoodEntries": [entry.asdict() for entry in entries]}), 200


@app.route("/health", methods=["GET"])
def health():
    return health_check()
