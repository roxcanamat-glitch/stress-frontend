import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

function Dashboard() {
  const navigate = useNavigate();
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMoods = async () => {
    try {
      const res = await api.get("/moods");
      setMoods(res.data);
    } catch (error) {
      console.error("Error al cargar los registros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getMoods(); }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(44, 74, 82);
    doc.text("Historial de Ansiedad", 20, 20);
    doc.setFontSize(11);
    doc.setTextColor(92, 122, 130);
    doc.text(`Generado el ${new Date().toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`, 20, 30);
    doc.setFontSize(10);
    doc.setTextColor(107, 175, 146);
    doc.text("Este documento es orientativo y no sustituye atención médica profesional.", 20, 40);
    doc.setDrawColor(200, 224, 232);
    doc.line(20, 45, 190, 45);

    let y = 55;
    if (moods.length === 0) {
      doc.setFontSize(12);
      doc.setTextColor(92, 122, 130);
      doc.text("No hay registros guardados.", 20, y);
    } else {
      moods.forEach((mood, index) => {
        if (y > 260) { doc.addPage(); y = 20; }
        doc.setFontSize(11);
        doc.setTextColor(44, 74, 82);
        const fecha = new Date(mood.createdAt).toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
        doc.text(`${index + 1}. ${fecha}`, 20, y); y += 7;
        doc.setFontSize(10);
        doc.setTextColor(74, 101, 114);
        doc.text(`   Ansiedad: ${mood.ansiedad} / 24`, 20, y); y += 6;
        doc.text(`   Estado de ánimo: ${mood.estadoAnimo}`, 20, y); y += 6;
        if (mood.notas) {
          doc.setTextColor(92, 122, 130);
          const lineas = doc.splitTextToSize(`   Notas: ${mood.notas}`, 165);
          doc.text(lineas, 20, y);
          y += lineas.length * 6;
        }
        y += 6;
        doc.setDrawColor(200, 224, 232);
        doc.line(20, y - 3, 190, y - 3);
      });
    }
    doc.save("historial-ansiedad.pdf");
  };

  if (loading) return <p style={{ padding: 20, color: "#5C7A82" }}>Cargando...</p>;

  return (
    <div style={{ padding: 20, background: "#E8F4F8", minHeight: "100vh" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ margin: 0, color: "#2C4A52" }}>Mi historial</h1>
        <button onClick={handleLogout} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #C8E0E8", borderRadius: 8, cursor: "pointer", fontSize: 14, color: "#5C7A82" }}>
          Cerrar sesión
        </button>
      </div>

      <button onClick={() => navigate("/test-ansiedad")} style={{ width: "100%", padding: 16, background: "#6BAF92", color: "#fff", border: "none", borderRadius: 12, fontSize: 16, cursor: "pointer", marginBottom: 12 }}>
        Hacer nuevo test
      </button>

      <button onClick={exportarPDF} disabled={moods.length === 0} style={{ width: "100%", padding: 16, background: moods.length === 0 ? "#C8E0E8" : "#7B9EAE", color: moods.length === 0 ? "#aaa" : "#fff", border: "none", borderRadius: 12, fontSize: 16, cursor: moods.length === 0 ? "not-allowed" : "pointer", marginBottom: 24 }}>
        📄 Exportar historial a PDF
      </button>

      <h2 style={{ color: "#2C4A52" }}>Mis tests guardados</h2>

      {moods.length === 0 ? (
        <p style={{ color: "#5C7A82" }}>Aún no tienes ningún test guardado.</p>
      ) : (
        moods.map((mood) => (
          <div key={mood._id} style={{ border: "1px solid #C8E0E8", borderRadius: 12, padding: 16, marginBottom: 12, background: "#F0F7F4" }}>
            <p style={{ fontSize: 12, color: "#7B9EAE", margin: "0 0 8px 0" }}>
              {new Date(mood.createdAt).toLocaleDateString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p style={{ margin: "4px 0", fontWeight: "bold", color: "#2C4A52" }}>Ansiedad: {mood.ansiedad} / 24</p>
            <p style={{ margin: "4px 0", color: "#4A6572" }}>Estado de ánimo: {mood.estadoAnimo}</p>
            {mood.notas && (
              <p style={{ margin: "8px 0 0 0", color: "#5C7A82", fontSize: 14, fontStyle: "italic" }}>"{mood.notas}"</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
