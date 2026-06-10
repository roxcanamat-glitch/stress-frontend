import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/register", { nombre, email, password });
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.error || "Error al registrarse. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#E8F4F8", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "1.5rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400, background: "#F0F7F4", borderRadius: "2rem", boxShadow: "0 20px 35px -12px rgba(44,74,82,0.12)", padding: "2rem" }}>

        <h2 style={{ color: "#2C4A52", marginBottom: 4 }}>Crear cuenta</h2>
        <p style={{ color: "#5C7A82", fontSize: 14, marginBottom: 24 }}>Empieza a registrar tu bienestar</p>

        {error && <p style={{ color: "#c0392b", fontSize: 14, marginBottom: 12, background: "#fde8e8", padding: "10px 14px", borderRadius: 8 }}>{error}</p>}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, color: "#2C4A52", fontWeight: "bold", fontSize: 14 }}>Nombre</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" required style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #C8E0E8", fontSize: 15, boxSizing: "border-box", background: "#E8F4F8", color: "#2C4A52" }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, color: "#2C4A52", fontWeight: "bold", fontSize: 14 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #C8E0E8", fontSize: 15, boxSizing: "border-box", background: "#E8F4F8", color: "#2C4A52" }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 6, color: "#2C4A52", fontWeight: "bold", fontSize: 14 }}>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #C8E0E8", fontSize: 15, boxSizing: "border-box", background: "#E8F4F8", color: "#2C4A52" }} />
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, background: "#6BAF92", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "#5C7A82" }}>
          ¿Ya tienes cuenta?{" "}
          <span onClick={() => navigate("/login")} style={{ color: "#6BAF92", cursor: "pointer", fontWeight: "bold" }}>
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
