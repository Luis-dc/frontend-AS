import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { obtenerDenuncias } from "../services/apiService";
import { obtenerEducacion } from "../services/educacionService";
import { obtenerPagos } from "../services/pagosService";

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
      const [edu, pag] = await Promise.all([obtenerEducacion(), obtenerPagos()]);
      setEducacion(edu);
      setPagos(pag);
    } catch (err) {
      console.error("Error cargando listas:", err);
    }
  };

  useEffect(() => {
    cargarDenuncias();
    cargarListas();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Bandeja de Denuncias</h2>

      {/* Filtros */}
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <select className="form-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="RECIBIDA">Recibida</option>
            <option value="VALIDADA">Validada</option>
            <option value="NO_PROCEDENTE">No procedente</option>
            <option value="CLASIFICADA">Clasificada</option>
          </select>
        </div>

        <div className="col-md-3">
          <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            <option value="Corrupción">Corrupción</option>
            <option value="Mala praxis">Mala praxis</option>
            <option value="Transparencia">Transparencia</option>
            <option value="Otra">Otra</option>
          </select>
        </div>

        <div className="col-md-2">
          <input type="date" className="form-control" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
        </div>
        <div className="col-md-2">
          <input type="date" className="form-control" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
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
            <thead className="table-primary">
              <tr>
                <th>Código</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {denuncias.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No hay denuncias registradas
                  </td>
                </tr>
              ) : (
                denuncias.map((d) => (
                  <tr key={d.id}>
                    <td>{d.codigo}</td>
                    <td>{d.categoria_preliminar}</td>
                    <td>
                      <span className={`badge bg-${
                        d.estado === "VALIDADA" ? "success" :
                        d.estado === "NO_PROCEDENTE" ? "danger" :
                        d.estado === "CLASIFICADA" ? "info" : "secondary"
                      }`}>
                        {d.estado}
                      </span>
                    </td>
                    <td>{d.descripcion.slice(0, 40)}...</td>
                    <td>{new Date(d.creado_en).toLocaleDateString()}</td>
                    <td>
                      <div className="dropdown d-inline-block position-relative">
                        <button
                          className="btn btn-outline-primary btn-sm dropdown-toggle"
                          onClick={() =>
                            setMenuActivo((prev) => (prev === d.id ? null : d.id))
                          }
                        >
                          Opciones
                        </button>

                        {menuActivo === d.id && (
                          <div className="dropdown-menu show position-absolute" style={{ zIndex: 1000 }}>
                            <div
                              onMouseEnter={() => setSubmenuActivo(`edu-${d.id}`)}
                              onMouseLeave={() => setSubmenuActivo(null)}
                              className="dropdown-item position-relative"
                            >
                              Educación
                              {submenuActivo === `edu-${d.id}` && (
                                <ul className="list-group position-absolute start-100 top-0 ms-2 shadow-sm" style={{ minWidth: "200px" }}>
                                  {educacion.map((e, i) => (
                                    <button
                                      key={i}
                                      className="btn btn-outline-info btn-sm m-1"
                                      onClick={() => console.log("Seleccionado:", e.nombre)}
                                    >
                                      {e.nombre}
                                    </button>
                                  ))}
                                </ul>
                              )}
                            </div>

                            <div
                              onMouseEnter={() => setSubmenuActivo(`pag-${d.id}`)}
                              onMouseLeave={() => setSubmenuActivo(null)}
                              className="dropdown-item position-relative"
                            >
                              Pagos
                              {submenuActivo === `pag-${d.id}` && (
                                <ul className="list-group position-absolute start-100 top-0 ms-2 shadow-sm" style={{ minWidth: "200px" }}>
                                  {pagos.map((p, i) => (
                                    <button
                                      key={i}
                                      className="btn btn-outline-info btn-sm m-1"
                                      onClick={() => console.log("Pago seleccionado:", p.nombre)}
                                    >
                                      {p.nombre}
                                    </button>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
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
