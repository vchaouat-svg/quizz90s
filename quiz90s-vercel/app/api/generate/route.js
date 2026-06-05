import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `Tu es le moteur d'un quiz de personnalité 90s. Réponds UNIQUEMENT avec du JSON valide, sans backticks, sans markdown, sans texte autour.

CASTING FEMMES: Carrie Bradshaw, Miranda Hobbes, Charlotte York, Samantha Jones, Rachel Green, Monica Geller, Phoebe Buffay, Ally McBeal, Buffy Summers, Willow Rosenberg, Dana Scully, Sabrina Spellman, Hélène (Hélène et les garçons), Daria Morgendorffer, Jane Lane, Quinn Morgendorffer, Lisa Simpson, Sailor Moon, Cher Horowitz (Clueless), Elle Woods, Vivian Ward, Mia Wallace, Jackie Brown, Clarice Starling, Pamela Anderson (Alerte à Malibu), Beyoncé Destiny's Child era, Beyoncé Lemonade era, Beyoncé Renaissance era, Britney Spears, Christina Aguilera, Shakira, Victoria Beckham, Scary Spice, Baby Spice, Sporty Spice, Ginger Spice, TLC, Madonna 90s, Alanis Morissette, Lauryn Hill, Mariah Carey, Shania Twain, Cher la chanteuse, Mylène Farmer, Lara Croft, Prue Halliwell (Charmed), Piper Halliwell (Charmed), Phoebe Halliwell (Charmed), Paige Matthews (Charmed)

CASTING HOMMES: Chandler Bing, Joey Tribbiani, Ross Geller, Fox Mulder, Steve Urkel, Zack Morris, Will (Le Prince de Bel-Air), Carlton Banks, Hannibal (L'Agence tous risques), Looping, Barracuda, Michael Knight, KITT, Bart Simpson, Homer Simpson, Jack Dawson, Vincent Vega, Jules Winnfield, Tyler Durden, Forrest Gump, Neo, Austin Powers, Edward Scissorhands, Henry Hill, Leonardo DiCaprio 90s, Brad Pitt 90s, Jean-Claude Van Damme, Ricky Martin, Nick Carter, Filip (2Be3), Kurt Cobain, Tupac, Biggie, Eminem, Will Smith rap era, Michael Jordan, Prince, Robbie Williams, Seth Cohen

NON-BINAIRE / FLUIDE : tu puises librement dans les deux listes.

RÈGLES:
- Analyse le pattern global ET les contradictions dans les réponses
- Génère un profil pur (1 perso) OU composite "X x Y" avec personnalités en VRAIE tension opposée
- Composite interdit si même archétype (ex: deux femmes qui gèrent = non)
- Ton mordant, second degré, parenthèses meta, franglais. Jamais générique.
- Utilise des détails concrets des réponses

FORMAT JSON STRICT - rien d'autre:
{"personnage_principal":"X x Y ou Nom","titre":"phrase courte percutante max 10 mots","profil":"3-4 phrases horoscope Grazia mordant avec refs concrètes aux réponses","citation":"citation drôle LOL du personnage","superpower":"une ligne drôle et vraie","zone_aveugle":"une ligne mortifiante mais affectueuse"}`;

export async function POST(request) {
  try {
    const { genre, answers } = await request.json();

    if (!genre || !answers?.length) {
      return Response.json({ error: "Données manquantes" }, { status: 400 });
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const answersText = answers.map(a => `Q${a.q}: ${a.answer}`).join("\n");
    const userMessage = `Genre: ${genre}\n\n${answersText}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const rawText = message.content.map(b => b.text || "").join("");

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
