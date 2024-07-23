import traceback
import uuid
from datetime import datetime
from database.conn import Session
from database.model_class import * 
from sqlalchemy.orm import aliased, outerjoin
from sqlalchemy.exc import SQLAlchemyError

def total_equipment_list_service(page: int, pageSize: int):
    try:
        offset = (page - 1) * pageSize
        response = Session.query(FacilityEquipment, CepResult)\
                          .outerjoin(CepResult, FacilityEquipment.kafka_topic_uuid == CepResult.kafka_topic_uuid)\
                          .order_by(FacilityEquipment.seq.asc())\
                          .offset(offset)\
                          .limit(pageSize).all()
        result = []
        for equipment, cep_result in response:
            title = f"{equipment.equipment_nm}"
            result.append({
                "id": equipment.seq,
                "equipment_id": equipment.equipment_uuid,
                "topic_id": cep_result.kafka_topic_uuid if cep_result else None,
                "title": title,
                "topic_nm": cep_result.kafka_topic_nm if cep_result else None,
                "ip": cep_result.ip if cep_result else None,
                "port": cep_result.port if cep_result else None,
                "flag": cep_result.flag if cep_result else None
            })
        return result
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : str(e)}

def total_item_list_service(equipment_id):
    try:
        
        response = Session.query(FacilityEquipment, CepResult, FacilityItem)\
                          .outerjoin(CepResult, FacilityEquipment.kafka_topic_uuid == CepResult.kafka_topic_uuid)\
                          .outerjoin(FacilityItem, FacilityEquipment.equipment_uuid == FacilityItem.equipment_uuid)\
                          .filter(FacilityEquipment.seq == equipment_id) \
                          .order_by(FacilityEquipment.seq.asc(), FacilityItem.seq.asc()).all() 
        equipment_dict = {}
        
        for equipment, cep_result, item in response:
            if equipment.seq not in equipment_dict:
                title = f"{equipment.equipment_nm}"
                equipment_dict[equipment.seq] = {
                    "id": equipment.seq,
                    "equipment_id": equipment.equipment_uuid,
                    "equipment_nm": title,
                    "topic_id": cep_result.kafka_topic_uuid if cep_result else None,
                    "topic_nm": cep_result.kafka_topic_nm if cep_result else None,
                    "ip": cep_result.ip if cep_result else None,
                    "port": cep_result.port if cep_result else None,
                    "flag": cep_result.flag if cep_result else None,
                    "item": []
                }
            
            if item:
                equipment_dict[equipment.seq]["item"].append({
                    "id": item.seq,
                    "item_uuid": item.item_uuid,
                    "item_nm": item.item_nm,
                    "data_type": item.data_type
                })
        
        result = list(equipment_dict.values())
        return result
        
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data" : "fail"}



def facility_creation_service(body):
    try:
        namespace = uuid.uuid4()
        current_time = datetime.now()
        
        equipment_name = body.equipment_nm
        topic_name = body.topic_nm
        ip = body.ip
        port = body.port
        items = body.item

        # Create CepResult entry
        kafka_topic_uuid = uuid.uuid5(namespace, equipment_name)
        kafka_topic_nm = topic_name
        cep_result_add = CepResult(kafka_topic_uuid=kafka_topic_uuid, kafka_topic_nm=kafka_topic_nm, flag='Y', wdate=current_time, ip=ip, port=port)
        
        # Create FacilityEquipment entry
        equipment_uuid = uuid.uuid5(namespace, equipment_name)
        facility_equipment_add = FacilityEquipment(equipment_uuid=equipment_uuid, equipment_nm=equipment_name, kafka_topic_uuid=kafka_topic_uuid, wdate=current_time)
        
        # Create FacilityItem entries
        facility_items = [FacilityItem(item_uuid=uuid.uuid5(namespace, item.item_nm), item_nm=item.item_nm, equipment_uuid=equipment_uuid, data_type=item.data_type, wdate=current_time) for item in items]

        with Session() as session:
            session.add(cep_result_add)
            session.add(facility_equipment_add)
            session.add_all(facility_items)
            session.commit()
            session.close()
        return {"data": "ok"}
    
    except Exception as e:
        print(e)
        traceback.print_exc()
        return {"data": "fail"}

def facility_update_service(equipment_id, body):
    try:
        equipment_name = body.equipment_nm
        topic_name = body.topic_nm
        ip = body.ip
        port = body.port
        items = body.item
        
        current_time = datetime.now()
        
        with Session() as session:
            # Retrieve FacilityEquipment
            equipment = session.query(FacilityEquipment).filter(FacilityEquipment.seq == equipment_id).first()
            if not equipment:
                raise ValueError("Equipment not found")
                
            equipment.equipment_nm = equipment_name

            cep_result = session.query(CepResult).filter(CepResult.kafka_topic_uuid == body.topic_id).first()
            if cep_result:
                cep_result.kafka_topic_nm = topic_name
                cep_result.ip = ip
                cep_result.port = port
                
            existing_item_ids = [item.id for item in items if item.id is not None]

            session.query(FacilityItem).filter(FacilityItem.equipment_uuid == body.equipment_id, FacilityItem.seq.notin_(existing_item_ids)).delete(synchronize_session=False)

            for item in items:
                if item.id is not None:
                    facility_item = session.query(FacilityItem).filter(FacilityItem.seq == item.id).first()
                    if facility_item:
                        facility_item.item_nm = item.item_nm
                        facility_item.data_type = item.data_type
                else:
                    new_item = FacilityItem(
                        item_uuid=item.item_uuid,
                        item_nm=item.item_nm,
                        data_type=item.data_type,
                        equipment_uuid=body.equipment_id,
                        wdate=current_time
                    )
                    session.add(new_item)

            session.commit()
            session.close()
            updated_items = session.query(FacilityItem).filter(FacilityItem.equipment_uuid == body.equipment_id).all()
            

            return {"equipment": equipment, "items": updated_items}
    
    except Exception as e:
        traceback.print_exc()
        session.rollback()
        raise e

def facility_deletion_service(equipment_id: int):
    try:
        with Session() as session:
            equipment = session.query(FacilityEquipment).filter_by(seq=equipment_id).first()
            if not equipment:
                raise ValueError("Equipment not found")

            items = session.query(FacilityItem).filter_by(equipment_uuid=equipment.equipment_uuid).all()
            for item in items:
                session.delete(item)

            session.delete(equipment)
            
            cep_result = session.query(CepResult).filter_by(kafka_topic_uuid=equipment.kafka_topic_uuid).first()
            if cep_result:
                session.delete(cep_result)
                
            session.commit()
            session.close()
            return {"message": "Deleted successfully"}

    except SQLAlchemyError  as e:
        # Rollback in case of error
        session.rollback()
        raise e