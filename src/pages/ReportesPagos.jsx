import React, { useEffect, useState } from "react";
import { obtenerReportes } from "../services/apiService";
import { descargarReporte } from "../services/apiService";

const API_URL = process.env.REACT_APP_API_URL;

export default function ReportesPagos() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarReportes = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const data = await obtenerReportes(token);
        setReportes(data);
      } catch (error) {
        console.error("Error cargando reportes:", error);
      } finally {
        setLoading(false);
      }
    };
    cargarReportes();
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando reportes...</p>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4 text-primary">Reportes Generados</h2>

      <table className="table table-striped table-bordered shadow-sm">
        <thead className="table-primary">
          <tr>
            <th>Archivo</th>
            <th>Fecha</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {reportes.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center text-muted">
                No hay reportes generados
              </td>
            </tr>
          ) : (
            reportes.map((r, i) => (
              <tr key={i}>
                <td>{r.nombre}</td>
                <td>{new Date(r.fecha).toLocaleDateString()}</td>
                <td>
                    <button
                        onClick={() => descargarReporte(r.nombre)}
                        className="btn btn-outline-success btn-sm"
                    >
                        Descargar PDF
                    </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
