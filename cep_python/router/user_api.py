from email.header import Header
import traceback
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from service.user_service.models import *
from service.user_service.user_service import *
from database.conn import *
from database.model_class import * 
from passlib.context import CryptContext
from pydantic import BaseModel
from typing import List


router = APIRouter()
templates = Jinja2Templates(directory="templates")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.get("/users", tags=['사용자 정보'], summary="전체 사용자 정보 조회")
async def users_list_api(page: int = 1, pageSize: int = 10):
    try:
        result = users_list_service(page, pageSize)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.post("/users", tags=['사용자 정보'], summary="사용자 추가", response_model=UserResponse)
async def create_user_api(user_data: UserCreateRequest):
    try:
        created_user = create_user_service(user_data)
        return created_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.put("/users/{user_id}", tags=['사용자 정보'], summary="사용자 정보 수정", response_model=UserResponse)
async def update_user_api(user_id: int, updated_user_data: UserUpdateRequest):
    try:
        updated_user = update_user_service(user_id, updated_user_data)
        return updated_user
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.delete("/users/{user_id}", tags=['사용자 정보'], summary="사용자 삭제")
async def delete_user_api(user_id: int):
    try:
        delete_user_service(user_id)
        return JSONResponse(content={"message": f"User with ID {user_id} deleted successfully"}, status_code=200)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
