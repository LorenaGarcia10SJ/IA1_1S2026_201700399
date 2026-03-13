import smtplib
from email.message import EmailMessage
from services.bitacora_service import Bitacora


class CorreoService:

    def __init__(
        self,
        smtp_host: str,
        smtp_port: int,
        smtp_user: str,
        smtp_password: str,
        email_from: str,
        bitacora: Bitacora
    ):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
        self.smtp_user = smtp_user
        self.smtp_password = smtp_password
        self.email_from = email_from
        self.bitacora = bitacora

    def enviar(self, destinatarios: list, informe: str):
        """
        Enviar el informe a una lista de destinatarios.
        """
        try:
            # Leer informe en UTF-8
            with open(informe, "r", encoding="utf-8") as f:
                contenido = f.read()

            msg = EmailMessage()
            msg.set_content(contenido, subtype="plain", charset="utf-8")

            msg["Subject"] = "Informe MediLogic RPA"
            msg["From"] = self.email_from
            msg["To"] = ", ".join(destinatarios)

            # Usar STARTTLS con puerto 587 (recomendado para Gmail)
            with smtplib.SMTP(self.smtp_host, self.smtp_port) as smtp:
                smtp.ehlo()
                smtp.starttls()
                smtp.ehlo()
                smtp.login(self.smtp_user, self.smtp_password)
                smtp.send_message(msg)

            self.bitacora.escribir(
                f"Correo enviado correctamente a: {', '.join(destinatarios)}"
            )
            return True

        except Exception as e:
            self.bitacora.escribir(f"Error enviando correo: {e}")
            return False