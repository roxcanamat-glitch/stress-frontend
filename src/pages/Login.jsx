import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.error || "Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#E8F4F8", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", padding: "1.5rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400, background: "#F0F7F4", borderRadius: "2rem", boxShadow: "0 20px 35px -12px rgba(44,74,82,0.12)", padding: "2rem" }}>

        <h2 style={{ color: "#2C4A52", marginBottom: 4 }}>Iniciar sesión</h2>
        <p style={{ color: "#5C7A82", fontSize: 14, marginBottom: 24 }}>Bienvenido/a de nuevo</p>

        {error && <p style={{ color: "#c0392b", fontSize: 14, marginBottom: 12, background: "#fde8e8", padding: "10px 14px", borderRadius: 8 }}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 6, color: "#2C4A52", fontWeight: "bold", fontSize: 14 }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@email.com" required style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #C8E0E8", fontSize: 15, boxSizing: "border-box", background: "#E8F4F8", color: "#2C4A52" }} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", marginBottom: 6, color: "#2C4A52", fontWeight: "bold", fontSize: 14 }}>Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #C8E0E8", fontSize: 15, boxSizing: "border-box", background: "#E8F4F8", color: "#2C4A52" }} />
          </div>

          <button type="submit" disabled={loading} style={{ width: "100%", padding: 14, background: "#6BAF92", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 16, fontSize: 14, color: "#5C7A82" }}>
          ¿No tienes cuenta?{" "}
          <span onClick={() => navigate("/register")} style={{ color: "#6BAF92", cursor: "pointer", fontWeight: "bold" }}>
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
