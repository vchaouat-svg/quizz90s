"use client";
import { useState, useRef } from "react";

const QUESTIONS = [
  { id: 1, text: "C'est vendredi soir, ton téléphone explose de notifications.", options: ["Tu réponds à tout, t'organises le plan, t'es la tour de contrôle (comme d'hab)", "Tu lis tout. Tu réponds à personne. (T'as tes raisons.)", "Euh?? A part si c'est mon birthday, ça fait longtemps que mon tel a pas vibré un vendredi soir."], placeholder: "Vendredi tout est permis !" },
  { id: 2, text: "Budget illimité, une journée, personne le saura. Tu fais quoi ?", options: ["Tu prends un jet pour Barcelone, tu décroches la dernière table chez Disfrutar et tu rentres.", "Tu disparais au Mexique sans prévenir personne, ambiance Oaxaca mezcalitoooo.", "Tu t'enfermes dans la meilleure suite du Crillon 24h et tu regardes Netflix en pyjama."], placeholder: "Dis moi tout chéri" },
  { id: 3, text: "T'arrives à une fête où tu connais personne. Les 10 premières minutes ?", options: ["Tu trouves le buffet et tu t'y installes officiellement.", "Tu choisis une personne random et tu la lâches plus jamais, le plus gros tunnel de l'histoire.", "Tour complet de reconnaissance avant tout engagement. T'es une générale, pas une touriste."], placeholder: "T'emballes pas trop non plus" },
  { id: 4, text: "Ton meilleur ami te demande ton avis sur une décision de merde : s'installer à Chambéry, ouvrir un bar à vin nat, se faire une coupe mulet.", options: ["Vérité directe, avec amour, sans anesthésie.", "Tu poses des questions jusqu'à ce qu'il arrive lui-même à la conclusion. (Très malin. Très long.)", "Tu soutiens en te disant que ça n'arrivera jamais. 6 mois plus tard tu l'appelles tous les jours depuis Chambéry."], placeholder: "Autre chose ?" },
  { id: 5, text: "On te confie un projet sans brief, deadline floue, équipe mystère. Ta réaction ?", options: ["Excitation totale. C'est là que tu brilles.", "48h de cadrage, Excel, PPT, Notion, et après seulement tu commences.", "Tu paniques dans les toilettes, t'écris ta lettre de dem, tu fais le projet avec la lettre dans la poche."], placeholder: "Autre chose ?" },
  { id: 6, text: "Journée de merde garantie. Tu mets quoi dans les oreilles ?", options: ["Survivor — Destiny's Child. Tu sors en slow motion et les pigeons s'écartent.", "Lose Yourself — Eminem. Une chance, une seule.", "No Scrubs — TLC. Pour te rappeler que t'as des standards."], placeholder: "Autre chose ?" },
  { id: 7, text: "Silence gênant dans le groupe. Toi tu fais quoi ?", options: ["Tu le remplis — t'as toujours quelque chose à dire. Pas forcément de qualité.", "Une blague. Pas toujours bonne. Pour voir si ça fait grandir le malaise.", "T'observes qui va craquer en premier. (Fascinant comme expérience sociale.)"], placeholder: "Autre chose ?" },
  { id: 8, text: "Tu rates quelque chose d'important — une présentation, un vol, un crush. Les 24h après ?", options: ["Passé en 20 minutes. L'autocommisération c'est pas ton truc.", "T'appelles ta mère, ta BFF, ton collègue, ton chat. Verbaliser ça aide.", "Tu disparais du radar. Tu reviens quand t'as digéré. (Délai variable.)"], placeholder: "Autre chose ?" },
  { id: 9, text: "Ton rôle dans le film 90s ?", options: ["Le héros — pression totale, tout repose sur toi.", "Le meilleur ami — toutes les meilleures répliques, zéro responsabilité.", "Le villain — franchement le seul personnage vraiment bien écrit."], placeholder: "Autre chose ?" },
  { id: 10, text: "Comment tu prends une décision importante ?", options: ["Instinct pur. Tu sais dans les 30 premières secondes.", "Tableau Excel. Pour et contre. T'assumes complètement.", "T'appelles ta mère, elle dit fais un tableau Excel. Tu fais ce que t'avais décidé au départ."], placeholder: "Autre chose ?" },
  { id: 11, text: "Ta routine explose du jour au lendemain. Bureau à la Défense, salle de sport fermée, coiffeur à la retraite (des trucs vraiment graves quoi).", options: ["Relief. T'en avais marre mais t'aurais jamais sauté seul.", "Résistance. T'as mis du temps à construire ça, merci mais non.", "Adaptation immédiate. T'es un caméléon, c'est ton super pouvoir."], placeholder: "Autre chose ?" },
  { id: 12, text: "Sur ta pierre tombale sera gravé :", options: ['"Imprévisible, on ne s\'est jamais ennuyé."', '"Là quand ça comptait. Les autres fois aussi."', '"Toujours un coup d\'avance. Même sur ça."'], placeholder: "Autre chose ?" },
];

