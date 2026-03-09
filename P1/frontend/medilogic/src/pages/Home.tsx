import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Home.css";
import { FaHospital, FaBrain } from "react-icons/fa";

function Home() {

  return (
    <div>

      <Navbar />

      {/* HERO */}
      <section id="inicio" className="hero">

        <h1>MEDILOGIC</h1>

        <p>
          
        </p>

        <div className="buttons">

          <Link to="/paciente" className="btn">
            🧑‍⚕️ Paciente
          </Link>

          <Link to="/admin" className="btn">
            ⚙️ Administrador
          </Link>

        </div>

      </section>


      {/* CONOCENOS */}
      <section id="conocenos" className="section">

        <h2>
            <FaHospital className="icon" /> ¿Qué es Medilogic?</h2>
          

          <p>
            Medilogic es un sistema diseñado para apoyar el diagnóstico médico preliminar mediante el análisis
            de síntomas ingresados por el paciente. Utiliza una
            base de conocimiento en Prolog para procesar la información y generar recomendaciones.


          </p>

      </section>


      {/* FUNCIONAMIENTO */}
      <section id="funcionamiento" className="section">

        <h2>
          <FaBrain className="icon" /> ¿Cómo funciona?</h2>

        <ul >
          <li>El paciente selecciona los síntomas que presenta.</li>
          <li>El sistema consulta una base de conocimiento.</li>
          <li>Se calcula la afinidad entre síntomas y enfermedades.</li>
          <li>Se determina el nivel de urgencia del caso.</li>
          <li>Se recomiendan medicamentos considerando alergias.</li>
        </ul>

      </section>

    </div>
  );
}

export default Home;