export async function GET() {
  try {
    const url = process.env.KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN;

    if (!url || !token) {
      return Response.json({ error: "KV non configure" }, { status: 500 });
    }

    const headers = { Authorization: "Bearer " + token };

    // Total quizz
    const totalRes = await fetch(url + "/get/quiz:total", { headers });
    const totalData = await totalRes.json();
    const total = parseInt(totalData.result || "0");

    // Tous les persos
    const keysRes = await fetch(url + "/keys/quiz:perso:*", { headers });
    const keysData = await keysRes.json();
    const keys = keysData.result || [];

    const persos = [];
    for (const key of keys) {
      const valRes = await fetch(url + "/get/" + key, { headers });
      const valData = await valRes.json();
      const count = parseInt(valData.result || "0");
      const name = key.replace("quiz:perso:", "").replace(/_/g, " ");
      persos.push({ name, count });
    }

    persos.sort((a, b) => b.count - a.count);

    // Derniers resultats
    const recentRes = await fetch(url + "/lrange/quiz:recent/0/19", { headers });
    const recentData = await recentRes.json();
    const recent = (recentData.result || []).map((r) => {
      try { return JSON.parse(r); } catch { return null; }
    }).filter(Boolean);

    return Response.json({ total, persos, recent });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
