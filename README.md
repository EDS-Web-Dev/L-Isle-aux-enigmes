# L'Isle aux Énigmes

PWA de chasses au trésor géolocalisées à L'Isle-Jourdain (Gers). Chaque
aventure ("parcours") guide le joueur d'étape en étape via GPS ; à chaque
étape, une énigme se débloque une fois dans la zone de validation.

Stack : Next.js (App Router) · TypeScript · Tailwind CSS · Leaflet /
react-leaflet · next-pwa.

## Démarrer

```bash
npm install
npm run dev      # serveur de dev sur http://localhost:3000
npm run build    # build de production
npm run lint     # ESLint
```

## Ajouter un parcours

Un parcours est un fichier JSON dans `public/`, chargé au runtime via
`/chasse?parcours=<nom-du-fichier-sans-extension>`. Il doit respecter le
schéma `Parcours` défini dans `src/lib/types.ts` :

```jsonc
{
  "id": "islo-mon-parcours-001",
  "version": "1.0",
  "titre": "Titre affiché",
  "description": "...",
  "ville": "L'Isle-Jourdain",
  "difficulty": 1,
  "age_conseille": "6-9 ans",     // optionnel
  "temps_estime": "30 min",       // optionnel
  "config": {
    "unite_distance": "metres",
    "precision_gps_requise": 20,
    "theme_color": "#2ecc71"
  },
  "point_depart": {                // optionnel : affiche un écran d'intro avant l'étape 1
    "nom": "...",
    "coords": { "lat": 0, "lng": 0 },
    "texte_bienvenue": "...",
    "consigne_action": "..."
  },
  "etapes": [
    {
      "id": "etape-1",
      "nom": "...",
      "instruction": "...",
      "coords": { "lat": 0, "lng": 0 },
      "validation_radius": 20,     // en mètres
      "histoire": "...",
      "enigme": {
        "type": "TEXT",           // "TEXT" | "NUMBER" | "CHOICE"
        "question": "...",
        "reponse": "<hash>",      // voir ci-dessous — jamais en clair
        "indice": "...",
        "message_succes": "...",
        "options": ["...", "..."] // uniquement pour type: "CHOICE"
      }
    }
  ],
  "final": {
    "titre": "...",
    "message": "...",
    "code_validation": "MON-CODE-2026",
    "recompense": "..."           // optionnel
  }
}
```

### Réponses hachées

Le champ `enigme.reponse` ne doit **jamais** contenir la réponse en clair :
n'importe qui peut ouvrir `/mon-parcours.json` directement dans le
navigateur, ce qui révélerait toutes les solutions. Il doit contenir le hash
SHA-256 de la réponse normalisée (minuscules, sans accents, espaces
retirés — voir `src/lib/hash.ts`).

Pour générer un hash :

```bash
npm run hash -- "Ma Réponse"
```

Une énigme peut accepter plusieurs formulations : dans ce cas `reponse` est
un tableau de hashs (`["hash1", "hash2"]`).

### Brancher le parcours dans l'app

1. Ajouter une entrée dans `ADVENTURES` (`src/app/page.tsx`) pour qu'il
   apparaisse sur la page d'accueil.
2. Si le parcours a un thème visuel dédié (couleurs, photo de fond), l'ajouter
   dans `src/lib/themes.ts` (`getTheme()` et, si besoin, `PARCOURS_PHOTOS`).

## Structure du projet

```
src/app/            pages Next.js (accueil, /chasse)
src/components/      composants UI (carte, formulaire d'énigme, écrans intro/fin...)
src/hooks/           géolocalisation, progression (localStorage)
src/lib/             types, thèmes, calcul de distance, hash des réponses
public/*.json        les parcours (contenu du jeu)
```
