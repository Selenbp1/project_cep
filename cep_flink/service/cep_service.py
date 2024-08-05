from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
import json
from pyspark import *

# SparkSession 생성
spark = SparkSession.builder \
    .appName("KafkaSparkCEP") \
    .master("spark://ys.onewayplatform.com:30068") \
    .config("spark.executor.memory", "4g") \
    .config("spark.executor.cores", "4") \
    .config("spark.cores.max", "8") \
    .config("spark.driver.memory", "4g") \
    .getOrCreate()

# Kafka에서 스트리밍 데이터를 읽어오는 부분
kafka_bootstrap_servers = 'ys.onewayplatform.com:9092'  # 실제 Kafka 서버 주소로 변경
topic = 'simulation-topic'

# Kafka 소스로부터 데이터프레임을 생성
df = spark \
    .readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", kafka_bootstrap_servers) \
    .option("subscribe", topic) \
    .option("startingOffsets", "earliest") \
    .load()

# Kafka의 메시지 값(value)은 바이너리로 인코딩 되어 있으므로 이를 문자열로 변환
df = df.selectExpr("CAST(value AS STRING) as json_data")

# JSON 데이터를 개별 필드로 파싱
schema = ArrayType(StructType([
    StructField("sensor_id", IntegerType(), True),
    StructField("temperature", DoubleType(), True),
    StructField("humidity", DoubleType(), True),
    StructField("timestamp", DoubleType(), True)
]))

df = df.withColumn("data", from_json("json_data", schema))
df = df.select(explode("data").alias("event"))
df = df.select(
    col("event.sensor_id"),
    col("event.temperature"),
    col("event.humidity"),
    col("event.timestamp")
)

# 윈도우 할당 방식 적용
windowed_df = df \
    .withWatermark("timestamp", "10 seconds") \
    .groupBy(
        window(from_unixtime("timestamp"), "10 seconds", "5 seconds"),
        "sensor_id"
    ) \
    .agg(
        avg("temperature").alias("avg_temperature"),
        avg("humidity").alias("avg_humidity")
    )

# 콘솔에 출력
query = windowed_df \
    .writeStream \
    .outputMode("update") \
    .format("console") \
    .option("truncate", "false") \
    .start()

query.awaitTermination()
