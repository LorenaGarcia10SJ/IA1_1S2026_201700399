from typing import List, Dict
from repositories.medilogic_repo import MediLogicRepo

# Aquí se define la lógica de negocio, se encarga de procesar los datos y aplicar reglas de negocio.
class MediLogicService:

    def __init__(self, repo: MediLogicRepo):
        self.repo = repo

    def obtener_enfermedades(self) -> List[str]:
        return self.repo.obtener_enfermedades()

    def obtener_sintomas_por_nombre(self, nombre: str) -> Dict[str]:
        return self.repo.obtener_sintomas_por_nombre(nombre)

    def calcular_afinidad(self, enfermedad: str, sintomas: List[str]) -> float:
        return self.repo.calcular_afinidad(enfermedad, sintomas)

    
    def diagnosticar(self, sintomas: List[str]) -> List[Dict]:

        enfermedades = self.repo.obtener_enfermedades()
        resultados = []

        for enfermedad in enfermedades:
            porcentaje = self.repo.calcular_afinidad(enfermedad, sintomas)

            if porcentaje > 0:
                resultados.append({
                    "enfermedad": enfermedad,
                    "afinidad": porcentaje
                })

        resultados.sort(key=lambda x: x["afinidad"], reverse=True)

        return resultados