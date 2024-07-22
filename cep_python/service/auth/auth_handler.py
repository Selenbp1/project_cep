import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os


env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

SECRET_KEY = os.getenv("SECRET_KEY")


def sign_jwt(username: str):
    try:
        payload = {
            "username": username,
            "exp": datetime.now() + timedelta(days=1)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
        return token
    except:
        import traceback; traceback.print_exc();

def decode_jwt(token: str):
    try: 
        decoded_token = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return decoded_token if decoded_token["exp"] >= datetime.now() else None
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

