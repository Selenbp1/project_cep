import hmac
import hashlib
import secrets
import time
from typing import Optional
from fastapi import APIRouter, Request, Cookie, HTTPException, status, Form
from database.conn import *
from database.model_class import * 


SECRET_KEY = "sfsdfe"

TOKEN_EXPIRATION = 3600 

if not SECRET_KEY:
    raise ValueError("No SECRET_KEY set for Flask application")

def generate_token(username):
    expiration_time = int(time.time()) + TOKEN_EXPIRATION
    salt = secrets.token_urlsafe(16)
    token_data = f"{username}:{expiration_time}:{salt}"
    signature = hmac.new(SECRET_KEY.encode(), token_data.encode(), hashlib.sha256).hexdigest()
    token = f"{username}:{expiration_time}:{salt}:{signature}"
    return token

def verify_token(token):
    if token is None:
        return False
    try:
        username, expiration_time, salt, signature = token.split(":")
        current_time = int(time.time())
        if current_time > int(expiration_time):
            return False

        reconstructed_token = f"{username}:{expiration_time}:{salt}"
        expected_signature = hmac.new(SECRET_KEY.encode(), reconstructed_token.encode(), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(signature, expected_signature):
            return False

        return True

    except ValueError:
        return False

def get_token(token: str = Cookie(None)):
    if not verify_token(token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return token

def get_user_by_id(user_id: int) -> Optional[user]:
    return session.query(user).filter(user.id == user_id).first()


