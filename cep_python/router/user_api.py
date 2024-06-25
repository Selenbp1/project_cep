from email.header import Header
import traceback
from fastapi import APIRouter, Request, Cookie, HTTPException, status, Form
from fastapi.responses import HTMLResponse, RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from database.conn import *
from database.model_class import * 
from service.user_service.user_service import generate_token, get_user_by_id, verify_token
from passlib.context import CryptContext

router = APIRouter()
templates = Jinja2Templates(directory="templates")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.get("/", response_class=JSONResponse)
async def home(request: Request, token: str = Header(None)):
    try:
        # print(token)
        if token is None or not verify_token(token):
            return RedirectResponse(url="/login")

        return {"message": "Welcome to the dashboard", "token": token}
    except Exception as e:
        traceback.print_exc()

@router.get("/login", response_class=JSONResponse)
async def login_page(request: Request):
    return {"message": "login success"}

@router.post("/login", response_class=JSONResponse)
async def login(request: Request, username: str = Form(...), password: str = Form(...)):
    user_instance = session.query(user).filter(user.username == username).first()
    
    if user_instance:
        if pwd_context.verify(password, user_instance.password):
            token = generate_token(username)
            response = JSONResponse(content={"message": "Login successful", "token": token})
            response.headers["Authorization"] = f"Bearer {token}"
            return response
        else:
            raise HTTPException(status_code=400, detail="Incorrect username or password")
    else:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

@router.post("/logout", response_class=JSONResponse)
async def logout():
    response = JSONResponse(content={"message": "Logout successful"})
    response.headers["Authorization"] = ""
    return response

@router.get("/users", response_class=JSONResponse)
async def users_list(request: Request, token: str = Header(None)):
    print(token)
    if not verify_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized")
    user_instance = session.query(user).all()
    return user_instance

@router.get("/users/{user_id}", response_class=JSONResponse)
async def get_user(user_id: int, token: str = Header(None)):
    if not verify_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized")

    user_instance = get_user_by_id(user_id)
    if not user_instance:
        raise HTTPException(status_code=404, detail="User not found")

    return {"user_id": user_instance.id, "username": user_instance.username}
    
@router.post("/users", response_class=JSONResponse)
async def create_user(username: str = Form(...), password: str = Form(...)):
    try:
        ashed_password = pwd_context.hash(password)
        user_instance = user(username=username, password=ashed_password)
        session.add(user_instance)
        session.commit()
        
        return {"message": "User created successfully"}
    except:
        traceback.print_exc()

@router.post("/users/info", response_class=JSONResponse)
async def create_user_info(username: str = Form(...), full_name: str = Form(...), email: str = Form(...), token: str = Header(None)):
    if not verify_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized")

    user_instance = session.query(user).filter(user.username == username).first()
    if user_instance:
        user_info_instance = user_info(user_id=user_instance.id, full_name=full_name, email=email)
        session.add(user_info_instance)
        session.commit()
        return {"message": f"Permissions granted for user {username}"}
    else:
        raise HTTPException(status_code=404, detail="User not found")


@router.post("/users/permissions", response_class=JSONResponse)
async def grant_permissions(username: str = Form(...), permission: str = Form(...), token: str = Header(None)):
    if not verify_token(token):
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    token_username = token.split(":")[0]  
    if token_username != username:  
        raise HTTPException(status_code=403, detail="Token does not match requested user")
        
    user_instance = session.query(user).filter(user.username == username).first()
    permission = permission.upper()
    if permission not in ("ADMIN", "READ", "CREATE", "UPDATE", "DELETE"):
        raise HTTPException(status_code=404, detail="Permission value not found")
    if user_instance:
        user_permission_instance = user_permission(user_id=user_instance.id, permission=permission)
        session.add(user_permission_instance)
        session.commit()
        return {"message": f"Permissions granted for user {username}"}
    else:
        raise HTTPException(status_code=404, detail="User not found")
