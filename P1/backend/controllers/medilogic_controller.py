from fastapi import APIRouter, Body, Depends, UploadFile, File
from fastapi.responses import FileResponse
from services.medilogic_service import MediLogicService
from pydantic import BaseModel
from security.jwt_handler import crear_token
from security.auth_middleware import verificar_admin
from typing import List
import shutil
import os
from services.rpa_service import RPAService
from services.correo_service import CorreoService
from services.bitacora_service import Bitacora
from dotenv import load_dotenv

load_dotenv()

# Variables de correo desde .env
SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USER = os.getenv("SMTP_USER")
EMAIL_FROM = os.getenv("EMAIL_FROM")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

# Rutas de archivos
PL_FILE_PATH = "../backend/medilogic.pl"
BITACORA_PATH = "logs/bitacora.txt"

# Inicializamos servicios que se usarán en RPA
bitacora = Bitacora(BITACORA_PATH)

correo = CorreoService(
    smtp_host=SMTP_HOST,
    smtp_port=SMTP_PORT,
    smtp_user=SMTP_USER,
    smtp_password=SMTP_PASSWORD,
    email_from=EMAIL_FROM,
    bitacora=bitacora
)

class Login(BaseModel):
    usuario:str
    password:str

class CrearEnfermedad(BaseModel):
    nombre : str
    sintomas : List[str]
    medicamentos : List[str]
    sistema : List[str]

PL_FILE_PATH = "../backend/medilogic.pl"

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
    @router.post("/diagnostico-completo")
    def diagnostico_completo(data: dict = Body(...)):

        sintomas_data = data.get("sintomas", [])
        alergias = data.get("alergias", [])
        cronicas = data.get("cronicas", [])

        if not sintomas_data:
            return {"error": "Debe enviar síntomas"}

        # EXTRAER SOLO LOS NOMBRES DE LOS SINTOMAS
        sintomas = [s["nombre"] for s in sintomas_data]

        resultado = service.obtener_diagnostico_completo(
            sintomas,
            alergias,
            cronicas
        )

        return resultado

    
    @router.get("/obtener_sintomas")
    def obtener_todos_los_sintomas():
        return {"sintomas": service.obtener_sintomas()}


    @router.get("/obtener_alergias")
    def obtener_todas_las_alergias():
        return {"alergias": service.obtener_alergias()}

    @router.get("/obtener_enfermedades_cronicas")
    def obtener_enfermedades_cronicas():
        return {"enfermedades_cronicas": service.obtener_enfermedades_cronicas()}   
    
    
    # LOGIN DE ADMINISTRADOR

    @router.post("/login-admin")
    def login(data: Login):

        if data.usuario == "admin" and data.password == "1234":

            token = crear_token({
                "usuario": data.usuario,
                "rol": "admin"
            })

            return {"token": token}

        return {"error": "credenciales incorrectas"} 
        

    @router.get("/admin-test")
    def admin_test(user = Depends(verificar_admin)):
        return {
            "mensaje": "Acceso autorizado",
            "usuario": user
        }

    # Obtener medicamentos
    @router.get("/obtener_medicamentos")
    def obtener_medicamentos():
        return {"medicamentos": service.obtener_medicamentos()}
    

    # Agregar enfermedad (solo admin)
    @router.post("/admin/agregar_enfermedad")
    def agregar_enfermedad(
        data: CrearEnfermedad,
        user = Depends(verificar_admin)
    ):

        service.agregar_enfermedad(
            data.nombre,
            data.sintomas,
            data.medicamentos,
            data.sistema
        )

        return {"mensaje": "Enfermedad creada"}
    
    
    # Obtener sistema por enfermedad
    @router.get("/sistema/{nombre}")
    def obtener_sistema_por_enfermedad(nombre: str):
        resultado = service.obtener_sistema_por_enfermedad(nombre)
        return resultado
    
    # Obtener todos los sistemas
    @router.get("/obtener_sistemas")
    def obtener_sistemas():
        resultado = service.obtener_sistemas()
        return {"sistemas": resultado}
    
    # medilogic_controller.py
    @router.delete("/admin/eliminar_enfermedad/{nombre}")
    def eliminar_enfermedad(nombre: str, user=Depends(verificar_admin)):
        # Normalizar nombre como hacemos en frontend
        nombre_normalizado = nombre.lower().replace(" ", "_")

        eliminado = service.eliminar_enfermedad(nombre_normalizado)
        if not eliminado:
            return {"error": "Enfermedad no encontrada"}
        
        return {"ok": True, "mensaje": f"Enfermedad '{nombre_normalizado}' eliminada"}
        
    
    # ------------------------------------
    # Carga y descarga de archivo .pl
    # ------------------------------------

    @router.get("/descargar_pl")
    def descargar_pl(user=Depends(verificar_admin)):
        if not os.path.exists(PL_FILE_PATH):
            return {"error": "Archivo no existe"}
        return FileResponse(PL_FILE_PATH, media_type="text/plain", filename="medilogic.pl")

    @router.post("/cargar_pl")
    def cargar_pl(file: UploadFile = File(...), user = Depends(verificar_admin)):

        if not file.filename.endswith(".pl"):
            return {"error": "El archivo debe ser un .pl"}

        # Guardar el archivo reemplazando el anterior
        with open(PL_FILE_PATH, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # Recargar Prolog
        service.repo._consult_file()

        return {"mensaje": "Archivo .pl cargado correctamente"}


    # ------------------------------------
    # Contraindicaciones
    # ------------------------------------

    @router.get("/obtener_contraindicaciones")
    def obtener_contraindicaciones():
        return {"contraindicaciones": service.obtener_contraindicaciones()}

    # Agregar contraindicacion
    @router.post("/agregar_contraindicacion")
    def agregar_contraindicacion(data:dict):
        service.agregar_contraindicacion(
            data["medicamento"],
            data["alergia"]
        )

        return {"mensaje":"Contraindicación agregada"}

    # Eliminar contraindicacion
    @router.delete("/eliminar_contraindicacion/{medicamento}/{alergia}")
    def eliminar_contraindicacion(medicamento: str, alergia: str):
        service.eliminar_contraindicacion(medicamento, alergia)
        return {"mensaje": "Contraindicación eliminada"}
    
    
    # --------------------------------
    # RPA cargar enfermedades
    # --------------------------------

    rpa = RPAService(service, correo, bitacora)

    @router.post("/rpa_cargar_enfermedades")
    def ejecutar_rpa(user = Depends(verificar_admin)):
        rpa.ejecutar()
        return {"mensaje":"RPA ejecutado correctamente"}


    return router















