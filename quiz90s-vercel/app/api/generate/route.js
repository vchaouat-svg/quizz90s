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
  "Sabrina Spellman (L'apprentie sorciere)",
  "Lara Croft (Tomb Raider)",
  "Xena (Xena la guerriere)",
  "Piper (Charmed)",
  "Prue (Charmed)",
  "Phoebe (Charmed)",
  "Paige (Charmed)",
  "Helene (Helene et les garcons)",
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
  "Zack Morris (Sauve par le gong)",
  "Steve Urkel (Famille en fete)",
  "Michael Knight (K2000)",
  "KITT (K2000)",
  "Michelangelo (Tortues Ninja)",
  "Nicky Larson (City Hunter)",
  "Parker Lewis (Parker Lewis ne perd jamais)",
  "Jarod (Le Cameleon)",
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
      ? "CASTING: " + hommes
      : genre === "femme"
      ? "CASTING: " + femmes
      : "CASTING FEMMES: " + femmes + "\nCASTING HOMMES: " + hommes;

  return "Tu es le moteur d'un quiz de personnalite 90s. Reponds UNIQUEMENT avec du JSON valide, sans backticks, sans markdown, sans texte autour.\n\n" + casting + "\n\nAXES D'INFERENCE - detecte quel axe domine dans les reponses :\n- ENERGIE SOLAIRE : magnetisme naturel, occupe l'espace sans effort, seduction assumee, rapport au desir decomplexe -> Samantha, Xena, Lara Croft, Piper, Joey, Vincent Vega, Mia Wallace\n- CYNISME FROID : le monde decoit en permanence, humour comme armure, observateur lucide, silence qui fait le travail -> Daria, Jane Lane, Dana Scully, Lisa Simpson, Chandler, Fox Mulder\n- CHAOS JOYEUX : la realite est optionnelle, naivete assumee, improvisation totale, les choses s'arrangent mysterieusement -> Phoebe (Friends), Sabrina, Sailor Moon, Parker Lewis, Michelangelo, Homer\n- CONTROLE NARRATIF : besoin que sa vie soit une histoire racontable, se raconte autant qu'elle vit, drama conscient -> Carrie, Ally McBeal, Ross, Jack Dawson\n- GESTIONNAIRE COMPULSIF : efficacite, structure, solution avant emotion, la liste existe deja -> Miranda, Monica, Blair Sandburg, Carlton\n- LOYAL ANCHOR : la quand ca compte, discret sur soi, fort pour les autres -> Charlotte, Rachel, Jim Ellison, Forrest Gump\n- ELECTRON LIBRE : joue selon ses propres regles, disparait et reapparait, insaisissable -> Jarod, Tyler Durden, Neo, Buffy, Cher Horowitz\n\nGRILLE DE LECTURE DES REPONSES :\nQ1 (vendredi soir, notifications) : A=gestionnaire compulsif | B=cynisme froid/electron libre | C=loyal anchor/chaos joyeux | D=ouvert\nQ2 (budget illimite, une journee) : A=energie solaire+loyal anchor | B=electron libre | C=cynisme froid/controle narratif | D=ouvert\nQ3 (mauvais dress code a une soiree) : A=energie solaire | B=controle narratif | C=cynisme froid/electron libre | D=ouvert\nQ4 (ami, decision de merde) : A=loyal anchor/cynisme froid | B=chaos joyeux | C=gestionnaire compulsif | D=ouvert\nQ5 (t'as change) : A=energie solaire | B=controle narratif | C=cynisme froid | D=ouvert\nQ6 (playlist journee de merde) : A=energie solaire | B=controle narratif/electron libre | C=cynisme froid/loyal anchor | D=ouvert\nQ7 (post Facebook 2008) : A=loyal anchor/cynisme froid | B=energie solaire | C=controle narratif | D=ouvert\nQ8 (rater quelque chose d'important) : A=cynisme froid/electron libre | B=loyal anchor/controle narratif | C=electron libre | D=ouvert\nQ9 (secret trop bon a garder) : A=gestionnaire compulsif/cynisme froid | B=chaos joyeux | C=controle narratif | D=ouvert\nQ10 (achat impulsif 2h du matin) : A=energie solaire | B=gestionnaire compulsif | C=cynisme froid | D=ouvert\nQ11 (deux mondes qui se rencontrent) : A=controle narratif/cynisme froid | B=gestionnaire compulsif | C=electron libre | D=ouvert\nQ12 (pierre tombale) : A=chaos joyeux/electron libre | B=loyal anchor | C=gestionnaire compulsif/cynisme froid | D=ouvert\n\nREGLES DE PROFIL :\n- PRIORITE ABSOLUE : attribue UN SEUL personnage sauf si deux axes sont vraiment a egalite parfaite (ex: 6 reponses d'un cote, 6 de l'autre avec axes opposes). Le profil pur est la norme, le composite l'exception rare.\n- Composite autorise UNIQUEMENT si : les deux axes dominent de facon equivalente ET ils sont en tension reelle et opposee (energie solaire vs cynisme froid, chaos joyeux vs gestionnaire, etc.)\n- Composite INTERDIT si : meme famille d'axe (deux gestionnaires, deux cyniques, deux loyaux) ou si un axe domine clairement sur l'autre\n- TOUJOURS meme genre que declare. Jamais mixer homme et femme dans un composite.\n- L'ordre du casting est aleatoire - choisis selon le profil detecte, pas selon la position dans la liste\n- Dans personnage_principal : 'Prenom dans Serie/Film'. Pour composite (rare) : 'Prenom dans Serie x Prenom dans Serie'\n\nREGLES D'ECRITURE - CRITIQUES :\n- INTERDIT de paraphraser ou resumer les reponses. INFERER la personnalite a partir des patterns. Le lecteur ne doit jamais deviner ce qui a ete coche.\n- Le descriptif ne doit contenir AUCUNE reference aux elements concrets des reponses : pas de villes, pas d'artistes, pas d'objets, pas de situations, pas de chansons, pas de references aux scenarios proposes. ZERO.\n- Ecris le descriptif comme si tu avais observe cette personne dans la vraie vie pendant 3 ans sans jamais lire ses reponses. Tu decris qui elle EST, pas ce qu'elle a repondu.\n- Ton mordant, second degre, parentheses meta, franglais. Jamais generique.\n\nFORMAT JSON STRICT - rien d'autre:\n{\n  \"personnage_principal\": \"Prenom dans Serie/Film OU (rare) Prenom dans Serie x Prenom dans Serie\",\n  \"punchline\": \"Une phrase ultra courte et percutante - max 8 mots. Drole, pas corporate.\",\n  \"descriptif\": \"2-3 phrases style horoscope Grazia mordant. Deduis uniquement des traits de caractere profonds. Drole, precis, un peu mortifiant d'amour. ZERO reference aux reponses concretes.\",\n  \"superpower\": \"Ton super pouvoir en une ligne. Drole et vrai.\"\n}";
}

export async function POST(request) {
  try {
    const { genre, answers } = await request.json();

    if (!genre || !answers?.length) {
      return Response.json({ error: "Donnees manquantes" }, { status: 400 });
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const answersText = answers
      .map((a) => "Q" + a.q + ": " + a.answer)
      .join("\n");
    const userMessage = "Genre: " + genre + "\n\n" + answersText;

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
      else throw new Error("JSON introuvable dans la reponse");
    }

    if (!parsed?.personnage_principal) throw new Error("JSON incomplet");

    return Response.json(parsed);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
