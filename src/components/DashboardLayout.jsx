import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Layers, ClipboardList, FileSearch } from "lucide-react";
import { useAuth } from "react-oidc-context";
import "./DashboardLayout.css";

export default function DashboardLayout({ children, signOut }) {
  const location = useLocation();
  const auth = useAuth();

  // 🔹 Datos de sesión
  const email = auth.user?.profile?.email || "Desconocido";
  const grupo = auth.user?.profile?.["cognito:groups"]?.[0] || "Sin grupo";

  // 🔹 Función para aplicar estilos activos
  const isActive = (path) =>
    location.pathname === path ? "active bg-white text-primary rounded p-2" : "";

  return (
    <div className="d-flex vh-100">
      {/* 🔹 Sidebar dinámico */}
      <div
        className="bg-primary text-white d-flex flex-column p-3"
        style={{ width: "230px" }}
      >
        <h5 className="fw-bold mb-4 text-center">Auditoría</h5>

        <nav className="nav flex-column">

          {/*Coordinadores */}
          {grupo === "Coordinadores" && (
            <>
              <Link
                to="/"
                className={`nav-link text-white mb-2 d-flex align-items-center gap-2 ${isActive("/")}`}
              >
                <LayoutDashboard size={18} />
                Validar denuncias
              </Link>

              <Link
                to="/filtrado"
                className={`nav-link text-white mb-2 d-flex align-items-center gap-2 ${isActive("/filtrado")}`}
              >
                <Layers size={18} />
                Clasificar denuncias
              </Link>
            </>
          )}

          {/* 🔹 Solo mostrar estos links si el grupo es AuditoresPagos */}
            {grupo === "AuditoresPagos" && (
              <>
                <Link
                  to="/"
                  className={`nav-link text-white mb-2 d-flex align-items-center gap-2 ${
                    location.pathname === "/" ? "active bg-white text-primary rounded p-2" : ""
                  }`}
                >
                  <FileSearch size={18} />
                  Denuncias de Pagos
                </Link>

                <Link
                  to="/reportes"
                  className={`nav-link text-white mb-2 d-flex align-items-center gap-2 ${
                    location.pathname === "/reportes" ? "active bg-white text-primary rounded p-2" : ""
                  }`}
                >
                  <Layers size={18} />
                  Reportes Generados
                </Link>
              </>
            )}


          {/* 🔹 Solo mostrar estos links si el grupo es AuditoresEducacion */}
          {grupo === "AuditoresEducacion" && (
            <>
              <Link
                to="/"
                className={`nav-link text-white mb-2 d-flex align-items-center gap-2 ${
                  location.pathname === "/" ? "active bg-white text-primary rounded p-2" : ""
                }`}
              >
                <FileSearch size={18} />
                Denuncias de Educación
              </Link>

              <Link
                to="/reportes"
                className={`nav-link text-white mb-2 d-flex align-items-center gap-2 ${
                  location.pathname === "/reportes" ? "active bg-white text-primary rounded p-2" : ""
                }`}
              >
                <Layers size={18} />
                Reportes Generados
              </Link>
            </>
          )}

          {/*Ciudadanos */}
          {grupo === "Ciudadanos" && (
            <Link
              to="/"
              className={`nav-link text-white mb-2 d-flex align-items-center gap-2 ${isActive("/")}`}
            >
              <ClipboardList size={18} />
              Registrar denuncia
            </Link>
          )}
        </nav>

        {/* Pie del sidebar */}
        <div className="mt-auto small text-center text-white-50">
          <hr className="border-light opacity-25" />
          <span>&copy; 2025 Auditoría Social</span>
        </div>
      </div>

      {/*Contenido principal */}
      <div className="flex-grow-1 bg-light d-flex flex-column">
        {/* Barra superior */}
        <div className="bg-primary text-white d-flex justify-content-between align-items-center px-4 py-2 shadow-sm">
          <div className="fw-bold fs-5">Panel de {grupo}</div>

          <div className="d-flex align-items-center gap-3">
            <div>
              <span>{email}</span>
              <small className="ms-2 text-warning">({grupo})</small>
            </div>
            <button className="btn btn-outline-light btn-sm" onClick={signOut}>
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Contenido dinámico */}
        <div className="p-4 overflow-auto">{children}</div>
      </div>
    </div>
  );
}
