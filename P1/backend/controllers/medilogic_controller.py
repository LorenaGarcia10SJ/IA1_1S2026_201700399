from fastapi import APIRouter, Body
from services.medilogic_service import MediLogicService

def medilogic_router(service: MediLogicService) -> APIRouter:
    
    router = APIRouter(prefix="/medilogic", tags=["diagnostico"])
    # ---------------------------- ENFERMEDADES Y SINTOMAS ----------------------------
    @router.get("/")
    def get_enfermedades():
        inicio = "Funcionando MediLogic" 
        return  inicio
    
    @router.get("/enfermedades")
    def get_enfermedades():
        return {"enfermedades": service.obtener_enfermedades()}

    # Obtener sintoma por nombre
    @router.get("/sintomas/{nombre}")
    def get_sintomas_por_nombre(nombre: str):
        return service.obtener_sintomas_por_nombre(nombre)

    # Obtener medicamento por nombre de enfermedad
    @router.get("/medicamentos/{nombre}")
    def get_medicamentos_por_enfermedad(nombre: str):
        return service.obtener_medicamentos_por_enfermedad(nombre)
    
    # ---------------------------- DIAGNOSTICO ----------------- -----------
    #  Se diagnostica a partir de una lista de sintomas, se devuelve una lista de enfermedades con su afinidad.
    @router.post("/diagnosticos")
    def diagnostico(data: dict = Body(...)):

        sintomas = data.get("sintomas")

        if not sintomas or not isinstance(sintomas, list):
            return {"error": "Debe enviar una lista de sintomas"}

        resultado = service.diagnosticar(sintomas)

        return {"diagnosticos": resultado}


    # Recomendación de medicamentos considerando alergias
    @router.post("/medicamentos_recomendados")
    def medicamentos_recomendados(data: dict = Body(...)):

        nombre = data.get("nombre")
        alergias = data.get("alergias")

        if not nombre:
            return {"error": "Debe enviar el nombre de la enfermedad"}

        if not alergias or not isinstance(alergias, list):
            return {"error": "Debe enviar una lista de alergias"}

        resultado = service.obtener_medicamentos_recomendados(nombre, alergias)

        return {"medicamentos_recomendados": resultado} 
    

    # Diagnóstico completo considerando síntomas y alergias
    @router.post("/diagnostico_completo")
    def diagnostico_completo(data: dict = Body(...)):

        sintomas = data.get("sintomas")
        alergias = data.get("alergias")

        if not sintomas or not isinstance(sintomas, list):
            return {"error": "Debe enviar una lista de sintomas"}

        if not alergias or not isinstance(alergias, list):
            return {"error": "Debe enviar una lista de alergias"}

        resultado = service.obtener_diagnostico_completo(sintomas, alergias)

        return {"diagnostico_completo": resultado}
    

    @router.post("/diagnostico-completo")
    def diagnostico_completo(data: dict = Body(...)):

        sintomas = data.get("sintomas")
        alergias = data.get("alergias", [])

        if not sintomas or not isinstance(sintomas, list):
            return {"error": "Debe enviar una lista de sintomas"}

        resultado = service.obtener_diagnostico_completo(sintomas, alergias)
        return resultado

    
    @router.get("/obtener_sintomas")
    def obtener_todos_los_sintomas():
        return {"sintomas": service.obtener_sintomas()}

    return router