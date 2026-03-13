from pathlib import Path
from pyswip import Prolog

class AdminRepo:

    def __init__(self, prolog_file: str):
        self.prolog_file = Path(prolog_file)
        self.prolog = Prolog()
        self._consult_file()

    def _consult_file(self):
        """Carga o recarga el archivo Prolog"""
        path_str = self.prolog_file.resolve().as_posix()
        self.prolog.reconsult(path_str)

    def leer_archivo(self):
        with open(self.prolog_file, "r") as f:
            return f.read()

    def escribir_archivo(self, contenido):
        with open(self.prolog_file, "w") as f:
            f.write(contenido)
        self._consult_file()  # recarga automáticamente

    def agregar_enfermedad(self, nombre):
        linea = f"enfermedad({nombre}).\n"
        with open(self.prolog_file, "a") as f:
            f.write(linea)
        self._consult_file()

    def agregar_sintoma(self, enfermedad, sintoma):
        linea = f"sintomas({enfermedad},{sintoma}).\n"
        with open(self.prolog_file, "a") as f:
            f.write(linea)
        self._consult_file()

    def agregar_medicamento(self, medicamento, enfermedad):
        linea = f"medicamento({medicamento},{enfermedad}).\n"
        with open(self.prolog_file, "a") as f:
            f.write(linea)
        self._consult_file()