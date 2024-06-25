import traceback
import uuid
from datetime import datetime
from database.conn import * 
from database.model_class import * 


def total_equipment_list_service():
    try:
        response = session.query(facility_equipment).order_by(facility_equipment.seq.asc()).all()
        result = []
        for r in response:
            title = "[" + str(r.seq) + "]_" + r.equipment_nm
            formatted_date = r.wdate.strftime("%Y-%m-%d %H:%M:%S")
            
            result.append({"title": title, "date":formatted_date, "equipmet_id": r.equipment_uuid})
        return result
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : "fail"}

# 룰명, 설비명, 아이템명, feature value명, feature value 로우 값, feature value 하이 값, stedv 값, order type, order low 값, order high 값, 알람 여부
def total_item_list_service(equipment_id):
    try:
        
        facility_item_alias = aliased(facility_item)
        rule_algorithm_alias = aliased(rule_algorithm)
        rule_algorithm_feature_alias = aliased(rule_algorithm_feature)
        rule_algorithm_stdev_alias = aliased(rule_algorithm_stdev)
        rule_algorithm_order_type_alias = aliased(rule_algorithm_order_type)
        cep_alaram_alias = aliased(cep_alaram)
        
        response = session.query(
            facility_item_alias.item_uuid,
            facility_item_alias.item_nm,
            rule_algorithm_alias.rule_uuid,
            rule_algorithm_alias.rule_nm,
            rule_algorithm_alias.size_count,
            rule_algorithm_feature_alias.feature_value_id,
            rule_algorithm_feature_alias.feature_value_nm,
            rule_algorithm_feature_alias.feature_low_value,
            rule_algorithm_feature_alias.feature_high_value,
            rule_algorithm_stdev_alias.stdev_value,
            rule_algorithm_order_type_alias.order_type_flag,
            rule_algorithm_order_type_alias.order_lower_limit,
            rule_algorithm_order_type_alias.order_upper_limit,
            cep_alaram_alias.alaram_flag
        ).select_from(
            outerjoin(facility_item_alias, rule_algorithm_alias, facility_item_alias.item_uuid == rule_algorithm_alias.item_uuid
                      )
            .outerjoin(
                rule_algorithm_feature_alias, facility_item_alias.item_uuid == rule_algorithm_feature_alias.item_uuid
                       )
            .outerjoin(
                rule_algorithm_stdev_alias, facility_item_alias.item_uuid == rule_algorithm_stdev_alias.item_uuid
                       )
            .outerjoin(
                rule_algorithm_order_type_alias, facility_item_alias.item_uuid == rule_algorithm_order_type_alias.item_uuid
                )
            .outerjoin(
                cep_alaram_alias, facility_item_alias.item_uuid == cep_alaram_alias.item_uuid
                )
        ).filter(
            facility_item_alias.equipment_uuid == equipment_id
        )
        
        result = []
        for r in response:
            result.append({
                "item_uuid": r[0],
                "item_nm": r[1],
                "rule_uuid": r[2],
                "rule_nm": r[3],
                "size_count": r[4],
                "feature_value_id": r[5],
                "feature_value_nm": r[6],
                "feature_low_value": r[7],
                "feature_high_value": r[8],
                "stdev_value": r[9],
                "order_type_flag": "ASC" if r[10] == 1 else "DESC" if r[10] is not None else None,
                "order_lower_limit": r[11],
                "order_upper_limit": r[12],
                "alaram_flag": r[13]
            })
        print("result : ", result)
        return result
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : "fail"}


def facility_creation_service(body):
    try:
        namespace = uuid.uuid4() 
        current_time = datetime.now()
        
        facility_name = body.facility_name
        equipment_name = body.equipment_name
        item_names = body.item_name
        
        kafka_topic_uuid = uuid.uuid5(namespace, facility_name)
        
        kafka_topic_nm = facility_name + "_topic"
        cep_result_add = cep_result(kafka_topic_uuid=kafka_topic_uuid, kafka_topic_nm=kafka_topic_nm, flag='Y', wdate=current_time)
        session.add(cep_result_add)
        
        equipment_uuid = uuid.uuid5(namespace, equipment_name)
        facility_equipment_add = facility_equipment(equipment_uuid=equipment_uuid, equipment_nm=equipment_name, kafka_topic_uuid=kafka_topic_uuid, wdate=current_time)
        session.add(facility_equipment_add)

        for item_name in item_names:
            item_uuid = uuid.uuid5(namespace, item_name)
            facility_item_add = facility_item(item_uuid=item_uuid, item_nm=item_name, equipment_uuid=equipment_uuid, wdate=current_time)
            session.add(facility_item_add)
            session.commit()

        return {"data" : "ok"}
    
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : "fail"}