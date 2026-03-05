from fastapi import APIRouter, Body
from services.medilogic_service import MediLogicService

def medilogic_router(service: MediLogicService) -> APIRouter:
    
    router = APIRouter(prefix="/diagnostico", tags=["diagnostico"])

    @router.get("")
    def get_enfermedades():
        return {"enfermedades": service.obtener_enfermedades()}

    @router.get("/sintomas/{nombre}")
    def get_sintomas_por_nombre(nombre: str):
        return service.obtener_sintomas_por_nombre(nombre)

    @router.post("/diagnostico")
    def diagnosticar(data: dict = Body(...)):
        sintomas = data.get("sintomas", [])
        return service.diagnosticar(sintomas)

    @router.post("")
    def diagnostico(data: dict = Body(...)):

        sintomas = data.get("sintomas")

        if not sintomas or not isinstance(sintomas, list):
            return {"error": "Debe enviar una lista de sintomas"}

        resultado = service.diagnosticar(sintomas)

        return {"diagnosticos": resultado}

    return router