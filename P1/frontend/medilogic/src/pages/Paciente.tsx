import { useState , useEffect} from "react";
import "./Paciente.css";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

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
  
  /* DETALLE -> TODOS LOS DIAGNOSTICOS */
  const mostrarDetalle = (diagnosticoCompleto: any) => {

    let mensaje = "DIAGNÓSTICOS SUGERIDOS\n\n";

    diagnosticoCompleto.diagnosticos.forEach((d:any)=>{
      mensaje +=
      "Enfermedad: " + formatearSintoma(d.enfermedad) + "\n" +
      "Afinidad: " + d.afinidad + "%\n" +
      "Medicamentos: " + d.medicamentos.join(", ") + "\n\n";
    });

    alert(mensaje);
  };

  /* PDF -> TODOS LOS DIAGNOSTICOS */
  const descargarPDF = (diagnosticoCompleto: any) => {

    const doc = new jsPDF();

    /* ---------- ENCABEZADO ---------- */

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 25, "F");

    doc.setTextColor(255,255,255);
    doc.setFontSize(18);
    // Agregar imagen del logo (reemplaza "logo.png" con la ruta de tu imagen)
    // doc.addImage("logo.png", "PNG", 10, 5, 15, 15);
    doc.text("MediLogic - Informe Médico", 20, 15);

    doc.setTextColor(0,0,0);
    doc.setFontSize(11);

    doc.text("Fecha del análisis: " + new Date().toLocaleString(), 20, 35);

    /* ---------- URGENCIA ---------- */

    const urgencia = diagnosticoCompleto.urgencia;

    let colorUrgencia = [34,197,94]; // verde

    if(urgencia === "media"){
      colorUrgencia = [234,179,8]; // amarillo
    }

    if(urgencia === "alta"){
      colorUrgencia = [239,68,68]; // rojo
    }

    doc.setFillColor(colorUrgencia[0],colorUrgencia[1],colorUrgencia[2]);
    doc.rect(20,45,170,10,"F");

    doc.setTextColor(255,255,255);
    doc.text(
      "Nivel de urgencia: " + urgencia.toUpperCase(),
      25,
      52
    );

    doc.setTextColor(0,0,0);

    /* ---------- TITULO SECCION ---------- */

    doc.setFontSize(14);
    doc.text("Diagnósticos sugeridos",20,70);

    /* ---------- TABLA ---------- */

    let y = 80;

    doc.setFontSize(11);

    doc.text("Enfermedad",20,y);
    doc.text("Afinidad",80,y);
    doc.text("Medicamentos",150,y);

    y += 5;
    doc.line(20,y,190,y);

    y += 8;

    diagnosticoCompleto.diagnosticos.forEach((d:any)=>{

      /* nombre enfermedad */

      doc.text(
        formatearSintoma(d.enfermedad),
        20,
        y
      );

      /* barra de afinidad */

      const barraMax = 40;
      const inicioBarra = 90;

      const ancho = (d.afinidad / 100) * barraMax;

      // barra gris de fondo
      doc.setFillColor(220,220,220);
      doc.rect(inicioBarra, y-4, barraMax, 5, "F");

      // barra azul de progreso
      doc.setFillColor(59,130,246);
      doc.rect(inicioBarra, y-4, ancho, 5, "F");

      // porcentaje después de la barra
      doc.setTextColor(0,0,0);
      doc.text(
        d.afinidad + "%",
        inicioBarra + barraMax + 5,
        y
      );

      /* medicamentos */

      doc.text(
        d.medicamentos
        .map((m:string)=>formatearSintoma(m))
        .join(", "),
        150,
        y
      );

      y += 15;

    });

    /* ---------- ALERTA MEDICA ---------- */

    y += 10;

    doc.setDrawColor(239,68,68);
    doc.rect(20,y,170,20);

    doc.setFontSize(10);

    doc.text(
      "Advertencia médica:",
      25,
      y + 7
    );

    doc.text(
      "Este sistema proporciona una sugerencia basada en síntomas.",
      25,
      y + 13
    );

    doc.text(
      "Consulte siempre a un profesional de salud.",
      25,
      y + 18
    );

    /* ---------- FOOTER ---------- */

    doc.setFontSize(9);

    doc.text(
      "Generado por MediLogic - Sistema Experto de Diagnóstico",
      20,
      285
    );

    doc.save("reporte_diagnostico_medico.pdf");

  };

  const principal = diagnostico?.diagnosticos?.[0];

  //----------------------------------------------------
  return (

    <div className="dashboard">
      <button 
        className="btn-volver"
        onClick={() => navigate("/")}
      >
        ⬅ Volver al inicio
      </button>

      <h1>Diágnostico del Paciente</h1>
      
      {!diagnostico && ( 
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
      )}

    {diagnostico && principal && (

      <div className="resultado">

        <h2>Informe de Diagnóstico Médico</h2>

        <p>
          <strong>Urgencia:</strong>{" "}
          {formatearSintoma(diagnostico.urgencia)} -{" "}
          {mensajeUrgencia(diagnostico.urgencia)}
        </p>

        <table className="tabla-diagnostico">

          <thead>
            <tr>
              <th>Enfermedad más probable</th>
              <th>Afinidad</th>
              <th>Medicamentos</th>
              <th>Opciones</th>
            </tr>
          </thead>

          <tbody>

            <tr>

              <td>{formatearSintoma(principal.enfermedad)}</td>

              <td>{principal.afinidad}%</td>

              <td>
                {principal.medicamentos.map((m:string)=>(
                  <div key={m}>{formatearSintoma(m)}</div>
                ))}
              </td>

              <td>

                <button
                  className="btn-opcion"
                  onClick={() => mostrarDetalle(diagnostico)}
                >
                  Ver detalle
                </button>

                <button
                  className="btn-opcion"
                  onClick={() => descargarPDF(diagnostico)}
                >
                  PDF
                </button>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

      )}


    </div>

  );
}

export default Paciente;