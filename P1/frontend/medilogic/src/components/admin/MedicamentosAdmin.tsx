import { useState } from "react";

function MedicamentosAdmin() {
  const [medicamento, setMedicamento] = useState("");
  const [enfermedad, setEnfermedad] = useState("");
  const [mensaje, setMensaje] = useState("");

  const agregarMedicamento = () => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8000/admin/medicamento", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ medicamento, enfermedad })
    })
    .then(res => res.json())
    .then(data => setMensaje(data.mensaje));
  };

  return (
    <div>
      <h2>Agregar Medicamento</h2>
      <input
        type="text"
        placeholder="Medicamento"
        value={medicamento}
        onChange={(e) => setMedicamento(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enfermedad"
        value={enfermedad}
        onChange={(e) => setEnfermedad(e.target.value)}
      />
      <button onClick={agregarMedicamento}>Agregar</button>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default MedicamentosAdmin;