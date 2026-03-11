import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {

  const [usuario,setUsuario] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e:React.FormEvent) => {

    e.preventDefault();

    try{

      const response = await fetch("http://localhost:8000/medilogic/login-admin",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          usuario,
          password
        })
      });

      if (!response.ok){
        setError("Error en el servidor");
        return;
      }

      const data = await response.json();

      if(data.token){

        localStorage.setItem("token",data.token);

        navigate("/admin");

      }else{

        setError("Credenciales incorrectas");

      }

    }catch(err){

      setError("Error conectando con el servidor");

    }

  };

  return(

    <div className="login-container">

      <form className="login-form" onSubmit={handleLogin}>

        <h2>Login</h2>

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e)=>setUsuario(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
        />

        <button type="submit">
          Iniciar sesión
        </button>

        {error && <p className="error">{error}</p>}

      </form>

    </div>

  );

}

export default AdminLogin;