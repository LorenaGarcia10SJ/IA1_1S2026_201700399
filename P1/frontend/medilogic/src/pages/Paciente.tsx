import { useState , useEffect} from "react";
import "./Paciente.css";
import { useNavigate } from "react-router-dom";

type Severidad = "leve" | "moderado" | "severo" | "";

type SintomasState = {
  [key: string]: Severidad;
};

function Paciente() {

  const [sintomas, setSintomas] = useState<SintomasState>({});
  const [alergias, setAlergias] = useState<string[]>([]);
  const [cronica, setCronicas] = useState<string[]>([]);
  const navigate = useNavigate();
  const [listaSintomas, setListaSintomas] = useState<string[]>([]);

  // Resultado del diágnostico
  const [diagnostico, setDiagnostico] = useState<any>(null);

  useEffect(() => {

    fetch("http://localhost:8000/medilogic/obtener_sintomas")
      .then(res => res.json())
      .then(data => {

        // eliminar duplicados si vienen del backend
        const sintomasUnicos = [...new Set(data.sintomas as string[])];
        setListaSintomas(sintomasUnicos);

      })
      .catch(error => console.error("Error obteniendo síntomas:", error));

  }, []);
    
  // Obtener alergias desde backend
  const [listaAlergias, setListaAlergias] = useState<string[]>([]);
  useEffect(() => {

    fetch("http://localhost:8000/medilogic/obtener_alergias")
      .then(res => res.json())
      .then(data => {

        const alergiasUnicas = [...new Set(data.alergias as string[])];
        setListaAlergias(alergiasUnicas);

      })
      .catch(error => console.error("Error obteniendo alergias:", error));

  }, []);

  // Obtener enfermedades crónicas desde backend
  const [listaCronicas, setListaCronicas] = useState<string[]>([]);
  useEffect(() => {

    fetch("http://localhost:8000/medilogic/obtener_enfermedades_cronicas")
      .then(res => res.json())
      .then(data => {

        const cronicasUnicas = [...new Set(data.enfermedades_cronicas as string[])];
        setListaCronicas(cronicasUnicas);

      })
      .catch(error => console.error("Error obteniendo enfermedades crónicas:", error));

  }, []);


  const handleSintomaChange = (sintoma: string, severidad: Severidad) => {
    setSintomas({
      ...sintomas,
      [sintoma]: severidad
    });
  };

  const handleAlergiaChange = (alergia: string) => {
    if(alergias.includes(alergia)){
      setAlergias(
        alergias.filter(a => a !== alergia)
      );
    } else {
        setAlergias([...alergias, alergia]);
    }
  };

  const handleCronicaChange = (cronicaSeleccionada: string) => {

    if (cronica.includes(cronicaSeleccionada)) {
      setCronicas(cronica.filter(a => a !== cronicaSeleccionada));
    } else {
      setCronicas([...cronica, cronicaSeleccionada]);
    }

  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const sintomasSeleccionados = Object.entries(sintomas)
      .filter(([_, severidad]) => severidad !== "")
      .map(([nombre, severidad]) => ({
          nombre,
          severidad
      }));

    const datosPaciente = {
      sintomas: sintomasSeleccionados,
      alergias: alergias,
      cronicas: cronica
    };

    const response = await fetch("http://localhost:8000/medilogic/diagnostico-completo",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(datosPaciente)
    });

    const resultado = await response.json();
    setDiagnostico(resultado);

    console.log(resultado);
  };

  const formatearSintoma=(sintoma: string)=>{
    return sintoma
    .replace(/_/g, " ") // reemplaza _ por espacio
    .replace(/\b\w/g, (letra) => letra.toUpperCase()); // primera letra mayúscula
  };

  const mensajeUrgencia= (urgencia: string)=>{
    // monstrar mensaje
    switch(urgencia){
      case "alta":
        return "Recomendamos buscar atención médica inmediata.";
      case "media":
        return "Posible automanejo pero se recomienda consultar a un médico pronto.";
      case "baja":
        return "Es probable que puedas manejarlo con cuidado en casa, pero si empeora, consulta a un médico.";
      default:
        return "";
    }
  };
  
  return (

    <div className="dashboard">
      <button 
        className="btn-volver"
        onClick={() => navigate("/")}
      >
        ⬅ Volver al inicio
      </button>

      <h1>Diágnostico del Paciente</h1>
      
      <form onSubmit={handleSubmit}>

        {/* SINTOMAS */}
        <h2>Selecciona tus síntomas</h2>
        <div className="sintomas-container">
          {listaSintomas.map((sintoma) => (

            <div key={sintoma} className="sintoma-card">

              <label>{formatearSintoma(sintoma)}</label>

              <select
                onChange={(e) =>
                  handleSintomaChange(
                    sintoma,
                    e.target.value as Severidad
                  )
                }
              >
                <option value="">No tengo este síntoma</option>
                <option value="leve">Leve</option>
                <option value="moderado">Moderado</option>
                <option value="severo">Severo</option>
              </select>

            </div>

          ))}
        </div>

        {/* ALERGIAS */}
        <h2>Alergias o condiciones médicas</h2>
        <p className="h3">Indique si tiene alguna alergia o condición médica relevante (ej. alergia a penicilina, asma, etc.)</p>
        <div className="checkbox-gropu">
          {listaAlergias.map((alergia) => (

            <label key={alergia} className="checkbox">

              <input
                type="checkbox"
                onChange={() => handleAlergiaChange(alergia)}
              />

              {formatearSintoma(alergia)}

            </label>

          ))}
        </div>

        {/* ENFERMEDADES CRONICAS */}
        <h2>Enfermedades crónicas</h2>
        <div className="checkbox-gropu">
          {listaCronicas.map((cronica) => (

            <label key={cronica} className="checkbox">

              <input
                type="checkbox"
                onChange={() => handleCronicaChange(cronica)}
              />

              {formatearSintoma(cronica)}

            </label>

          ))}
        </div>

        <button type="submit" className="btn">
          Analizar síntomas
        </button>

      </form>

    {diagnostico && (
      <div className="resultado">
        <h2>Resultado del Diagnóstico</h2>

        <p>
          <strong>Enfermedad probable:</strong> {formatearSintoma(diagnostico.diagnosticos[0].enfermedad)}
        </p>

        <p>
          <strong> Urgencia:</strong> 
          
          {diagnostico.urgencia + " - " + mensajeUrgencia(diagnostico.urgencia)}
          {/*mensaje: {mensajeUrgencia(diagnostico.urgencia)}*/}
        </p>

        <p>
          <strong>Probabilidad:</strong> {diagnostico.diagnosticos[0].afinidad}%
        </p>

        <h3>Medicamentos recomendados</h3>
        <ul>
          {diagnostico.diagnosticos[0].medicamentos.map((med: string) => (
            <li key={med}>{formatearSintoma(med)}</li>
          ))}
        </ul>

      </div>
    )}

    </div>

  );
}

export default Paciente;