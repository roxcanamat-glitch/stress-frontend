import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const getAnxietyResult = (score) => {
  if (score <= 5) return { level: "Baja", message: "Tus niveles de ansiedad parecen bajos.", advice: "Mantén hábitos saludables: duerme bien, haz ejercicio y descansa." };
  if (score <= 10) return { level: "Leve", message: "Ansiedad leve detectada.", advice: "La respiración profunda y el descanso pueden ayudarte mucho." };
  if (score <= 15) return { level: "Moderada", message: "Ansiedad moderada.", advice: "Revisa tus hábitos diarios y trata de reducir el estrés." };
  return { level: "Alta", message: "Ansiedad elevada.", advice: "Es recomendable hablar con un profesional de la salud." };
};

const playlists = {
  spotify: "https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ",
  youtube: "https://youtu.be/79kpoGF8KWU"
};

const questions = [
  "¿Te has sentido nervioso/a o ansioso/a?",
  "¿Te cuesta controlar las preocupaciones?",
  "¿Sientes miedo sin una razón clara?",
  "¿Tienes pensamientos repetitivos que no puedes parar?",
  "¿Te cuesta relajarte?",
  "¿Notas síntomas físicos de ansiedad (corazón acelerado, sudor...)?",
  "¿Tienes problemas para dormir por los nervios?",
  "¿Evitas situaciones por miedo o ansiedad?"
];

const options = [
  { label: "Nunca", value: 0 },
  { label: "A veces", value: 1 },
  { label: "Frecuentemente", value: 2 },
  { label: "Siempre", value: 3 }
];

const estadoAnimoTexto = ["Muy mal", "Mal", "Normal", "Bien", "Muy bien"];

