import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin(){

  const navigate = useNavigate();

  useEffect(()=>{

    const token = localStorage.getItem("token");

    if(!token){
      navigate("/admin-login");
    }

  },[]);

  return(

    <div>
      <h1>Dashboard Administrador</h1>
    </div>

  );

}

export default Admin;