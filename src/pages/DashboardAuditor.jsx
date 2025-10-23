import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { obtenerDenuncias } from "../services/apiService";

export default function DashboardAuditor() {
  const auth = useAuth();
  const [denuncias, setDenuncias] = useState([]);
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
        estado,
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

  useEffect(() => {
    cargarDenuncias();
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

      {/* 🔹 Mensajes */}
      {cargando && <p className="text-secondary">Cargando denuncias...</p>}
      {error && <p className="text-danger">{error}</p>}

      {/* 🔹 Tabla de denuncias */}
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
                    <td>
                      <button className="btn btn-outline-primary btn-sm">
                        Ver detalle
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
