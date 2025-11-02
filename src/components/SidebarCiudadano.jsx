import { NavLink } from "react-router-dom";
import { FileText, Home } from "lucide-react";

export default function SidebarCiudadano() {
  return (
    <div
      className="bg-primary text-white d-flex flex-column p-3"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      <h4 className="text-center mb-4 fw-bold">Auditoría Social</h4>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink
            to="/ciudadano/denuncia"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center mb-2 ${
                isActive
                  ? "bg-light text-primary fw-bold shadow-sm"
                  : "text-white-50 hover:text-white"
              }`
            }
          >
            <Home className="me-2" size={18} />
            Registrar Denuncia
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/ciudadano/reportes"
            className={({ isActive }) =>
              `nav-link d-flex align-items-center ${
                isActive
                  ? "bg-light text-primary fw-bold shadow-sm"
                  : "text-white-50 hover:text-white"
              }`
            }
          >
            <FileText className="me-2" size={18} />
            Consultar Denuncia
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
