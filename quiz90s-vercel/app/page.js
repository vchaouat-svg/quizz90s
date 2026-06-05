"use client";
import { useState, useRef } from "react";

const QUESTIONS = [
  { id: 1, text: "C'est vendredi soir, ton téléphone explose de notifications.", options: ["Tu réponds à tout, t'organises le plan, t'es la tour de contrôle (comme d'hab)", "Tu lis tout. Tu réponds à personne. (T'as tes raisons.)", "Euh?? A part si c'est mon birthday, ça fait longtemps que mon tel a pas vibré un vendredi soir."], placeholder: "Vendredi tout est permis !" },
  { id: 2, text: "Budget illimité, une journée, personne le saura. Tu fais quoi ?", options: ["Tu prends un jet pour Barcelone, tu décroches la dernière table chez Disfrutar et tu rentres.", "Tu disparais au Mexique sans prévenir personne, ambiance Oaxaca mezcalitoooo.", "Tu t'enfermes dans la meilleure suite du Crillon 24h et tu regardes Netflix en pyjama."], placeholder: "Dis moi tout chéri" },
  { id: 3, text: "T'arrives à une fête où tu connais personne. Les 10 premières minutes ?", options: ["Tu trouves le buffet et tu t'y installes officiellement.", "Tu choisis une personne random et tu la lâches plus jamais, le plus gros tunnel de l'histoire.", "Tour complet de reconnaissance avant de décider si tu restes. T'es pas une touriste."], placeholder: "T'emballes pas trop non plus" },
  { id: 4, text: "Ton meilleur ami te demande ton avis sur une décision de merde : s'installer à Chambéry, ouvrir un bar à vin nat dans le 11eme, se faire une coupe mulet.", options: ["Vérité directe, avec amour, sans anesthésie.", "Tu poses des questions jusqu'à ce qu'il arrive lui-même à la conclusion. (Très malin. Très long.)", "Tu soutiens en te disant que ça n'arrivera jamais. 6 mois plus tard tu l'appelles tous les jours pour demander si Chambéry c'est pas méga boring."], placeholder: "Autre chose ?" },
  { id: 5, text: "On te confie un projet sans brief, deadline floue, équipe mystère. Ta réaction ?", options: ["Excitation totale. C'est là que tu brilles.", "48h de cadrage, Excel, PPT, Notion, et après seulement tu commences.", "Tu paniques dans les toilettes, t'écris ta lettre de dem, tu fais le projet avec la lettre dans la poche."], placeholder: "Autre chose ?" },
  { id: 6, text: "Journée de merde garantie. Tu mets quoi dans les oreilles ?", options: ["Survivor — Destiny's Child. Tu sors en slow motion et les pigeons s'écartent.", "Lose Yourself — Eminem. Une chance, une seule.", "No Scrubs — TLC. Pour te rappeler que t'as des standards."], placeholder: "Autre chose ? allez dis, vas-y..." },
  { id: 7, text: "Silence gênant dans le groupe. Toi tu fais quoi ?", options: ["Tu le remplis — t'as toujours quelque chose à dire. Pas forcément de qualité.", "Une blague. Pas toujours bonne. Pour voir si ça fait grandir le malaise.", "T'observes qui va craquer en premier. (Fascinant comme expérience sociale.)"], placeholder: "Autre chose ?" },
  { id: 8, text: "Tu rates quelque chose d'important — une présentation, un vol, un crush. Les 24h après ?", options: ["Passé en 20 minutes. L'autocommisération c'est pas ton truc.", "T'appelles ta mère, ta BFF, ton collègue, ton chat. Verbaliser ça aide.", "Tu disparais du radar. Tu reviens quand t'as digéré. (Délai variable.)"], placeholder: "Autre chose ?" },
  { id: 9, text: "Ton rôle dans le film 90s ?", options: ["Le héros — pression totale, tout repose sur toi.", "Le meilleur ami — toutes les meilleures répliques, zéro responsabilité.", "Le vilain — franchement le seul personnage vraiment bien écrit."], placeholder: "Autre chose ?" },
  { id: 10, text: "Comment tu prends une décision importante ?", options: ["Instinct pur. Tu sais dans les 30 premières secondes.", "Tableau Excel. Pour et contre. T'assumes complètement.", "T'appelles ta mère, elle dit de faire un tableau Excel. Tu fais ce que t'avais décidé au départ."], placeholder: "Autre chose ?" },
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
  const [copyState, setCopyState] = useState("idle");
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
        backgroundColor: "#0a0a1e",
        scale: 2, useCORS: true, logging: false,
      });
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setCopyState("done");
          setTimeout(() => setCopyState("idle"), 3000);
        } catch {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "mon-profil-90s.png"; a.click();
          setCopyState("done");
          setTimeout(() => setCopyState("idle"), 3000);
        }
      }, "image/png");
    } catch { setCopyState("idle"); }
  };

  const shareLinkedIn = () => {
    window.open("https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fquizz90s.vercel.app", "_blank");
  };

  const shareWhatsApp = () => {
    const text = result ? `Je suis ${result.personnage_principal} ! Découvre ton profil 90s : https://quizz90s.vercel.app` : "Découvre ton profil 90s : https://quizz90s.vercel.app";
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const extractTags = (r) => {
    if (!r) return [];
    const tags = [];
    const name = r.personnage_principal || "";
    if (name.includes("SATC") || name.includes("Sex and the City")) tags.push({ label: "Sex and the City", type: "pink" });
    if (name.includes("Friends")) tags.push({ label: "Friends", type: "orange" });
    if (name.includes("X-Files")) tags.push({ label: "X-Files", type: "pink" });
    if (name.includes("Titanic")) tags.push({ label: "Titanic", type: "orange" });
    if (name.includes("Fight Club")) tags.push({ label: "Fight Club", type: "pink" });
    if (name.includes("Matrix")) tags.push({ label: "Matrix", type: "orange" });
    if (name.includes("Pulp Fiction")) tags.push({ label: "Pulp Fiction", type: "pink" });
    if (name.includes("Buffy")) tags.push({ label: "Buffy", type: "orange" });
    if (name.includes("Clueless")) tags.push({ label: "Clueless", type: "pink" });
    if (name.includes("Charmed")) tags.push({ label: "Charmed", type: "orange" });
    if (name.includes("Daria")) tags.push({ label: "Daria", type: "pink" });
    if (name.includes("Prince de Bel-Air")) tags.push({ label: "Le Prince de Bel-Air", type: "orange" });
    if (name.includes("Legally Blonde")) tags.push({ label: "Legally Blonde", type: "pink" });
    if (tags.length === 0) tags.push({ label: "Quiz 90s", type: "pink" });
    tags.push({ label: "quizz90s.vercel.app", type: "white" });
    return tags;
  };

  const progress = step === "quiz" ? (currentQ / QUESTIONS.length) * 100 : 0;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'Courier New', monospace", color: C.text, position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
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
                Avec l'IA, pour la première fois, le résultat te ressemble <em style={{ color: "#fff", fontStyle: "normal" }}>vraiment</em>. 12 questions. Un profil unique. Zéro case préfabriquée.
              </p>
            </div>
            <button onClick={() => setStep("genre")} style={{ width: "100%", padding: "16px", fontSize: "14px", fontWeight: "700", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${C.a1},${C.a2})`, color: "white" }}>
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
                  style={{ padding: "16px 20px", textAlign: "left", fontSize: "15px", cursor: "pointer", background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px", color: C.text, transition: "all 0.15s" }}
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
                  style={{ padding: "15px 18px", textAlign: "left", fontSize: "14px", lineHeight: 1.5, cursor: "pointer", background: C.card, border: `1px solid ${C.border}`, borderRadius: "10px", color: C.text, transition: "all 0.15s", display: "flex", gap: "12px", alignItems: "flex-start" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.a1; e.currentTarget.style.background = "#1a1a2a"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = C.card; }}
                >
                  <span style={{ color: C.a1, fontWeight: "700", flexShrink: 0 }}>{String.fromCharCode(65 + i)}.</span>
                  <span>{opt}</span>
                </button>
              ))}
              {!showCustom ? (
                <button onClick={() => { setShowCustom(true); setTimeout(() => inputRef.current?.focus(), 50); }}
                  style={{ padding: "15px 18px", textAlign: "left", fontSize: "14px", cursor: "pointer", background: "transparent", border: `1px dashed ${C.border}`, borderRadius: "10px", color: C.muted, display: "flex", gap: "12px", transition: "all 0.15s" }}
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
                    style={{ flex: 1, padding: "14px 16px", fontSize: "14px", background: C.card, border: `1px solid ${C.a3}`, borderRadius: "10px", color: C.text, outline: "none" }}
                  />
                  <button onClick={() => customInput.trim() && handleAnswer(customInput.trim())}
                    style={{ padding: "14px 20px", fontSize: "16px", cursor: "pointer", background: C.a3, border: "none", borderRadius: "10px", color: "white", fontWeight: "700" }}>→</button>
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
            <button onClick={restart} style={{ width: "100%", padding: "16px", fontSize: "14px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${C.a1},${C.a2})`, color: "white" }}>
              Recommencer
            </button>
          </div>
        )}

        {/* RESULT */}
        {step === "result" && result && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div ref={cardRef} style={{
              background: "linear-gradient(135deg, #0a0a1e, #12123a, #0a1628)",
              border: "1px solid rgba(255,107,157,0.2)",
              borderRadius: "16px", padding: "36px 40px 40px",
              marginBottom: "16px", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "280px", height: "280px", background: "radial-gradient(circle, rgba(255,107,157,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "220px", height: "220px", background: "radial-gradient(circle, rgba(43,134,197,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

              <div style={{ fontSize: "10px", fontWeight: "500", letterSpacing: "0.2em", color: "#FF6B9D", textTransform: "uppercase", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ display: "block", height: "1px", width: "22px", background: "rgba(255,107,157,0.4)" }} />
                Which 90s character are you?
                <span style={{ display: "block", height: "1px", width: "22px", background: "rgba(255,107,157,0.4)" }} />
              </div>

              <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(24px,5vw,34px)", fontWeight: "700", lineHeight: 1.1, color: "#fff", marginBottom: "8px", letterSpacing: "-0.5px" }}>
                {result.personnage_principal.includes(" x ") ? (
                  <>
                    {result.personnage_principal.split(" x ")[0]}
                    <span style={{ color: "#FF6B9D", fontStyle: "italic" }}> × </span>
                    {result.personnage_principal.split(" x ")[1]}
                  </>
                ) : result.personnage_principal}
              </div>

              <div style={{ fontSize: "13px", color: "#FFA45B", letterSpacing: "0.05em", marginBottom: "24px" }}>
                {result.punchline}
              </div>

              <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(255,107,157,0.35), rgba(255,164,91,0.35), transparent)", marginBottom: "22px" }} />

              <div style={{ fontSize: "14px", fontWeight: "300", color: "#C0C0C0", lineHeight: 1.85, marginBottom: "26px" }}>
                {result.descriptif}
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "3px solid #FF6B9D", borderRadius: "0 8px 8px 0", padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "22px" }}>
                <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "2px" }}>⚡</span>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: "600", letterSpacing: "0.18em", color: "#FF6B9D", textTransform: "uppercase", marginBottom: "5px" }}>Super pouvoir</div>
                  <div style={{ fontSize: "13px", color: "#E0E0E0", lineHeight: 1.55 }}>{result.superpower}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {extractTags(result).map((tag, i) => (
                  <span key={i} style={{
                    fontSize: "11px", padding: "5px 13px", borderRadius: "20px", border: "1px solid",
                    color: tag.type === "pink" ? "#FF6B9D" : tag.type === "orange" ? "#FFA45B" : "#555",
                    borderColor: tag.type === "pink" ? "rgba(255,107,157,0.35)" : tag.type === "orange" ? "rgba(255,164,91,0.35)" : "rgba(255,255,255,0.1)",
                    background: tag.type === "pink" ? "rgba(255,107,157,0.08)" : tag.type === "orange" ? "rgba(255,164,91,0.08)" : "transparent",
                  }}>{tag.label}</span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button onClick={copyImage} style={{
                width: "100%", padding: "15px", fontSize: "13px", fontWeight: "700",
                letterSpacing: "2px", textTransform: "uppercase",
                cursor: copyState === "copying" ? "wait" : "pointer", border: "none",
                borderRadius: "10px", color: "white", transition: "background 0.3s",
                background: copyState === "done" ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg, #FF6B9D, #FFA45B)"
              }}>
                {copyState === "idle" && "Copier l'image \u2192"}
                {copyState === "copying" && "G\u00e9n\u00e9ration..."}
                {copyState === "done" && "\u2713 Image copi\u00e9e !"}
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button onClick={shareLinkedIn} style={{ padding: "13px", fontSize: "12px", cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#0A66C2"; e.currentTarget.style.background = "rgba(10,102,194,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </button>
                <button onClick={shareWhatsApp} style={{ padding: "13px", fontSize: "12px", cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#25D366"; e.currentTarget.style.background = "rgba(37,211,102,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </button>
              </div>

              <button onClick={restart} style={{ width: "100%", padding: "12px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#444", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"; e.currentTarget.style.color = "#aaa"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#444"; }}
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
