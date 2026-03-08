import logo from "../assets/logo.png";

function Navbar() {
  return (
    <nav className="navbar">

      <h2 className="logo">
        <img src={logo} alt="Logo" />
        </h2>

      <div className="menu">
        <a href="#inicio">Inicio</a>
        <a href="#conocenos">Conócenos</a>
        <a href="#funcionamiento">Funcionamiento</a>
      </div>

    </nav>
  );
}

export default Navbar;