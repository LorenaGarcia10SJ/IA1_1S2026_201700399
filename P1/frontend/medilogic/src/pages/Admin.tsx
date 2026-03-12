import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import EnfermedadesAdmin from "../components/admin/EnfermedadesAdmin";
import MedicamentosAdmin from "../components/admin/MedicamentosAdmin";
import CargaDescargaAdmin from "../components/admin/CargaDescargaAdmin";

import "./Admin.css";

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
    navigate("/");

  };

  return(

    <div>

      <Navbar mode = "admin"/>

      <div className="admin-container">

        {/* SIDEBAR */}

        <div className="admin-sidebar">

          <h2>Administrador</h2>

          <button
            className={tab==="enfermedades" ? "active" : ""}
            onClick={()=>setTab("enfermedades")}
          >
            🦠 Enfermedades
          </button>

          <button
            className={tab==="medicamentos" ? "active" : ""}
            onClick={()=>setTab("medicamentos")}
          >
            💊 Administrar medicamentos
          </button>

          <button
            className={tab==="cargaDescarga" ? "active" : ""}
            onClick={()=>setTab("cargaDescarga")}
          >
            � Gestionar archivos
          </button>

          <button className="logout-btn" onClick={logout}>
               Cerrar sesión
          </button>

        </div>


        {/* CONTENIDO */}

        <div className="admin-content">

          
          {tab === "enfermedades" && <EnfermedadesAdmin/>}
          {tab === "medicamentos" && <MedicamentosAdmin/>}
          {tab === "cargaDescarga" && <CargaDescargaAdmin/>}
        
        </div>

      </div>

    </div>

  );

}

export default Admin;