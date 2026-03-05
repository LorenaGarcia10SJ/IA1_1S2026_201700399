% =========================
% HECHOS
% =========================

% Enfermedades
enfermedad(gripe).
enfermedad(bronquitis).
enfermedad(gastroenteritis).

% Síntomas
sintomas(gripe, fiebre).
sintomas(gripe, tos).
sintomas(gripe, dolor_cabeza).
sintomas(gripe, escalofrios).

sintomas(bronquitis, dificultad_respirar).
sintomas(bronquitis, tos).
sintomas(bronquitis, dolor_pecho).
sintomas(bronquitis, fatiga).

sintomas(gastroenteritis, dolor_abdominal).
sintomas(gastroenteritis, diarrea).
sintomas(gastroenteritis, nauseas).
sintomas(gastroenteritis, vomitos).

% Medicamentos
medicamento(paracetamol, gripe).
medicamento(ibuprofeno, gripe).
medicamento(omeprazol, gastroenteritis).
medicamento(antibiotico, bronquitis).
medicamento(antidiarreico, gastroenteritis).
medicamento(amoxicilina, bronquitis).

% Contraindicaciones
contraindicado(paracetamol, alergia_paracetamol).
contraindicado(ibuprofeno, ulcera).
contraindicado(amoxicilina, alergia_penicilina).
contraindicado(antibiotico, resistencia_antibiotica).

% =========================
% REGLAS
% =========================

% Contar cuántos síntomas de la enfermedad coinciden con los síntomas del paciente.
contar_coincidencias(_, [], 0).

% Si la enfermedad E tiene el sintoma S, se suma 1 y sigue con el siguiente sintoma de la lista.
% Si no coincide, simplemente sigue con el siguiente sintoma sin sumar.
% regla - suma(A, B, R) := R is A + B.
% Recursión : sintomas contar_coincidencias
%           | contar_coincidencias

contar_coincidencias(E, [S|R], N) :- sintomas(E, S), contar_coincidencias(E, R, N1), N is N1 + 1.
contar_coincidencias(E, [_|R], N) :- contar_coincidencias(E, R, N).

% Contar el total de síntomas que tiene una enfermedad.
total_sintomas(E, Total):- findall(S, sintomas(E,S), Lista), length(Lista,Total).

% Afinidad :  (sintomas que coinciden / sintomas totales de la enfermedad)* 100
afinidad(E, ListaSintomas, Porcentaje) :- contar_coincidencias(E, ListaSintomas, Coincidencias),
    total_sintomas(E, Total),Total > 0,
    Porcentaje is (Coincidencias / Total) * 100.