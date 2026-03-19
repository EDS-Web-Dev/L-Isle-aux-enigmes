"use client";

import Link from "next/link";
import { Parcours } from "@/lib/types";
import { useTheme } from "@/lib/ThemeContext";

interface IntroScreenProps {
  parcours: Parcours;
  onStart: () => void;
}

export default function IntroScreen({ parcours, onStart }: IntroScreenProps) {
  const t = useTheme();
  const pd = parcours.point_depart!;

  return (
    <div className={`min-h-dvh flex flex-col ${t.pageBg} ${t.fontClass}`}>
      {/* Header */}
      <div className="shrink-0 px-4 pt-3 pb-2 flex items-center gap-3">
        <Link href="/" className={`${t.backColor} active:opacity-70 transition-opacity`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
          </svg>
        </Link>
        <h1 className={`flex-1 text-sm font-bold truncate ${t.titleColor}`}>
          {parcours.titre}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center space-y-6">
        {/* Icon */}
        <div className="text-5xl">
          {t.id === "historic" ? "🏰" : t.id === "spy" ? "📡" : t.id === "fairy" ? "✨" : "🗺️"}
        </div>

        {/* Title */}
        <div>
          <p className={`text-xs uppercase tracking-widest mb-2 ${t.subtitleColor}`}>
            Point de départ
          </p>
          <h2 className={`text-xl font-bold ${t.titleColor}`}>{pd.nom}</h2>
        </div>

        {/* Welcome text */}
        <p className={`text-sm leading-relaxed max-w-xs ${t.storyText} ${t.storyBg} rounded-xl px-4 py-3 italic`}>
          {pd.texte_bienvenue}
        </p>

        {/* Action instruction */}
        <p className={`text-sm font-medium ${t.questionText}`}>
          {pd.consigne_action}
        </p>

        {/* Info tags */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className={`text-[10px] px-2.5 py-1 rounded-full ${t.enigmeCardBg} border ${t.enigmeCardBorder} ${t.subtitleColor}`}>
            {parcours.etapes.length} étapes
          </span>
          {parcours.temps_estime && (
            <span className={`text-[10px] px-2.5 py-1 rounded-full ${t.enigmeCardBg} border ${t.enigmeCardBorder} ${t.subtitleColor}`}>
              {parcours.temps_estime}
            </span>
          )}
          {parcours.age_conseille && (
            <span className={`text-[10px] px-2.5 py-1 rounded-full ${t.enigmeCardBg} border ${t.enigmeCardBorder} ${t.subtitleColor}`}>
              {parcours.age_conseille}
            </span>
          )}
        </div>
      </div>

      {/* Start button (fixed bottom) */}
      <div className="shrink-0 px-6 pb-8 pt-4">
        <button
          onClick={onStart}
          className={`w-full ${t.submitBg} ${t.submitText} font-bold text-lg py-4 rounded-2xl
            shadow-lg active:scale-95 transition-transform`}
        >
          {t.id === "historic" ? "Débuter l'enquête" : t.id === "spy" ? "Lancer la mission" : t.id === "fairy" ? "C'est parti !" : "Commencer"}
        </button>
      </div>
    </div>
  );
}
