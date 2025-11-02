// src/services/dashboardService.js
const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:4000";

export async function obtenerDashboardPublico() {
  const resp = await fetch(`${API_BASE}/api/dashboard`);
  if (!resp.ok) {
    throw new Error("No se pudo obtener el dashboard público");
  }
  return resp.json();
}
