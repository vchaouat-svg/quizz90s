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
  bg: "#0a0a0a", card: "#111111", a1: "#FF6B9D", a2: "#FFA45B",
  a3: "#784ba0", text: "#f0f0f0", muted: "#666", border: "#222"
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
        backgroundColor: "#0D0D0D",
        scale: 2,
        useCORS: true,
        logging: false,
      });
      canvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setCopyState("done");
          setTimeout(() => setCopyState("idle"), 3000);
        } catch {
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

  const shareLinkedIn = () => {
    window.open("https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fquizz90s.vercel.app", "_blank");
  };

  const shareWhatsApp = () => {
    const text = result ? `Je suis ${result.personnage_principal} ! Découvre ton profil 90s ici : https://quizz90s.vercel.app` : "Découvre ton profil 90s ici : https://quizz90s.vercel.app";
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
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

  const extractTags = (r) => {
    if (!r) return [];
    const tags = [];
    const name = r.personnage_principal || "";
    if (name.includes("Sex and the City")) tags.push({ label: "Sex and the City", type: "pink" });
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
    if (tags.length === 0) tags.push({ label: "Quiz 90s", type: "pink" });
    tags.push({ label: "quizz90s.vercel.app", type: "white" });
    return tags;
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        * { box-sizing: border-box; }
        button:active { transform: scale(0.98) !important; }
        .opt-btn:hover { border-color: #FF6B9D !important; background: #1a1010 !important; }
        .genre-btn:hover { border-color: #FF6B9D !important; padding-left: 26px !important; }
        .custom-btn:hover { border-color: #FFA45B !important; color: #f0f0f0 !important; }
      `}</style>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 16px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>

        {/* INTRO */}
        {step === "intro" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "4px", color: C.a1, textTransform: "uppercase", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <span style={{ display: "block", height: "1px", width: "28px", background: "#FF6B9D66" }} />
                QUIZ PERSONNALITÉ
                <span style={{ display: "block", height: "1px", width: "28px", background: "#FF6B9D66" }} />
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(36px,9vw,58px)", fontWeight: "700", lineHeight: 1.05, margin: "0 0 10px", color: "#fff" }}>
                Which 90s<br /><em style={{ color: C.a1 }}>Character</em><br />Are You?
              </h1>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: C.muted, letterSpacing: "1px" }}>powered by IA — not a Cosmo test</div>
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#111", border: "1px solid #222", borderLeft: `3px solid ${C.a1}`, borderRadius: "10px", padding: "22px 24px", marginBottom: "28px" }}>
              <p style={{ fontSize: "15px", lineHeight: 1.75, color: "#bbb", margin: 0, fontWeight: 300 }}>
                Les quiz magazines t'ont menti. T'as toujours fini Carrie. <span style={{ color: C.a2, fontWeight: 500 }}>(tout le monde finit Carrie.)</span>
                <br /><br />
                Avec l'IA, pour la première fois, le résultat te ressemble <em style={{ color: "#fff", fontStyle: "normal", fontWeight: 500 }}>vraiment</em>. 12 questions. Un profil unique. Zéro case préfabriquée.
              </p>
            </div>
            <button onClick={() => setStep("genre")} style={{ width: "100%", padding: "17px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: "500", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", border: "none", borderRadius: "10px", background: `linear-gradient(135deg, ${C.a1}, ${C.a2})`, color: "white" }}>
              GO →
            </button>
          </div>
        )}

        {/* GENRE */}
        {step === "genre" && (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", letterSpacing: "3px", color: C.a1, textTransform: "uppercase", marginBottom: "10px" }}>Avant de commencer</div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "700", margin: 0 }}>Tu t'identifies comme :</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {GENRE_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => { setGenre(opt.label); setStep("quiz"); }} className="genre-btn"
                  style={{ fontFamily: "'DM Sans', sans-serif", padding: "16px 20px", textAlign: "left", fontSize: "15px", cursor: "pointer", background: "#111", border: "1px solid #222", borderRadius: "10px", color: C.text, transition: "all 0.15s" }}
                >{opt.label}</button>
              ))}
            </div>
          </div>
        )}

        {/* QUIZ */}
        {step === "quiz" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ marginBottom: "28px" }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", display: "flex", justifyContent: "space-between", fontSize: "11px", color: C.muted, marginBottom: "8px", letterSpacing: "2px" }}>
                <span>Q{currentQ + 1} / {QUESTIONS.length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: "2px", background: "#222", borderRadius: "2px" }}>
                <div style={{ height: "100%", borderRadius: "2px", transition: "width 0.4s", width: `${progress}%`, background: `linear-gradient(90deg,${C.a1},${C.a2})` }} />
              </div>
            </div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", lineHeight: 1.45, fontWeight: "700", marginBottom: "24px" }}>{QUESTIONS[currentQ].text}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {QUESTIONS[currentQ].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt)} className="opt-btn"
                  style={{ fontFamily: "'DM Sans', sans-serif", padding: "15px 18px", textAlign: "left", fontSize: "14px", lineHeight: 1.55, cursor: "pointer", background: "#111", border: "1px solid #222", borderRadius: "10px", color: C.text, transition: "all 0.15s", display: "flex", gap: "12px", alignItems: "flex-start" }}
                >
                  <span style={{ color: C.a1, fontWeight: "700", flexShrink: 0 }}>{String.fromCharCode(65 + i)}.</span>
                  <span>{opt}</span>
                </button>
              ))}
              {!showCustom ? (
                <button onClick={() => { setShowCustom(true); setTimeout(() => inputRef.current?.focus(), 50); }} className="custom-btn"
                  style={{ fontFamily: "'DM Sans', sans-serif", padding: "15px 18px", textAlign: "left", fontSize: "14px", cursor: "pointer", background: "transparent", border: "1px dashed #333", borderRadius: "10px", color: C.muted, display: "flex", gap: "12px", transition: "all 0.15s" }}
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
                    style={{ fontFamily: "'DM Sans', sans-serif", flex: 1, padding: "14px 16px", fontSize: "14px", background: "#111", border: `1px solid ${C.a1}`, borderRadius: "10px", color: C.text, outline: "none" }}
                  />
                  <button onClick={() => customInput.trim() && handleAnswer(customInput.trim())}
                    style={{ padding: "14px 20px", fontSize: "16px", cursor: "pointer", background: C.a1, border: "none", borderRadius: "10px", color: "white", fontWeight: "700" }}>→</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: "40px", marginBottom: "20px", display: "inline-block", animation: "spin 2s linear infinite" }}>✦</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", marginBottom: "10px" }}>Analyse en cours...</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: C.muted, fontSize: "14px", lineHeight: 1.7, fontWeight: 300 }}>L'IA rewind les 90s,<br />croise tes réponses avec 90 personnages,<br />et te génère un profil unique.</p>
            <div style={{ marginTop: "28px", display: "flex", justifyContent: "center", gap: "8px" }}>
              {[0,1,2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", background: C.a1, animation: `bounce 1s ease-in-out ${i*0.2}s infinite` }} />)}
            </div>
          </div>
        )}

        {/* ERROR */}
        {step === "error" && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.4s ease" }}>
            <div style={{ fontSize: "36px", marginBottom: "14px" }}>💥</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", fontWeight: "700", marginBottom: "12px" }}>Crash 90s style</h2>
            <div style={{ background: "#1a0a0a", border: "1px solid #3a1a1a", borderRadius: "10px", padding: "16px", marginBottom: "20px", textAlign: "left" }}>
              <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#ff9999", margin: 0, wordBreak: "break-all", whiteSpace: "pre-wrap" }}>{error}</p>
            </div>
            <button onClick={restart} style={{ width: "100%", padding: "16px", fontFamily: "'DM Sans', sans-serif", fontSize: "14px", fontWeight: "500", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", border: "none", borderRadius: "10px", background: `linear-gradient(135deg,${C.a1},${C.a2})`, color: "white" }}>
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

              <div style={{ fontFamily: "'Courier New', monospace", fontSize: "10px", fontWeight: "500", letterSpacing: "0.2em", color: "#FF6B9D", textTransform: "uppercase", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
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

              <div style={{ fontFamily: "'Courier New', monospace", fontSize: "13px", color: "#FFA45B", letterSpacing: "0.05em", marginBottom: "24px" }}>
                {result.punchline}
              </div>

              <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(255,107,157,0.35), rgba(255,164,91,0.35), transparent)", marginBottom: "22px" }} />

              <div style={{ fontFamily: "'Courier New', monospace", fontSize: "14px", fontWeight: "300", color: "#C0C0C0", lineHeight: 1.85, marginBottom: "26px" }}>
                {result.descriptif}
              </div>

              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "3px solid #FF6B9D", borderRadius: "0 8px 8px 0", padding: "16px 20px", display: "flex", alignItems: "flex-start", gap: "14px", marginBottom: "22px" }}>
                <span style={{ fontSize: "18px", flexShrink: 0, marginTop: "2px" }}>⚡</span>
                <div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: "10px", fontWeight: "600", letterSpacing: "0.18em", color: "#FF6B9D", textTransform: "uppercase", marginBottom: "5px" }}>Super pouvoir</div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: "13px", color: "#E0E0E0", lineHeight: 1.55 }}>{result.superpower}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {extractTags(result).map((tag, i) => (
                  <span key={i} style={{
                    fontFamily: "'Courier New', monospace", fontSize: "11px",
                    padding: "5px 13px", borderRadius: "20px", border: "1px solid",
                    color: tag.type === "pink" ? "#FF6B9D" : tag.type === "orange" ? "#FFA45B" : "#555",
                    borderColor: tag.type === "pink" ? "rgba(255,107,157,0.35)" : tag.type === "orange" ? "rgba(255,164,91,0.35)" : "rgba(255,255,255,0.1)",
                    background: tag.type === "pink" ? "rgba(255,107,157,0.08)" : tag.type === "orange" ? "rgba(255,164,91,0.08)" : "transparent",
                  }}>{tag.label}</span>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button onClick={copyImage} style={{
                width: "100%", padding: "15px", fontFamily: "'Courier New', monospace",
                fontSize: "13px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase",
                cursor: copyState === "copying" ? "wait" : "pointer", border: "none",
                borderRadius: "10px", color: "white", transition: "background 0.3s",
                background: copyState === "done" ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg, #FF6B9D, #FFA45B)"
              }}>
                {copyState === "idle" && "Copier l'image →"}
                {copyState === "copying" && "Génération..."}
                {copyState === "done" && "✓ Image copiée !"}
              </button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <button onClick={shareLinkedIn} style={{ padding: "13px", fontFamily: "'Courier New', monospace", fontSize: "12px", cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#0A66C2"; e.currentTarget.style.background = "rgba(10,102,194,0.12)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </button>
                <button onClick={shareWhatsApp} style={{ padding: "13px", fontFamily: "'Courier New', monospace", fontSize: "12px", cursor: "pointer", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#25D366"; e.currentTarget.style.background = "rgba(37,211,102,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </button>
              </div>

              <button onClick={restart} style={{ width: "100%", padding: "12px", fontFamily: "'Courier New', monospace", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#444", transition: "all 0.15s" }}
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
