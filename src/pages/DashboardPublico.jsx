// src/pages/DashboardPublico.jsx
import React, { useEffect, useState } from "react";
import { obtenerDashboardPublico } from "../services/dashboardService";

export default function DashboardPublico() {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    obtenerDashboardPublico()
      .then((json) => {
        setData(json);
        setCargando(false);
      })
      .catch((err) => {
        console.error(err);
        setError("No se pudo cargar el resumen de auditoría social.");
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <p className="text-muted mb-3">Cargando resumen...</p>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="mb-4">
      <h5 className="mb-3">Auditoría social — resumen público</h5>

      {/* tarjetas */}
      <div className="row mb-3">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body py-3">
              <p className="text-muted mb-1">Denuncias totales</p>
              <h3 className="mb-0">{data.total_denuncias}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body py-3">
              <p className="text-muted mb-1">Denuncias resueltas</p>
              <h3 className="mb-0">{data.denuncias_resueltas}</h3>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body py-3">
              <p className="text-muted mb-1">Porcentaje de resolución</p>
              <h3 className="mb-0">{data.porcentaje_resueltas}%</h3>
            </div>
          </div>
        </div>
      </div>

      {/* tablas */}
      <div className="row">
        <div className="col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body py-3">
              <h6 className="card-title">Por categoría</h6>
              <table className="table table-sm mb-0">
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.por_categoria?.length ? (
                    data.por_categoria.map((item) => (
                      <tr key={item.categoria}>
                        <td>{item.categoria}</td>
                        <td className="text-end">{item.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center text-muted">
                        Sin datos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body py-3">
              <h6 className="card-title">Por departamento</h6>
              <table className="table table-sm mb-0">
                <thead>
                  <tr>
                    <th>Departamento</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.por_departamento?.length ? (
                    data.por_departamento.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.departamento}</td>
                        <td className="text-end">{item.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center text-muted">
                        Sin datos
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* estados */}
      <div className="card border-0 shadow-sm mt-3">
        <div className="card-body py-3">
          <h6 className="card-title">Por estado</h6>
          <table className="table table-sm mb-0">
            <thead>
              <tr>
                <th>Estado</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.por_estado?.length ? (
                data.por_estado.map((item) => (
                  <tr key={item.estado}>
                    <td>{item.estado}</td>
                    <td className="text-end">{item.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center text-muted">
                    Sin datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <p className="small text-muted mt-2 mb-0">
            Datos agregados desde las denuncias registradas.
          </p>
        </div>
      </div>
    </div>
  );
}