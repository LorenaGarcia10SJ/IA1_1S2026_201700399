# Proyecto 1
# MediLogic

## Herramientas y tecnologías requeridas

### Lenguajes de programación
- Python
- Librerias: pyswip, PyAutoGUI

### Motor lógico
- Prolog
- Archvio "medilogic.pl" en el que se incluye:
  - Hechos
  - Reglas

## Instalar dependencias
npm install jspdf

### Módulos principales 
 - Dashboard Pacientes
 - Dashboard Administrador

## Dashboard Pacientes

- Permite ingresar información clínica basica a través de formularios interactivos.
- El sistema permite seleccionar síntomas a través de checkbox
- Registrar alergías a medicamentos y enfermedades crónicas preexistentes como:
    - diabetes
    - hipertención
    - enfermedades autoinmunes
- El sistema indica el nivel de severidad de cada sintoma
    - Leve
    - Moderado
    - Severo

- El usuario completa el ingreso de datos, podrá solicitar un análisis para determinar posibles enfermedades asociados a los síntomas proporcionados.

- Las enfermedades deberan ordenarse por porcentaje de coincidencia.

- El sistema debe dugerir medamentos adecuados para tratar cada una de las enfermedades listadas.

- El sistema emiti una recomendación de acción para el usuario, indicando el nivel de urgencia con frases como:
    - Consulta médica inmediate
    - Observación recomendada.


# Logica de prolog medilogic.pl

- Se necesita calcular la afinidad: (sintomas que coinciden / sintomas totales de la enfermedad)* 100


# Resultados obtenidos

{
  "urgencia": "media",
  "diagnosticos": [
    {
      "enfermedad": "gripe",
      "afinidad": 50,
      "medicamentos": ["ibuprofeno"]
    },
    {
      "enfermedad": "bronquitis",
      "afinidad": 25,
      "medicamentos": ["antibiotico"]
    }
  ]
}

Desde frontend se envia los datos que el usuario selecciona.

## Dashboard Administrador
El modulo esta protegido por autenticación y es accesible únicamente por usuarios con credenciales válidas.

Funcionalidades:
- Crear enfermedades 
  - Nombre
  - Descripcion
  - sintomas asociados
  - medicamentos contraindicados
- Editar enfermedades
- Eliminar enfermedades
- Registrar nuevos sintomas
- Administrar medicamentos disponibles
- Clasificar enfermedades por sistema del cuerpo.

