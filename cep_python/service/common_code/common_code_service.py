import traceback
from datetime import datetime
from database.conn import Session
from database.model_class import CommonCode
from sqlalchemy import or_

def total_common_code_list_service(page: int, pageSize: int):
    try:
        session = Session()
        offset = (page - 1) * pageSize
        # response = session.query(common_code).order_by(common_code.code.asc()).offset(offset).limit(pageSize).all()
        # total = session.query(common_code).count()
        response = session.query(CommonCode).filter(or_(CommonCode.group_code == None, CommonCode.group_code == '')).order_by(CommonCode.code.asc()).offset(offset).limit(pageSize).all()
        total = session.query(CommonCode).filter(or_(CommonCode.group_code == None, CommonCode.group_code == '')).count()
        result = {"codes": [r.__dict__ for r in response], "total": total}
        session.close()
        return result
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"codes": [], "total": 0}

def sub_common_code_list_service(parentCodeId: str, page: int, pageSize: int):
    try:
        session = Session()
        offset = (page - 1) * pageSize
        response = session.query(CommonCode).filter(CommonCode.group_code == parentCodeId).order_by(CommonCode.code.asc()).offset(offset).limit(pageSize).all()
        total = session.query(CommonCode).filter(CommonCode.group_code == parentCodeId).count()
        result = {"subCodes": [r.__dict__ for r in response], "total": total}
        session.close()
        return result
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"subCodes": [], "total": 0}

def common_code_id_service(parameter: str):
    try:
        session = Session()
        result = session.query(CommonCode).filter(CommonCode.code == parameter).first()
        session.close()
        return result.__dict__ if result else None
    except Exception as e:
        print(e)
        traceback.print_exc()
        return None

def common_code_creation_service(body):
    try:
        session = Session()
        current_time = datetime.now()
        new_common_code = CommonCode(
            group_code=body.group_code,
            code=body.code,
            code_name=body.code_name,
            sub_code=body.sub_code,
            sub_code2=body.sub_code2,
            sub_code3=body.sub_code3,
            sub_code4=body.sub_code4,
            ref_code=body.ref_code,
            ref_code2=body.ref_code2,
            ref_code3=body.ref_code3,
            ref_code4=body.ref_code4,
            description=body.description,
            wdate=current_time,
            flag=body.flag
        )
        session.add(new_common_code)
        session.commit()
        session.close()
        return {"message": "Common code created successfully"}
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"message": "Failed to create common code"}

def common_code_update_service(parameter: str, body):
    try:
        session = Session()
        current_time = datetime.now()
        common_code_to_update = session.query(CommonCode).filter(CommonCode.code == parameter).first()
        

        common_code_to_update.group_code = body.group_code
        common_code_to_update.code_name = body.code_name
        common_code_to_update.sub_code = body.sub_code
        common_code_to_update.sub_code2 = body.sub_code2
        common_code_to_update.sub_code3 = body.sub_code3
        common_code_to_update.sub_code4 = body.sub_code4
        common_code_to_update.ref_code = body.ref_code
        common_code_to_update.ref_code2 = body.ref_code2
        common_code_to_update.ref_code3 = body.ref_code3
        common_code_to_update.ref_code4 = body.ref_code4
        common_code_to_update.description = body.description
        common_code_to_update.flag = body.flag
        common_code_to_update.mdate = current_time
        session.commit()
        session.close()
        return {"message": "Common code updated successfully"}

    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"message": "Failed to update common code"}

def common_code_deletion_service(parameter: str):
    try:
        session = Session()
        common_code_to_delete = session.query(CommonCode).filter(CommonCode.code == parameter).first()
        
        if common_code_to_delete:
            session.delete(common_code_to_delete)
            session.commit()
            session.close()
            return {"message": "Common code deleted successfully"}
        else:
            session.close()
            return {"message": "Common code not found"}
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"message": "Failed to delete common code"}
