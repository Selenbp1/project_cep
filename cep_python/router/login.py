from email.header import Header
import traceback
from fastapi import APIRouter, Form, HTTPException, Request
from fastapi.responses import RedirectResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from cep_python.service.user_service.login_service import generate_token, verify_token
from database.conn import *
from database.model_class import * 

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
    user_instance = session.query(User).filter(User.username == username).first()
    
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