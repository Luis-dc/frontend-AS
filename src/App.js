import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import React, { useEffect } from "react";
import DenunciaForm from "./pages/DenunciaForm";
import DashboardAuditor from "./pages/DashboardAuditor";
import DashboardAuditorFiltrado from "./pages/DashboardAuditorFiltrado";
import DashboardLayout from "./components/DashboardLayout";
import DashboardAuditorEducacion from "./pages/DashboardAuditorEducacion";
import DashboardAuditorPagos from "./pages/DashboardAuditorPagos";
import ReportesPagos from "./pages/ReportesPagos";
import ReportesEducacion from "./pages/ReportesEducacion";
import ReportesCiudadano from "./pages/ReportesCiudadano";
import DashboardCiudadano from "./pages/DashboardCiudadano";
import ConsultaPublica from "./pages/ConsultaPublica";
import DashboardPublico from "./pages/DashboardPublico";

function App() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.access_token) {
      localStorage.setItem("access_token", auth.user.access_token);
    }
  }, [auth.isAuthenticated, auth.user]);

  const grupo = auth.user?.profile["cognito:groups"]?.[0];

  const signOutRedirect = async () => {
    const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
    const logoutUri = process.env.REACT_APP_COGNITO_LOGOUT_URI;
    const cognitoDomain = process.env.REACT_APP_COGNITO_DOMAIN;

    await auth.removeUser();
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (auth.isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <p className="text-secondary fs-5">Cargando sesión...</p>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="alert alert-danger shadow-sm p-4">
          <h4>Error de autenticación</h4>
          <p>{auth.error.message}</p>
        </div>
      </div>
    );
  }

  // 🧍 Usuario NO autenticado
  if (!auth.isAuthenticated) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center min-vh-100"
        style={{ backgroundColor: "#f8f9fa", paddingTop: "40px" }}
      >
        {/* header */}
        <div
          className="card shadow-sm border-0 text-center"
          style={{ maxWidth: "480px", width: "90%", marginBottom: "20px" }}
        >
          <div className="card-body py-4">
            <h2 className="fw-bold text-primary mb-2">
              Portal de Auditoría Social
            </h2>
            <p className="text-muted mb-4">
              Inicia sesión para registrar una denuncia ciudadana o consulta el
              estado de tu denuncia con tu código de seguimiento.
            </p>

            <button
              className="btn btn-primary px-4"
              onClick={() => auth.signinRedirect()}
            >
              Iniciar sesión
            </button>
          </div>
        </div>

        {/* 🔹 NUEVO: dashboard público */}
        <div
          className="card shadow border-0 mb-3"
          style={{ maxWidth: "900px", width: "90%", borderRadius: "20px" }}
        >
          <div className="card-body py-4">
            <DashboardPublico />
          </div>
        </div>

        {/* 🔍 Módulo de consulta pública */}
        <div
          className="card shadow border-0"
          style={{
            maxWidth: "700px",
            width: "90%",
            borderRadius: "20px",
            marginTop: "0",
          }}
        >
          <div className="card-body py-4">
            <ConsultaPublica />
          </div>
        </div>

        <footer className="text-muted small mt-4">
          <p className="mb-0">© 2025 Auditoría Social Guatemala</p>
        </footer>
      </div>
    );
  }
  // Autenticado
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/callback" element={<Navigate to="/" replace />} />

        {/* Ciudadanos */}
        {grupo === "Ciudadanos" && (
          <>
            <Route
              path="/ciudadano/*"
              element={<DashboardCiudadano signOutRedirect={signOutRedirect} />}
            >
              <Route path="denuncia" element={<DenunciaForm />} />
              <Route path="reportes" element={<ReportesCiudadano />} />
            </Route>
            <Route
              path="/"
              element={<Navigate to="/ciudadano/denuncia" replace />}
            />
          </>
        )}

        {/* Coordinadores */}
        {grupo === "Coordinadores" && (
          <>
            <Route
              path="/"
              element={
                <DashboardLayout signOut={signOutRedirect}>
                  <DashboardAuditor />
                </DashboardLayout>
              }
            />
            <Route
              path="/filtrado"
              element={
                <DashboardLayout signOut={signOutRedirect}>
                  <DashboardAuditorFiltrado />
                </DashboardLayout>
              }
            />
          </>
        )}

        {/* Auditores Pagos */}
        {grupo === "AuditoresPagos" && (
          <>
            <Route
              path="/"
              element={
                <DashboardLayout signOut={signOutRedirect}>
                  <DashboardAuditorPagos />
                </DashboardLayout>
              }
            />
            <Route
              path="/reportes"
              element={
                <DashboardLayout signOut={signOutRedirect}>
                  <ReportesPagos />
                </DashboardLayout>
              }
            />
          </>
        )}

        {/* Auditores Educación */}
        {grupo === "AuditoresEducacion" && (
          <>
            <Route
              path="/"
              element={
                <DashboardLayout signOut={signOutRedirect}>
                  <DashboardAuditorEducacion />
                </DashboardLayout>
              }
            />
            <Route
              path="/reportes"
              element={
                <DashboardLayout signOut={signOutRedirect}>
                  <ReportesEducacion />
                </DashboardLayout>
              }
            />
          </>
        )}

        {/* Fallback de acceso no autorizado */}
        {![
          "Ciudadanos",
          "Coordinadores",
          "AuditoresPagos",
          "AuditoresEducacion",
        ].includes(grupo) && (
          <Route
            path="*"
            element={
              <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="alert alert-warning text-center shadow-sm p-4">
                  <h4>Acceso restringido</h4>
                  <p>No perteneces a un grupo autorizado.</p>
                </div>
              </div>
            }
          />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
