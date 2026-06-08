"use client";
import { useState, useRef } from "react";

const QUESTIONS = [
  {
    id: 1,
    text: "C'est vendredi soir, ton telephone explose de notifications.",
    options: [
      "Tu reponds a tout, t'organises le plan, t'es la tour de controle. (Comme d'hab.)",
      "Tu lis tout. Tu reponds a personne. T'as tes raisons.",
      "Euh?? A part si c'est ton birthday, ca fait longtemps que ton tel a pas vibre un vendredi soir.",
    ],
    placeholder: "Vendredi tout est permis !",
  },
  {
    id: 2,
    text: "Budget illimite, une journee, personne le saura. Tu fais quoi ?",
    options: [
      "Tu prends un jet pour Barcelone avec 10 potes, tu decroches la derniere table chez Disfrutar, tu commandes toute la carte et tu rentres.",
      "Tu disparais au Mexique sans prevenir personne, ambiance Oaxaca mezcalito. (Spoiler : t'as deja le sac pret.)",
      "Tu t'enfermes dans la meilleure suite du Crillon pendant 24h et tu regardes Netflix en pyjama.",
    ],
    placeholder: "Dis-moi tout cheri",
  },
  {
    id: 3,
    text: "T'arrives a une soiree, t'avais clairement pas le bon dress code : ambiance Loana debarque dans le loft mais c'est une version speciale Le masque et la plume produite par France Inter.",
    options: [
      "Tu assumes totalement. C'est eux le probleme, tous bloques dans les annees 50s.",
      "Tu fais croire a tout le monde que Cyril t'a dit que c'etait deguise (ca t'a coute de le rincer toute la soiree pour te backer)",
      "Tu reperes la sortie en 3 minutes. T'es pas obligee de rester pour confirmer.",
    ],
    placeholder: "Sois creatif.ve !",
  },
  {
    id: 4,
    text: "Ton meilleur ami te demande ton avis sur une decision de merde. (genre s'installer a Chambery, ouvrir un bar a vin nat dans le 11eme, se faire une coupe mulet)",
    options: [
      "Verite directe, avec amour, sans anesthesie. C'est pour ca qu'il t'appelle non ?",
      "Tu soutiens en te disant que ca n'arrivera jamais. 6 mois plus tard tu l'appelles tous les jours pour lui demander si Chambery c'est pas mega boring.",
      "Tu poses des questions jusqu'a ce qu'il arrive lui-meme a la conclusion. Tres malin. Tres long.",
    ],
    placeholder: "Stratege machiavellique ?",
  },
  {
    id: 5,
    text: "Quelqu'un te dit \"t'as change\" avec un ton pas vraiment dechiffrable.",
    options: [
      '"En mieux j\'espere ?" Tu souris. T\'assumes la reponse de toute facon, t\'es FABULOUS.',
      "T'y penses encore 3 jours apres en cherchant ce que ca voulait dire.",
      '"Je sais, c\'est les antidepresseurs." Tu souris. Tu laisses le silence faire le travail.',
    ],
    placeholder: "What else ?",
  },
  {
    id: 6,
    text: "Journee de merde garantie. Tu mets quoi dans les oreilles ?",
    options: [
      "Survivor — Destiny's Child. Tu sors en slow motion et les pigeons s'ecartent.",
      "Lose Yourself — Eminem. Une chance, une seule, l'occasion ne repassera pas.",
      "No Scrubs — TLC. Pour te rappeler que t'as des standards et que tu les maintiens.",
    ],
    placeholder: "T'inquiete y'a pas de tracking",
  },
  {
    id: 7,
    text: "T'as retrouve un post sur ton wall Facebook de 2008. Ecrit par toi.",
    options: [
      "Cringe total mais avec tendresse. Cette fille avait du courage meme si elle avait tort sur tout.",
      "Franchement c'etait bien. T'assumais pas assez a l'epoque.",
      "Tu fais une story avec. Le vintage ca se monetise.",
    ],
    placeholder: "Ouais moi non plus je sais pas ce que ca veut dire cringe mais ca sonne cool",
  },
  {
    id: 8,
    text: "Tu rates quelque chose d'important. Vraiment important. Genre ton vol pour Ibiza, ton premier date avec ton crush ultime, ta coupe mulet.",
    options: [
      "Passe en 20 minutes. L'autocommiseration c'est vraiment pas ton truc et les cheveux ca repousse.",
      "T'appelles ta mere, ta BFF, ton meilleur collegue, ton chat. Verbaliser ca aide. Et franchement c'est une bonne histoire au final.",
      "Tu disparais du radar. Tu reviens quand t'as digere. (Delai variable.)",
    ],
    placeholder: "Vraiment ?",
  },
  {
    id: 9,
    text: "T'as un secret que tu peux absolument pas reveler. Mais il est vraiment genial.",
    options: [
      "Tu le gardes. T'as une discipline d'acier et la reputation d'etre une tombe, c'est d'ailleurs comme ca que tu sais tout.",
      "Ah c'etait un secret ?? Oupsi trop tard sorry, mais franchement tu te sens pas mieux maintenant que tout le monde le sait ?",
      "Tu le dis a une personne. Elle le dit a deux. Dans 48h c'est regle et c'est pas de ta faute.",
    ],
    placeholder: "Fais pas genre...",
  },
  {
    id: 10,
    text: "T'as clique \"acheter\" a 2h du matin sur un truc dont t'avais pas besoin. (Un 3eme sac Lemaire mais c'est la version mini trop cuuute, un body marine serre pas en solde, une montre Cartier.. nan je dec on a toujours besoin d'une montre Cartier)",
    options: [
      "Tu assumes. C'est pas une depense c'est un investissement.",
      "Tu annules a 8h du matin avec la honte du lendemain. Le walk of shame version e-commerce.",
      "Tu gardes. Il est la, il te juge depuis l'etagere. Vous avez trouve un equilibre.",
    ],
    placeholder: "Fais pas genre tu l'offres a ta mere",
  },
  {
    id: 11,
    text: "Tu vois deux personnes de ta vie qui se connaissent pas se rencontrer pour la premiere fois.",
    options: [
      "Tu regardes. C'est fascinant de voir comment les gens te percoivent selon leur version de toi.",
      "Tu controles l'ambiance, tu cadres les sujets, tu geres. Pas question que ca parte n'importe ou.",
      "Tu t'eclipses. Ces deux mondes devaient pas se toucher et t'aurais du y penser avant.",
    ],
    placeholder: "Autre chose ?",
  },
  {
    id: 12,
    text: "Sur ta pierre tombale sera grave :",
    options: [
      '"Imprevisible. On ne s\'est jamais ennuye."',
      '"La quand ca comptait. Les autres fois aussi d\'ailleurs."',
      '"Toujours un coup d\'avance. Meme sur ca."',
    ],
    placeholder: "Reflechis pas trop trop c'est fictif.",
  },
];
