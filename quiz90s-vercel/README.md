# Quiz 90s — Which Character Are You?

Propulsé par Claude (Anthropic). Un profil unique généré à partir de tes réponses.

## Déploiement sur Vercel (5 min)

### 1. Mettre le projet sur GitHub
- Va sur [github.com/new](https://github.com/new)
- Crée un repo `quiz90s` (privé ou public)
- Upload tous ces fichiers dedans

### 2. Déployer sur Vercel
- Va sur [vercel.com](https://vercel.com) → "Add New Project"
- Connecte ton GitHub et sélectionne le repo `quiz90s`
- Clique "Deploy" — Vercel détecte Next.js automatiquement

### 3. Ajouter la clé API
- Dans Vercel → ton projet → "Settings" → "Environment Variables"
- Ajoute : `ANTHROPIC_API_KEY` = ta clé Anthropic
- Ta clé Anthropic est sur [console.anthropic.com](https://console.anthropic.com)
- Redéploie (Settings → Deployments → Redeploy)

### 4. C'est en ligne 🎉
Vercel te donne une URL genre `quiz90s-xxx.vercel.app`
Tu peux aussi configurer un domaine custom dans Settings → Domains.

## Dev local
```bash
npm install
cp .env.example .env.local
# Remplis ANTHROPIC_API_KEY dans .env.local
npm run dev
```
