from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from security.jwt_handler import verificar_token

security = HTTPBearer()


def verificar_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    payload = verificar_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Token inválido")

    if payload.get("rol") != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")

    return payload