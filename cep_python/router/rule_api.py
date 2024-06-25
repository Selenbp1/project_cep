import traceback
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from service.rule_service.rule_service import *
from database.conn import * 
from database.model_class import * 
from typing import List, Optional

router = APIRouter()
  
# 새로운 rule 저장 
class rule_creation_body(BaseModel):
    item_id: str
    rule_id: str
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
                        "item_id": "cd42ae1b-c638-5836-b0cc-cab24b5fd6b2",
                        "rule_id": "SYS0100010",
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
                        "item_id": "bd6bb61c-cfc4-5691-ac2e-88ad6e7ba0fe",
                        "rule_id": "SYS0100020",
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

@router.post("/rule_creation/{equipment_id}", tags=['룰'], summary="룰 저장") # 15604664-a480-5163-bcd5-baf9132e1d1f
async def rule_creation_api(equipment_id: str, body : List[rule_creation_body]):
    try:
        result = rule_creation_service(equipment_id, body)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
    
    