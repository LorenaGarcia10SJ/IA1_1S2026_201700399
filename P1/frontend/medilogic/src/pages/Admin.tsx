import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import EnfermedadesAdmin from "../components/admin/EnfermedadesAdmin";
import SintomasAdmin from "../components/admin/SintomasAdmin";
import MedicamentosAdmin from "../components/admin/MedicamentosAdmin";

function Admin() {

  const navigate = useNavigate();
  const [tab,setTab] = useState("enfermedades");

  useEffect(()=>{

    const token = localStorage.getItem("token");

    if(!token){
      navigate("/admin-login");
    }

  },[]);

  const logout = () => {

    localStorage.removeItem("token");
    navigate("/admin-login");

  };

  return(

    <div style={{padding:"40px"}}>

      <h1>Panel Administrador</h1>

      <button onClick={logout}>
        Cerrar sesión
      </button>

      <hr/>

      <div style={{marginBottom:"20px"}}>

        <button onClick={()=>setTab("enfermedades")}>
          Enfermedades
        </button>

        <button onClick={()=>setTab("sintomas")}>
          Síntomas
        </button>

        <button onClick={()=>setTab("medicamentos")}>
          Medicamentos
        </button>

      </div>

      {tab === "enfermedades" && <EnfermedadesAdmin/>}
      {tab === "sintomas" && <SintomasAdmin/>}
      {tab === "medicamentos" && <MedicamentosAdmin/>}

    </div>

  );

}

export default Admin;