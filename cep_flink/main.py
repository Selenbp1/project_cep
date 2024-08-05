import time
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
import yaml

# Config 파일 로드
with open('config.yaml', 'r') as file:
    config = yaml.safe_load(file)

kafka_bootstrap_servers = config['kafka']
spark_servers = config['spark']

topic = 'simulation-topics'
normal_topic = 'normal-data-topic'
abnormal_topic = 'abnormal-data-topic'
windowed_topic = 'windowed-data-topic'

# Spark 세션 생성
spark = SparkSession.builder \
    .appName("KafkaSparkCEP") \
    .master(f"spark://{spark_servers}") \
    .config("spark.executor.memory", "4g") \
    .config("spark.executor.cores", "4") \
    .config("spark.cores.max", "8") \
    .config("spark.driver.memory", "4g") \
    .config("spark.jars.packages", "org.apache.spark:spark-sql-kafka-0-10_2.12:3.5.1") \
    .getOrCreate()

# Kafka에서 데이터 읽기
df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", kafka_bootstrap_servers) \
    .option("subscribe", topic) \
    .option("startingOffsets", "earliest") \
        .option("failOnDataLoss", "false") \
    .load()

df = df.selectExpr("CAST(value AS STRING) as json_data")

# 데이터 스키마 정의
schema = ArrayType(StructType([
    StructField("sensor_id", IntegerType(), True),
    StructField("temperature", DoubleType(), True),
    StructField("humidity", DoubleType(), True),
    StructField("timestamp", DoubleType(), True)
]))

# JSON 데이터를 구조화된 형식으로 변환
df = df.withColumn("data", from_json("json_data", schema))
df = df.select(explode("data").alias("event"))
df = df.select(
    col("event.sensor_id"),
    col("event.temperature"),
    col("event.humidity"),
    col("event.timestamp")
)

df = df.withColumn("timestamp", from_unixtime(col("timestamp")).cast(TimestampType()))

# 윈도우 함수 사용
windowed_df = df \
    .withWatermark("timestamp", "10 seconds") \
    .groupBy(
        window("timestamp", "10 seconds", "5 seconds"),
        "sensor_id"
    ) \
    .agg(
        avg("temperature").alias("avg_temperature"),
        avg("humidity").alias("avg_humidity")
    )

# 정상 및 비정상 데이터 필터링
normal_df = df.filter(col("temperature").between(20.0, 100.0))
abnormal_df = df.filter((col("temperature") < 20.0) | (col("temperature") > 100.0))

checkpoint_dir = "/tmp/spark-checkpoints"

# Kafka로 데이터 쓰기 함수
def write_to_kafka(df, topic, checkpoint_dir):
    return df \
        .selectExpr("CAST(sensor_id AS STRING) AS key", "to_json(struct(*)) AS value") \
        .writeStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", kafka_bootstrap_servers) \
        .option("topic", topic) \
        .option("checkpointLocation", checkpoint_dir) \
        .outputMode("update") \
        .start()

normal_query = write_to_kafka(normal_df, normal_topic, checkpoint_dir + "/normal")
abnormal_query = write_to_kafka(abnormal_df, abnormal_topic, checkpoint_dir + "/abnormal")
windowed_query = write_to_kafka(windowed_df, windowed_topic, checkpoint_dir + "/windowed")

# 각 쿼리 모니터링 함수
def monitor_queries(queries):
    start_times = {query.id: time.time() for query in queries}
    end_times = {}

    try:
        while True:
            all_done = True
            for query in queries:
                status = query.status
                if status['isTriggerActive']:
                    all_done = False
                else:
                    if query.id not in end_times:
                        end_times[query.id] = time.time()
                        processing_time = end_times[query.id] - start_times[query.id]
                        print(f"Query {query.id} completed. Processing time: {processing_time:.2f} seconds")

            if all_done:
                break

    except KeyboardInterrupt:
        for query in queries:
            query.stop()
        end_time = time.time()
        total_processing_time = end_time - min(start_times.values())
        print(f"Total processing time: {total_processing_time:.2f} seconds")

queries = [normal_query, abnormal_query, windowed_query]
monitor_queries(queries)
