from app import db
from app.models import User, MoodEntry

def create_user(username, email, password):
    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return user

def add_mood_entry(user_id, mood_score):
    mood_entry = MoodEntry(user_id=user_id, mood_score=mood_score)
    db.session.add(mood_entry)
    db.session.commit()
    return mood_entry

def get_user_mood_entries(user_id):
    return MoodEntry.query.filter_by(user_id=user_id).all()
