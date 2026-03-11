import { useEffect, useState } from "react";

function PrologAdmin() {
  const [contenido, setContenido] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/admin/prolog", {
      headers: { "Authorization": `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setContenido(data.archivo));
  }, []);

  const guardarCambios = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:8000/admin/prolog", {
      method: "PUT",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ contenido })
    })
    .then(res => res.json())
    .then(data => setMensaje(data.mensaje));
  };

  return (
    <div>
      <h2>Archivo Prolog</h2>
      <textarea
        value={contenido}
        onChange={e => setContenido(e.target.value)}
        rows={25}
        cols={80}
      />
      <br/>
      <button onClick={guardarCambios}>Guardar cambios</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default PrologAdmin;