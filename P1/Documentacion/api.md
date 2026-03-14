Cómo correr la API

Esta guía te ayudará a poner en marcha la API de CMDB en tu entorno local utilizando Node.js, Express y PostgreSQL.
1. Instalar dependencias

npm install

2. Configurar variables de entorno

    Crear un archivo -env en la carpeta Api

DB_USER=
DB_PASSWORD=
DB_NAME=
DB_HOST=
DB_PORT=

3. Crear las tablas en PostgreSQL

Ejecuta el script SQL proporcionado en el modelo de base de datos.
4. Cargar datos iniciales

Desde la terminal, en la raíz del proyecto (carpeta Api), ejecuta el siguiente comando para insertar datos:

npm run seed

5. Ejecutar la API

Desde la terminal, en la raíz del proyecto (carpeta Api), ejecuta el siguiente comando:

npm run dev

REGRESAR