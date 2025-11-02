import { useState } from "react";
import { enviarDenuncia } from "../services/apiService";
import { logAnalyticsEvent } from "../firebase";

export default function DenunciaForm() {
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. usuario hizo clic en "Enviar denuncia"
    logAnalyticsEvent("denuncia_submit_click");

    setEnviando(true);
    setMensaje("");

    try {
      const formData = new FormData();
      formData.append("descripcion", descripcion);
      formData.append("categoria_preliminar", categoria);
      formData.append("contacto_email", email);
      formData.append("contacto_telefono", telefono);
      archivos.forEach((f) => formData.append("evidencias", f));

      const data = await enviarDenuncia(formData); // <-- aquí ahora mismo te da ERR_CONNECTION_REFUSED

      // 2. si llegó aquí: denuncia enviada OK
      logAnalyticsEvent("denuncia_enviada", {
        categoria: categoria || "sin_categoria",
        tiene_archivos: archivos.length > 0,
      });

      setMensaje(`✅ Denuncia registrada con código: ${data.codigo}`);

      // limpiar
      setDescripcion("");
      setCategoria("");
      setEmail("");
      setTelefono("");
      setArchivos([]);
    } catch (error) {
      // 3. si backend está caído, igual registramos el evento de error
      logAnalyticsEvent("denuncia_error", {
        reason: error?.message || "unknown",
      });

      setMensaje("❌ Error al registrar la denuncia. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <div className="card shadow border-0">
        <div className="card-body">
          <h3 className="text-center text-primary mb-4">
            Registrar Denuncia Ciudadana
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Descripción</label>
              <textarea
                className="form-control"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows="4"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Categoría</label>
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

            <div className="mb-3">
              <label className="form-label fw-semibold">Correo</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Teléfono</label>
              <input
                type="text"
                className="form-control"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Adjuntar evidencias
              </label>
              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setArchivos(Array.from(e.target.files))}
                className="form-control"
              />
            </div>

            <button className="btn btn-success w-100" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar Denuncia"}
            </button>
          </form>

          {mensaje && (
            <div
              className={`alert mt-3 ${
                mensaje.startsWith("✅") ? "alert-success" : "alert-danger"
              }`}
            >
              {mensaje}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
