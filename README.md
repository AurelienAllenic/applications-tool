# JobTracker — Suivi de candidatures

Une application web moderne pour remplacer le tableau Excel de suivi de candidatures. Construite avec React, Tailwind CSS et LocalStorage.

---

## Aperçu

JobTracker te permet de centraliser et piloter toute ta recherche d'emploi depuis une interface claire, responsive et entièrement locale (aucun compte, aucun serveur).

**Fonctionnalités principales :**

- **Dashboard de statistiques** — cartes de score (Total, En attente, Relancés, Entretiens, Acceptés, Refusés) + graphique circulaire de répartition avec taux de conversion
- **Ajout / édition** — formulaire complet en modale avec 10 champs (entreprise, poste, localisation, date d'envoi, lien de l'offre, contact/recruteur, salaire, statut, date de relance, commentaires)
- **Changement de statut en un clic** — dropdown sur desktop, bottom sheet sur mobile
- **Recherche** — par nom d'entreprise, intitulé du poste ou localisation
- **Filtres & tri** — par statut (chips), par date d'ajout / d'envoi / entreprise / salaire, sens croissant ou décroissant
- **Double vue** — tableau sur desktop, cartes sur mobile (bascule manuelle sur desktop)
- **Export / Import JSON** — sauvegarde et restauration des données hors du navigateur
- **Persistance** — toutes les données sont stockées dans le LocalStorage du navigateur

---

## Stack technique

| Outil | Rôle |
|---|---|
| [React 19](https://react.dev) + [Vite 8](https://vite.dev) | Framework UI + bundler |
| [Tailwind CSS v4](https://tailwindcss.com) | Styles utilitaires |
| [Lucide React](https://lucide.dev) | Icônes |
| [Recharts](https://recharts.org) | Graphique circulaire |
| LocalStorage | Persistance des données côté client |
| TypeScript | Typage statique |

---

## Installation & démarrage

### Prérequis

- [Node.js](https://nodejs.org) v18 ou supérieur
- npm v9 ou supérieur (inclus avec Node)

### Cloner et lancer

```bash
# 1. Cloner le dépôt
git clone https://github.com/TON_USERNAME/applications-dashboard.git
cd applications-dashboard

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev
```

L'application est disponible sur **http://localhost:5173** (ou le port suivant si déjà occupé).

### Autres commandes

```bash
# Build de production (génère le dossier dist/)
npm run build

# Prévisualiser le build de production localement
npm run preview
```

---

## Déploiement sur Vercel

Le projet est prêt pour Vercel grâce au fichier `vercel.json` inclus (redirige toutes les URLs vers `index.html` pour éviter les 404 lors de rechargements).

### Via l'interface Vercel (recommandé)

1. Pousser le projet sur GitHub / GitLab / Bitbucket
2. Aller sur [vercel.com](https://vercel.com) → **New Project**
3. Importer le dépôt
4. Laisser les paramètres par défaut (Vercel détecte automatiquement Vite)
5. Cliquer sur **Deploy**

### Via la CLI Vercel

```bash
# Installer la CLI Vercel (une seule fois)
npm install -g vercel

# Déployer
vercel
```

---

## Structure du projet

```
src/
├── main.tsx                      # Point d'entrée React
├── App.tsx                       # Shell principal, état global, logique de filtrage/tri
├── index.css                     # Tailwind v4 + variables CSS + animations
├── types.ts                      # Types TypeScript + configuration des statuts (couleurs)
├── hooks/
│   └── useApplications.ts        # CRUD LocalStorage + export/import JSON
└── components/
    ├── StatsDashboard.tsx         # Cartes stats + graphique Recharts
    ├── FilterBar.tsx              # Barre de recherche, filtres, tri, toggle vue
    ├── ApplicationModal.tsx       # Modale d'ajout / édition (10 champs)
    ├── ApplicationTable.tsx       # Vue tableau (desktop)
    ├── ApplicationCard.tsx        # Vue cartes (mobile)
    ├── StatusPicker.tsx           # Sélecteur de statut (dropdown desktop / bottom sheet mobile)
    └── StatusBadge.tsx            # Badge coloré réutilisable
```

---

## Statuts disponibles

| Statut | Couleur |
|---|---|
| En attente | Ambre |
| Relancé | Violet |
| Entretien | Bleu |
| Offre reçue | Teal |
| Accepté | Vert |
| Refusé | Rouge |

Pour ajouter ou modifier un statut, éditer le fichier `src/types.ts` — la clé `STATUS_CONFIG` contient les labels et les classes Tailwind associées.

---

## Export / Import des données

Les données sont stockées dans le LocalStorage sous la clé `jobtracker_applications`. Pour les sauvegarder hors du navigateur (changement d'ordinateur, réinitialisation du navigateur…) :

- **Exporter** : bouton **Exporter** dans le header → télécharge un fichier `jobtracker_YYYY-MM-DD.json`
- **Importer** : bouton **Importer** → sélectionner un fichier JSON préalablement exporté

> Le format JSON est un tableau d'objets `Application` tel que défini dans `src/types.ts`.

---

## Licence

Projet personnel — libre d'utilisation et de modification.
