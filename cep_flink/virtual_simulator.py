import json
import random
import time
import yaml
from confluent_kafka import Producer, KafkaException
from confluent_kafka.admin import AdminClient, NewTopic
from time import time as timer

with open('config.yaml', 'r') as file:
    config = yaml.safe_load(file)
kafka_bootstrap_servers  = config['kafka']  

kafka_config = {
    'bootstrap.servers': kafka_bootstrap_servers,  
    'client.id': 'simulator-producer'
}

admin_config = {
    'bootstrap.servers': kafka_bootstrap_servers 
}

producer = Producer(kafka_config)
topic = 'simulation-topics'
admin_client = AdminClient(admin_config)
num_partitions = 20
messages_per_partition = 50
data_points_per_message = 500

def generate_data():
    """가상 설비 데이터를 생성합니다."""
    abnormal_probability = 0.1
    if random.random() < abnormal_probability:
        temperature = round(random.uniform(0.0, 120.0), 2) # 비정상 데이터
    else:
        temperature = round(random.uniform(20.0, 100.0), 2) # 정상 데이터
    data = {
        'sensor_id': random.randint(1, 100),
        'temperature': temperature,
        'humidity': round(random.uniform(30.0, 90.0), 2),
        'timestamp': time.time()
    }
    return data

def delivery_report(err, msg):
    """전송 보고서를 처리합니다."""
    if err is not None:
        print(f'Error delivering message to {msg.topic()} [{msg.partition()}]: {err}')
    else:
        pass
    
def create_topic(topic_name, num_partitions, replication_factor=1):
    """토픽을 생성합니다."""
    new_topic = NewTopic(topic_name, num_partitions=num_partitions, replication_factor=replication_factor)
    future = admin_client.create_topics([new_topic])
    
    try:
        future[topic_name].result()  
        print(f'Topic "{topic_name}" created with {num_partitions} partitions.')
    except KafkaException as e:
        print(f'Failed to create topic "{topic_name}": {e}')
    except Exception as e:
        print(f'An unexpected error occurred while creating topic "{topic_name}": {e}')

metadata = admin_client.list_topics(timeout=10)
if topic not in metadata.topics:
    create_topic(topic, num_partitions)
else:
    print(f'Topic "{topic}" already exists.')
    
start_time = timer()
       
for partition in range(num_partitions):
    for _ in range(messages_per_partition):
        data_batch = [generate_data() for _ in range(data_points_per_message)]
        message = json.dumps(data_batch)
        producer.produce(topic, value=message, partition=partition, callback=delivery_report)
        producer.poll(0)  

producer.flush()
end_time = timer()
elapsed_time = end_time - start_time
print(f"모든 데이터 전송이 완료되었습니다. 총 소요 시간: {elapsed_time:.2f} 초")
