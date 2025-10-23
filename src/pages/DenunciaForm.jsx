import { useState } from "react";
import { enviarDenuncia } from "../services/apiService";

export default function DenunciaForm() {
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [contactoEmail, setContactoEmail] = useState("");
  const [contactoTelefono, setContactoTelefono] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // 🔹 Validación básica de archivos
  const validarArchivos = (files) => {
    const maxSize = 5 * 1024 * 1024; // 5 MB
    for (let file of files) {
      if (file.size > maxSize) {
        alert(`El archivo ${file.name} excede el tamaño máximo (5MB).`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("descripcion", descripcion);
      formData.append("categoria_preliminar", categoria);
      formData.append("contacto_email", contactoEmail);
      formData.append("contacto_telefono", contactoTelefono);

      for (let file of archivos) {
        formData.append("evidencias", file);
      }

      const data = await enviarDenuncia(formData);
      setMensaje(`Denuncia registrada con código: ${data.codigo}`);

      // Limpiar campos
      setDescripcion("");
      setCategoria("");
      setContactoEmail("");
      setContactoTelefono("");
      setArchivos([]);
    } catch (err) {
      console.error(err);
      setMensaje("Ocurrió un error al registrar la denuncia. Intenta nuevamente.");
    }
  };

  const handleArchivosChange = (e) => {
    const files = Array.from(e.target.files);
    if (validarArchivos(files)) setArchivos(files);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h3 className="card-title text-center text-primary mb-4">
            Registrar Denuncia Ciudadana
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Descripción */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Descripción de la denuncia</label>
              <textarea
                className="form-control"
                rows="4"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Explica brevemente los hechos..."
                required
              ></textarea>
            </div>

            {/* Categoría */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Categoría preliminar</label>
              <select
                className="form-select"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
              >
                <option value="">Selecciona una opción</option>
                <option value="Corrupción">Corrupción</option>
                <option value="Mala praxis">Mala praxis</option>
                <option value="Transparencia">Transparencia</option>
                <option value="Otra">Otra</option>
              </select>
            </div>

            {/* Correo */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Correo de contacto</label>
              <input
                type="email"
                className="form-control"
                placeholder="ejemplo@correo.com"
                value={contactoEmail}
                onChange={(e) => setContactoEmail(e.target.value)}
                required
              />
              <div className="form-text">
                Se usará únicamente para enviarte el código de seguimiento.
              </div>
            </div>

            {/* Teléfono */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Teléfono de contacto</label>
              <input
                type="tel"
                className="form-control"
                placeholder="(ej. 5555-5555)"
                value={contactoTelefono}
                onChange={(e) => setContactoTelefono(e.target.value)}
              />
            </div>

            {/* Evidencias */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Adjuntar evidencias</label>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                className="form-control"
                onChange={handleArchivosChange}
              />
              <div className="form-text">
                Puedes subir imágenes o documentos (máx. 5MB por archivo).
              </div>
            </div>

            {/* Botón */}
            <button type="submit" className="btn btn-success w-100">
              Enviar Denuncia
            </button>
          </form>

          {/* Mensaje de éxito/error */}
          {mensaje && (
            <div
              className={`alert mt-4 ${
                mensaje.startsWith("") ? "alert-success" : "alert-danger"
              }`}
              role="alert"
            >
              {mensaje}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
