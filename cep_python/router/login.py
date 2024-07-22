import traceback
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from service.user_service.login_service import login_service
from database.conn import *
from database.model_class import * 

router = APIRouter()

class LoginInfo(BaseModel):
    username : str = Field(..., example="string")
    password : str = Field(..., example="string")

@router.post("/login", tags=['로그인'], summary="로그인")
async def login_api(body : LoginInfo):
    try:
        result = login_service(body)
        return result['username_jwt']
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
