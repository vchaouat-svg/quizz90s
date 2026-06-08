import { Analytics } from "@vercel/analytics/next";
 
export const metadata = {
  title: "Which 90s Character Are You?",
  description: "Pas un quiz Cosmo. Un profil IA qui te ressemble vraiment.",
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
 
