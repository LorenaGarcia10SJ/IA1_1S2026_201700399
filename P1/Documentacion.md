# Proyecto 1
# MediLogic

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
