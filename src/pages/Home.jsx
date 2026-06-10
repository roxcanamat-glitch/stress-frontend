import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

function Home() {
  const navigate = useNavigate();
  const [modal, setModal] = useState(null);

  const [nombre, setNombre] = useState("");
  const [emailUsuario, setEmailUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState(null);

  const cerrarModal = () => {
    setModal(null);
    setNombre("");
    setEmailUsuario("");
    setMensaje("");
    setEnviado(false);
    setErrorEnvio(null);
  };

  const handleContacto = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErrorEnvio(null);

    try {
      await emailjs.send(
        "service_vh0r4wb",
        "template_7upmjc8",
        {
          name: nombre,
          email: emailUsuario,
          message: mensaje,
          title: "Mensaje desde la app"
        },
        "DEuAvFAkZg8HVaO4w"
      );
      setEnviado(true);
    } catch (err) {
      console.error("Error al enviar:", err);
      setErrorEnvio("No se pudo enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <div style={{
        background: "#E8F4F8",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1.5rem",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif"
      }}>
        <div style={{
          width: "100%",
          maxWidth: 560,
          background: "#F0F7F4",
          borderRadius: "2rem",
          boxShadow: "0 20px 35px -12px rgba(44, 74, 82, 0.12)",
          padding: "2rem",
          position: "relative"
        }}>

          <div style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>

            <h1 style={{
              fontSize: "2rem",
              fontWeight: 600,
              lineHeight: 1.3,
              color: "#2C4A52",
              margin: "0.5rem 0 1rem"
            }}>
              Evalúa tu nivel de ansiedad
            </h1>

            <p style={{
              fontSize: "1rem",
              color: "#5C7A82",
              maxWidth: 420,
              lineHeight: 1.5,
              marginBottom: "2rem"
            }}>
              Una evaluación rápida para orientarte sobre tu bienestar emocional.
            </p>

            <button
              onClick={() => navigate("/test-ansiedad")}
              style={{
                background: "#6BAF92",
                color: "#fff",
                border: "none",
                borderRadius: 50,
                padding: "1rem 2rem",
                width: "100%",
                maxWidth: 300,
                fontSize: "1.2rem",
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: "2rem",
                transition: "0.2s"
              }}
              onMouseOver={e => e.target.style.background = "#5A9E81"}
              onMouseOut={e => e.target.style.background = "#6BAF92"}
            >
              EMPEZAR TEST
            </button>

            {localStorage.getItem("token") ? (
              <button
                onClick={() => navigate("/dashboard")}
                style={{
                  background: "transparent",
                  color: "#7B9EAE",
                  border: "2px solid #7B9EAE",
                  borderRadius: 50,
                  padding: "0.7rem 2rem",
                  width: "100%",
                  maxWidth: 300,
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: "2rem"
                }}
              >
                Mi historial
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: "transparent",
                  color: "#7B9EAE",
                  border: "2px solid #7B9EAE",
                  borderRadius: 50,
                  padding: "0.7rem 2rem",
                  width: "100%",
                  maxWidth: 300,
                  fontSize: "1rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginBottom: "2rem"
                }}
              >
                Iniciar sesión
              </button>
            )}

            <div style={{
              width: "100%",
              background: "#E8F4F8",
              borderRadius: "1rem",
              padding: "0.9rem 1rem",
              marginBottom: "2rem",
              fontSize: "0.9rem",
              color: "#5C7A82",
              border: "1px solid #C8E0E8"
            }}>
              ⚠️ Esta herramienta no sustituye atención médica profesional
            </div>

            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              borderTop: "1px solid #C8E0E8",
              paddingTop: "1.5rem",
              width: "100%"
            }}>
              {[
                { label: "Contacto", key: "contacto" },
                { label: "Privacidad", key: "privacidad" },
                { label: "Aviso legal", key: "legal" }
              ].map(link => (
                <span
                  key={link.key}
                  onClick={() => setModal(link.key)}
                  style={{
                    color: "#7B9EAE",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    cursor: "pointer"
                  }}
                >
                  {link.label}
                </span>
              ))}
            </div>

          </div>
        </div>
      </div>

      {modal && (
        <div
          onClick={cerrarModal}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(44, 74, 82, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
            padding: "1.5rem"
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#F0F7F4",
              borderRadius: "1.5rem",
              padding: "2rem",
              maxWidth: 420,
              width: "100%"
            }}
          >

            {modal === "contacto" && (
              <>
                <h3 style={{ marginBottom: 4, color: "#2C4A52" }}>Contacto</h3>
                {enviado ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <p style={{ fontSize: 40 }}>✅</p>
                    <p style={{ fontWeight: "bold", marginBottom: 8, color: "#2C4A52" }}>¡Mensaje enviado!</p>
                    <p style={{ color: "#5C7A82", fontSize: 14 }}>
                      Gracias por escribirnos. Te responderemos lo antes posible.
                    </p>
                    <button onClick={cerrarModal} style={{ marginTop: 20, padding: "10px 24px", background: "#6BAF92", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, cursor: "pointer" }}>
                      Cerrar
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContacto}>
                    <p style={{ color: "#5C7A82", fontSize: 14, marginBottom: 20 }}>
                      ¿Tienes alguna duda o sugerencia? Escríbenos.
                    </p>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", fontSize: 14, color: "#2C4A52" }}>Nombre</label>
                      <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" required style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #C8E0E8", fontSize: 14, boxSizing: "border-box", background: "#E8F4F8" }} />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", fontSize: 14, color: "#2C4A52" }}>Tu email</label>
                      <input type="email" value={emailUsuario} onChange={e => setEmailUsuario(e.target.value)} placeholder="para poder responderte" required style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #C8E0E8", fontSize: 14, boxSizing: "border-box", background: "#E8F4F8" }} />
                    </div>
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", fontSize: 14, color: "#2C4A52" }}>Mensaje</label>
                      <textarea value={mensaje} onChange={e => setMensaje(e.target.value)} placeholder="¿En qué podemos ayudarte?" required style={{ width: "100%", minHeight: 100, padding: 10, borderRadius: 8, border: "1px solid #C8E0E8", fontSize: 14, resize: "vertical", boxSizing: "border-box", background: "#E8F4F8" }} />
                    </div>
                    {errorEnvio && <p style={{ color: "red", fontSize: 13, marginBottom: 10 }}>{errorEnvio}</p>}
                    <div style={{ display: "flex", gap: 10 }}>
                      <button type="submit" disabled={enviando} style={{ flex: 1, padding: "12px 0", background: "#6BAF92", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, cursor: enviando ? "not-allowed" : "pointer" }}>
                        {enviando ? "Enviando..." : "Enviar mensaje"}
                      </button>
                      <button type="button" onClick={cerrarModal} style={{ flex: 1, padding: "12px 0", background: "transparent", border: "1px solid #C8E0E8", borderRadius: 10, fontSize: 15, cursor: "pointer", color: "#5C7A82" }}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            {modal === "privacidad" && (
              <>
                <h3 style={{ marginBottom: 12, color: "#2C4A52" }}>Privacidad</h3>
                <p style={{ color: "#5C7A82" }}>Tus datos solo se guardarán si decides registrarte.</p>
                <button onClick={cerrarModal} style={{ marginTop: 20, padding: "10px 24px", background: "#6BAF92", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, cursor: "pointer", width: "100%" }}>Cerrar</button>
              </>
            )}

            {modal === "legal" && (
              <>
                <h3 style={{ marginBottom: 12, color: "#2C4A52" }}>Aviso legal</h3>
                <p style={{ color: "#5C7A82" }}>Esta app ofrece orientación emocional, no diagnóstico médico.</p>
                <button onClick={cerrarModal} style={{ marginTop: 20, padding: "10px 24px", background: "#6BAF92", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, cursor: "pointer", width: "100%" }}>Cerrar</button>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}

export default Home;