const GENRE_OPTIONS = [
  { value: "femme", label: "Une femme" },
  { value: "homme", label: "Un homme" },
  { value: "non-binaire", label: "Non-binaire / fluide" },
  { value: "surprise", label: "Surprise me 🎲" },
];

const C = {
  bg: "#0a0a0f", card: "#12121a", a1: "#ff3cac", a2: "#784ba0",
  a3: "#2b86c5", a4: "#ffcc00", text: "#f0f0f0", muted: "#777", border: "#2a2a3a"
};

export default function Quiz90s() {
  const [step, setStep] = useState("intro");
  const [genre, setGenre] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copyState, setCopyState] = useState("idle"); // idle | copying | done
  const inputRef = useRef(null);
  const cardRef = useRef(null);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers, { q: currentQ + 1, answer }];
    setAnswers(newAnswers);
    setShowCustom(false);
    setCustomInput("");
    if (currentQ + 1 < QUESTIONS.length) {
      setCurrentQ(currentQ + 1);
    } else {
      generateResult(newAnswers);
    }
  };

  const generateResult = async (allAnswers) => {
    setStep("loading");
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre, answers: allAnswers }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setStep("result");
    } catch (e) {
      setError(e.message);
      setStep("error");
    }
  };

  const restart = () => {
    setStep("intro"); setGenre(""); setCurrentQ(0); setAnswers([]);
    setResult(null); setError(null); setShowCustom(false); setCustomInput("");
    setCopyState("idle");
  };

  const copyImage = async () => {
    if (!cardRef.current || copyState !== "idle") return;
    setCopyState("copying");
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0a0a0f",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob })
          ]);
          setCopyState("done");
          setTimeout(() => setCopyState("idle"), 3000);
        } catch {
          // Fallback: télécharger l'image
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "mon-profil-90s.png";
          a.click();
          setCopyState("done");
          setTimeout(() => setCopyState("idle"), 3000);
        }
      }, "image/png");
    } catch (e) {
      setCopyState("idle");
    }
  };

  const progress = step === "quiz" ? (currentQ / QUESTIONS.length) * 100 : 0;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Courier New', monospace", color: C.text, position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        * { box-sizing: border-box; }
        button:active { transform: scale(0.98) !important; }
      `}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100, backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)" }} />
      <div style={{ position: "fixed", top: "-20%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle,${C.a1}12,transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: "-20%", left: "-10%", width: "400px", height: "400px", borderRadius: "50%", background: `radial-gradient(circle,${C.a3}12,transparent 70%)`, pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "620px", margin: "0 auto", padding: "24px 16px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>

        {/* INTRO */}
        {step === "intro" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: "36px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "4px", color: C.a1, textTransform: "uppercase", marginBottom: "14px" }}>◈ QUIZ PERSONNALITÉ ◈</div>
              <h1 style={{ fontSize: "clamp(32px,8vw,50px)", fontWeight: "900", lineHeight: 1.1, margin: "0 0 8px", background: `linear-gradient(135deg,${C.a1},${C.a4},${C.a3})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                WHICH 90s<br />CHARACTER<br />ARE YOU?
              </h1>
              <div style={{ fontSize: "12px", color: C.muted, letterSpacing: "2px" }}>powered by IA — not a Cosmo test</div>
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "12px", padding: "22px", marginBottom: "28px" }}>
              <p style={{ fontSize: "15px", lineHeight: 1.7, color: "#ccc", margin: 0 }}>
                Les quiz magazines t'ont menti. T'as toujours fini Carrie. <span style={{ color: C.a4 }}>(tout le monde finit Carrie.)</span>
                <br /><br />
                Avec l'IA, pour la première fois, le résultat te ressemble <em>vraiment</em>. 12 questions. Un profil unique. Zéro case préfabriquée.
              </p>
            </div>
            <button onClick={() => setStep("genre")} style={{ width: "100%", padding: "16px", fontSize: "14px", fontWeight: "700", fontFamily: "'Courier New', monospace", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${C.a1},${C.a2})`, color: "white" }}>
              GO →
            </button>
          </div>
        )}

        {/* GENRE */}
        {step === "genre" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontSize: "11px", letterSpacing: "3px", color: C.a1, textTransform: "uppercase", marginBottom: "10px" }}>Avant de commencer</div>
              <h2 style={{ fontSize: "22px", fontWeight: "700", margin: 0 }}>Tu t'identifies comme :</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {GENRE_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => { setGenre(opt.label); setStep("quiz"); }}
                  style={{ padding: "16px 20px", textAlign: "left", fontSize: "15px", fontFamily: "'Courier New', monospace", cursor: "pointer", background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px", color: C.text, transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.a1; e.currentTarget.style.paddingLeft = "26px"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.paddingLeft = "20px"; }}
                >{opt.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* QUIZ */}
        {step === "quiz" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: C.muted, marginBottom: "6px", letterSpacing: "2px" }}>
                <span>Q{currentQ + 1} / {QUESTIONS.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: "3px", background: C.border, borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", transition: "width 0.4s", width: `${progress}%`, background: `linear-gradient(90deg,${C.a1},${C.a3})` }} />
              </div>
            </div>
            <p style={{ fontSize: "17px", lineHeight: 1.5, fontWeight: "600", marginBottom: "24px" }}>{QUESTIONS[currentQ].text}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {QUESTIONS[currentQ].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt)}
                  style={{ padding: "15px 18px", textAlign: "left", fontSize: "14px", lineHeight: 1.5, fontFamily: "'Courier New', monospace", cursor: "pointer", background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px", color: C.text, transition: "all 0.15s", display: "flex", gap: "12px", alignItems: "flex-start" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.a1; e.currentTarget.style.background = "#1a1a2a"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card; }}
                >
                  <span style={{ color: C.a1, fontWeight: "700", flexShrink: 0 }}>{String.fromCharCode(65 + i)}.</span>
                  <span>{opt}</span>
                </button>
              ))}
              {!showCustom ? (
                <button onClick={() => { setShowCustom(true); setTimeout(() => inputRef.current?.focus(), 50); }}
                  style={{ padding: "15px 18px", textAlign: "left", fontSize: "14px", fontFamily: "'Courier New', monospace", cursor: "pointer", background: "transparent", border: `1px dashed ${C.border}`, borderRadius: "10px", color: C.muted, display: "flex", gap: "12px", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.a3; e.currentTarget.style.color = C.text; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
                >
                  <span style={{ fontWeight: "700" }}>D.</span>
                  <span>Autre chose — {QUESTIONS[currentQ].placeholder}</span>
                </button>
              ) : (
                <div style={{ display: "flex", gap: "8px" }}>
                  <input ref={inputRef} value={customInput}
                    onChange={e => setCustomInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && customInput.trim() && handleAnswer(customInput.trim())}
                    placeholder={QUESTIONS[currentQ].placeholder}
                    style={{ flex: 1, padding: "14px 16px", fontSize: "14px", fontFamily: "'Courier New', monospace", background: C.card, border: `1px solid ${C.a3}`, borderRadius: "10px", color: C.text, outline: "none" }}
                  />
                  <button onClick={() => customInput.trim() && handleAnswer(customInput.trim())}
                    style={{ padding: "14px 20px", fontSize: "16px", fontFamily: "'Courier New', monospace", cursor: "pointer", background: C.a3, border: "none", borderRadius: "10px", color: "white", fontWeight: "700" }}>→</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: "44px", marginBottom: "20px", display: "inline-block", animation: "spin 2s linear infinite" }}>◈</div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px" }}>Analyse en cours...</h2>
            <p style={{ color: C.muted, fontSize: "14px", lineHeight: 1.6 }}>L'IA rewind les 90s,<br />croise tes réponses avec 90 personnages,<br />et te génère un profil unique.</p>
            <div style={{ marginTop: "28px", display: "flex", justifyContent: "center", gap: "8px" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: C.a1, animation: `bounce 1s ease-in-out ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}

        {/* ERROR */}
        {step === "error" && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>💥</div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>Crash 90s style</h2>
            <div style={{ background: "#1a0a0a", border: `1px solid ${C.a1}55`, borderRadius: "10px", padding: "16px", marginBottom: "20px", textAlign: "left" }}>
              <p style={{ fontSize: "12px", color: "#ff9999", fontFamily: "monospace", margin: 0, wordBreak: "break-all", whiteSpace: "pre-wrap" }}>{error}</p>
            </div>
            <button onClick={restart} style={{ width: "100%", padding: "16px", fontSize: "14px", fontWeight: "700", fontFamily: "'Courier New', monospace", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${C.a1},${C.a2})`, color: "white" }}>
              Recommencer
            </button>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && result && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>

            {/* CARTE — capturée pour l'image */}
            <div ref={cardRef} style={{
              background: "linear-gradient(135deg,#0a0a0f,#1a1a2e,#0f3460)",
              borderRadius: "20px", padding: "32px 28px",
              marginBottom: "16px", position: "relative", overflow: "hidden",
            }}>
              {/* Déco */}
              <div style={{ position: "absolute", top: 0, right: 0, width: "200px", height: "200px", background: `radial-gradient(circle at top right,${C.a1}25,transparent)`, pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "150px", height: "150px", background: `radial-gradient(circle at bottom left,${C.a3}20,transparent)`, pointerEvents: "none" }} />

              {/* Badge */}
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: C.a1, textTransform: "uppercase", marginBottom: "20px", opacity: 0.8 }}>◈ WHICH 90s CHARACTER ARE YOU? ◈</div>

              {/* Nom */}
              <h2 style={{ fontSize: "clamp(24px,6vw,36px)", fontWeight: "900", margin: "0 0 10px", lineHeight: 1.1, background: `linear-gradient(135deg,${C.a1},${C.a4})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {result.personnage_principal}
              </h2>

              {/* Titre */}
              <p style={{ fontSize: "15px", color: "#ddd", margin: "0 0 24px", lineHeight: 1.5, fontStyle: "italic" }}>
                {result.titre}
              </p>

              {/* Citation */}
              <div style={{ borderLeft: `3px solid ${C.a1}`, paddingLeft: "16px", marginBottom: "24px" }}>
                <p style={{ fontSize: "14px", fontStyle: "italic", color: C.a4, margin: 0, lineHeight: 1.6 }}>
                  "{result.citation}"
                </p>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: "rgba(43,134,197,0.12)", border: "1px solid rgba(43,134,197,0.25)", borderRadius: "10px", padding: "14px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "2px", color: C.a3, textTransform: "uppercase", marginBottom: "6px" }}>⚡ super pouvoir</div>
                  <p style={{ fontSize: "13px", margin: 0, lineHeight: 1.4, color: "#ddd" }}>{result.superpower}</p>
                </div>
                <div style={{ background: "rgba(255,60,172,0.1)", border: "1px solid rgba(255,60,172,0.2)", borderRadius: "10px", padding: "14px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "2px", color: C.a1, textTransform: "uppercase", marginBottom: "6px" }}>🐛 ton bug</div>
                  <p style={{ fontSize: "13px", margin: 0, lineHeight: 1.4, color: "#ddd" }}>{result.zone_aveugle}</p>
                </div>
              </div>

              {/* Watermark */}
              <div style={{ marginTop: "20px", fontSize: "10px", color: "#444", letterSpacing: "2px", textAlign: "right" }}>
                quizz90s.vercel.app
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button onClick={copyImage}
                style={{ width: "100%", padding: "16px", fontSize: "14px", fontWeight: "700", fontFamily: "'Courier New', monospace", letterSpacing: "2px", textTransform: "uppercase", cursor: copyState === "copying" ? "wait" : "pointer", border: "none", borderRadius: "10px", color: "white", transition: "background 0.3s", background: copyState === "done" ? "linear-gradient(135deg,#22c55e,#16a34a)" : `linear-gradient(135deg,${C.a1},${C.a2})` }}>
                {copyState === "idle" && "Copier l'image pour LinkedIn →"}
                {copyState === "copying" && "Génération de l'image..."}
                {copyState === "done" && "✓ Image copiée !"}
              </button>
              <button onClick={restart}
                style={{ width: "100%", padding: "14px", fontSize: "13px", fontFamily: "'Courier New', monospace", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", background: "transparent", border: `1px solid ${C.border}`, borderRadius: "10px", color: C.muted, transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#999"; e.currentTarget.style.color = C.text; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
              >
                Recommencer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
