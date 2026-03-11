from fastapi import APIRouter, Depends, Body
from security.auth_middleware import verificar_admin
from services.admin_service import AdminService

def admin_router(service: AdminService):
    router = APIRouter(prefix="/admin", tags=["admin"])

    @router.get("/prolog")
    def ver_prolog(user=Depends(verificar_admin)):
        return {"archivo": service.obtener_prolog()}

    @router.put("/prolog")
    def actualizar_prolog(data: dict = Body(...), user=Depends(verificar_admin)):
        contenido = data.get("contenido")
        return service.actualizar_prolog(contenido)

    @router.post("/enfermedad")
    def agregar_enfermedad(data: dict = Body(...), user=Depends(verificar_admin)):
        nombre = data.get("nombre")
        return service.agregar_enfermedad(nombre)

    @router.post("/sintoma")
    def agregar_sintoma(data: dict = Body(...), user=Depends(verificar_admin)):
        enfermedad = data.get("enfermedad")
        sintoma = data.get("sintoma")
        return service.agregar_sintoma(enfermedad, sintoma)

    @router.post("/medicamento")
    def agregar_medicamento(data: dict = Body(...), user=Depends(verificar_admin)):
        medicamento = data.get("medicamento")
        enfermedad = data.get("enfermedad")
        return service.agregar_medicamento(medicamento, enfermedad)

    return router