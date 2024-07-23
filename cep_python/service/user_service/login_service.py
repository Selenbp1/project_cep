import traceback
from sqlalchemy import and_
from service.user_service.user_service import verify_password
from service.auth.auth_handler import sign_jwt
from database.conn import *
from database.model_class import * 
from fastapi import HTTPException

def login_service(body):
    try:
        session = Session()
        username = body.username
        password = body.password
        
        user = session.query(User).filter(User.username == username).first()
                       
        if user and verify_password(user.password, password):
            return {"username_jwt": sign_jwt(user.username), "username": username}
        else:
            raise HTTPException(status_code=400, detail="Invalid username or password")
    
    except:
        traceback.print_exc()
        return HTTPException(status_code=400, detail="Invalid username or password")