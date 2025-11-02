import React, { useEffect, useState } from "react";
import { obtenerDenuncias } from "../services/apiService";
import { generarReporte } from "../services/apiService"; 

export default function DashboardAuditorPagos() {
  const [denuncias, setDenuncias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  const cargarDenuncias = async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await obtenerDenuncias(token, { departamento: "Pagos" });
      setDenuncias(data);
    } catch (err) {
      setError("Error al cargar denuncias");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };
  const handleGenerarPDF = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await generarReporte(token, id);
      alert(`${response.message}`);
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Error al generar el reporte");
    }
  };
  
  useEffect(() => {
    cargarDenuncias();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Denuncias asignadas — Departamento de Pagos</h2>

      {cargando && <p className="text-secondary">Cargando denuncias...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!cargando && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-primary">
            <tr>
                <th>Código</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Módulo</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Acción</th>
            </tr>
            </thead>
            <tbody>
                {denuncias.length === 0 ? (
                    <tr>
                    <td colSpan="7" className="text-center text-muted">
                        No hay denuncias asignadas al departamento de Pagos
                    </td>
                    </tr>
                ) : (
                    denuncias.map((d) => (
                    <tr key={d.id}>
                        <td>{d.codigo}</td>
                        <td>{d.categoria_preliminar}</td>
                        <td>
                        <span
                            className={`badge bg-${
                            d.estado === "VALIDADA"
                                ? "success"
                                : d.estado === "NO_PROCEDENTE"
                                ? "danger"
                                : d.estado === "EN_TRAMITE"
                                ? "warning"
                                : "secondary"
                            }`}
                        >
                            {d.estado}
                        </span>
                        </td>
                        <td>{d.modulo || "—"}</td>
                        <td>{d.descripcion.slice(0, 50)}...</td>
                        <td>{new Date(d.creado_en).toLocaleDateString()}</td>
                        <td>
                        <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleGenerarPDF(d.id)}
                        >
                            Generar PDF
                        </button>
                        </td>
                    </tr>
                    ))
                )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
