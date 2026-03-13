from datetime import datetime


class Bitacora:

    def __init__(self, archivo: str):
        self.archivo = archivo

    def escribir(self, mensaje: str):

        with open(self.archivo, "a", encoding="utf-8") as f:

            f.write(f"[{datetime.now()}] {mensaje}\n")