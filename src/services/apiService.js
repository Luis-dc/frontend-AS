const API_URL = process.env.REACT_APP_API_URL;

// Registrar denuncia
export async function enviarDenuncia(formData) {
  const token = localStorage.getItem("access_token");

  console.log("🟢 Enviando token:", token ? token.slice(0, 40) + "..." : "NULO");

  const response = await fetch(`${API_URL}/api/denuncias`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("❌ Error en el backend:", text);
    throw new Error("Error al registrar la denuncia");
  }

  return response.json();
}

// Obtener denuncias
export async function obtenerDenuncias(token, filtros = {}) {
  const params = new URLSearchParams(filtros);
  const url = `${API_URL}/api/denuncias?${params}`;

  console.log("Solicitando denuncias:", url);
  console.log("Token enviado:", token ? token.slice(0, 20) + "..." : "NULO");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("📥 Respuesta del backend:", response.status, response.statusText);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Contenido del error:", errorText);
    throw new Error("Error al obtener denuncias");
  }

  return await response.json();
}

// Asignar denuncia
export async function asignarDenuncia(token, id, departamento, modulo) {
  try {
    const url = `${API_URL}/api/denuncias/${id}/asignar`;
    console.log("Asignando denuncia:", { id, departamento, modulo });

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ departamento, modulo }),
    });

    console.log("Respuesta asignar:", response.status, response.statusText);

    if (!response.ok) {
      const err = await response.text();
      console.error("Detalle del error:", err);
      throw new Error("Error al asignar denuncia");
    }

    return await response.json();
  } catch (error) {
    console.error("Error asignando denuncia:", error);
    throw error;
  }
}

// Generar reporte PDF
export async function generarReporte(token, id) {
  console.log("Generando reporte para denuncia:", id);
  const response = await fetch(`${API_URL}/api/reportes/${id}/generar`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Error generando PDF:", text);
    throw new Error("Error al generar el reporte");
  }

  return await response.json();
}

// Obtener reportes
export async function obtenerReportes(token) {
  console.log("Solicitando lista de reportes...");
  const response = await fetch(`${API_URL}/api/reportes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Error obteniendo reportes:", text);
    throw new Error("Error al obtener los reportes");
  }

  return await response.json();
}

export async function descargarReporte(nombre) {
  const response = await fetch(`${API_URL}/api/reportes/archivo/${nombre}`);
  if (!response.ok) throw new Error("Error al descargar reporte");
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  window.open(url);
}

