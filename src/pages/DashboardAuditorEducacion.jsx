import React, { useEffect, useState } from "react";
import { obtenerDenuncias } from "../services/apiService";

export default function DashboardAuditorEducacion() {
  const [denuncias, setDenuncias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("access_token");

  const cargarDenuncias = async () => {
    try {
      setCargando(true);
      setError(null);

      const data = await obtenerDenuncias(token, { departamento: "Educación" });
      setDenuncias(data);
    } catch (err) {
      setError("Error al cargar denuncias");
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDenuncias();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Denuncias asignadas — Departamento de Educación</h2>

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
              </tr>
            </thead>
            <tbody>
              {denuncias.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No hay denuncias asignadas al departamento de Educación
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
