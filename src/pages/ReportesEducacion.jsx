import React, { useEffect, useState } from "react";
import { obtenerReportes } from "../services/apiService";

export default function ReportesEducacion() {
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    async function cargarReportes() {
      try {
        const token = localStorage.getItem("access_token");
        const data = await obtenerReportes(token);
        setReportes(data);
      } catch (err) {
        console.error("Error obteniendo reportes:", err);
      }
    }
    cargarReportes();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4"> Reportes de Educación</h2>
      <table className="table table-striped table-bordered">
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
                No hay reportes disponibles
              </td>
            </tr>
          ) : (
            reportes.map((r, i) => (
              <tr key={i}>
                <td>{r.nombre}</td>
                <td>{new Date(r.fecha).toLocaleString()}</td>
                <td>
                  <a
                    href={`${import.meta.env.VITE_API_URL}/uploads/reportes/${r.nombre}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-success btn-sm"
                  >
                    Descargar PDF
                  </a>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
