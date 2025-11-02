import { useAuth } from "react-oidc-context";

export default function Topbar({ onLogout }) {
  const auth = useAuth();
  const email = auth.user?.profile?.email;
  const grupo = auth.user?.profile["cognito:groups"]?.[0] || "Sin grupo";

  return (
    <nav className="navbar navbar-dark bg-primary px-4 py-2 shadow-sm">
      <div className="container-fluid justify-content-between">
        {/* Logo o título */}
        <span className="navbar-brand fw-bold">Auditoría Social</span>

        {/* Usuario + botón */}
        <div className="d-flex align-items-center gap-3">
          <span className="text-white">
            {email}{" "}
            <small className="text-warning">({grupo})</small>
          </span>

          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => onLogout?.() || auth.signoutRedirect()}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}
