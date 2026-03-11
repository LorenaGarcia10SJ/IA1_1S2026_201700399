import logo from "../assets/logo.png";

interface NavbarProps{
  mode?: "home" | "admin";
}


function Navbar({mode = "home"}:NavbarProps){
  return (
    <nav className="navbar">

      <h2 className="logo">
        <img src={logo} alt="Logo" />
        </h2>
      {mode === "home" && (
      <div className="menu">
        <a href="#inicio">Inicio</a>
        <a href="#conocenos">Conócenos</a>
        <a href="#funcionamiento">Funcionamiento</a>
      </div>
      )}
    </nav>
  );
}

export default Navbar;