import traceback
from service.common_code.common_code_service import *
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

router = APIRouter()

@router.get("/codes", tags=['공통코드'], summary="공통 코드 리스트 조회")
async def total_common_code_list_api(page: int = 1, pageSize: int = 3):
    try:
        result = total_common_code_list_service(page, pageSize)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/subcodes", tags=['공통코드'], summary="하위 코드 리스트 조회")
async def sub_common_code_list_api(parentCodeId: str, page: int = 1, pageSize: int = 10):
    try:
        result = sub_common_code_list_service(parentCodeId, page, pageSize)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

# @router.get("/code/{code_id}", tags=['공통코드'], summary="공통 코드 조회")
# async def common_code_id_api(code_id: str):
#     try:
#         result = common_code_id_service(code_id)
#         return result
#     except Exception as e:
#         traceback.print_exc()
#         raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

class CommonCodeCreationBody(BaseModel):
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
                "code_name": "1차 테스트",
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

@router.post("/code", tags=['공통코드'], summary="공통 코드 저장")
async def common_code_creation_api(body: CommonCodeCreationBody):
    try:
        result = common_code_creation_service(body)
        print(body)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.put("/code/{code_id}", tags=['공통코드'], summary="공통 코드 수정")
async def common_code_update_api(code_id: str, body: CommonCodeCreationBody):
    try:
        result = common_code_update_service(code_id, body)
        print(body)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.delete("/code/{code_id}", tags=['공통코드'], summary="공통 코드 삭제")
async def common_code_deletion_api(code_id: str):
    try:
        result = common_code_deletion_service(code_id)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
