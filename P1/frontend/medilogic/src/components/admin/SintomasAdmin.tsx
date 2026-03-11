import { useState } from "react";

function SintomasAdmin() {
  const [enfermedad, setEnfermedad] = useState("");
  const [sintoma, setSintoma] = useState("");
  const [mensaje, setMensaje] = useState("");

  const agregarSintoma = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/admin/sintoma", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ enfermedad, sintoma })
    })
    .then(res => res.json())
    .then(data => setMensaje(data.mensaje));
  };

  return (
    <div>
      <h2>Agregar Síntoma</h2>
      <input
        type="text"
        placeholder="Enfermedad"
        value={enfermedad}
        onChange={(e) => setEnfermedad(e.target.value)}
      />
      <input
        type="text"
        placeholder="Síntoma"
        value={sintoma}
        onChange={(e) => setSintoma(e.target.value)}
      />
      <button onClick={agregarSintoma}>Agregar</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default SintomasAdmin;