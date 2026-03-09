from pyswip import Prolog
from typing import Any, Dict, Optional, List
from pathlib import Path
import re

# Aqui de define los metodos para interactuar con Prolog, se encarga de la parte de datos.
class MediLogicRepo:

    def __init__(self, prolog_file: str):
        self.prolog_file = Path(prolog_file).resolve()
        self.prolog = Prolog()
        self._consult_file()

    def _consult_file(self) -> None:
        path_str = self.prolog_file.as_posix()
        list(self.prolog.query(f"consult('{path_str}')."))

    def query_one(self, q: str) -> Optional[Dict[str, Any]]:
        return next(self.prolog.query(q), None)

    _safe_atom_re = re.compile(r"^[a-z][a-z0-9_]*$")

    def _to_prolog_atom(self, s:str) -> str:
        s = s.strip()
        if self._safe_atom_re.match(s): #juan Juan
            return s
        
        s_escaped = s.replace("'", "''") # Juan -> 'Juan'
        return f"'{s_escaped}'"

    def obtener_enfermedades(self) -> List[str]:
        resultado = list(self.prolog.query("enfermedad(E)"))
        return [r["E"] for r in resultado]

    def obtener_sintomas_por_nombre(self, nombre: str) -> Dict[str, Any]:

        consulta = f"sintomas({nombre}, S)"
        resultado = list(self.prolog.query(consulta))

        if not resultado:
            return {"error": "Enfermedad no encontrada"}

        sintomas = [r["S"] for r in resultado]

        return { "enfermedad": nombre, "sintomas": sintomas }
    
    def calcular_afinidad(self, enfermedad: str, sintomas: List[str]) -> float:
        lista_prolog = "[" + ",".join(sintomas) + "]"
        query = f"afinidad({enfermedad}, {lista_prolog}, P)"
        resultado = list(self.prolog.query(query))
        
        if resultado:
            return float(resultado[0]["P"])
        
        return 0.0
    
    # Obtener medicamentos para una enfermedad --------------------
    def obtener_medicamentos_por_enfermedad(self, nombre: str):
        consulta = f"medicamento(M,{nombre})"
        resultado = list(self.prolog.query(consulta))

        if not resultado:
            return {"error": "No se encontraron medicamentos para esta enfermedad"}

        medicamentos = [r["M"] for r in resultado]

        return { "enfermedad": nombre, "medicamentos": medicamentos }
    
    # Obtener medicamentos recomendados para una enfermedad y alergias del paciente
    def obtener_medicamentos_recomendados(self, nombre:str, alergias: List[str]):
        lista_alergias = "[" + ",".join(alergias) + "]"
        consulta = f"medicamento_recomendado(M,{nombre}, {lista_alergias})"
        resultado = list(self.prolog.query(consulta))

        if not resultado:
            return {"error": "No se encontraron medicamentos recomendados para esta enfermedad y alergias"}

        medicamentos = [r["M"] for r in resultado]

        return medicamentos
    

    # Obtener diagnostico completo
    def obtener_diagnostico_completo(self, sintomas: List[str], alergias: List[str]) -> List[Dict[str, Any]]:
        enfermedades = self.obtener_enfermedades()
        urgencia = self.obtener_nivel_urgencia(sintomas)
        resultados = []

        for enfermedad in enfermedades:
            afinidad = self.calcular_afinidad(enfermedad, sintomas)
            
            if afinidad > 0:
                medicamentos = self.obtener_medicamentos_recomendados(enfermedad, alergias)
               
                resultados.append({
                    "enfermedad": enfermedad,
                    "afinidad": afinidad,
                    "medicamentos": medicamentos
                })

        resultados.sort(key=lambda x: x["afinidad"], reverse=True)

        return {"urgencia": urgencia, "diagnosticos": resultados}
        
    
    # Obtener nivel de severidad de un sintoma
    def obtener_nivel_urgencia(self, sintomas: List[str]):

        lista_prolog = "[" + ",".join(sintomas) + "]"

        consulta = f"nivel_urgencia({lista_prolog}, U)"

        resultado = list(self.prolog.query(consulta))

        if resultado:
            return resultado[0]["U"]

        return "baja"
    
    # Obtener todos los sintomas registrados en Prolog
    def obtener_sintomas(self) -> List[str]:
        resultado = list(self.prolog.query("sintomas(_,S)"))
        return [r["S"] for r in resultado]  