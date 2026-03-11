import { useEffect, useState } from "react";

function EnfermedadesAdmin(){

  const [enfermedades,setEnfermedades] = useState<string[]>([]);
  const [nueva,setNueva] = useState("");

  const token = localStorage.getItem("token");

  const cargar = async () => {

    const res = await fetch("http://localhost:8000/medilogic/enfermedades");

    const data = await res.json();

    setEnfermedades(data.enfermedades);

  };

  useEffect(()=>{
    cargar();
  },[]);

  const agregar = async () => {

    await fetch("http://localhost:8000/admin/enfermedades",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      },
      body:JSON.stringify({
        nombre:nueva
      })
    });

    setNueva("");

    cargar();

  };

  return(

    <div>

      <h2>Administrar Enfermedades</h2>

      <input
        value={nueva}
        onChange={(e)=>setNueva(e.target.value)}
        placeholder="Nueva enfermedad"
      />

      <button onClick={agregar}>
        Agregar
      </button>

      <ul>

        {enfermedades.map((e)=>(
          <li key={e}>{e}</li>
        ))}

      </ul>

    </div>

  );

}

export default EnfermedadesAdmin;