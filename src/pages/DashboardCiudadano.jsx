import SidebarCiudadano from "../components/SidebarCiudadano";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";
import { useAuth } from "react-oidc-context";

export default function DashboardCiudadano({ signOutRedirect }) {
  const auth = useAuth();

  return (
    <div className="d-flex">
      {/* Sidebar izquierdo */}
      <SidebarCiudadano />

      {/* Contenido principal */}
      <div className="flex-grow-1 bg-light" style={{ minHeight: "100vh" }}>
        {/* Topbar superior */}
        <Topbar
          email={auth.user?.profile.email}
          rol="Ciudadano"
          onLogout={signOutRedirect}
        />

        {/* Contenedor de vistas */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
