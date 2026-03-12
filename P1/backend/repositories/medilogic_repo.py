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
    def obtener_diagnostico_completo(self, sintomas: List[str], alergias: List[str], cronicas: List[str]) -> List[Dict[str, Any]]:
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
        prolog = Prolog()
        prolog.consult("medilogic.pl")
        resultado = list(prolog.query("sintomas(_,S)"))
        return list({r["S"] for r in resultado})
    
    # Obtener alergias registradas en Prolog
    def obtener_alergias(self) -> List[str]:
        prolog = Prolog()
        prolog.consult("medilogic.pl")
        resultado = list(prolog.query("contraindicado(_,A)"))
        return list({r["A"] for r in resultado})
    
    # Obtener enfermedades cronicas registradas en Prolog
    def obtener_enfermedades_cronicas(self) -> List[str]:
        prolog = Prolog()
        prolog.consult("medilogic.pl")
        resultado = list(prolog.query("enfermedad_cronica(E)"))
        return list({r["E"] for r in resultado})    
    
    # Obtener medicamentos registrados en Prolog
    def obtener_medicamentos(self) -> List[str]:
        prolog = Prolog()
        prolog.consult("medilogic.pl")
        resultado = list(prolog.query("medicamento(M,_)"))
        return list({r["M"] for r in resultado})    
    
    # Agregar nueva enfermedad al sistema
    def agregar_enfermedad(self,nombre: str, sintomas: List[str], medicamentos: List[str], sistema: List[str]):

        with open(self.prolog_file, "a", encoding="utf-8") as f:

            f.write(f"\n\n% enfermedad creada desde admin\n")

            f.write(f"enfermedad({nombre}).\n")

            for s in sintomas:
                f.write(f"sintomas({nombre},{s}).\n")

            for m in medicamentos:
                f.write(f"medicamento({m},{nombre}).\n")
                
            for h in sistema:
                f.write(f"sistema({nombre},{h}).\n")

        # recargar prolog
        self._consult_file()

    # Obtener clasificacion de una enfermedad
    def obtener_sistema_por_enfermedad(self, nombre: str):
        consulta = f"sistema({nombre}, S)"
        resultado = list(self.prolog.query(consulta))
        if not resultado:
            return {"error": "No se encontró sistema para esta enfermedad"}
        return {"enfermedad": nombre, "sistema": resultado[0]["S"]}
    
    # Obtener todos los sistemas
    def obtener_sistemas(self) -> List[str]:
        prolog = Prolog()
        prolog.consult("medilogic.pl")
        resultado = list(prolog.query("sistema(_,S)"))
        return list({r["S"] for r in resultado})
    
    # Eliminar enfermedad del sistema (solo admin)
    def eliminar_enfermedad(self, nombre: str):
        nombre = self._to_prolog_atom(nombre)

        # Leer todo el archivo
        with open(self.prolog_file, "r", encoding="utf-8") as f:
            lineas = f.readlines()

        # Filtrar las líneas que no contengan la enfermedad
        nuevas_lineas = []
        patrones = [
            f"enfermedad({nombre})",
            f"sintomas({nombre},",
            f"medicamento(",
            f"sistema({nombre},"
        ]

        for linea in lineas:
            if not any(pat in linea for pat in patrones):
                nuevas_lineas.append(linea)

        # Sobrescribir el archivo
        with open(self.prolog_file, "w", encoding="utf-8") as f:
            f.writelines(nuevas_lineas)

        # Recargar Prolog
        self._consult_file()

        return True