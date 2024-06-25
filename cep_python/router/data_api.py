import traceback
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

# data 리스트 조회
@router.get("/data_list", tags=['데이터'], summary="전체 데이터 리스트 조회")
async def data_list_api():
    try:
        print("")
        return
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
@router.get("/data_list/{data_id}", tags=['데이터'], summary="데이터 조회")
async def data_id_api(data_id: str):
    try:
        print("")
        return
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/data_list/raw_data/{data_id}", tags=['데이터'], summary="raw 데이터 조회")
async def raw_data_id_api(data_id: str):
    try:
        print("")
        return
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
    
@router.get("/data_list/featured_data/{data_id}", tags=['데이터'], summary="featured 데이터 조회")
async def featured_data_id_api(data_id: str):
    try:
        print("")
        return
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
