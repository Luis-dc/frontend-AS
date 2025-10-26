import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import DenunciaForm from "./pages/DenunciaForm";
import "bootstrap/dist/css/bootstrap.min.css";
import DashboardAuditor from "./pages/DashboardAuditor";
import DashboardAuditorFiltrado from "./pages/DashboardAuditorFiltrado";


function App() {
  const auth = useAuth();

  // 🔹 Extraer el grupo de Cognito
  const grupo = auth.user?.profile["cognito:groups"]?.[0];

  // 🔹 Cerrar sesión redirigiendo a Cognito
  const signOutRedirect = async () => {
    const clientId = "4pj32ltqhib5s1vkap8r5p0qn3";
    const logoutUri = "http://localhost:3000/";
    const cognitoDomain = "https://us-east-2jxpatqpyj.auth.us-east-2.amazoncognito.com";
    await auth.removeUser();
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  // 🔹 Mientras carga Cognito
  if (auth.isLoading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-secondary fs-5">Cargando sesión...</p>
      </div>
    );

  if (auth.error)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p className="text-danger fs-5">Error: {auth.error.message}</p>
      </div>
    );

  // 🔹 Si el usuario NO está autenticado
  if (!auth.isAuthenticated) {
    return (
      <div className="container text-center mt-5">
        <div className="card shadow-sm mx-auto" style={{ maxWidth: "450px" }}>
          <div className="card-body">
            <h2 className="fw-bold mb-3">Portal de Auditoría Social</h2>
            <p className="text-muted mb-4">
              Inicia sesión para registrar una denuncia ciudadana.
            </p>
            <button
              className="btn btn-primary px-4"
              onClick={() => auth.signinRedirect()}
            >
              Iniciar sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🔹 Usuario autenticado: mostrar según grupo
  return (
    <BrowserRouter>
      {/* 🔹 Encabezado superior */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid justify-content-between px-3">
          <span className="navbar-brand fw-bold">Auditoría Social</span>
          <div>
            <span className="text-white me-3">
              {auth.user?.profile.email}{" "}
              <small className="text-warning">({grupo || "Sin grupo"})</small>
            </span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={signOutRedirect}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* 🔹 Contenedor principal */}
      <div className="container mt-5">
        {grupo === "Ciudadanos" ? (
          <Routes>
            <Route path="/" element={<DenunciaForm />} />
          </Routes>
        ) : (
          <div className="alert alert-info text-center shadow-sm">
            <h4 className="mb-2">Bienvenido, {grupo}</h4>
            <Routes>
            <Route path="/" element={<DashboardAuditor />} />
            <Route path="/filtrado" element={<DashboardAuditorFiltrado />} />
          </Routes>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
