export interface Coords {
  lat: number;
  lng: number;
}

export interface Enigme {
  type: "TEXT" | "NUMBER" | "CHOICE";
  question: string;
  reponse: string | string[];
  indice: string;
  message_succes: string;
  options?: string[];
}

export interface Etape {
  id: string;
  nom: string;
  instruction: string;
  coords: Coords;
  validation_radius: number;
  histoire: string;
  enigme: Enigme;
}

export interface Final {
  titre: string;
  message: string;
  code_validation: string;
  image_fin?: string;
  recompense?: string;
}

export interface ParcoursConfig {
  unite_distance: string;
  precision_gps_requise: number;
  theme_color: string;
}

export interface PointDepart {
  nom: string;
  coords: Coords;
  texte_bienvenue: string;
  image_intro?: string;
  consigne_action: string;
}

export interface Parcours {
  id: string;
  version: string;
  titre: string;
  description: string;
  ville: string;
  difficulty: number;
  age_conseille?: string;
  temps_estime?: string;
  config: ParcoursConfig;
  point_depart?: PointDepart;
  etapes: Etape[];
  final: Final;
}
