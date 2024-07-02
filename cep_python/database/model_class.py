from sqlalchemy import BigInteger, Column, Integer, String, TIMESTAMP, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database.conn import Base


class CepDataLog(Base):
    __tablename__ = 'cep_data_log'

    seq = Column(Integer, primary_key=True, autoincrement=True)
    kafka_topic_uuid = Column(String(100), nullable=False)
    volume_up = Column(String(50), nullable=False)
    wdate = Column(TIMESTAMP)

class CepResult(Base):
    __tablename__ = 'cep_result'

    seq = Column(Integer, primary_key=True, autoincrement=True)
    kafka_topic_uuid = Column(String(100), nullable=False)
    kafka_topic_nm = Column(String(100), nullable=False)
    wdate = Column(TIMESTAMP)
    mdate = Column(TIMESTAMP)
    flag = Column(String(5), nullable=False)
    ip = Column(String(100), nullable=False)
    port = Column(String(100), nullable=False)

    # Define the relationship with FacilityEquipment
    equipments = relationship('FacilityEquipment', backref='cep_result', primaryjoin="CepResult.kafka_topic_uuid == FacilityEquipment.kafka_topic_uuid")


class FacilityEquipment(Base):
    __tablename__ = 'facility_equipment'

    seq = Column(Integer, primary_key=True, autoincrement=True)
    equipment_uuid = Column(String(100), nullable=False)
    equipment_nm = Column(String(100), nullable=False)
    kafka_topic_uuid = Column(String(100), ForeignKey('cep_result.kafka_topic_uuid'), nullable=False)
    wdate = Column(TIMESTAMP)
    mdate = Column(TIMESTAMP)

    # Define the relationship with FacilityItem
    items = relationship('FacilityItem', backref='facility_equipment')


class FacilityItem(Base):
    __tablename__ = 'facility_item'

    seq = Column(Integer, primary_key=True, autoincrement=True)
    item_uuid = Column(String(100), nullable=False)
    item_nm = Column(String(100), nullable=False)
    equipment_uuid = Column(String(100), ForeignKey('facility_equipment.equipment_uuid'), nullable=False)
    wdate = Column(TIMESTAMP)
    mdate = Column(TIMESTAMP)
    
    
class RuleAlgorithm(Base):
    __tablename__ = 'rule_algorithm'

    seq = Column(Integer, primary_key=True, autoincrement=True)
    item_uuid = Column(String(100), nullable=False)
    rule_uuid = Column(String(100), nullable=False)
    rule_nm = Column(String(100), nullable=False)
    size_count = Column(BigInteger, nullable=False)

class RuleAlgorithmFeature(Base):
    __tablename__ = 'rule_algorithm_feature'

    seq = Column(Integer, primary_key=True, autoincrement=True)
    item_uuid = Column(String(100), nullable=False)
    rule_uuid = Column(String(100), nullable=False)
    feature_value_id = Column(String(100), nullable=False)
    feature_value_nm = Column(String(100), nullable=False)
    feature_low_value = Column(BigInteger, nullable=False)
    feature_high_value = Column(BigInteger, nullable=False) 

class RuleAlgorithmStdev(Base):
    __tablename__ = 'rule_algorithm_stdev'

    item_uuid = Column(String(100), primary_key=True, nullable=True)
    feature_value_id = Column(String(100),  nullable=False)
    stdev_value = Column(BigInteger, nullable=False)

class RuleAlgorithmOrderType(Base):
    __tablename__ = 'rule_algorithm_order_type'

    item_uuid = Column(String(100), primary_key=True, nullable=False)
    order_type_flag = Column(BigInteger, nullable=False)
    order_lower_limit = Column(BigInteger, nullable=False)
    order_upper_limit = Column(BigInteger, nullable=False)

class cep_alaram(Base):
    __tablename__ = 'cep_alaram'

    item_uuid = Column(String(100), primary_key=True, nullable=False)
    alaram_flag = Column(String(5), nullable=False)

class item_data(Base):
    __tablename__ = 'item_data'

    seq = Column(Integer, primary_key=True, autoincrement=True)
    item_uuid = Column(String(100), primary_key=True, nullable=False)
    item_nm = Column(String(100), nullable=False)
    raw_value = Column(BigInteger, nullable=False)
    feature_value = Column(BigInteger, nullable=False)
    error_value = Column(String(100), nullable=False)
    wdate = Column(TIMESTAMP)
    mdate = Column(TIMESTAMP)

class cep_item_log(Base):
    __tablename__ = 'cep_item_log'

    seq = Column(Integer, primary_key=True, autoincrement=True)
    item_uuid = Column(String(100), primary_key=True, nullable=False)
    volume_up = Column(String(100), nullable=False)
    wdate = Column(TIMESTAMP)

class CommonCode(Base):
    __tablename__ = 'common_code'

    group_code = Column(String(100), nullable=True)
    code = Column(String(100), primary_key=True, nullable=False)
    code_name = Column(String(100), nullable=True)
    sub_code = Column(String(100), nullable=True)
    sub_code2 = Column(String(100), nullable=True)
    sub_code3 = Column(String(100), nullable=True)
    sub_code4 = Column(String(100), nullable=True)
    ref_code = Column(String(100), nullable=True)
    ref_code2 = Column(String(100), nullable=True)
    ref_code3 = Column(String(100), nullable=True)
    ref_code4 = Column(String(100), nullable=True)
    description = Column(String(100), nullable=True)
    wdate = Column(TIMESTAMP)
    mdate = Column(TIMESTAMP)
    flag = Column(String(5), nullable=False)
    
    
class User(Base):
    __tablename__ = 'user'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(100), unique=True, index=True)
    password = Column(String(1000))

    info = relationship("UserInfo", back_populates="user", uselist=False, cascade="all, delete-orphan")
    permissions = relationship("UserPermission", back_populates="user", uselist=False)

class UserInfo(Base):
    __tablename__ = 'user_info'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    full_name = Column(String(50))
    email = Column(String(50))
    contact = Column(String(100))
    
    user = relationship("User", back_populates="info")

class UserPermission(Base):
    __tablename__ = 'user_permission'
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('user.id'))
    permission = Column(String(50))
    
    user = relationship("User", back_populates="permissions")