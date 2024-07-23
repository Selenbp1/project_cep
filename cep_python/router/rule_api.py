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
  
@router.get("/rules/result/detail/{id}", tags=['룰'], summary="설비 전체 리스트 조회")
async def rule_result_detail_api(id : int, page: int = 1, pageSize: int = 10):
    try:
        result = rule_result_detail_service(id, page, pageSize)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")  
  
  
  
# 새로운 rule 저장 
class rule_creation_body(BaseModel):
    ruleNm: str
    alaramFlag: str
    equipmentId: str
    itemId: str
    dataType: str
    algorithm: str
    sizeCount: int
    featureValue: str
    lowerValue: Optional[int] = None
    upperValue: Optional[int] = None
    orderType: int
    lowerLimit: Optional[int] = None
    upperLimit: Optional[int] = None

    
    class Config:
        json_schema_extra = {
            "example": 
                    {
                        "ruleNm": "테스트",
                        "alaramFlag": "Y",
                        "equipmentId": "a6984c02-25cb-5f8c-947e-c1831bbdf7a9",
                        "itemId": "ef2d25d7-d318-5c71-be45-df6884cf5af0",
                        "dataType": "Integer",
                        "algorithm": "SYS0100010",
                        "sizeCount": 10,
                        "featureValue": "SYS0200010",
                        "lowerValue": 80,
                        "upperValue": 100,
                        "orderType": 1,
                        "lowerLimit": 1,
                        "upperLimit": 10
                    }
                }    

@router.post("/rules", tags=['룰'], summary="룰 저장")
async def rule_creation_api(body : rule_creation_body):
    try:
        result = rule_creation_service(body)
        return result
    except Exception as e:
        traceback.print_exc()
        print(str(e))
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
@router.put("/rules/{id}", tags=['룰'], summary="룰 저장")
async def rule_updation_api(id : int, body : rule_creation_body, ):
    try:
        result = rule_updation_service(id, body)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
@router.delete("/rules/{id}", tags=['룰'], summary="룰 저장")
async def rule_deletion_api(id : int):
    try:
        result = rule_deletion_service(id)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
    
@router.get("/rules/form/step1", tags=['룰'], summary="설비 전체 리스트 조회")
async def rule_form_step1_api(page: int = 1, pageSize: int = 10):
    try:
        result = rule_form_step1_service(page, pageSize)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")  

@router.get("/rules/form/step2", tags=['룰'], summary="설비 전체 리스트 조회")
async def rule_form_step2_api(page: int = 1, pageSize: int = 10):
    try:
        result = rule_form_step2_service(page, pageSize)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")  
    
@router.get("/rules/form/step3", tags=['룰'], summary="설비 전체 리스트 조회")
async def rule_form_step3_api(page: int = 1, pageSize: int = 10):
    try:
        result = rule_form_step3_service(page, pageSize)
        return result
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")  
    