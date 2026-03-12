import { useEffect, useState } from "react";
import "./MedicamentosAdmin.css";

function MedicamentosAdmin() {

  const [medicamentos, setMedicamentos] = useState<string[]>([]);
  const [contraindicaciones, setContraindicaciones] = useState<any[]>([]);
  const [nuevoMedicamento, setNuevoMedicamento] = useState("");
  const [nuevaAlergia, setNuevaAlergia] = useState("");
  const [mensaje, setMensaje] = useState("");

  const token = localStorage.getItem("token");

  const formatearNombre = (nombre:string) => {
    return nombre.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase());
  };

  // Cargar medicamentos
  const cargarMedicamentos = async () => {

    const res = await fetch("http://localhost:8000/medilogic/obtener_medicamentos");
    const data = await res.json();

    setMedicamentos(data.medicamentos || []);
  };

  // Cargar contraindicaciones
  const cargarContraindicaciones = async () => {

    const res = await fetch("http://localhost:8000/medilogic/obtener_contraindicaciones");
    const data = await res.json();

    setContraindicaciones(data.contraindicaciones || []);
  };

  useEffect(()=>{
    cargarMedicamentos();
    cargarContraindicaciones();
  },[]);

  // Agregar contraindicacion
  const agregarContraindicacion = async () => {

    if(!nuevoMedicamento || !nuevaAlergia){
      setMensaje("Debe completar los campos");
      return;
    }

    await fetch("http://localhost:8000/medilogic/agregar_contraindicacion",{

      method:"POST",

      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      },

      body:JSON.stringify({
        medicamento:nuevoMedicamento,
        alergia:nuevaAlergia
      })

    });

    setMensaje("Contraindicación agregada");
    setNuevoMedicamento("");
    setNuevaAlergia("");

    cargarContraindicaciones();
  };

  // Eliminar
  const eliminar = async (medicamento:string, alergia:string) => {

    await fetch(`http://localhost:8000/medilogic/eliminar_contraindicacion/${medicamento}/${alergia}`,{

      method:"DELETE",

      headers:{
        "Authorization":`Bearer ${token}`
      }

    });

    setMensaje("Contraindicación eliminada");

    cargarContraindicaciones();
  };

  return(

    <div className="medicamentos-container">

      <h2>Gestión de medicamentos y contraindicaciones</h2>

      <div className="formulario">

        <select
        value={nuevoMedicamento}
        onChange={(e)=>setNuevoMedicamento(e.target.value)}
        >

          <option value="">Seleccionar medicamento</option>

          {medicamentos.map(m=>(
            <option key={m} value={m}>
              {formatearNombre(m)}
            </option>
          ))}

        </select>

        <input
        type="text"
        placeholder="Contraindicación"
        value={nuevaAlergia}
        onChange={(e)=>setNuevaAlergia(e.target.value)}
        />

        <button onClick={agregarContraindicacion}>
          Agregar
        </button>

      </div>

      <table>

        <thead>

          <tr>
            <th>Medicamento</th>
            <th>Contraindicación</th>
            <th>Acciones</th>
          </tr>

        </thead>

        <tbody>

          {contraindicaciones.map((c,i)=>(
            <tr key={i}>

              <td>{formatearNombre(c.medicamento)}</td>
              <td>{formatearNombre(c.alergia)}</td>

              <td>

                <button
                className="btn-eliminar"
                onClick={()=>eliminar(c.medicamento,c.alergia)}
                >
                  Eliminar
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

      {mensaje && <div className="mensaje">{mensaje}</div>}

    </div>
  );
}

export default MedicamentosAdmin;