import traceback
from service.facility_service.facility_servcie import *
from service.user_service.user_service import get_token, verify_token
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi import APIRouter, HTTPException, Depends


router = APIRouter()

@router.get("/equipment_list", tags=['설비'], summary="설비 전체 리스트 조회")
async def total_equipment_list_api():
    try:
        result = total_equipment_list_service()
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
    
@router.get("/item_list/{equipment_id}", tags=['설비'], summary="아이템 전체 리스트 조회") # 15604664-a480-5163-bcd5-baf9132e1d1f
async def total_item_list_api(equipment_id : str):
    try:
        result = total_item_list_service(equipment_id)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")    
    

class facility_creation_body(BaseModel):
    facility_name: str
    equipment_name: str
    item_name: List[str]

    class Config:
        json_schema_extra = {
            "example": {
                "facility_name": "facility1",
                "equipment_name": "equipment_name1",
                "item_name": [
                    "item1", "item2" 
                ]
            }  
        }

@router.post("/facility_creation/", tags=['설비'], summary="공장 설비 및 아이템 정보 저장")
async def facility_creation_api(body : facility_creation_body, token: str = Depends(get_token)):
    try:
        if not verify_token(token):
            raise HTTPException(status_code=401, detail="Unauthorized")

        result = facility_creation_service(body)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")