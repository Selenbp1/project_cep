from pyspark.sql import SparkSession

# Spark 세션 생성
spark = SparkSession.builder \
    .appName("TestSparkSession") \
    .master("local") \
    .getOrCreate()

print("Spark session created successfully.")