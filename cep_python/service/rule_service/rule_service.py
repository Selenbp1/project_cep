import traceback
import uuid
from datetime import datetime
from database.conn import * 
from database.model_class import * 


def total_rule_list_service(page: int, pageSize: int):
    try:
        offset = (page - 1) * pageSize
        CommonCode1 = aliased(CommonCode)
        CommonCode2 = aliased(CommonCode)
        
        response = Session.query(FacilityItem, FacilityEquipment, RuleAlgorithm, RuleAlgorithmFeature, RuleAlgorithmStdev, RuleAlgorithmOrderType, CepAlaram,  CommonCode1, CommonCode2)\
                          .outerjoin(FacilityEquipment, FacilityItem.equipment_uuid == FacilityEquipment.equipment_uuid)\
                          .outerjoin(RuleAlgorithm, FacilityItem.item_uuid == RuleAlgorithm.item_uuid)\
                          .outerjoin(RuleAlgorithmFeature, RuleAlgorithmFeature.item_uuid == RuleAlgorithm.item_uuid)\
                          .outerjoin(RuleAlgorithmStdev, RuleAlgorithmStdev.item_uuid == RuleAlgorithm.item_uuid)\
                          .outerjoin(RuleAlgorithmOrderType, RuleAlgorithmOrderType.item_uuid == RuleAlgorithm.item_uuid)\
                          .outerjoin(CepAlaram, CepAlaram.item_uuid == RuleAlgorithm.item_uuid)\
                          .outerjoin(CommonCode1, CommonCode1.code == RuleAlgorithm.rule_uuid)\
                          .outerjoin(CommonCode2, CommonCode2.code == RuleAlgorithmFeature.feature_value_id)\
                          .order_by(FacilityItem.seq.asc())\
                          .offset(offset)\
                          .limit(pageSize).all()
        result = []
        for item, equipment, rule_algorithm, rule_algorithm_feature, rule_algorithm_stdev, rule_algorithm_order_type, cep_alarm, common_code1, common_code2 in response:
            result.append({
                "id": item.seq, # No.
                "item_id": item.item_uuid,
                "item_nm": item.item_nm, #아이템명
                "equipment_id": equipment.equipment_uuid,
                "equipment_nm": equipment.equipment_nm, #장비명
                "rule_id": rule_algorithm.rule_uuid if rule_algorithm else None,
                "rule_nm": rule_algorithm.rule_nm if rule_algorithm else None,
                "code_nm": common_code1.code_name if common_code1 else None, # 적용 알고리즘 
                "feature_id": rule_algorithm_feature.feature_value_id if rule_algorithm_feature else None,
                "feature_nm": rule_algorithm_feature.feature_value_nm if rule_algorithm_feature else None, # 함수
                "feature_low_value": rule_algorithm_feature.feature_low_value if rule_algorithm_feature else None,
                "feature_high_value": rule_algorithm_feature.feature_high_value if rule_algorithm_feature else None,
                "stdev_value": rule_algorithm_stdev.stdev_value if rule_algorithm_stdev else None,
                "order_type_flag": rule_algorithm_order_type.order_type_flag if rule_algorithm_order_type else None,
                "order_lower_limit": rule_algorithm_order_type.order_lower_limit if rule_algorithm_order_type else None,
                "order_upper_limit": rule_algorithm_order_type.order_upper_limit if rule_algorithm_order_type else None,
                "alaram_flag": cep_alarm.alaram_flag if cep_alarm else None # 알림 여부
            })
        return result
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : str(e)}


