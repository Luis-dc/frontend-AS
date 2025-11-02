import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;

// 🔍 Buscar reporte por código (público)
export const buscarReportePorCodigo = async (codigo) => {
  try {
    const res = await axios.get(`${API_URL}/api/reportes/public/codigo/${codigo.trim()}`);
    return res.data;
  } catch (err) {
    console.error("❌ Error al buscar reporte:", err);
    throw err;
  }
};

// 🔽 Descargar reporte público (PDF)
export const descargarReportePublico = async (nombre) => {
  try {
    const response = await fetch(`${API_URL}/api/reportes/public/archivo/${nombre}`);
    if (!response.ok) throw new Error("Error al descargar reporte público");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
  } catch (err) {
    console.error("❌ Error al descargar PDF público:", err);
    throw err;
  }
};
