import traceback
from service.common_code.common_code_service import *
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()


@router.get("/common_code_list/", tags=['공통코드'], summary="공통 코드 리스트 조회")
async def total_common_code_list_api():
    try:
        result = total_common_code_list_service()
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/common_code/{code_id}", tags=['공통코드'], summary="공통 코드 조회")
async def common_code_id_api(code_id : str):
    try:
        result = common_code_id_service(code_id)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    

# 새로운 common_code 저장 
class common_code_creation_body(BaseModel):
    group_code: str = None
    code: str
    code_name: str = None
    sub_code: str = None
    sub_code2: str = None
    sub_code3: str = None
    sub_code4: str = None
    ref_code: str = None
    ref_code2: str = None
    ref_code3: str = None
    ref_code4: str = None
    description: str = None
    flag: str

    class Config:
        json_schema_extra = {
            "example": {
                "group_code": "SYS010",
                "code": "SYS0100010",
                "code_name":"1차 테스트",
                "sub_code": "",
                "sub_code2": "",
                "sub_code3": "",
                "sub_code4": "",
                "ref_code": "",
                "ref_code2": "",
                "ref_code3": "",
                "ref_code4": "",
                "description": "",
                "flag": "Y"
            }  
        }

@router.post("/common_code_creation/", tags=['공통코드'], summary="공통 코드 저장")
async def common_code_creation_api(body : common_code_creation_body):
    try:
        result = common_code_creation_service(body)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
    
    
@router.put("/common_code_update/{code_id}", tags=['공통코드'], summary="공통 코드 수정")
async def common_code_update_api(code_id : str, body : common_code_creation_body):
    try:
        result = common_code_update_service(code_id, body)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
    
@router.delete("/common_code_deletion/{code_id}", tags=['공통코드'], summary="공통 코드 삭제")
async def common_code_deletion_api(code_id : str):
    try:
        result = common_code_deletion_service(code_id)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")