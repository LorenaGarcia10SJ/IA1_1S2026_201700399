# pip install fastapi uvicorn pyswip
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from repositories.medilogic_repo import MediLogicRepo
from services.medilogic_service import MediLogicService
from controllers.medilogic_controller import medilogic_router

app = FastAPI(title="MediLogic")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Se conecta con Prolog
repo = MediLogicRepo("medilogic.pl")

# Se crea el service (Se encarga de la lógica de negocio)
service = MediLogicService(repo)

# controller(Se encarga de manejar las rutas)
app.include_router(medilogic_router(service))