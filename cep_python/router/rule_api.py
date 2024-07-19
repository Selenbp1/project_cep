import traceback
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from service.rule_service.rule_service import *
from database.conn import * 
from database.model_class import * 
from typing import List, Optional

router = APIRouter()
  
@router.get("/rules", tags=['룰'], summary="설비 전체 리스트 조회")
async def total_rule_list_api(page: int = 1, pageSize: int = 10):
    try:
        result = total_rule_list_service(page, pageSize)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/rules/result", tags=['룰'], summary="설비 전체 리스트 조회")
async def total_rule_result_api(page: int = 1, pageSize: int = 10):
    try:
        result = total_rule_result_service(page, pageSize)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
  
@router.get("/rules/result/detail/{item_id}", tags=['룰'], summary="설비 전체 리스트 조회")
async def rule_result_detail_api(item_id : str, page: int = 1, pageSize: int = 10):
    try:
        result = rule_result_detail_service(item_id, page, pageSize)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")  
  
  
  
# 새로운 rule 저장 
class rule_creation_body(BaseModel):
    rule_id: str
    rule_nm: str
    equipment_id: str
    equipment_nm: str
    item_nm: str
    item_id: str
    size_count: int
    feature_id: str
    feature_low_value: Optional[int] = None
    feature_high_value: Optional[int] = None
    stdev_value: Optional[int] = None
    order_type_flag: int
    order_lower_limit: Optional[int] = None
    order_upper_limit: Optional[int] = None
    alaram_flag: str
    
    class Config:
        json_schema_extra = {
            "example": [
                    {
                        "rule_id": "SYS0100010",
                        "rule_nm": "string",
                        "equipment_id": "string",
                        "equipment_nm": "string",
                        "item_id": "string",
                        "item_nm": "string",
                        "size_count": 50,
                        "feature_id": "SYS0200010",
                        "feature_low_value": 120,
                        "feature_high_value": 260,
                        "stdev_value": None,
                        "order_type_flag": 1,
                        "order_lower_limit": 0,
                        "order_upper_limit": 100,
                        "alaram_flag": "N"
                    },
                    {
                        "rule_id": "SYS0100010",
                        "rule_nm": "string",
                        "equipment_id": "string",
                        "equipment_nm": "string",
                        "item_id": "string",
                        "item_nm": "string",
                        "size_count": 50,
                        "feature_id": "SYS0200010",
                        "feature_low_value": 120,
                        "feature_high_value": 260,
                        "stdev_value": None,
                        "order_type_flag": 1,
                        "order_lower_limit": 0,
                        "order_upper_limit": 100,
                        "alaram_flag": "N"
                    }
                ]
            }    

@router.post("/rules/{equipment_id}", tags=['룰'], summary="룰 저장") # 15604664-a480-5163-bcd5-baf9132e1d1f
async def rule_creation_api(equipment_id: str, body : List[rule_creation_body]):
    try:
        result = rule_creation_service(equipment_id, body)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
    
    