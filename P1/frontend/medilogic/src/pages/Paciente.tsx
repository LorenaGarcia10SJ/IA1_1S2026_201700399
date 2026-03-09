import { useState , useEffect} from "react";
import "./Paciente.css";

type Severidad = "leve" | "moderado" | "severo" | "";

type SintomasState = {
  [key: string]: Severidad;
};

function Paciente() {

  const [sintomas, setSintomas] = useState<SintomasState>({});
  const [alergias, setAlergias] = useState<string>("");
  const [cronicas, setCronicas] = useState<string[]>([]);

  const [listaSintomas, setListaSintomas] = useState<string[]>([]);

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
    

  const enfermedadesCronicas: string[] = [
    "Diabetes",
    "Hipertensión",
    "Enfermedad autoinmune",
    "Asma"
  ];

  const handleSintomaChange = (sintoma: string, severidad: Severidad) => {
    setSintomas({
      ...sintomas,
      [sintoma]: severidad
    });
  };

  const handleCronicaChange = (enfermedad: string) => {

    if (cronicas.includes(enfermedad)) {
      setCronicas(cronicas.filter(e => e !== enfermedad));
    } else {
      setCronicas([...cronicas, enfermedad]);
    }

  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    const datosPaciente = {
      sintomas,
      alergias,
      cronicas
    };

    console.log(datosPaciente);
    alert("Información enviada para análisis");

  };

  const formatearSintoma=(sintoma: string)=>{
    return sintoma
    .replace(/_/g, " ") // reemplaza _ por espacio
    .replace(/\b\w/g, (letra) => letra.toUpperCase()); // primera letra mayúscula
};

  return (

    <div className="dashboard">

      <h1>Panel del Paciente</h1>

      <form onSubmit={handleSubmit}>

        {/* SINTOMAS */}
        <h2>Selecciona tus síntomas</h2>

        {listaSintomas.map((sintoma) => (

          <div key={sintoma} className="sintoma">

            <label>{formatearSintoma(sintoma)}</label>

            <select
              onChange={(e) =>
                handleSintomaChange(
                  sintoma,
                  e.target.value as Severidad
                )
              }
            >
              <option value="">Seleccionar severidad</option>
              <option value="leve">Leve</option>
              <option value="moderado">Moderado</option>
              <option value="severo">Severo</option>
            </select>

          </div>

        ))}

        {/* ALERGIAS */}
        <h2>Alergias a medicamentos</h2>

        <textarea
          placeholder="Ej: penicilina, ibuprofeno..."
          value={alergias}
          onChange={(e) => setAlergias(e.target.value)}
        />

        {/* ENFERMEDADES CRONICAS */}
        <h2>Enfermedades crónicas</h2>

        {enfermedadesCronicas.map((enfermedad) => (

          <label key={enfermedad} className="checkbox">

            <input
              type="checkbox"
              onChange={() => handleCronicaChange(enfermedad)}
            />

            {enfermedad}

          </label>

        ))}

        <button type="submit" className="btn">
          Analizar síntomas
        </button>

      </form>

    </div>

  );
}

export default Paciente;