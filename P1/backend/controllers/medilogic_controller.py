from fastapi import APIRouter, Body
from services.medilogic_service import MediLogicService

def medilogic_router(service: MediLogicService) -> APIRouter:
    
    router = APIRouter(prefix="/medilogic", tags=["diagnostico"])
    # ---------------------------- ENFERMEDADES Y SINTOMAS ----------------------------
    @router.get("/enfermedades")
    def get_enfermedades():
        return {"enfermedades": service.obtener_enfermedades()}

    # Obtener sintoma por nombre
    @router.get("/sintomas/{nombre}")
    def get_sintomas_por_nombre(nombre: str):
        return service.obtener_sintomas_por_nombre(nombre)

    # ---------------------------- DIAGNOSTICO ----------------- -----------
    #  Se diagnostica a partir de una lista de sintomas, se devuelve una lista de enfermedades con su afinidad.
    @router.post("/diagnostico")
    def diagnosticar(data: dict = Body(...)):
        sintomas = data.get("sintomas", [])
        return service.diagnosticar(sintomas)

    @router.post("/diagnosticos")
    def diagnostico(data: dict = Body(...)):

        sintomas = data.get("sintomas")

        if not sintomas or not isinstance(sintomas, list):
            return {"error": "Debe enviar una lista de sintomas"}

        resultado = service.diagnosticar(sintomas)

        return {"diagnosticos": resultado}

    return router