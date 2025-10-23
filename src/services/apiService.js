export async function enviarDenuncia(formData) {
    const token = localStorage.getItem("access_token");
  
    const response = await fetch("http://localhost:4000/api/denuncias", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // enviamos archivos, por eso usamos FormData
    });
  
    if (!response.ok) throw new Error("Error al registrar la denuncia");
  
    return response.json();
  }

  export async function obtenerDenuncias(token, filtros) {
    const params = new URLSearchParams(filtros);
    const response = await fetch(`http://localhost:4000/api/denuncias?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (!response.ok) throw new Error("Error al obtener denuncias");
    return await response.json();
  }
  