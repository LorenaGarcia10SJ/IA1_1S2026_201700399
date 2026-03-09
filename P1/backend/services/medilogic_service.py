from typing import List, Dict, Any
from repositories.medilogic_repo import MediLogicRepo

# Aquí se define la lógica de negocio, se encarga de procesar los datos y aplicar reglas de negocio.
class MediLogicService:

    def __init__(self, repo: MediLogicRepo):
        self.repo = repo

    def obtener_enfermedades(self) -> List[str]:
        return self.repo.obtener_enfermedades()

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
    
    # Obtener sintomas por nombre de enfermedad
    def obtener_sintomas_por_nombre(self, nombre: str) -> Dict[str, Any]:
        return self.repo.obtener_sintomas_por_nombre(nombre)

    # Obtener medicamentos para una enfermedad --------------------
    def obtener_medicamentos_por_enfermedad(self, nombre: str):
        return self.repo.obtener_medicamentos_por_enfermedad(nombre)
    
    # Obtener medicamentos recomendados para una enfermedad considerando alergias
    def obtener_medicamentos_recomendados(self, nombre: str, alergias: List[str]):
        return self.repo.obtener_medicamentos_recomendados(nombre, alergias)
    
    # Obtener diagnostico completo
    def obtener_diagnostico_completo(self, sintomas: List[str], alergias: List[str]) -> List[Dict[str, Any]]:
        return self.repo.obtener_diagnostico_completo(sintomas, alergias)
    
    # Obtener nivel de urgencia de sintoma
    def obtener_nivel_urgencia(self, sintomas: List[str]) -> str:
        return self.repo.obtener_nivel_urgencia(sintomas)
    
    # Obtener todos los sintomas
    def obtener_sintomas(self) -> List[str]:
        return self.repo.obtener_sintomas()
    
    # Obtener alergias
    def obtener_alergias(self) -> List[str]:
        return self.repo.obtener_alergias()     
    
    # Obtener enfermedades cronicas
    def obtener_enfermedades_cronicas(self) -> List[str]:
        return self.repo.obtener_enfermedades_cronicas()