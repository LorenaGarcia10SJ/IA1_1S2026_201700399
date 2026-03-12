import { useState } from "react";
import "./CargaDescargaAdmin.css";

function CargaDescargaAdmin() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [contenido, setContenido] = useState<string>("");
  const [mensaje, setMensaje] = useState("");
  const [progreso, setProgreso] = useState(0);

  const token = localStorage.getItem("token");

  // Selección de archivo y lectura
  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setArchivo(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setContenido(reader.result as string);
      reader.readAsText(file);
    } else {
      setContenido("");
    }
  };

  // Descargar archivo .pl
  const descargar = async () => {
    setMensaje("Iniciando descarga...");
    try {
      const res = await fetch("http://localhost:8000/medilogic/descargar_pl", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al descargar");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "medilogic.pl";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setMensaje(`Descargado: medilogic.pl (${(blob.size / 1024).toFixed(2)} KB)`);
    } catch (err) {
      setMensaje("Error al descargar el archivo");
    }
  };

  // Subir archivo al backend
  const subirArchivo = async () => {
    if (!archivo) {
      setMensaje("Por favor, selecciona un archivo");
      return;
    }
    setMensaje(`Cargando ${archivo.name}...`);
    const formData = new FormData();
    const archivoEditado = new Blob([contenido], { type: "text/plain" });
    formData.append("file", archivoEditado, archivo.name);

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "http://localhost:8000/medilogic/cargar_pl", true);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setProgreso(Math.round((event.loaded / event.total) * 100));
        }
      };
      xhr.onload = () => {
        if (xhr.status === 200) {
          setMensaje(`Archivo ${archivo.name} cargado correctamente`);
          setProgreso(0);
          setArchivo(null);
          setContenido("");
        } else {
          setMensaje("Error al cargar el archivo");
          setProgreso(0);
        }
      };
      xhr.send(formData);
    } catch (err) {
      setMensaje("Error en la subida");
    }
  };

  return (
    <div className="gestion-pl-container">

        <h2 className="titulo">Gestión del archivo .pl</h2>

        <div className="descarga">
            <h3>Descarga</h3>
            <button className="btn-descargar" onClick={descargar}>📥 Descargar .pl</button>
        </div>

        <div className="carga">
            <h3>Carga</h3>

            {/* Botón seleccionar archivo siempre visible */}
            <input
            type="file"
            accept=".pl"
            className="input-archivo"
            onChange={handleArchivo}
            />

            {/* Mostrar info y textarea SOLO si hay archivo seleccionado */}
            {archivo && (
            <>
                <div className="info-archivo">
                Archivo seleccionado: {archivo.name} ({(archivo.size / 1024).toFixed(2)} KB)
                </div>

                <div className="previsualizacion">
                <label>Previsualización y edición:</label>
                <textarea
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    className="textarea-contenido"
                    rows={15}
                />
                </div>

                {/* Botón cargar solo visible cuando hay archivo seleccionado */}
                <button
                className="btn-subir"
                onClick={subirArchivo}
                >
                📤 Cargar .pl
                </button>
            </>
            )}
        </div>

        {progreso > 0 && (
            <div className="barra-progreso-container">
            <div className="barra-progreso-fondo">
                <div className="barra-progreso-llenado" style={{ width: `${progreso}%` }}></div>
            </div>
            <div className="porcentaje">{progreso}%</div>
            </div>
        )}

        {mensaje && <div className="mensaje">{mensaje}</div>}

        </div>
  );
}

export default CargaDescargaAdmin;