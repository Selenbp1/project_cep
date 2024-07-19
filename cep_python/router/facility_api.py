import traceback
from service.facility_service.facility_servcie import *
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from fastapi import APIRouter, HTTPException

router = APIRouter()
    
@router.get("/equipment", tags=['설비'], summary="설비 전체 리스트 조회")
async def total_equipment_list_api(page: int = 1, pageSize: int = 10):
    try:
        result = total_equipment_list_service(page, pageSize)
        return result
    except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
        
@router.get("/equipment/{equipment_id}", tags=['설비'], summary="아이템 전체 리스트 조회")
async def total_item_list_api(equipment_id: str):
    try:
        result = total_item_list_service(equipment_id)
        return result
    except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

class Item(BaseModel):
    id: Optional[int]
    item_uuid: str = Field(..., example="string")
    item_nm: str = Field(..., example="string")
    data_type: str = Field(..., example="string")
    
class FacilityCreationBody(BaseModel):
    equipment_nm: str = Field(..., example="string")
    topic_id: str = Field(..., example="string")
    topic_nm: str = Field(..., example="string")
    ip: str = Field(..., example="string")
    port: str = Field(..., example="string")
    item: List[Item]

    class Config:
        json_schema_extra = {
            "example": {
                "equipment_nm": "string",
                "topic_id": "string",
                "topic_nm": "string",
                "ip": "string",
                "port": "string",
                "item": [
                    {
                        "item_nm": "string",
                        "data_type": "string"
                    },
                    {
                        "item_nm": "string",
                        "data_type": "string"
                    }
                ]
            }
        }
        

class FacilityUpdatenBody(BaseModel):
    equipment_id: str = Field(..., example="string")
    equipment_nm: str = Field(..., example="string")
    topic_id: str = Field(..., example="string")
    topic_nm: str = Field(..., example="string")
    ip: str = Field(..., example="string")
    port: str = Field(..., example="string")
    item: List[Item]

    class Config:
        json_schema_extra = {
            "example": {
                "equipment_id": "string",
                "equipment_nm": "string",
                "topic_nm": "string",
                "ip": "string",
                "port": "string",
                "item": [
                    {
                        "id": 0,
                        "item_uuid": "string",
                        "item_nm": "string",
                        "data_type": "string"
                    },
                    {
                        "id": None,
                        "item_uuid": "string",
                        "item_nm": "string",
                        "data_type": "string"
                    }
                ]
            }
        }
    
@router.post("/equipment", tags=['설비'], summary="Create facility, equipment, and items")
async def facility_creation_api(body: FacilityCreationBody):
    try:
        result = facility_creation_service(body)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.put("/equipment/{equipment_id}", tags=['설비'], summary="Update facility, equipment, and items")
async def facility_update_api(equipment_id: int, body: FacilityUpdatenBody):
    try:
        result = facility_update_service(equipment_id, body)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
        
@router.delete("/equipment/{equipment_id}", tags=['설비'], summary="공장 설비 및 아이템 정보 삭제")
async def facility_deletion_api(equipment_id: int):
    try:
        result = facility_deletion_service(equipment_id)
        return result
    except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")