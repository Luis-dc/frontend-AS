import axios from "axios";

const API_URL = "https://semipagos.store/api/auditoria";

export const obtenerPagos = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Mapeo de datos para mantener compatibilidad visual
    return response.data.map((p) => ({
      nombre: p.concepto,
      id: p.id,
      carne: p.carne,
      email: p.email,
    }));
  } catch (error) {
    console.error("❌ Error al obtener datos de Semipagos:", error);
    return [];
  }
};
