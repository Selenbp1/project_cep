import traceback
from datetime import datetime
from database.conn import * 
from database.model_class import * 


def total_common_code_list_service():
    try:
        response = session.query(common_code).order_by(common_code.code.asc()).all()
        result = []
        for r in response:
            result.append(r)
        return result
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : "fail"}

def common_code_id_service(parameter):
    try:
        result = session.query(common_code).filter(common_code.code == parameter).first()
        return result
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : "fail"}
    
def common_code_creation_service(body):
    try:
        current_time = datetime.now()
        default_value = None
        
        group_code = body.group_code if hasattr(body, 'group_code') else default_value
        code = body.code if hasattr(body, 'code') else default_value
        code_name = body.code_name if hasattr(body, 'code_name') else default_value
        sub_code = body.sub_code if hasattr(body, 'sub_code') else default_value
        sub_code2 = body.sub_code2 if hasattr(body, 'sub_code2') else default_value
        sub_code3 = body.sub_code3 if hasattr(body, 'sub_code3') else default_value
        sub_code4 = body.sub_code4 if hasattr(body, 'sub_code4') else default_value
        ref_code = body.ref_code if hasattr(body, 'ref_code') else default_value
        ref_code2 = body.ref_code2 if hasattr(body, 'ref_code2') else default_value
        ref_code3 = body.ref_code3 if hasattr(body, 'ref_code3') else default_value
        ref_code4 = body.ref_code4 if hasattr(body, 'ref_code4') else default_value
        description = body.description if hasattr(body, 'description') else default_value
        flag = body.flag if hasattr(body, 'flag') else default_value
        
        
        common_code_add = common_code(
            group_code=group_code, 
            code=code, 
            code_name=code_name,
            sub_code=sub_code,
            sub_code2=sub_code2,
            sub_code3=sub_code3,
            sub_code4=sub_code4,
            ref_code=ref_code,
            ref_code2=ref_code2,
            ref_code3=ref_code3,
            ref_code4=ref_code4,
            description=description,
            wdate=current_time,
            flag=flag
            )
        session.add(common_code_add)
        session.commit()

        return {"data" : "ok"}
    
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : "fail"}
    
    
def common_code_update_service(parameter, body):
    try:
        current_time = datetime.now()
        default_value = None
        
        group_code = body.group_code if hasattr(body, 'group_code') else default_value
        code = body.code if hasattr(body, 'code') else default_value
        code_name = body.code_name if hasattr(body, 'code_name') else default_value
        sub_code = body.sub_code if hasattr(body, 'sub_code') else default_value
        sub_code2 = body.sub_code2 if hasattr(body, 'sub_code2') else default_value
        sub_code3 = body.sub_code3 if hasattr(body, 'sub_code3') else default_value
        sub_code4 = body.sub_code4 if hasattr(body, 'sub_code4') else default_value
        ref_code = body.ref_code if hasattr(body, 'ref_code') else default_value
        ref_code2 = body.ref_code2 if hasattr(body, 'ref_code2') else default_value
        ref_code3 = body.ref_code3 if hasattr(body, 'ref_code3') else default_value
        ref_code4 = body.ref_code4 if hasattr(body, 'ref_code4') else default_value
        description = body.description if hasattr(body, 'description') else default_value
        flag = body.flag if hasattr(body, 'flag') else default_value
        
        result = session.query(common_code).filter(common_code.code == parameter).first()
        
        if result:
            result.group_code = group_code
            result.code = code
            result.code_name = code_name
            result.sub_code = sub_code
            result.sub_code2 = sub_code2
            result.sub_code3 = sub_code3
            result.sub_code4 = sub_code4
            result.ref_code = ref_code
            result.ref_code2 = ref_code2
            result.ref_code3 = ref_code3
            result.ref_code4 = ref_code4
            result.description = description
            result.flag = flag
            result.mdate = current_time
            session.commit()
        
        return {"data" : "ok"}
    except Exception as e:
        print(e)
        traceback.print_exc()
        
        
def common_code_deletion_service(parameter):
    try:
        result = session.query(common_code).filter(common_code.code == parameter).first()
        
        if result:
            session.delete(result)
            session.commit()
        return {"data" : "ok"}
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : "fail"}
        
        