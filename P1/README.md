# Proyecto MediLogic - Backend

## Descripción
MediLogic es un sistema de soporte para diagnóstico médico. Permite gestionar enfermedades, síntomas, medicamentos y contraindicaciones. También cuenta con un módulo RPA que carga automáticamente enfermedades desde archivos.

---

## Manual Técnico

### Estructura del proyecto
- `controllers/` → Maneja las rutas de la API.
- `repositories/` → Conexión con Prolog y manejo de datos.
- `services/` → Lógica de negocio y RPA.
- `main.py` → Configuración del FastAPI y conexión de capas.
- `.env` → Variables de entorno, incluyendo credenciales de correo.
- `README.md` → Documentación del proyecto.

### Dependencias
Instalar con pip:
```bash
pip install fastapi uvicorn pyswip python-dotenv