export default function Home() {
    const token = localStorage.getItem("access_token");
  
    const handleFakeLogin = () => {
      // Simula que el usuario inició sesión y recibió un token
      localStorage.setItem("access_token", "FAKE_JWT_TOKEN_123");
      window.location.reload();
    };
  
    const handleLogout = () => {
      localStorage.removeItem("access_token");
      window.location.reload();
    };
  
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Auditoría Social</h1>
        {!token ? (
          <>
            <p>Inicia sesión para registrar una denuncia.</p>
            <button onClick={handleFakeLogin}>Simular inicio de sesión</button>
          </>
        ) : (
          <>
            <p>Sesión activa (token simulado).</p>
            <a href="/denuncia"><button>Registrar Denuncia</button></a><br /><br />
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </>
        )}
      </div>
    );
  }
  