export default function TestAnsiedad() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState("test");
  const [estadoAnimo, setEstadoAnimo] = useState(2);
  const [notas, setNotas] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const score = answers.reduce((a, b) => a + b, 0);
  const result = getAnxietyResult(score);

  const handleSelect = (value) => {
    const updated = [...answers, value];
    setAnswers(updated);
    setSelected(value);
    const isLast = step === questions.length - 1;
    setTimeout(() => {
      if (isLast) { setPhase("post"); }
      else { setStep(step + 1); setSelected(null); }
    }, 200);
  };

  const saveToBackend = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setPhase("result"); return; }
    try {
      setLoading(true);
      setSaveError(null);
      await api.post("/moods", { ansiedad: score, estadoAnimo: estadoAnimoTexto[estadoAnimo], notas });
      setPhase("result");
    } catch (err) {
      console.error("Error al guardar:", err);
      setSaveError("No se pudo guardar el resultado. Puedes seguir igualmente.");
    } finally {
      setLoading(false);
    }
  };

  if (phase === "test") {
    return (
      <div style={{ padding: 20, background: "#E8F4F8", minHeight: "100vh" }}>
        <h2 style={{ color: "#2C4A52" }}>Test de Ansiedad</h2>
        <p style={{ color: "#5C7A82" }}>Pregunta {step + 1} de {questions.length}</p>

        <div style={{ background: "#C8E0E8", borderRadius: 8, height: 8, marginBottom: 24 }}>
          <div style={{ background: "#6BAF92", height: 8, borderRadius: 8, width: `${((step + 1) / questions.length) * 100}%`, transition: "width 0.3s" }} />
        </div>

        <h3 style={{ marginBottom: 20, color: "#2C4A52" }}>{questions[step]}</h3>

        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            style={{
              display: "block",
              margin: "10px auto",
              padding: 16,
              width: "100%",
              borderRadius: 12,
              border: selected === opt.value ? "2px solid #6BAF92" : "1px solid #C8E0E8",
              background: selected === opt.value ? "#A8D5BA" : "#F0F7F4",
              fontSize: 16,
              cursor: "pointer",
              textAlign: "center",
              color: "#2C4A52"
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    );
  }

  if (phase === "post") {
    return (
      <div style={{ padding: 20, background: "#E8F4F8", minHeight: "100vh" }}>
        <h2 style={{ color: "#2C4A52" }}>Antes de ver tu resultado</h2>
        <p style={{ color: "#5C7A82" }}>Cuéntanos cómo te has sentido hoy</p>

        <div style={{ margin: "24px 0" }}>
          <label style={{ fontWeight: "bold", color: "#2C4A52" }}>
            Estado de ánimo: <span style={{ color: "#6BAF92" }}>{estadoAnimoTexto[estadoAnimo]}</span>
          </label>
          <input type="range" min={0} max={4} value={estadoAnimo} onChange={(e) => setEstadoAnimo(Number(e.target.value))} style={{ width: "100%", marginTop: 10, accentColor: "#6BAF92" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#5C7A82" }}>
            <span>Muy mal</span><span>Muy bien</span>
          </div>
        </div>

        <div style={{ margin: "24px 0" }}>
          <label style={{ fontWeight: "bold", color: "#2C4A52" }}>Notas del día (opcional)</label>
          <textarea
            placeholder="¿Qué ha pasado hoy? ¿Cómo te has sentido?"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            style={{ width: "100%", minHeight: 100, marginTop: 10, padding: 12, borderRadius: 10, border: "1px solid #C8E0E8", fontSize: 15, resize: "vertical", boxSizing: "border-box", background: "#F0F7F4", color: "#2C4A52" }}
          />
        </div>

        {saveError && <p style={{ color: "red", fontSize: 14 }}>{saveError}</p>}

        <button onClick={saveToBackend} disabled={loading} style={{ padding: "14px 28px", background: "#6BAF92", color: "#fff", border: "none", borderRadius: 10, fontSize: 16, cursor: loading ? "not-allowed" : "pointer", width: "100%" }}>
          {loading ? "Guardando..." : "Ver resultado"}
        </button>

        <button onClick={() => setPhase("result")} style={{ marginTop: 10, padding: "12px 28px", background: "transparent", border: "1px solid #C8E0E8", borderRadius: 10, fontSize: 15, cursor: "pointer", width: "100%", color: "#5C7A82" }}>
          Saltar sin guardar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, background: "#E8F4F8", minHeight: "100vh" }}>
      <h2 style={{ color: "#2C4A52" }}>Tu resultado</h2>

      <div style={{ background: "#A8D5BA", borderRadius: 16, padding: 24, marginTop: 16 }}>
        <p style={{ fontSize: 20, fontWeight: "bold", color: "#2C4A52" }}>Nivel de ansiedad: {result.level}</p>
        <p style={{ color: "#2C4A52" }}>{result.message}</p>
        <p style={{ color: "#4A6572" }}>{result.advice}</p>
        <p style={{ color: "#5C7A82", fontSize: 14, marginTop: 12 }}>Puntuación: {score} / {questions.length * 3}</p>
      </div>

      {/* Música relajante */}
      <div style={{ marginTop: 24, padding: 20, background: "#F0F7F4", borderRadius: 16, border: "1px solid #C8E0E8" }}>
        <p style={{ fontWeight: "bold", marginBottom: 6, color: "#2C4A52" }}>🎵 Música relajante para ti</p>
        <p style={{ fontSize: 14, color: "#5C7A82", marginBottom: 16 }}>
          Hemos seleccionado una playlist de relajación para ayudarte.
        </p>
        <div style={{ display: "flex", flexDirection: window.innerWidth < 480 ? "column" : "row", gap: 12 }}>
          <a href={playlists.spotify} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 0", background: "#1DB954", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: "bold", textDecoration: "none" }}>
            ♫ Spotify
          </a>
          <a href={playlists.youtube} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 0", background: "#FF0000", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: "bold", textDecoration: "none" }}>
            ▶ YouTube
          </a>
        </div>
      </div>

      {!localStorage.getItem("token") && (
        <div style={{ marginTop: 24, padding: 16, background: "#E8F4F8", borderRadius: 12, border: "1px solid #C8E0E8" }}>
          <p style={{ margin: "0 0 12px 0", fontSize: 14, color: "#2C4A52" }}>
            💡 <b>¿Quieres guardar tus resultados?</b> Inicia sesión o regístrate para poder comparar tu evolución día a día.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button 
            onClick={() => navigate("/login")} 
            style={{ 
              flex: 1, 
              padding: "12px 0", 
              background: "#6BAF92", 
              color: "#fff", 
              border: "none", 
              borderRadius: 10,
              fontSize: 15, 
              cursor: "pointer" }}>
                Iniciar sesión
              </button>
            <button 
            onClick={() => navigate("/register")} 
            style={{ 
              flex: 1, 
              padding: "12px 0", 
              background: "transparent", 
              color: "#6BAF92", 
              border: "2px solid #6BAF92", 
              borderRadius: 10, 
              fontSize: 15, 
              cursor: "pointer" }}>
                Registrarse
              </button>
          </div>
        </div>
      )}

      {localStorage.getItem("token") && (
        <button 
        onClick={() => navigate("/dashboard")}
        style={{ 
          marginTop: 20, 
          padding: "14px 28px", 
          background: "#F0F7F4", 
          color: "#6BAF92", 
          border: "2px solid #6BAF92", 
          borderRadius: 10, 
          fontSize: 16, 
          cursor: "pointer", 
          width: "100%" }}>
          Ver mi historial
        </button>
      )}

      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: 12,
          padding: "14px 28px",
          background: "transparent",
          color: "#6BAF92",
          border: "2px solid #6BAF92",
          borderRadius: 10,
          fontSize: 16,
          cursor: "pointer",
          width: "100%"
        }}
      >
        Ir al inicio
      </button>

      <button 
      onClick={() => { 
        setStep(0); 
        setAnswers([]); 
        setSelected(null); 
        setPhase("test"); 
        setEstadoAnimo(2); 
        setNotas(""); 
        setSaveError(null); 
        }} 
        style={{ marginTop: 12, 
        padding: "14px 28px", 
        background: "#6BAF92", 
        color: "#fff", 
        border: "none", 
        borderRadius: 10, 
        fontSize: 16, 
        cursor: "pointer", 
        width: "100%" }}>
        Repetir test
      </button>
    </div>
  );
}
