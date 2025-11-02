import { useState } from "react";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export default function ReportesCiudadano() {
  const [codigo, setCodigo] = useState("");
  const [reporte, setReporte] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const buscarReporte = async (e) => {
    e.preventDefault();
    setMensaje("");
    setReporte(null);
    setCargando(true);

    try {
      const res = await axios.get(`${API_URL}/api/reportes/codigo/${codigo.trim()}`);
      if (res.data) {
        setReporte(res.data);
      } else {
        setMensaje("⚠️ No se encontró ningún reporte con ese código.");
      }
    } catch (err) {
      console.error("Error al buscar reporte:", err);
      setMensaje("No se encontró ningún reporte con ese código.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow border-0">
        <div className="card-body">
          <h3 className="text-center text-primary mb-4">
            Consultar Denuncia Ciudadana
          </h3>

          <form onSubmit={buscarReporte} className="d-flex mb-3">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Ingrese su código de seguimiento (ej: AS-202511-567)"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
            />
            <button className="btn btn-primary" disabled={cargando}>
              {cargando ? "Buscando..." : "Buscar"}
            </button>
          </form>

          {mensaje && (
            <div
              className={`alert ${
                mensaje.startsWith("✅")
                  ? "alert-success"
                  : "alert-warning"
              }`}
            >
              {mensaje}
            </div>
          )}

          {reporte && (
            <div className="card mt-3 border-success shadow-sm">
              <div className="card-body">
                <h5 className="text-success fw-bold mb-3">
                  Resultado del Reporte
                </h5>
                <p><strong>Código:</strong> {reporte.codigo}</p>
                <p><strong>Descripción:</strong> {reporte.descripcion}</p>
                <p><strong>Categoría:</strong> {reporte.categoria_preliminar}</p>
                <p><strong>Estado actual:</strong> {reporte.estado}</p>
                <p><strong>Fecha de registro:</strong> {new Date(reporte.creado_en).toLocaleString()}</p>

                {reporte.pdf_url ? (
                  <a
                    href={reporte.pdf_url}
                    className="btn btn-outline-success mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver PDF
                  </a>
                ) : (
                  <p className="text-muted mt-2">
                    El PDF aún no ha sido generado.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
