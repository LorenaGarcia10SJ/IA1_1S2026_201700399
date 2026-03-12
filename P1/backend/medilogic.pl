:- discontiguous enfermedad/1.
:- discontiguous sintomas/2.
:- discontiguous medicamento/2.
:- discontiguous sistema/2.
:- discontiguous contraindicado/2.

:- dynamic enfermedad/1.
:- dynamic sintomas/2.
:- dynamic medicamento/2.
:- dynamic sistema/2.
:- dynamic contraindicado/2.

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
% contraindicado(Medicamento, Alergia) -> El medicamento Medicamento está contraindicado para personas con la alergia Alergia
contraindicado(paracetamol, alergia_paracetamol).
contraindicado(amoxicilina, alergia_penicilina).
contraindicado(antibiotico, resistencia_antibiotica).
contraindicado(ibuprofeno, alergia_ibuprofeno).

% Enfermedades crónicas
enfermedad_cronica(asma).
enfermedad_cronica(diabetes).
enfermedad_cronica(hipertension).
enfermedad_cronica(cardiopatia).
enfermedad_cronica(enfermedad_autoinmune).

% Nivel de severidad de cada sintoma
% Leve - Moderado - Severo
urgencia(fiebre, moderado).
urgencia(tos, moderado).
urgencia(dolor_cabeza, leve).
urgencia(escalofrios, moderado).
urgencia(dificultad_respirar, severo).
urgencia(dolor_pecho, moderado).
urgencia(fatiga, leve).
urgencia(dolor_abdominal, moderado).
urgencia(diarrea, leve).
urgencia(nauseas, leve).
urgencia(vomitos, moderado).


% Clasificar enfermedad por sistema del cuerpo
sistema(gripe, respiratorio).
sistema(bronquitis, respiratorio).
sistema(gastroenteritis, digestivo).

% =========================
% Reglas - ayudan en el backend
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

% Medicamento recomendado(ver contraindicaciones)
% medicamento(M,Enfermedad) -> M es un medicamento recomendado para tratar la Enfermedad
% y
% \+ (member(A, Alergias), contraindicado(M, A)) -> No existe ninguna alergia en la lista de alergias que contraindique el medicamento M.
medicamento_recomendado( M , Enfermedad, Alergias) :- medicamento(M,Enfermedad), \+ (member(A, Alergias), contraindicado(M, A)).

% Urgencia
% Si existe un síntoma severo → urgencia alta
nivel_urgencia(ListaSintomas, alta) :-
    member(S, ListaSintomas), urgencia(S, severo), !.

% Si existe moderado → urgencia media
nivel_urgencia(ListaSintomas, media) :-
    member(S, ListaSintomas), urgencia(S, moderado), !.

% Si no hay severos ni moderados
nivel_urgencia(_, baja).

% eliminar_enfermedad(+Nombre)
% Elimina la enfermedad y todas sus relaciones (sintomas, medicamentos, sistema)
eliminar_enfermedad(Nombre) :-
    retractall(enfermedad(Nombre)),
    retractall(sintomas(Nombre, _)),
    retractall(medicamento(_, Nombre)),
    retractall(sistema(Nombre, _)).



% enfermedad creada desde admin


% enfermedad creada desde admin

