from services.bitacora_service import Bitacora
from datetime import datetime

class RPAService:

    def __init__(self, service, correo, bitacora):

        self.service = service
        self.correo = correo
        self.bitacora = bitacora


    def leer_archivo(self, ruta):

        enfermedades = []

        with open(ruta, "r", encoding="utf-8") as f:

            contenido = f.read()

        bloques = contenido.strip().split("\n\n")

        for bloque in bloques:

            datos = {}

            for linea in bloque.split("\n"):

                clave, valor = linea.split(":",1)

                datos[clave.strip().lower()] = [
                    v.strip().replace(" ", "_")
                    for v in valor.split(",")
                ]

            enfermedades.append(datos)

        self.bitacora.escribir(f"Se esta cargando el archivo...")
        
        return enfermedades


    def guardar_enfermedades(self, enfermedades):

        for e in enfermedades:

            nombre = e["nombre"][0]

            sintomas = e.get("sintomas", [])
            medicamentos = e.get("medicamentos", [])
            sistema = e.get("sistema", [])

            self.service.agregar_enfermedad(
                nombre,
                sintomas,
                medicamentos,
                sistema
            )

            contra = e.get("contraindicados", [])

            for m in medicamentos:

                for c in contra:

                    self.service.agregar_contraindicacion(m,c)

            self.bitacora.escribir(f"Enfermedad agregada: {nombre}")


    def generar_informe(self, enfermedades):
        fecha_actual = datetime.now().strftime("%d/%m/%Y")
        total_enfermedades = len(enfermedades)

        with open("informe.txt","w",encoding="utf-8") as f:
            # Encabezado
            f.write("RPA MediLogic - Informe\n")
            f.write(f"Fecha: {fecha_actual}\n")
            f.write(f"Total enfermedades: {total_enfermedades}\n\n")
            
            for e in enfermedades:
                f.write(f"Enfermedad: {e['nombre'][0]}\n")
                f.write(f"Sintomas: {', '.join(e.get('sintomas',[]))}\n")
                f.write(f"Medicamentos: {', '.join(e.get('medicamentos',[]))}\n")
                f.write(f"Sistema: {', '.join(e.get('sistema',[]))}\n")
                f.write("\n-----------------\n\n")

        self.bitacora.escribir("Informe generado")


    def leer_correos(self):

        correos = []

        with open("config/correos.txt","r") as f:

            for linea in f:

                correo = linea.strip()

                if correo:

                    correos.append(correo)

        self.bitacora.escribir(f"Leyendo correos a enviar")

        return correos


    def ejecutar(self):

        enfermedades = self.leer_archivo("files/enfermedades.txt")

        self.guardar_enfermedades(enfermedades)

        self.generar_informe(enfermedades)

        correos = self.leer_correos()

        self.correo.enviar(correos, "informe.txt")

        self.bitacora.escribir("RPA ejecutado correctamente")