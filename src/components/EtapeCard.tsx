"use client";

import { Etape, Coords } from "@/lib/types";
import { haversineDistance } from "@/lib/geo";
import { useTheme } from "@/lib/ThemeContext";
import EnigmeForm from "./EnigmeForm";

interface EtapeCardProps {
  etape: Etape;
  userPosition: Coords | null;
  onCorrect: () => void;
}

export default function EtapeCard({ etape, userPosition, onCorrect }: EtapeCardProps) {
  const t = useTheme();
  const distance = userPosition
    ? haversineDistance(userPosition, etape.coords)
    : null;
  const isInZone = distance !== null && distance <= etape.validation_radius;

  return (
    <div className={`rounded-3xl overflow-hidden border ${t.enigmeCardBorder} ${t.enigmeCardBg} shadow-sm`}>

      {/* ── Header ─────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className={`text-lg font-bold leading-snug flex-1 ${t.titleColor}`}>
            {etape.nom}
          </h2>

          {/* Badge GPS */}
          {distance !== null ? (
            <span className={`shrink-0 inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full ${
              isInZone ? t.badgeInZone : t.badgeOutZone
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isInZone ? "bg-green-400 animate-pulse" : "bg-orange-400"}`} />
              {isInZone ? "Vous y êtes !" : `${Math.round(distance)} m`}
            </span>
          ) : (
            <span className={`shrink-0 inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full ${t.badgeGps}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
              GPS…
            </span>
          )}
        </div>

        <p className={`text-xs mt-1.5 leading-relaxed ${t.subtitleColor}`}>
          {etape.instruction}
        </p>
      </div>

      {/* ── Histoire ───────────────────────────────── */}
      <div className={`mx-4 mb-4 rounded-2xl px-4 py-3.5 ${t.storyBg}`}>
        <div className={`text-xl leading-none mb-1 opacity-40 ${t.storyText}`}>&ldquo;</div>
        <p className={`text-sm italic leading-relaxed ${t.storyText}`}>
          {etape.histoire}
        </p>
        <div className={`text-xl leading-none mt-1 text-right opacity-40 ${t.storyText}`}>&rdquo;</div>
      </div>

      {/* ── Séparateur ─────────────────────────────── */}
      <div className={`mx-4 border-t ${t.enigmeCardBorder} mb-4`} />

      {/* ── Énigme ─────────────────────────────────── */}
      <div className="px-5 pb-5">
        {isInZone ? (
          <EnigmeForm enigme={etape.enigme} onCorrect={onCorrect} />
        ) : (
          <div className="flex flex-col items-center py-6 gap-3 text-center">
            <span className="text-4xl">{t.lockedIcon}</span>
            <div>
              <p className={`text-sm font-semibold ${t.lockedText}`}>
                Rapproche-toi pour débloquer l&apos;énigme
              </p>
              {distance !== null && (
                <>
                  <p className={`text-xs mt-1 ${t.lockedSubtext}`}>
                    Plus que {Math.round(distance)} mètres…
                  </p>
                  {/* Barre de proximité */}
                  <div className={`mt-3 mx-auto w-32 h-1.5 rounded-full ${t.progressBg} overflow-hidden`}>
                    <div
                      className={`h-full ${t.progressFill} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.min(100, (etape.validation_radius / distance) * 100)}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
