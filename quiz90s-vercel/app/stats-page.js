"use client";
import { useState, useEffect } from "react";

const C = {
  bg: "#0a0a0f", card: "#12121a", a1: "#ff3cac", a2: "#784ba0",
  a3: "#2b86c5", a4: "#ffcc00", text: "#f0f0f0", muted: "#777", border: "#2a2a3a"
};

export default function StatsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch((e) => setError(e.message));
  }, []);

  const max = data?.persos?.[0]?.count || 1;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Courier New', monospace", color: C.text, padding: "32px 16px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        <div style={{ marginBottom: "40px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: C.a1, textTransform: "uppercase", marginBottom: "8px" }}>Dashboard</div>
          <h1 style={{ fontSize: "28px", fontWeight: "900", margin: 0 }}>Stats du quiz</h1>
        </div>

        {error && (
          <div style={{ background: "#1a0a0a", border: "1px solid " + C.a1, borderRadius: "10px", padding: "16px", color: "#ff9999", marginBottom: "24px" }}>
            Erreur : {error}
          </div>
        )}

        {!data && !error && (
          <div style={{ color: C.muted, fontSize: "14px" }}>Chargement...</div>
        )}

        {data && (
          <>
            {/* Total */}
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: "12px", padding: "24px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ fontSize: "48px", fontWeight: "900", background: "linear-gradient(135deg," + C.a1 + "," + C.a3 + ")", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {data.total}
              </div>
              <div>
                <div style={{ fontSize: "16px", fontWeight: "700" }}>quizz completes</div>
                <div style={{ fontSize: "12px", color: C.muted, marginTop: "4px" }}>{data.persos?.length || 0} personnages differents sortis</div>
              </div>
            </div>

            {/* Classement persos */}
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: "12px", padding: "24px", marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: C.a1, textTransform: "uppercase", marginBottom: "20px" }}>Classement des personnages</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {data.persos.map((p, i) => (
                  <div key={i}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "5px" }}>
                      <span style={{ color: i === 0 ? C.a4 : i === 1 ? "#ccc" : i === 2 ? "#cd7f32" : C.muted }}>
                        {i < 3 ? ["1", "2", "3"][i] + ". " : ""}{p.name}
                      </span>
                      <span style={{ color: C.muted }}>{p.count}x</span>
                    </div>
                    <div style={{ height: "4px", background: C.border, borderRadius: "2px" }}>
                      <div style={{
                        height: "100%", borderRadius: "2px",
                        width: Math.round((p.count / max) * 100) + "%",
                        background: i === 0
                          ? "linear-gradient(90deg," + C.a1 + "," + C.a4 + ")"
                          : "linear-gradient(90deg," + C.a2 + "," + C.a3 + ")"
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Derniers resultats */}
            <div style={{ background: C.card, border: "1px solid " + C.border, borderRadius: "12px", padding: "24px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: C.a1, textTransform: "uppercase", marginBottom: "20px" }}>20 derniers resultats</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {data.recent.map((r, i) => (
                  <div key={i} style={{ borderBottom: "1px solid " + C.border, paddingBottom: "10px" }}>
                    <div style={{ fontSize: "13px", fontWeight: "700", color: C.text }}>{r.perso}</div>
                    <div style={{ fontSize: "12px", color: C.muted, marginTop: "2px" }}>{r.punchline}</div>
                    <div style={{ fontSize: "11px", color: C.border, marginTop: "2px" }}>
                      {new Date(r.ts).toLocaleString("fr-FR")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <a href="/" style={{ fontSize: "12px", color: C.muted, textDecoration: "none", letterSpacing: "2px" }}>
            retour au quiz
          </a>
        </div>
      </div>
    </div>
  );
}
