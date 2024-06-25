import traceback
import uuid
from datetime import datetime
from database.conn import * 
from database.model_class import * 

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
            
            rule_data = session.query(common_code).filter(common_code.code == rule_id).first()
            rule_name = rule_data.code_name
            
            feature_value_data = session.query(common_code).filter(common_code.code == feature_value_id).first()
            feature_value_name = feature_value_data.code_name
            
            rule_algorithm_add = rule_algorithm(item_uuid=item_id, rule_uuid=rule_id, rule_nm=rule_name, size_count=size_count)
            session.add(rule_algorithm_add)
            
            rule_algorithm_feature_add = rule_algorithm_feature(item_uuid=item_id, rule_uuid=rule_id, feature_value_id=feature_value_id, feature_value_nm=feature_value_name, feature_low_value=feature_low_value, feature_high_value=feature_high_value)
            session.add(rule_algorithm_feature_add)
            
            if stdev_value is not None:
                rule_algorithm_stdev_add = rule_algorithm_stdev(feature_value_id=feature_value_id, stdev_value=stdev_value)
                session.add(rule_algorithm_stdev_add)
            
            if order_type_flag != 0:
                rule_algorithm_order_type_add = rule_algorithm_order_type(item_uuid=item_id, order_type_flag=order_type_flag, order_lower_limit=order_lower_limit, order_upper_limit=order_upper_limit)
                session.add(rule_algorithm_order_type_add)
            
            cep_alaram_add = cep_alaram(item_uuid=item_id, alaram_flag=alaram_flag)
            session.add(cep_alaram_add)
            session.commit()

        return {"data" : "ok"}
    
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : "fail"}