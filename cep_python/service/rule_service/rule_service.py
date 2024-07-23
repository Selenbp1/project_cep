import traceback
from database.conn import * 
from database.model_class import * 
from sqlalchemy import func

def total_rule_list_service(page: int, pageSize: int):
    try:
        offset = (page - 1) * pageSize
        AlgorithmName = aliased(CommonCode)
        FeatureName = aliased(CommonCode)
        
        total_count = Session.query(func.count(RuleAlgorithm.seq)).scalar()
        
        response = Session.query(RuleAlgorithm, FacilityItem, FacilityEquipment, FeatureName, AlgorithmName)\
                          .outerjoin(FacilityItem, FacilityItem.item_uuid == RuleAlgorithm.item_uuid)\
                          .outerjoin(FacilityEquipment, FacilityItem.equipment_uuid == FacilityEquipment.equipment_uuid)\
                          .outerjoin(AlgorithmName, AlgorithmName.code == RuleAlgorithm.algorithm_id)\
                          .outerjoin(FeatureName, FeatureName.code == RuleAlgorithm.feature_value_id)\
                          .order_by(FacilityItem.seq.asc())\
                          .offset(offset)\
                          .limit(pageSize).all()

        result = []
        for rule_algorithm, item, equipment, feature_nm, algorithm_nm in response:
            result.append({
                "id": rule_algorithm.seq, # No.
                "itemId": item.item_uuid,
                "itemNm": item.item_nm, #아이템명
                "equipmentId": equipment.equipment_uuid,
                "equipmentNm": equipment.equipment_nm, #장비명
                "dataType": item.data_type,
                "ruleNm": rule_algorithm.rule_nm if rule_algorithm else None,
                "algorithm": rule_algorithm.algorithm_id if rule_algorithm else None,
                "algorithmNm": algorithm_nm.code_name if algorithm_nm else None,
                "featureValue": rule_algorithm.feature_value_id if rule_algorithm else None,
                "featureNm": feature_nm.code_name if feature_nm else None, 
                "lowerValue": rule_algorithm.feature_low_value if rule_algorithm else None,
                "upperValue": rule_algorithm.feature_high_value if rule_algorithm else None,
                "orderType": rule_algorithm.order_type_flag if rule_algorithm else None,
                "lowerLimit": rule_algorithm.order_lower_limit if rule_algorithm else None,
                "upperLimit": rule_algorithm.order_upper_limit if rule_algorithm else None,
                "alaramFlag": rule_algorithm.alaram_flag if rule_algorithm else None,
                "sizeCount": rule_algorithm.size_count if rule_algorithm else None
            })
        return {"rules": result, "total": total_count}
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : str(e)}


def total_rule_result_service(page: int, pageSize: int):
    try:
        offset = (page - 1) * pageSize
        AlgorithmName = aliased(CommonCode)
        FeatureName = aliased(CommonCode)
        
        total_count = Session.query(func.count(FacilityItem.item_uuid)).scalar()
        
        response = Session.query(RuleAlgorithm, FacilityItem, FacilityEquipment, FeatureName, AlgorithmName)\
                          .outerjoin(FacilityItem, FacilityItem.item_uuid == RuleAlgorithm.item_uuid)\
                          .outerjoin(FacilityEquipment, FacilityItem.equipment_uuid == FacilityEquipment.equipment_uuid)\
                          .outerjoin(AlgorithmName, AlgorithmName.code == RuleAlgorithm.algorithm_id)\
                          .outerjoin(FeatureName, FeatureName.code == RuleAlgorithm.feature_value_id)\
                          .order_by(FacilityItem.seq.asc())\
                          .offset(offset)\
                          .limit(pageSize).all()
                          
        result = []
        for rule_algorithm, item, equipment, feature_nm, algorithm_nm in response:
            result.append({
                "id": rule_algorithm.seq, # No.
                "itemId": item.item_uuid,
                "itemNm": item.item_nm, #아이템명
                "equipmentId": equipment.equipment_uuid,
                "equipmentNm": equipment.equipment_nm, #장비명
                "ruleNm": rule_algorithm.rule_nm if rule_algorithm else None,
                "algorithm": rule_algorithm.algorithm_id if rule_algorithm else None,
                "algorithmNm": algorithm_nm.code_name if algorithm_nm else None,
                "featureValue": rule_algorithm.feature_value_id if rule_algorithm else None,
                "featureNm": feature_nm.code_name if feature_nm else None, 
                "lowerValue": rule_algorithm.feature_low_value if rule_algorithm else None,
                "upperValue": rule_algorithm.feature_high_value if rule_algorithm else None,
                "orderType": rule_algorithm.order_type_flag if rule_algorithm else None,
                "lowerLimit": rule_algorithm.order_lower_limit if rule_algorithm else None,
                "upperLimit": rule_algorithm.order_upper_limit if rule_algorithm else None,
                "alaramFlag": rule_algorithm.alaram_flag if rule_algorithm else None 
            })
        return {"rules": result, "total": total_count}
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : str(e)}
    
def rule_result_detail_service(id, page: int, pageSize: int):
    try:
        offset = (page - 1) * pageSize
        
        total_count = Session.query(func.count(ItemData.rule_id)).filter(ItemData.rule_id == id).scalar()
        
        response = Session.query(ItemData)\
                          .filter(ItemData.rule_id == id)\
                          .order_by(ItemData.seq.asc())\
                          .offset(offset)\
                          .limit(pageSize).all()
                          
        result = []
        for item_data in response:
            result.append({
                "id": item_data.seq, # No.
                "rawValue": item_data.raw_value if item_data else None,
                "featureValue": item_data.feature_value if item_data else None,
                "errorValue": item_data.error_value if item_data else None,
                "wdate": item_data.wdate if item_data else None
            })
        return {"details": result, "totalCount": total_count}
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : str(e)}
       

