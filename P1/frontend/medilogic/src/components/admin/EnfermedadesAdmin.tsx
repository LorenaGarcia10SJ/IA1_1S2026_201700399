import { useEffect, useState } from "react";
import "./EnfermedadAdmin.css";

function EnfermedadesAdmin() {

  const [enfermedades,setEnfermedades] = useState<string[]>([]);
  const [sistemas, setSistemas] = useState<{[nombre:string]: string}>({});
  const [mostrarFormulario,setMostrarFormulario] = useState(false);

  const [nombre,setNombre] = useState("");

  const [sintomasDisponibles,setSintomasDisponibles] = useState<string[]>([]);
  const [sintomasSeleccionados,setSintomasSeleccionados] = useState<string[]>([]);

  const [medicamentosDisponibles,setMedicamentosDisponibles] = useState<string[]>([]);
  const [medicamentosSeleccionados,setMedicamentosSeleccionados] = useState<string[]>([]);

  const [sistemasDisponibles,setSistemasDisponibles] = useState<string[]>([]);
  const [sistemasSeleccionados,setSistemasSeleccionados] = useState<string[]>([]);


  const [busquedaSintoma,setBusquedaSintoma] = useState("");
  const [busquedaMedicamento,setBusquedaMedicamento] = useState("");
  const [busquedaSistema,setBusquedaSistema] = useState("");

  const token = localStorage.getItem("token");

  // -----------------------------
  // UTILIDADES
  // -----------------------------

  const formatearNombre = (texto:string) => {
    return texto.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase());
  };

  const normalizarNombre = (texto:string) => {
    return texto.toLowerCase().trim().replace(/\s+/g,"_");
  };

  // -----------------------------
  // CARGAR DATOS
  // -----------------------------

  const cargar = async () => {

    const res = await fetch("http://localhost:8000/medilogic/enfermedades");
    const data = await res.json();

    setEnfermedades(data.enfermedades || []);

  };

  const cargarSintomas = async () => {

    const res = await fetch("http://localhost:8000/medilogic/obtener_sintomas");
    const data = await res.json();

    setSintomasDisponibles((data.sintomas || []).map(normalizarNombre));

  };

  const cargarMedicamentos = async () => {

    const res = await fetch("http://localhost:8000/medilogic/obtener_medicamentos");
    const data = await res.json();

    setMedicamentosDisponibles((data.medicamentos || []).map(normalizarNombre));

  };

  const cargarSistemas = async () => {
    const nuevosSistemas: { [nombre: string]: string } = {};
    for (const e of enfermedades) {
      const res = await fetch(`http://localhost:8000/medilogic/sistema/${e}`);
      const data = await res.json();
      nuevosSistemas[e] = data.sistema ?? "-";
    }
    setSistemas(nuevosSistemas);
  };

  const cargarTodosSistemas = async () => {
    const res = await fetch("http://localhost:8000/medilogic/obtener_sistemas");
    const data = await res.json();
    setSistemasDisponibles((data.sistemas || []).map(normalizarNombre));

  };

  useEffect(()=>{

    cargar();
    cargarSintomas();
    cargarMedicamentos();
    cargarTodosSistemas();

  },[]);

  useEffect(() => {
    cargarSistemas();
  }, [enfermedades]);

  // -----------------------------
  // FILTROS AUTOCOMPLETE
  // -----------------------------

  const sintomasFiltrados = sintomasDisponibles.filter(s =>
    formatearNombre(s).toLowerCase().includes(busquedaSintoma.toLowerCase())
  );

  const medicamentosFiltrados = medicamentosDisponibles.filter(m =>
    formatearNombre(m).toLowerCase().includes(busquedaMedicamento.toLowerCase())
  );

  const sistemasFiltrados = sistemasDisponibles.filter(s =>
    formatearNombre(s).toLowerCase().includes(busquedaSistema.toLowerCase())
  );
  // -----------------------------
  // SELECCIONAR / DESELECCIONAR
  // -----------------------------

  const toggleSintoma = (s:string) => {

    if(sintomasSeleccionados.includes(s)){
      setSintomasSeleccionados(sintomasSeleccionados.filter(x=>x!==s));
    }else{
      setSintomasSeleccionados([...sintomasSeleccionados,s]);
    }

  };

  const toggleMedicamento = (m:string) => {

    if(medicamentosSeleccionados.includes(m)){
      setMedicamentosSeleccionados(medicamentosSeleccionados.filter(x=>x!==m));
    }else{
      setMedicamentosSeleccionados([...medicamentosSeleccionados,m]);
    }

  };

  const toggleSistema = (s:string) => {

    if(sistemasSeleccionados.includes(s)){
      setSistemasSeleccionados(sistemasSeleccionados.filter(x=>x!==s));
    } else {                              
      setSistemasSeleccionados([...sistemasSeleccionados,s]);
    }

  };

  // -----------------------------
  // AGREGAR ENFERMEDAD
  // -----------------------------

  const agregar = async () => {

    if(!nombre.trim()){

      alert("Debe ingresar un nombre de enfermedad");
      return;

    }

    const nombreNormalizado = normalizarNombre(nombre);

    if(enfermedades.includes(nombreNormalizado)){

      alert("La enfermedad ya existe");
      return;

    }

    const response = await fetch("http://localhost:8000/medilogic/admin/agregar_enfermedad",{

      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      },
      body:JSON.stringify({

        nombre:nombreNormalizado,
        sintomas:sintomasSeleccionados,
        medicamentos:medicamentosSeleccionados,
        sistema:sistemasSeleccionados

      })

    });

    if(response.ok){
      alert("Se agrego correctamente el registro");
    }else{
      alert("Error al agregar la enfermedad");
      return;
    }


    setNombre("");
    setSintomasSeleccionados([]);
    setMedicamentosSeleccionados([]);
    setSistemasSeleccionados([]);

    setMostrarFormulario(false);

    cargar();
    cargarSistemas();

  };

  return(

  <div className="tabla-container">

    <div className="tabla-header">

      <h2>Gestión de Enfermedades</h2>

      <button
        className="btn-agregar"
        onClick={()=>setMostrarFormulario(true)}
      >
        + Nueva
      </button>

    </div>

    <table>

      <thead>

        <tr>
          <th>Nombre</th>
          <th>Sistema</th>
          <th>Acciones</th>
        </tr>

      </thead>

      <tbody>

        {enfermedades.map(e=>(
          <tr key={e}>

            <td>{formatearNombre(e)}</td>
            <td>{sistemas[e] ? formatearNombre(sistemas[e]) : "Cargando..."}</td>
            
            <td className="acciones">

              <button className="btn-editar">
                Editar
              </button>

              <button className="btn-eliminar">
                Eliminar
              </button>

            </td>

          </tr>
        ))}

      </tbody>

    </table>

    {mostrarFormulario && (

      <div className="modal">

        <div className="modal-content">

          <h3>Nueva Enfermedad</h3>

          <input
            placeholder="Ingrese el nombre de la enfermedad"
            value={nombre}
            onChange={(e)=>setNombre(e.target.value)}
          />

          {/* SINTOMAS */}

          <div className="selector">

            <h4>Seleccione los síntomas </h4>

            <input
              placeholder="Buscar o agregar síntoma"
              value={busquedaSintoma}
              onChange={(e)=>setBusquedaSintoma(e.target.value)}
            />

            {busquedaSintoma && (

              <div className="autocomplete-list">

                {sintomasFiltrados.map(s=>(

                  <div
                    key={s}
                    className="autocomplete-item"
                    onClick={()=>{
                      toggleSintoma(s)
                      setBusquedaSintoma("")
                    }}
                  >
                    {formatearNombre(s)}
                  </div>

                ))}

                {!sintomasDisponibles.includes(normalizarNombre(busquedaSintoma)) && (

                  <div
                    className="autocomplete-item nuevo"
                    onClick={()=>{

                      const n = normalizarNombre(busquedaSintoma)

                      setSintomasDisponibles([...sintomasDisponibles,n])
                      setSintomasSeleccionados([...sintomasSeleccionados,n])

                      setBusquedaSintoma("")

                    }}
                  >
                    ➕ Crear "{busquedaSintoma}"
                  </div>

                )}

              </div>

            )}

            <div className="chips-container">

              {sintomasSeleccionados.map(s=>(

                <div key={s} className="chip">

                  {formatearNombre(s)}

                  <button onClick={()=>toggleSintoma(s)}>×</button>

                </div>

              ))}

            </div>

          </div>

          {/* MEDICAMENTOS */}

          <div className="selector">

            <h4>Medicamentos</h4>

            <input
              placeholder="Buscar o agregar medicamento"
              value={busquedaMedicamento}
              onChange={(e)=>setBusquedaMedicamento(e.target.value)}
            />

            {busquedaMedicamento && (

              <div className="autocomplete-list">

                {medicamentosFiltrados.map(m=>(

                  <div
                    key={m}
                    className="autocomplete-item"
                    onClick={()=>{
                      toggleMedicamento(m)
                      setBusquedaMedicamento("")
                    }}
                  >
                    {formatearNombre(m)}
                  </div>

                ))}

                {!medicamentosDisponibles.includes(normalizarNombre(busquedaMedicamento)) && (

                  <div
                    className="autocomplete-item nuevo"
                    onClick={()=>{

                      const n = normalizarNombre(busquedaMedicamento)

                      setMedicamentosDisponibles([...medicamentosDisponibles,n])
                      setMedicamentosSeleccionados([...medicamentosSeleccionados,n])

                      setBusquedaMedicamento("")

                    }}
                  >
                    ➕ Crear "{busquedaMedicamento}"
                  </div>

                )}

              </div>

            )}

            <div className="chips-container">

              {medicamentosSeleccionados.map(m=>(

                <div key={m} className="chip">

                  {formatearNombre(m)}

                  <button onClick={()=>toggleMedicamento(m)}>×</button>

                </div>

              ))}

            </div>

          </div>


          {/* Sistemas */}

          <div className="selector">

            <h4>Clasificación </h4>

            <input
              placeholder="Buscar o agregar clasificación"
              value={busquedaSistema}
              onChange={(e)=>setBusquedaSistema(e.target.value)}
            />

            {busquedaSistema && (

              <div className="autocomplete-list">

                {sistemasFiltrados.map(s=>(

                  <div
                    key={s}
                    className="autocomplete-item"
                    onClick={()=>{
                      toggleSistema(s)
                      setBusquedaSistema("")
                    }}
                  >
                    {formatearNombre(s)}
                  </div>

                ))}

                {!sistemasDisponibles.includes(normalizarNombre(busquedaSistema)) && (

                  <div
                    className="autocomplete-item nuevo"
                    onClick={()=>{

                      const n = normalizarNombre(busquedaSistema)

                      setSistemasDisponibles([...sistemasDisponibles,n])
                      setSistemasSeleccionados([...sistemasSeleccionados,n])

                      setBusquedaSistema("")

                    }}
                  >
                    ➕ Crear "{busquedaSistema}"
                  </div>

                )}

              </div>

            )}

            <div className="chips-container">

              {sistemasSeleccionados.map(s=>(

                <div key={s} className="chip">

                  {formatearNombre(s)}

                  <button onClick={()=>toggleSistema(s)}>×</button>

                </div>

              ))}

            </div>

          </div>

          <div className="modal-buttons">

            <button
              className="btn-guardar"
              onClick={agregar}
            >
              Guardar
            </button>

            <button
              className="btn-cancelar"
              onClick={()=>setMostrarFormulario(false)}
            >
              Cancelar
            </button>

          </div>

        </div>

      </div>

    )}

  </div>

  )

}

export default EnfermedadesAdmin