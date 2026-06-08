import Anthropic from "@anthropic-ai/sdk";

const CASTING_FEMMES = [
  "Carrie (Sex and the City)",
  "Miranda (Sex and the City)",
  "Charlotte (Sex and the City)",
  "Samantha (Sex and the City)",
  "Rachel (Friends)",
  "Monica (Friends)",
  "Phoebe (Friends)",
  "Buffy (Buffy contre les vampires)",
  "Dana Scully (X-Files)",
  "Cher Horowitz (Clueless)",
  "Mia Wallace (Pulp Fiction)",
  "Ally McBeal (Ally McBeal)",
  "Daria Morgendorffer (Daria)",
  "Jane Lane (Daria)",
  "Quinn Morgendorffer (Daria)",
  "Lisa Simpson (Les Simpson)",
  "Sabrina Spellman (L'apprentie sorcière)",
  "Lara Croft (Tomb Raider)",
  "Xena (Xena la guerrière)",
  "Piper (Charmed)",
  "Prue (Charmed)",
  "Phoebe (Charmed)",
  "Paige (Charmed)",
  "Hélène (Hélène et les garçons)",
  "Sailor Moon",
];

const CASTING_HOMMES = [
  "Chandler (Friends)",
  "Joey (Friends)",
  "Ross (Friends)",
  "Fox Mulder (X-Files)",
  "Jack (Titanic)",
  "Tyler Durden (Fight Club)",
  "Neo (Matrix)",
  "Forrest Gump (Forrest Gump)",
  "Vincent Vega (Pulp Fiction)",
  "Will (Le Prince de Bel-Air)",
  "Carlton (Le Prince de Bel-Air)",
  "Bart Simpson (Les Simpson)",
  "Homer Simpson (Les Simpson)",
  "Austin Powers (Austin Powers)",
  "Jean-Claude Van Damme (JCVD)",
  "Zack Morris (Sauvés par le gong)",
  "Steve Urkel (Famille en fête)",
  "Michael Knight (K2000)",
  "KITT (K2000)",
  "Michelangelo (Tortues Ninja)",
  "Nicky Larson (City Hunter)",
  "Parker Lewis (Parker Lewis ne perd jamais)",
  "Jarod (Le Caméléon)",
  "Jim Ellison (The Sentinel)",
  "Blair Sandburg (The Sentinel)",
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildSystemPrompt(genre) {
  const femmes = shuffle(CASTING_FEMMES).join(", ");
  const hommes = shuffle(CASTING_HOMMES).join(", ");

  const casting =
    genre === "homme"
      ? `CASTING: ${hommes}`
      : genre === "femme"
      ? `CASTING: ${femmes}`
      : `CASTING FEMMES: ${femmes}\nCASTING HOMMES: ${hommes}`;

  return `Tu es le moteur d'un quiz de personnalité 90s. Réponds UNIQUEMENT avec du JSON valide, sans backticks, sans markdown, sans texte autour.

${casting}

AXES D'INFÉRENCE — lis les réponses et détecte quel axe domine :
- ÉNERGIE SOLAIRE : magnétisme naturel, occupe l'espace sans effort, séduction assumée, rapport au désir décomplexé → Samantha, Xena, Lara Croft, Piper, Joey, Vincent Vega
- CYNISME FROID : le monde déçoit en permanence, humour comme armure, observateur lucide, peu de mots mais précis → Daria, Jane Lane, Dana Scully, Lisa Simpson, Chandler, Fox Mulder
- CHAOS JOYEUX : la réalité est optionnelle, naïveté assumée, improvisation totale, les choses s'arrangent mystérieusement → Phoebe (Friends), Sabrina, Sailor Moon, Parker Lewis, Michelangelo
- CONTRÔLE NARRATIF : besoin que sa vie soit une histoire, se raconte autant qu'elle vit, drama conscient → Carrie, Ally McBeal, Ross, Jack Dawson
- GESTIONNAIRE COMPULSIF : efficacité, structure, solution avant émotion, la liste existe déjà → Miranda, Monica, Blair Sandburg, Carlton
- LOYAL ANCHOR : là quand ça compte, discret sur soi, fort pour les autres → Charlotte, Rachel, Jim Ellison, Forrest Gump

RÈGLES:
- Analyse le pattern global ET les contradictions dans les réponses
- Génère un profil pur (1 perso) OU composite "X x Y" avec personnalités en VRAIE tension opposée
- Composite interdit si même axe (deux gestionnaires, deux rebelles = non)
- TOUJOURS utiliser des persos du même genre que celui déclaré. Jamais mixer homme et femme dans un composite.
- L'ordre du casting est aléatoire — choisis selon le profil détecté, pas selon la position dans la liste
- Dans personnage_principal : "Prénom dans Série/Film" ex: "Miranda dans Sex and the City". Pour composite : "Miranda dans Sex and the City x Phoebe dans Friends"
- INTERDIT de paraphraser ou résumer les réponses. Tu dois INFÉRER la personnalité à partir des patterns. Le lecteur ne doit jamais deviner ce qui a été coché. Tu parles de qui ils SONT, pas de ce qu'ils ont DIT.
- Ton mordant, second degré, parenthèses meta, franglais. Jamais générique.

FORMAT JSON STRICT - rien d'autre:
{
  "personnage_principal": "Prénom dans Série x Prénom dans Série OU Prénom dans Série",
  "punchline": "Une phrase ultra courte et percutante — max 8 mots. Drôle, pas corporate.",
  "descriptif": "2-3 phrases style horoscope Grazia mordant. Parle de la PERSONNALITÉ, pas des réponses. Comme si tu avais observé cette personne pendant des années. Drôle, précis, un peu mortifiant d'amour. Une citation du personnage peut apparaître naturellement si elle colle.",
  "superpower": "Ton super pouvoir en une ligne. Drôle et vrai."
}`;
}

export async function POST(request) {
  try {
    const { genre, answers } = await request.json();

    if (!genre || !answers?.length) {
      return Response.json({ error: "Données manquantes" }, { status: 400 });
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const answersText = answers.map((a) => `Q${a.q}: ${a.answer}`).join("\n");
    const userMessage = `Genre: ${genre}\n\n${answersText}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 800,
      system: buildSystemPrompt(genre),
      messages: [{ role: "user", content: userMessage }],
    });

    const rawText = message.content.map((b) => b.text || "").join("");

    let parsed;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error("JSON introuvable dans la réponse");
    }

    if (!parsed?.personnage_principal) throw new Error("JSON incomplet");

    return Response.json(parsed);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