def rule_creation_service(data):
    try:
        default_value = None
        session = Session()

        rule_nm = data.ruleNm 
        alaram_flag = data.alaramFlag 
        
        item_id = data.itemId

        algorithm = data.algorithm 
        size_count = data.sizeCount 
        
        feature_value = data.featureValue 
        low_value = data.lowerValue if hasattr(data, 'lowerValue') else default_value
        upper_value = data.upperValue if hasattr(data, 'upperValue') else default_value
        
        order_type = data.orderType 
        if order_type == 0:
            order_type_flag = 'NONE'
        elif order_type == 1:
            order_type_flag = 'ASC'
        else:
            order_type_flag = 'DESC'
        
        lower_limit = data.lowerLimit if hasattr(data, 'lowerLimit') else default_value
        upper_limit = data.upperLimit if hasattr(data, 'upperLimit') else default_value
        
        rule_algorithm_add = RuleAlgorithm(item_uuid=item_id, 
                                           algorithm_id=algorithm, 
                                           rule_nm=rule_nm, 
                                           size_count=size_count,
                                           feature_value_id=feature_value,
                                           feature_low_value=low_value,
                                           feature_high_value=upper_value,
                                           order_type_flag=order_type_flag,
                                           order_lower_limit=lower_limit,
                                           order_upper_limit=upper_limit,
                                           alaram_flag=alaram_flag
                                           )

        session.add(rule_algorithm_add)
        session.commit()
        session.close()
        return {"data" : "ok"}
    
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : "fail"}

def rule_updation_service(id, data):
    try:
        session = Session()

        rule = session.query(RuleAlgorithm).filter(RuleAlgorithm.seq == id).one_or_none()
        if rule is None:
            return {"data": "not found"}
        
        rule.rule_nm = data.ruleNm
        rule.alaram_flag = data.alaramFlag
        
        rule.item_uuid = data.itemId
        rule.algorithm_id = data.algorithm
        rule.size_count = data.sizeCount
        
        rule.feature_value_id = data.featureValue
        rule.feature_low_value = data.lowerValue if hasattr(data, 'lowerValue') else None
        rule.feature_high_value = data.upperValue if hasattr(data, 'upperValue') else None
        
        rule.order_type_flag = 'NONE' if data.orderType == 0 else 'ASC' if data.orderType == 1 else 'DESC'
        rule.order_lower_limit = data.lowerLimit if hasattr(data, 'lowerLimit') else None
        rule.order_upper_limit = data.upperLimit if hasattr(data, 'upperLimit') else None
        

        session.commit()
        session.close()
        return {"data": "ok"}
    except:
        traceback.print_exc()
        return {"data" : "fail"}
    
    
def rule_deletion_service(id):
    try:
        print(id)
        session = Session()
        query = session.query(RuleAlgorithm).filter(RuleAlgorithm.seq == id).one_or_none()

        if query is None:
            return {"data": "not found"}
        
        session.delete(query)
        session.commit()
        session.close()
        return {"data" : "ok"}
    except:
        traceback.print_exc()
        return {"data" : "fail"}
        
        
def rule_form_step1_service(page: int, pageSize: int):
    try:
        offset = (page - 1) * pageSize

        response = Session.query(FacilityItem, FacilityEquipment)\
                          .outerjoin(FacilityEquipment, FacilityItem.equipment_uuid == FacilityEquipment.equipment_uuid)\
                          .order_by(FacilityEquipment.seq.asc())\
                          .offset(offset)\
                          .limit(pageSize).all()
                          
        equipment_dict = {}
        for item, equipment in response:
            if equipment.equipment_uuid not in equipment_dict:
                equipment_dict[equipment.equipment_uuid] = {
                    "equipmentSeq": equipment.seq,
                    "equipmentId": equipment.equipment_uuid,
                    "equipmentNm": equipment.equipment_nm,
                    "item": []
                }
            equipment_dict[equipment.equipment_uuid]["item"].append({
                "itemSeq": item.seq if item else None,
                "itemId": item.item_uuid if item else None,
                "itemNm": item.item_nm if item else None,
                "dataType": item.data_type if item else None
            })

        result = list(equipment_dict.values())
        return result
    except Exception as e:
        traceback.print_exc()

def rule_form_step2_service(page: int, pageSize: int):
    try:
        offset = (page - 1) * pageSize

        response = Session.query(CommonCode)\
                          .filter(CommonCode.group_code == 'SYS010')\
                          .order_by(CommonCode.code.asc())\
                          .offset(offset)\
                          .limit(pageSize).all()
                          
        result = []
        for commoncode in response:
            result.append({
                "groupCode": commoncode.group_code,
                "code": commoncode.code if commoncode else None,
                "codeName": commoncode.code_name if commoncode else None
            })
        return result
    except Exception as e:
        traceback.print_exc()
                
def rule_form_step3_service(page: int, pageSize: int):
    try:
        offset = (page - 1) * pageSize

        response = Session.query(CommonCode)\
                          .filter(CommonCode.group_code == 'SYS020')\
                          .order_by(CommonCode.code.asc())\
                          .offset(offset)\
                          .limit(pageSize).all()
                          
        result = []
        for commoncode in response:
            result.append({
                "groupCode": commoncode.group_code,
                "code": commoncode.code if commoncode else None,
                "codeName": commoncode.code_name if commoncode else None
            })
        return result
    except Exception as e:
        traceback.print_exc()
        