def total_rule_result_service(page: int, pageSize: int):
    try:
        offset = (page - 1) * pageSize
        CommonCode1 = aliased(CommonCode)
        CommonCode2 = aliased(CommonCode)
        
        response = Session.query(FacilityItem, FacilityEquipment, RuleAlgorithm, RuleAlgorithmFeature, RuleAlgorithmStdev, RuleAlgorithmOrderType, CepAlaram,  CommonCode1, CommonCode2)\
                          .outerjoin(FacilityEquipment, FacilityItem.equipment_uuid == FacilityEquipment.equipment_uuid)\
                          .outerjoin(RuleAlgorithm, FacilityItem.item_uuid == RuleAlgorithm.item_uuid)\
                          .outerjoin(RuleAlgorithmFeature, RuleAlgorithmFeature.item_uuid == RuleAlgorithm.item_uuid)\
                          .outerjoin(RuleAlgorithmStdev, RuleAlgorithmStdev.item_uuid == RuleAlgorithm.item_uuid)\
                          .outerjoin(RuleAlgorithmOrderType, RuleAlgorithmOrderType.item_uuid == RuleAlgorithm.item_uuid)\
                          .outerjoin(CepAlaram, CepAlaram.item_uuid == RuleAlgorithm.item_uuid)\
                          .outerjoin(CommonCode1, CommonCode1.code == RuleAlgorithm.rule_uuid)\
                          .outerjoin(CommonCode2, CommonCode2.code == RuleAlgorithmFeature.feature_value_id)\
                          .order_by(FacilityItem.seq.asc())\
                          .offset(offset)\
                          .limit(pageSize).all()
                          
        result = []
        for item, equipment, rule_algorithm, rule_algorithm_feature, rule_algorithm_stdev, rule_algorithm_order_type, cep_alarm, common_code1, common_code2 in response:
            result.append({
                "id": item.seq, # No.
                "item_id": item.item_uuid,
                "item_nm": item.item_nm, #아이템명
                "equipment_id": equipment.equipment_uuid,
                "equipment_nm": equipment.equipment_nm, #장비명
                "rule_id": rule_algorithm.rule_uuid if rule_algorithm else None,
                "rule_nm": rule_algorithm.rule_nm if rule_algorithm else None,
                "code_nm": common_code1.code_name if common_code1 else None, # 적용 알고리즘 
                "feature_id": rule_algorithm_feature.feature_value_id if rule_algorithm_feature else None,
                "feature_nm": rule_algorithm_feature.feature_value_nm if rule_algorithm_feature else None, # 함수
                "feature_low_value": rule_algorithm_feature.feature_low_value if rule_algorithm_feature else None,
                "feature_high_value": rule_algorithm_feature.feature_high_value if rule_algorithm_feature else None,
                "stdev_value": rule_algorithm_stdev.stdev_value if rule_algorithm_stdev else None,
                "order_type_flag": rule_algorithm_order_type.order_type_flag if rule_algorithm_order_type else None,
                "order_lower_limit": rule_algorithm_order_type.order_lower_limit if rule_algorithm_order_type else None,
                "order_upper_limit": rule_algorithm_order_type.order_upper_limit if rule_algorithm_order_type else None
                # "raw_value": item_data.raw_value if item_data else None,
                # "feature_value": item_data.feature_value if item_data else None,
                # "error_value": item_data.error_value if item_data else None,
            })
        return result
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : str(e)}
    
def rule_result_detail_service(item_id, page: int, pageSize: int):
    try:
        offset = (page - 1) * pageSize
        
        response = Session.query(ItemData)\
                          .filter(ItemData.item_uuid == item_id)\
                          .order_by(ItemData.seq.asc())\
                          .offset(offset)\
                          .limit(pageSize).all()
                          
        result = []
        for item_data in response:
            result.append({
                "id": item_data.seq, # No.
                "raw_value": item_data.raw_value if item_data else None,
                "feature_value": item_data.feature_value if item_data else None,
                "error_value": item_data.error_value if item_data else None,
                "wdate": item_data.wdate if item_data else None
            })
        return result
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : str(e)}
       

def rule_creation_service(equipment_id, body):
    try:
        default_value = None
        for b in body:
            item_id = b.item_id if hasattr(b, 'item_id') else default_value
            rule_id = b.rule_id if hasattr(b, 'rule_id') else default_value
            size_count = b.size_count if hasattr(b, 'size_count') else default_value
            feature_value_id = b.feature_id if hasattr(b, 'feature_id') else default_value
            feature_low_value = b.feature_low_value if hasattr(b, 'feature_low_value') else default_value
            feature_high_value = b.feature_high_value if hasattr(b, 'feature_high_value') else default_value
            stdev_value = b.stdev_value if hasattr(b, 'stdev_value') else default_value
            order_type_flag = b.order_type_flag if hasattr(b, 'order_type_flag') else default_value
            order_lower_limit = b.order_lower_limit if hasattr(b, 'order_lower_limit') else default_value
            order_upper_limit = b.order_upper_limit if hasattr(b, 'order_upper_limit') else default_value
            alaram_flag = b.alaram_flag if hasattr(b, 'alaram_flag') else default_value
            
            rule_data = session.query(CommonCode).filter(CommonCode.code == rule_id).first()
            rule_name = rule_data.code_name
            
            feature_value_data = session.query(CommonCode).filter(CommonCode.code == feature_value_id).first()
            feature_value_name = feature_value_data.code_name
            
            rule_algorithm_add = RuleAlgorithm(item_uuid=item_id, rule_uuid=rule_id, rule_nm=rule_name, size_count=size_count)
            session.add(rule_algorithm_add)
            
            rule_algorithm_feature_add = RuleAlgorithmFeature(item_uuid=item_id, rule_uuid=rule_id, feature_value_id=feature_value_id, feature_value_nm=feature_value_name, feature_low_value=feature_low_value, feature_high_value=feature_high_value)
            session.add(rule_algorithm_feature_add)
            
            if stdev_value is not None:
                rule_algorithm_stdev_add = RuleAlgorithmStdev(feature_value_id=feature_value_id, stdev_value=stdev_value)
                session.add(rule_algorithm_stdev_add)
            
            if order_type_flag != 0:
                rule_algorithm_order_type_add = RuleAlgorithmOrderType(item_uuid=item_id, order_type_flag=order_type_flag, order_lower_limit=order_lower_limit, order_upper_limit=order_upper_limit)
                session.add(rule_algorithm_order_type_add)
            
            cep_alaram_add = CepAlaram(item_uuid=item_id, alaram_flag=alaram_flag)
            session.add(cep_alaram_add)
            session.commit()

        return {"data" : "ok"}
    
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : "fail"}