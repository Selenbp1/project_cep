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

    
# @router.get("/users", response_class=JSONResponse, tags=['사용자 정보'], summary="전체 사용자 정보 조회")
# async def users_list(request: Request, token: str = Header(None)):
#     print(token)
#     if not verify_token(token):
#         raise HTTPException(status_code=401, detail="Unauthorized")
#     user_instance = session.query(user).all()
#     return user_instance

# @router.get("/users/{user_id}", response_class=JSONResponse, tags=['사용자 정보'], summary="사용자 정보 조회")
# async def get_user(user_id: int, token: str = Header(None)):
#     if not verify_token(token):
#         raise HTTPException(status_code=401, detail="Unauthorized")

#     user_instance = get_user_by_id(user_id)
#     if not user_instance:
#         raise HTTPException(status_code=404, detail="User not found")

#     return {"user_id": user_instance.id, "username": user_instance.username}
    
# @router.post("/users", response_class=JSONResponse, tags=['사용자 정보'], summary="사용자 정보 저장")
# async def create_user(username: str = Form(...), password: str = Form(...)):
#     try:
#         ashed_password = pwd_context.hash(password)
#         user_instance = user(username=username, password=ashed_password)
#         session.add(user_instance)
#         session.commit()
        
#         return {"message": "User created successfully"}
#     except:
#         traceback.print_exc()

# @router.post("/users/info", response_class=JSONResponse)
# async def create_user_info(username: str = Form(...), full_name: str = Form(...), email: str = Form(...), token: str = Header(None)):
#     if not verify_token(token):
#         raise HTTPException(status_code=401, detail="Unauthorized")

#     user_instance = session.query(user).filter(user.username == username).first()
#     if user_instance:
#         user_info_instance = user_info(user_id=user_instance.id, full_name=full_name, email=email)
#         session.add(user_info_instance)
#         session.commit()
#         return {"message": f"Permissions granted for user {username}"}
#     else:
#         raise HTTPException(status_code=404, detail="User not found")


# @router.post("/users/permissions", response_class=JSONResponse)
# async def grant_permissions(username: str = Form(...), permission: str = Form(...), token: str = Header(None)):
#     if not verify_token(token):
#         raise HTTPException(status_code=401, detail="Unauthorized")
    
#     token_username = token.split(":")[0]  
#     if token_username != username:  
#         raise HTTPException(status_code=403, detail="Token does not match requested user")
        
#     user_instance = session.query(user).filter(user.username == username).first()
#     permission = permission.upper()
#     if permission not in ("ADMIN", "READ", "CREATE", "UPDATE", "DELETE"):
#         raise HTTPException(status_code=404, detail="Permission value not found")
#     if user_instance:
#         user_permission_instance = user_permission(user_id=user_instance.id, permission=permission)
#         session.add(user_permission_instance)
#         session.commit()
#         return {"message": f"Permissions granted for user {username}"}
#     else:
#         raise HTTPException(status_code=404, detail="User not found")
