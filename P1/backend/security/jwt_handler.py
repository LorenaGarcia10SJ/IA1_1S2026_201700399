from jose import JWTError, jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

# Cargar variables de entorno
load_dotenv()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")  
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", 60))

def crear_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return token


def verificar_token(token: str):

    try:

        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        return payload

    except JWTError:

        return None