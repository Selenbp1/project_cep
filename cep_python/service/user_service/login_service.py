import traceback
from service.auth.auth_handler import sign_jwt
from database.conn import *
from database.model_class import * 
from fastapi import HTTPException


def login_service(body):
    try:
        session = Session()
        username = body.username
        password = body.password
        
        query = session.query(User)\
                       .filter(User.username == username and User.password == password).first()
        if query:
            return {"username_jwt" : sign_jwt(query.username), "username" : username}
        else:
            raise HTTPException(status_code=400, detail="Invalid username or password")
    
    except:
        traceback.print_exc()
        return HTTPException(status_code=400, detail="Invalid username or password")