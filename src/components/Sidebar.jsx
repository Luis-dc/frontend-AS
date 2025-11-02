import React from "react";
import { NavLink } from "react-router-dom";
import { ClipboardList, Layers, FileSearch } from "lucide-react";

const Sidebar = ({ grupo }) => {
  const baseClass = "d-flex align-items-center gap-2 nav-link px-3 py-2 rounded";
  const activeClass = ({ isActive }) =>
    isActive
      ? `${baseClass} bg-white text-primary fw-semibold`
      : `${baseClass} text-white text-opacity-75 hover:bg-primary-subtle`;

  return (
    <div
      className="bg-primary text-white vh-100 p-3 d-flex flex-column"
      style={{ width: "230px" }}
    >
      <h5 className="fw-bold mb-4 text-center">Auditoría</h5>

      {/* 🔹 Ciudadanos */}
      {grupo === "Ciudadanos" && (
        <NavLink to="/" className={activeClass}>
          <ClipboardList size={18} />
          Registrar denuncia
        </NavLink>
      )}

      {/* 🔹 Coordinadores */}
      {grupo === "Coordinadores" && (
        <>
          <NavLink to="/" className={activeClass}>
            <ClipboardList size={18} />
            Validar denuncias
          </NavLink>

          <NavLink to="/filtrado" className={activeClass}>
            <Layers size={18} />
            Clasificar denuncias
          </NavLink>
        </>
      )}

      {/* 🔹 Auditores de Pagos */}
      {grupo === "AuditoresPagos" && (
        <NavLink to="/" className={activeClass}>
          <FileSearch size={18} />
          Denuncias de Pagos
        </NavLink>
      )}

      {/* 🔹 Auditores de Educación */}
      {grupo === "AuditoresEducacion" && (
        <NavLink to="/" className={activeClass}>
          <FileSearch size={18} />
          Denuncias de Educación
        </NavLink>
      )}

      {/* 🔹 Separador inferior */}
      <div className="mt-auto text-center small text-white-50">
        <hr className="border-light opacity-25" />
        <span className="text-light">&copy; 2025 Auditoría Social</span>
      </div>
    </div>
  );
};

export default Sidebar;
