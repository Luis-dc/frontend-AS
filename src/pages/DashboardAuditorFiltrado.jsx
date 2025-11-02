import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { obtenerDenuncias } from "../services/apiService";
import { obtenerEducacion } from "../services/educacionService";
import { obtenerPagos } from "../services/pagosService";
import { asignarDenuncia } from "../services/apiService";

export default function DashboardAuditor() {
  const auth = useAuth();
  const [denuncias, setDenuncias] = useState([]);
  const [educacion, setEducacion] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [menuActivo, setMenuActivo] = useState(null);
  const [submenuActivo, setSubmenuActivo] = useState(null);
  const [estado, setEstado] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

    const cargarDenuncias = async () => {
  try {
    setCargando(true);
    setError("");

    const filtros = {
      estado: "VALIDADA", // 👈 filtro fijo
      categoria,
      fechaDesde,
      fechaHasta,
    };

    const data = await obtenerDenuncias(auth.user?.access_token, filtros);
    setDenuncias(data || []);
  } catch (err) {
    console.error("Error cargando denuncias:", err);
    setError("No se pudieron cargar las denuncias");
  } finally {
    setCargando(false);
  }
};


  const cargarListas = async () => {
    try {
      const [edu, pag] = await Promise.all([obtenerEducacion(), obtenerPagos(auth.user?.access_token)]);
      setEducacion(edu);
      setPagos(pag);
    } catch (err) {
      console.error("Error cargando listas:", err);
    }
  };
  
  const handleAsignar = async (id, tipo, valor) => {
    try {
      if (!valor) return; // evita enviar vacío
  
      // tipo = "educacion" o "pagos"
      // valor = "Mora", "Reintegros", etc.
      await asignarDenuncia(auth.user?.access_token, id, tipo, valor);
  
      alert(`Denuncia asignada a ${tipo}: ${valor}`);
  
      //  actualiza tabla sin recargar toda la app
      setDenuncias((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                departamento_nombre: tipo.charAt(0).toUpperCase() + tipo.slice(1),
                modulo: valor,
                estado: "CLASIFICADA",
              }
            : d
        )
      );
    } catch (err) {
      console.error("Error en la asignación:", err);
      alert("No se pudo asignar la denuncia");
    }
  };
  

  useEffect(() => {
    cargarDenuncias();
    cargarListas();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Bandeja de Denuncias</h2>
  
      {/* 🔹 Filtros */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="RECIBIDA">Recibida</option>
            <option value="VALIDADA">Validada</option>
            <option value="NO_PROCEDENTE">No procedente</option>
            <option value="CLASIFICADA">Clasificada</option>
          </select>
        </div>
  
        <div className="col-md-3">
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            <option value="Corrupción">Corrupción</option>
            <option value="Mala praxis">Mala praxis</option>
            <option value="Transparencia">Transparencia</option>
            <option value="Otra">Otra</option>
          </select>
        </div>
  
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <input
            type="date"
            className="form-control"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
          />
        </div>
  
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={cargarDenuncias}>
            Filtrar
          </button>
        </div>
      </div>
  
      {/* Mensajes */}
      {cargando && <p className="text-secondary">Cargando denuncias...</p>}
      {error && <p className="text-danger">{error}</p>}
  
      {/* Tabla */}
      {!cargando && !error && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-primary text-center">
              <tr>
                <th>Código</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Departamento a asignar</th>
                <th>Asignado a</th>
              </tr>
            </thead>
  
            <tbody>
              {denuncias.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    No hay denuncias registradas
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
                            : d.estado === "CLASIFICADA"
                            ? "info"
                            : "secondary"
                        }`}
                      >
                        {d.estado}
                      </span>
                    </td>
                    <td>{d.descripcion.slice(0, 40)}...</td>
                    <td>{new Date(d.creado_en).toLocaleDateString()}</td>
  
                    {/* 🔹 Departamento a asignar */}
                    <td style={{ minWidth: "320px" }}>
                      <div className="d-flex flex-column gap-3">
                        {/* Educación */}
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            id={`edu-${d.id}`}
                            checked={menuActivo === `edu-${d.id}`}
                            onChange={() =>
                              setMenuActivo(
                                menuActivo === `edu-${d.id}` ? null : `edu-${d.id}`
                              )
                            }
                          />
                          <label
                            htmlFor={`edu-${d.id}`}
                            className="form-check-label fw-bold"
                          >
                            Educación
                          </label>
  
                          {menuActivo === `edu-${d.id}` && (
                            <select
                              className="form-select form-select-sm ms-2"
                              style={{ width: "200px" }}
                              onChange={(e) =>
                                handleAsignar(d.id, "educacion", e.target.value)
                              }
                            >
                              <option value="">Seleccionar módulo...</option>
                              {educacion.map((e, i) => (
                                <option key={i} value={e.nombre}>
                                  {e.nombre}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
  
                        {/* Pagos */}
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="checkbox"
                            id={`pag-${d.id}`}
                            checked={menuActivo === `pag-${d.id}`}
                            onChange={() =>
                              setMenuActivo(
                                menuActivo === `pag-${d.id}` ? null : `pag-${d.id}`
                              )
                            }
                          />
                          <label
                            htmlFor={`pag-${d.id}`}
                            className="form-check-label fw-bold"
                          >
                            Pagos
                          </label>
  
                          {menuActivo === `pag-${d.id}` && (
                            <select
                              className="form-select form-select-sm ms-2"
                              style={{ width: "200px" }}
                              onChange={(e) =>
                                handleAsignar(d.id, "pagos", e.target.value)
                              }
                            >
                              <option value="">Seleccionar módulo...</option>
                              {pagos.map((p, i) => (
                                <option key={i} value={p.nombre}>
                                  {p.nombre}
                                </option>
                              ))}
                            </select>
                          )}
                        </div>
                      </div>
                    </td>
  
                    {/* 🔹 Resultado */}
                    <td className="text-center">
                      {d.departamento_nombre ? (
                        <>
                          <span className="fw-bold text-primary">
                            {d.departamento_nombre}
                          </span>
                          <br />
                          <small className="text-muted">{d.modulo}</small>
                        </>
                      ) : (
                        <span className="text-muted">Sin asignar</span>
                      )}
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
