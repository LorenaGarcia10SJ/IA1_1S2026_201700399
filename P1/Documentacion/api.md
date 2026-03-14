[REGRESAR](../README.md)

# Cómo correr la API

Esta guía explica cómo poner en funcionamiento MediLogic en tu computadora usando Python, FastAPI, Prolog y el frontend en React + Vite.

1. Instalar dependencias del backend

```
cd backend
pip install fastapi uvicorn pyswip python-dotenv
```

Explicación:
- fastapi → framework web para crear la API.
- uvicorn → servidor para ejecutar la API.
- pyswip → conecta Python con Prolog.
- python-dotenv → permite cargar variables desde un archivo .env.

2. Configurar variables de entorno

La API necesita información para enviar correos electrónicos.
- En la carpeta backend, crea un archivo llamado .env.
- Copia y completa las siguientes líneas con tus datos de correo:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=tu_correo@gmail.com
EMAIL_FROM=tu_correo@gmail.com
SMTP_PASSWORD=tu_contraseña_de_app
```
Importante: Si se usa Gmail, se necesita crear una contraseña de aplicación desde tu cuenta de Google.

3. Ejecutar la API

Desde la terminal, estando en la carpeta /backend, ejecutar:
```
uvicorn main:app --reload
```

4. Instalar y ejecutar el frontend

Abrir otra terminal e ingresar a la carpeta /frontend, ejecutar:

```bash
npm install     #Instalar dependencias de Node.js
npm run dev     #Ejecutar el frontend:
```

5. Usar MediLogic

Abrir un navegador y acceder a: http://localhost:5173

[REGRESAR](../README.md)