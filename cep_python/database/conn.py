import os
import yaml
from sqlalchemy import create_engine, or_
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import *
from sqlalchemy.orm import sessionmaker, scoped_session

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(current_dir, os.pardir))
config_path = os.path.join(project_root, 'config.yaml')

with open('config.yaml', 'r') as file:
    config = yaml.safe_load(file)
    
db_config = config['db']
db_url = f"mysql+pymysql://{db_config['username']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}"
engine = create_engine(db_url, echo=True)

Session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

Base = declarative_base()
Base.metadata.bind = engine 

def get_session():
    return Session()