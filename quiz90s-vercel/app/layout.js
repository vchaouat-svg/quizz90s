export const metadata = {
  title: "Which 90s Character Are You?",
  description: "Le quiz de personnalité 90s propulsé par IA. Pas de cases préfabriquées — un profil unique généré à partir de tes réponses.",
  openGraph: {
    title: "Which 90s Character Are You?",
    description: "Le quiz qui te dit enfin la vérité. Powered by IA.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
