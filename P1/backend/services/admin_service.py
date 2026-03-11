from repositories.admin_repo import AdminRepo

class AdminService:

    def __init__(self, repo: AdminRepo):
        self.repo = repo

    def obtener_prolog(self):
        return self.repo.leer_archivo()

    def actualizar_prolog(self, contenido: str):
        """Permite reemplazar todo el archivo Prolog desde el frontend"""
        self.repo.escribir_archivo(contenido)
        return {"mensaje": "Archivo Prolog actualizado correctamente"}

    def agregar_enfermedad(self, nombre):
        self.repo.agregar_enfermedad(nombre)
        return {"mensaje": "Enfermedad agregada"}

    def agregar_sintoma(self, enfermedad, sintoma):
        self.repo.agregar_sintoma(enfermedad, sintoma)
        return {"mensaje": "Síntoma agregado"}

    def agregar_medicamento(self, medicamento, enfermedad):
        self.repo.agregar_medicamento(medicamento, enfermedad)
        return {"mensaje": "Medicamento agregado"}