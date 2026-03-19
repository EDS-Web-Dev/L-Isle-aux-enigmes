"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ── Palette ────────────────────────────────────────────
   #C44A3A  rouge brique
   #D97A2B  orange
   #F2D479  or / fond clair
   #6FAF4F  vert
──────────────────────────────────────────────────────── */

interface AdventureInfo {
  id: string;
  titre: string;
  description: string;
  difficulty: number;
  age_conseille?: string;
  temps_estime?: string;
  etapes: unknown[];
  point_depart?: { coords?: { lat: number; lng: number } };
}

type Theme = "histoire" | "feerie" | "espion";

interface AdventureMeta {
  file: string;
  emoji: string;
  illustration: string;
  photo?: string;
  tags: string[];
  sector: string;
  theme: Theme;
}

interface ComingSoonItem {
  emoji: string;
  titre: string;
  sector: string;
  tags: string[];
  lat: number;
  lng: number;
}

interface ExtendedDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}
interface DeviceOrientationEventStatic extends EventTarget {
  requestPermission?: () => Promise<"granted" | "denied">;
}

/* ── Thèmes visuels ─────────────────────────────────── */
const THEME_CONFIG = {
  histoire: {
    cardBg: "#fdf0d5",
    bannerGradient: "linear-gradient(135deg, #8b6914 0%, #4a3000 100%)",
    borderColor: "#4a7fbf",
    glowColor: "rgba(74,127,191,0.65)",
    accentColor: "#4a7fbf",
    textColor: "#2d1a06",
    mutedColor: "#8a6a3a",
    tagBg: "rgba(74,127,191,0.12)",
    completedIcon: "📜",
    completedText: "Parchemin découvert !",
    stamp: "DÉCOUVERT",
  },
  feerie: {
    cardBg: "#fce8f8",
    bannerGradient: "linear-gradient(135deg, #bf4abf 0%, #5a1a6e 100%)",
    borderColor: "#9b4abf",
    glowColor: "rgba(155,74,191,0.65)",
    accentColor: "#9b4abf",
    textColor: "#2d0a38",
    mutedColor: "#7a3a8a",
    tagBg: "rgba(155,74,191,0.12)",
    completedIcon: "🌟",
    completedText: "Magie accomplie !",
    stamp: "✨ MAGIQUE",
  },
  espion: {
    cardBg: "#0d1117",
    bannerGradient: "linear-gradient(135deg, #D97A2B 0%, #1a0a00 100%)",
    borderColor: "#D97A2B",
    glowColor: "rgba(217,122,43,0.65)",
    accentColor: "#D97A2B",
    textColor: "#e0d5c0",
    mutedColor: "#8a7a5a",
    tagBg: "rgba(217,122,43,0.12)",
    completedIcon: "🕵️",
    completedText: "Mission accomplie !",
    stamp: "TOP SECRET",
  },
} as const;

/* ── Adventures data ────────────────────────────────── */
const ADVENTURES: AdventureMeta[] = [
  {
    file: "legrimoirperdudeclaudeauge",
    emoji: "📖",
    illustration: "📖✒️🔍",
    photo: "/icons/livres.jpg",
    tags: ["Historique"],
    sector: "Secteur Centre",
    theme: "histoire",
  },
  {
    file: "goutermagiquelac",
    emoji: "🧚",
    illustration: "🌸🧚✨",
    photo: "/icons/fée.jpg",
    tags: ["Magie"],
    sector: "Secteur Lac",
    theme: "feerie",
  },
  {
    file: "operationlisle",
    emoji: "🕵️",
    illustration: "🕵️🔐💻",
    photo: "/icons/top_secret.jpg",
    tags: ["Espionnage"],
    sector: "Secteur Centre",
    theme: "espion",
  },
];

const COMING_SOON: ComingSoonItem[] = [
  { emoji: "🗿",   titre: "Le Totem Perdu du Lac",       sector: "Secteur Lac",    tags: ["Famille"],    lat: 43.610, lng: 1.072 },
  { emoji: "🔔",   titre: "Maître Campanaire",            sector: "Secteur Centre", tags: ["Historique"], lat: 43.616, lng: 1.083 },
  { emoji: "🛰️",  titre: "Opération L.I.S.L.E. : Lac",  sector: "Secteur Lac",    tags: ["Espionnage"], lat: 43.609, lng: 1.071 },
  { emoji: "🏴‍☠️", titre: "Le Trésor du Capitaine Save", sector: "Secteur Port",   tags: ["Aventure"],   lat: 43.611, lng: 1.069 },
  { emoji: "🦎",   titre: "Les Gardiens du Lac",          sector: "Secteur Lac",    tags: ["Nature"],     lat: 43.608, lng: 1.073 },
];

/* ── Helpers ────────────────────────────────────────── */
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDist(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

function headingToLabel(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return dirs[Math.round(deg / 45) % 8];
}

function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/* ── Compass ────────────────────────────────────────── */
function Compass({ heading, targetBearing, targetEmoji }: {
  heading: number | null;
  targetBearing: number | null;
  targetEmoji?: string;
}) {
  const rotation = heading !== null ? -heading : 0;
  const targetRotation = targetBearing !== null && heading !== null
    ? (targetBearing - heading + 360) % 360
    : null;

  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="relative" style={{ width: 220, height: 220 }}>

        {/* Anneau extérieur laiton */}
        <div className="absolute inset-0 rounded-full" style={{
          background: "linear-gradient(135deg, #d4a820 0%, #8B6914 30%, #c9991a 55%, #6b4e10 80%, #d4a820 100%)",
          boxShadow: "0 6px 24px rgba(0,0,0,0.55), inset 0 2px 6px rgba(255,220,80,0.25)",
        }} />

        {/* Face parchemin */}
        <div className="absolute rounded-full" style={{
          inset: 10,
          background: "radial-gradient(circle at 38% 32%, #f2dfa0 0%, #d8b96a 55%, #a87830 100%)",
          boxShadow: "inset 0 3px 10px rgba(0,0,0,0.3)",
          border: "2px solid #7a5a10",
        }} />

        {/* Graduations */}
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="absolute" style={{
            top: "50%", left: "50%",
            width: i % 18 === 0 ? 3 : i % 6 === 0 ? 2 : 1,
            height: i % 18 === 0 ? 14 : i % 6 === 0 ? 9 : 5,
            background: i % 18 === 0 ? "#3d1a00" : "rgba(61,26,0,0.45)",
            borderRadius: 1,
            transform: `rotate(${i * 5}deg) translate(-50%, -98px)`,
            transformOrigin: "top center",
          }} />
        ))}

        {/* Rose des vents (tourne) */}
        <div className="absolute inset-0" style={{ transform: `rotate(${rotation}deg)`, transition: "transform 0.25s ease-out" }}>

          {/* Lettres cardinales */}
          {[
            { label: "N", style: { top: 22, left: "50%", transform: "translateX(-50%)", color: "#8B1010", fontSize: 17, fontWeight: 900, fontFamily: "Georgia, serif" } },
            { label: "S", style: { bottom: 22, left: "50%", transform: "translateX(-50%)", color: "#3d1a00", fontSize: 13, fontWeight: 700, fontFamily: "Georgia, serif", opacity: 0.75 } },
            { label: "E", style: { right: 20, top: "50%", transform: "translateY(-50%)", color: "#3d1a00", fontSize: 13, fontWeight: 700, fontFamily: "Georgia, serif", opacity: 0.75 } },
            { label: "O", style: { left: 20, top: "50%", transform: "translateY(-50%)", color: "#3d1a00", fontSize: 13, fontWeight: 700, fontFamily: "Georgia, serif", opacity: 0.75 } },
          ].map(({ label, style }) => (
            <div key={label} className="absolute" style={style}>{label}</div>
          ))}

          {/* Aiguille Nord — losange rouge */}
          <div className="absolute left-1/2 top-1/2" style={{ marginLeft: -7, marginTop: -72 }}>
            <div style={{ width: 0, height: 0, borderLeft: "7px solid transparent", borderRight: "7px solid transparent", borderBottom: "64px solid #C44A3A", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.35))" }} />
          </div>
          {/* Aiguille Sud — losange parchemin foncé */}
          <div className="absolute left-1/2 top-1/2" style={{ marginLeft: -6, marginTop: 6 }}>
            <div style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "52px solid #7a5010", filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }} />
          </div>
        </div>

        {/* Aiguille cible (mission) */}
        {targetRotation !== null && (
          <div className="absolute inset-0" style={{ transform: `rotate(${targetRotation}deg)`, transition: "transform 0.3s ease-out" }}>
            <div className="absolute left-1/2 top-1/2" style={{ marginLeft: -4, marginTop: -80 }}>
              <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderBottom: "70px solid rgba(111,175,79,0.92)", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
            </div>
            {targetEmoji && (
              <div className="absolute left-1/2" style={{ top: "calc(50% - 96px)", transform: "translateX(-50%)", fontSize: 15 }}>{targetEmoji}</div>
            )}
          </div>
        )}

        {/* Rivet central laiton */}
        <div className="absolute top-1/2 left-1/2 rounded-full z-10" style={{
          width: 16, height: 16, marginTop: -8, marginLeft: -8,
          background: "radial-gradient(circle at 35% 30%, #f0d060, #8B6914)",
          boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
          border: "1.5px solid #5a3a08",
        }} />

        {/* Triangle repère en haut */}
        <div className="absolute left-1/2" style={{ top: 4, transform: "translateX(-50%)" }}>
          <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "10px solid #c9991a" }} />
        </div>
      </div>

      {/* Affichage cap */}
      <div className="text-center space-y-1">
        {heading !== null ? (
          <>
            <div>
              <span className="text-2xl font-black" style={{ color: "#F2D479", fontFamily: "Georgia, serif" }}>{headingToLabel(heading)}</span>
              <span className="text-sm font-bold ml-2" style={{ color: "rgba(242,212,121,0.65)" }}>{Math.round(heading)}°</span>
            </div>
            {targetBearing !== null && (
              <p className="text-[10px] font-semibold" style={{ color: "#6FAF4F" }}>🎯 Mission à {Math.round(targetBearing)}°</p>
            )}
          </>
        ) : (
          <span className="text-sm animate-pulse" style={{ color: "rgba(242,212,121,0.5)", fontFamily: "Georgia, serif" }}>Calibrage…</span>
        )}
      </div>
    </div>
  );
}

/* ── DifficultyStars ────────────────────────────────── */
function DifficultyStars({ value, color }: { value: number; color: string }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <span key={i} className="text-sm" style={{ color: i <= value ? color : "rgba(0,0,0,0.15)" }}>★</span>
      ))}
    </span>
  );
}

/* ── Illustrations SVG par thème ───────────────────── */
function IllustrationHistoire({ filter }: { filter: string }) {
  return (
    <svg width="140" height="120" viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter }}>
      {/* Parchemin */}
      <rect x="20" y="10" width="100" height="80" rx="4" fill="#f5e6c0" stroke="#8B6914" strokeWidth="2"/>
      <path d="M20 18 Q10 18 10 28 Q10 38 20 38" fill="#e8d09a" stroke="#8B6914" strokeWidth="1.5"/>
      <path d="M120 18 Q130 18 130 28 Q130 38 120 38" fill="#e8d09a" stroke="#8B6914" strokeWidth="1.5"/>
      <path d="M20 72 Q10 72 10 82 Q10 92 20 92" fill="#e8d09a" stroke="#8B6914" strokeWidth="1.5"/>
      <path d="M120 72 Q130 72 130 82 Q130 92 120 92" fill="#e8d09a" stroke="#8B6914" strokeWidth="1.5"/>
      {/* Lignes de texte */}
      <line x1="35" y1="30" x2="105" y2="30" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="35" y1="40" x2="105" y2="40" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      <line x1="35" y1="50" x2="90" y2="50" stroke="#8B6914" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
      {/* Sceau */}
      <circle cx="70" cy="72" r="14" fill="#C44A3A" opacity="0.85"/>
      <circle cx="70" cy="72" r="10" fill="none" stroke="#f5e6c0" strokeWidth="1"/>
      <text x="70" y="77" textAnchor="middle" fill="#f5e6c0" fontSize="10" fontWeight="bold" fontFamily="Georgia, serif">✦</text>
      {/* Plume */}
      <path d="M95 15 Q115 5 118 25 Q105 20 98 35 Q100 22 95 15Z" fill="#d4a820" opacity="0.9"/>
      <line x1="98" y1="35" x2="88" y2="60" stroke="#7a5010" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function IllustrationFeerie({ filter }: { filter: string }) {
  return (
    <svg width="140" height="120" viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter }}>
      {/* Baguette magique */}
      <line x1="30" y1="95" x2="90" y2="35" stroke="#7a3a8a" strokeWidth="4" strokeLinecap="round"/>
      <line x1="30" y1="95" x2="90" y2="35" stroke="#c084fc" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
      {/* Étoile au bout */}
      <polygon points="90,20 93,30 104,30 95,37 98,47 90,40 82,47 85,37 76,30 87,30" fill="#F2D479" stroke="#bf4abf" strokeWidth="1"/>
      {/* Étincelles */}
      <circle cx="112" cy="25" r="3" fill="#F2D479" opacity="0.9"/>
      <circle cx="120" cy="45" r="2" fill="#c084fc" opacity="0.8"/>
      <circle cx="105" cy="55" r="2.5" fill="#F2D479" opacity="0.7"/>
      <circle cx="25" cy="40" r="2" fill="#c084fc" opacity="0.6"/>
      <circle cx="18" cy="60" r="3" fill="#F2D479" opacity="0.8"/>
      <circle cx="35" cy="20" r="2" fill="#c084fc" opacity="0.7"/>
      {/* Petites étoiles */}
      <polygon points="50,15 51.5,20 57,20 52.5,23 54,28 50,25 46,28 47.5,23 43,20 48.5,20" fill="#F2D479" opacity="0.6" transform="scale(0.7) translate(22,5)"/>
      <polygon points="118,70 119,74 123,74 120,76 121,80 118,78 115,80 116,76 113,74 117,74" fill="#c084fc" opacity="0.7" transform="scale(0.6) translate(80,-20)"/>
      {/* Nuage féérique */}
      <ellipse cx="38" cy="85" rx="18" ry="10" fill="#fce8f8" opacity="0.5"/>
      <ellipse cx="52" cy="80" rx="14" ry="9" fill="#fce8f8" opacity="0.5"/>
      <ellipse cx="64" cy="84" rx="12" ry="8" fill="#fce8f8" opacity="0.4"/>
    </svg>
  );
}

function IllustrationEspion({ filter }: { filter: string }) {
  return (
    <svg width="140" height="120" viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter }}>
      {/* Loupe */}
      <circle cx="65" cy="55" r="32" fill="none" stroke="#D97A2B" strokeWidth="4"/>
      <circle cx="65" cy="55" r="32" fill="rgba(217,122,43,0.08)"/>
      <circle cx="65" cy="55" r="24" fill="none" stroke="#D97A2B" strokeWidth="1.5" opacity="0.4"/>
      {/* Reflet loupe */}
      <path d="M50 38 Q55 33 62 35" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.4"/>
      {/* Manche */}
      <line x1="88" y1="78" x2="115" y2="105" stroke="#D97A2B" strokeWidth="7" strokeLinecap="round"/>
      <line x1="88" y1="78" x2="115" y2="105" stroke="#f0a050" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
      {/* Empreinte digitale dans la loupe */}
      <circle cx="65" cy="55" r="8" fill="none" stroke="#D97A2B" strokeWidth="1.2" opacity="0.6"/>
      <circle cx="65" cy="55" r="13" fill="none" stroke="#D97A2B" strokeWidth="1" opacity="0.4"/>
      <circle cx="65" cy="55" r="18" fill="none" stroke="#D97A2B" strokeWidth="0.8" opacity="0.25"/>
      {/* Point central */}
      <circle cx="65" cy="55" r="3" fill="#D97A2B" opacity="0.8"/>
      {/* Lignes de scan */}
      <line x1="38" y1="45" x2="92" y2="45" stroke="#D97A2B" strokeWidth="0.8" opacity="0.3"/>
      <line x1="36" y1="55" x2="94" y2="55" stroke="#D97A2B" strokeWidth="0.8" opacity="0.3"/>
      <line x1="38" y1="65" x2="92" y2="65" stroke="#D97A2B" strokeWidth="0.8" opacity="0.3"/>
    </svg>
  );
}

/* ── MissionCard — 3 états × 3 thèmes ──────────────── */
function MissionCard({ data, meta, progress, distM, alwaysAccessible = false }: {
  data: AdventureInfo;
  meta: AdventureMeta;
  progress: number;
  distM: number | null;
  alwaysAccessible?: boolean;
}) {
  const total = data.etapes.length;
  const done = progress >= total;
  const t = THEME_CONFIG[meta.theme];

  const state: "locked" | "near" | "active" | "completed" =
    done              ? "completed" :
    alwaysAccessible  ? "active"    :
    distM === null    ? "locked"    :
    distM <= 20       ? "active"    :
    distM <= 50       ? "near"      :
    "locked";

  const cardBorder =
    state === "active"    ? `3px solid ${t.borderColor}` :
    state === "near"      ? `2px solid ${t.borderColor}` :
    state === "completed" ? `2px solid ${t.accentColor}` :
    "2px solid rgba(0,0,0,0.08)";

  const cardShadow =
    state === "active"
      ? `0 0 24px ${t.glowColor}, 0 0 48px ${t.glowColor}`
      : "0 4px 16px rgba(0,0,0,0.12)";

  const bannerFilter =
    state === "locked" ? "grayscale(1) brightness(0.4)" :
    state === "near"   ? "grayscale(0.4) brightness(0.75)" :
    "none";

  return (
    <div className="rounded-3xl overflow-hidden transition-all duration-500 flex flex-col h-[420px]"
      style={{ border: cardBorder, boxShadow: cardShadow }}>

      {/* ── BANNIÈRE ── */}
      <div className="h-44 flex items-center justify-center relative overflow-hidden"
        style={{ background: t.bannerGradient }}>

        {/* Photo ou illustration SVG */}
        {meta.photo ? (
          <>
            <div className="absolute inset-0" style={{
              backgroundImage: `url('${meta.photo}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              filter: bannerFilter,
            }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${t.bannerGradient.includes("#0d") ? "rgba(13,17,23,0.55)" : "rgba(0,0,0,0.25)"} 0%, transparent 60%)` }} />
          </>
        ) : (
          <div className="relative z-10 transition-all duration-500">
            {meta.theme === "histoire" && <IllustrationHistoire filter={bannerFilter} />}
            {meta.theme === "feerie"   && <IllustrationFeerie   filter={bannerFilter} />}
            {meta.theme === "espion"   && <IllustrationEspion   filter={bannerFilter} />}
          </div>
        )}

        {/* LOCKED : overlay frosted glass + cadenas + distance */}
        {state === "locked" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}>
            <span className="text-4xl">🔒</span>
            {distM !== null && (
              <span className="text-sm font-extrabold px-3 py-1 rounded-full"
                style={{ background: "rgba(242,212,121,0.2)", color: "#F2D479" }}>
                📍 {Math.round(distM)} m
              </span>
            )}
          </div>
        )}

        {/* NEAR : badge distance + halo pulsant */}
        {state === "near" && (
          <>
            <div className="absolute inset-0 rounded-3xl animate-pulse pointer-events-none"
              style={{ boxShadow: `inset 0 0 20px ${t.borderColor}` }} />
            <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-extrabold z-20"
              style={{ background: t.borderColor, color: "white" }}>
              🔥 Plus que {Math.round(distM!)} m !
            </div>
          </>
        )}

        {/* ACTIVE : badge zone atteinte */}

        {/* Féérie : étincelles quand actif */}
        {state === "active" && meta.theme === "feerie" && (
          <>
            {[
              { top: "15%", left: "12%", delay: "0s" },
              { top: "20%", left: "75%", delay: "0.4s" },
              { top: "55%", left: "20%", delay: "0.7s" },
              { top: "65%", left: "80%", delay: "0.2s" },
              { top: "40%", left: "50%", delay: "1s" },
            ].map((pos, i) => (
              <span key={i} className="absolute text-base animate-ping z-10 pointer-events-none"
                style={{ top: pos.top, left: pos.left, animationDelay: pos.delay, animationDuration: "1.6s" }}>
                ✨
              </span>
            ))}
          </>
        )}

        {/* Histoire : effet parchemin overlay subtil quand actif */}
        {state === "active" && meta.theme === "histoire" && (
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(242,212,121,0.5) 28px, rgba(242,212,121,0.5) 29px)" }} />
        )}

        {/* Espion : lignes de scan quand actif */}
        {state === "active" && meta.theme === "espion" && (
          <div className="absolute inset-0 opacity-15 pointer-events-none"
            style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(217,122,43,0.6) 3px, rgba(217,122,43,0.6) 4px)" }} />
        )}

        {/* COMPLETED : trophée + stamp */}
        {state === "completed" && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2"
            style={{ background: "rgba(0,0,0,0.45)" }}>
            <span className="text-5xl drop-shadow-lg">{t.completedIcon}</span>
            <span className="text-xs font-extrabold px-3 py-1 rounded-full"
              style={{ background: t.accentColor, color: "white", transform: "rotate(-4deg)", display: "inline-block" }}>
              {t.stamp}
            </span>
          </div>
        )}
      </div>

      {/* ── CONTENU ── */}
      <div className="p-4 flex flex-col gap-2.5 flex-1" style={{ background: t.cardBg }}>

        {/* Titre + tags (tous états sauf completed où c'est réorganisé) */}
        {state !== "completed" && (
          <div>
            <h3 className={`font-extrabold leading-snug ${state === "active" ? "text-base" : "text-sm"}`}
              style={{ color: t.textColor }}>
              {data.titre}
            </h3>
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {meta.tags.map((tag) => (
                <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: t.tagBg, color: t.accentColor }}>{tag}</span>
              ))}
              {data.age_conseille && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.07)", color: t.mutedColor }}>
                  🧒 {data.age_conseille}
                </span>
              )}
              {data.temps_estime && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.07)", color: t.mutedColor }}>
                  ⏱️ {data.temps_estime}
                </span>
              )}
            </div>
          </div>
        )}

        {/* LOCKED : message encourageant */}
        {state === "locked" && (
          <p className="text-[11px] font-semibold text-center py-2.5 rounded-2xl"
            style={{ background: "rgba(0,0,0,0.06)", color: t.mutedColor }}>
            Rapproche-toi encore un peu pour débloquer l&apos;énigme !
          </p>
        )}

        {/* NEAR : message d'approche */}
        {state === "near" && (
          <p className="text-[11px] font-bold text-center py-2.5 rounded-2xl"
            style={{ background: t.tagBg, color: t.accentColor }}>
            Tu es sur la bonne voie, continue ! 🧭
          </p>
        )}

        {/* ACTIVE : meta-infos + gros bouton */}
        {state === "active" && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-[10px]" style={{ color: t.mutedColor }}>{total} étapes</span>
              <DifficultyStars value={data.difficulty} color={t.accentColor} />
            </div>
            <Link href={`/chasse?parcours=${meta.file}`}
              onClick={() => sessionStorage.removeItem(`islo-intro-seen-${meta.file}`)}
              className="mt-auto w-full text-white text-sm font-extrabold py-4 rounded-2xl tracking-wide uppercase text-center block transition-opacity active:opacity-80"
              style={{ background: t.accentColor, boxShadow: `0 6px 24px ${t.glowColor}` }}>
              🗺️ RÉSOUDRE L&apos;ÉNIGME
            </Link>
          </>
        )}

        {/* COMPLETED : résumé + rejouer */}
        {state === "completed" && (
          <>
            <div>
              <p className="text-xs font-bold" style={{ color: t.accentColor }}>{t.completedText}</p>
              <h3 className="text-sm font-extrabold mt-0.5" style={{ color: t.textColor }}>{data.titre}</h3>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(111,175,79,0.2)" }}>
              <div className="h-full rounded-full" style={{ width: "100%", background: "#6FAF4F" }} />
            </div>
            <Link href={`/chasse?parcours=${meta.file}`}
              className="w-full text-white text-xs font-extrabold py-2.5 rounded-xl tracking-wide uppercase text-center block"
              style={{ background: t.accentColor }}>
              🔁 Rejouer
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────── */
export default function Home() {
  const [adventures, setAdventures] = useState<(AdventureInfo | null)[]>(ADVENTURES.map(() => null));
  const [progresses, setProgresses] = useState<number[]>(ADVENTURES.map(() => 0));
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<"idle" | "loading" | "ok" | "denied">("idle");
  const [heading, setHeading] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const watchIdRef = useRef<number | null>(null);
  const orientationHandlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);
  const vibratedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    ADVENTURES.forEach((meta, i) => {
      fetch(`/${meta.file}.json`)
        .then((r) => r.json())
        .then((d: AdventureInfo) =>
          setAdventures((prev) => { const n = [...prev]; n[i] = d; return n; })
        );
      try {
        const raw = localStorage.getItem(`islo-progression-${meta.file}`);
        if (raw) {
          const p = JSON.parse(raw);
          setProgresses((prev) => { const n = [...prev]; n[i] = p.currentStepIndex ?? 0; return n; });
        }
      } catch { /* ignore */ }
    });
  }, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      if (orientationHandlerRef.current)
        window.removeEventListener("deviceorientation", orientationHandlerRef.current);
    };
  }, []);

  /* Vibration à ≤ 20 m (état actif) */
  useEffect(() => {
    if (!userPos) return;
    ADVENTURES.forEach((meta, i) => {
      const coords = adventures[i]?.point_depart?.coords;
      if (!coords) return;
      const distM = haversine(userPos.lat, userPos.lng, coords.lat, coords.lng) * 1000;
      if (distM <= 20 && !vibratedRef.current.has(meta.file)) {
        vibratedRef.current.add(meta.file);
        if ("vibrate" in navigator) navigator.vibrate([300, 100, 300, 100, 600]);
      }
    });
  }, [userPos, adventures]);

  function startCompass() {
    const handler = (e: DeviceOrientationEvent) => {
      const ext = e as ExtendedDeviceOrientationEvent;
      let h: number | null = null;
      if (ext.webkitCompassHeading != null) h = ext.webkitCompassHeading;
      else if (e.alpha != null) h = (360 - e.alpha) % 360;
      if (h !== null) setHeading(Math.round(h));
    };
    orientationHandlerRef.current = handler;
    window.addEventListener("deviceorientation", handler, true);
  }

  async function requestGeo() {
    setGeoStatus("loading");
    const DOE = DeviceOrientationEvent as unknown as DeviceOrientationEventStatic;
    if (typeof DOE.requestPermission === "function") {
      try { const p = await DOE.requestPermission(); if (p === "granted") startCompass(); }
      catch { /* ignore */ }
    } else {
      startCompass();
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => { setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setGeoStatus("ok"); },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  }

  const allLocations = ADVENTURES.map((a, i) => {
    const coords = adventures[i]?.point_depart?.coords ?? null;
    return {
      emoji: a.emoji, sector: a.sector, tags: a.tags,
      lat: coords?.lat ?? null, lng: coords?.lng ?? null,
      available: true as const, file: a.file,
      titre: adventures[i]?.titre ?? "Chargement…",
      dist: (userPos && coords)
        ? haversine(userPos.lat, userPos.lng, coords.lat, coords.lng)
        : null,
    };
  }).sort((a, b) => (a.dist ?? 999) - (b.dist ?? 999));

  const nearestAvailable = allLocations.find((l) => l.dist !== null);
  const targetBearing = nearestAvailable?.lat && nearestAvailable?.lng && userPos
    ? calculateBearing(userPos.lat, userPos.lng, nearestAvailable.lat, nearestAvailable.lng)
    : null;

  return (
    <main className="min-h-dvh overflow-x-hidden">

      {/* ══ BLOC 1 & 2 — Intro + Géolocalisation ══ */}
      <section className="relative overflow-hidden px-6 pt-14 pb-10"
        style={{ background: "linear-gradient(160deg, #C44A3A 0%, #D97A2B 100%)" }}>
        {/* Image boussole en fond */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "url('/icons/boussole.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.50 }} />
        {/* Overlay couleur */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(160deg, rgba(196,74,58,0.50) 0%, rgba(217,122,43,0.) 100%)" }} />

        {/* ── Titre ── */}
        <div className="relative text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight leading-none" style={{ color: "#F2D479", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>L&apos;ISLE</h1>
          <h2 className="text-2xl font-extrabold tracking-widest uppercase mt-1" style={{ color: "white", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>aux Énigmes</h2>
          <p className="mt-4 text-sm font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.9)", textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
            Pars à l&apos;aventure en famille !<br />
            <span className="font-bold" style={{ color: "#F2D479" }}>Explore L&apos;Isle-Jourdain 🌿</span>
          </p>
          <div className="flex justify-center gap-2 mt-6">
            {[
              {
                v: "8", l: "aventures",
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C44A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21"/>
                    <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
                  </svg>
                ),
              },
              {
                v: "20+", l: "énigmes",
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C44A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                ),
              },
              {
                v: "100%", l: "outdoor",
                icon: (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C44A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    <circle cx="9" cy="7" r="4"/>
                  </svg>
                ),
              },
            ].map(({ v, l, icon }) => (
              <div key={l} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: "rgba(242,212,121,0.5)", color: "#C44A3A", border: "1px solid rgba(242,212,121,0.3)" }}>
                {icon} {v} {l}
              </div>
            ))}
          </div>
        </div>

        {/* ── Séparateur ── */}
        <div className="relative flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: "rgba(242,212,121,0.25)" }} />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-base"
              style={{ background: "rgba(242,212,121,0.2)" }}>📍</div>
            <span className="text-sm font-extrabold" style={{ color: "#F2D479" }}>Aventures près de toi</span>
          </div>
          <div className="flex-1 h-px" style={{ background: "rgba(242,212,121,0.25)" }} />
        </div>

        {/* ── Contenu géoloc ── */}
        <div className="relative">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ background: "rgba(242,212,121,0.25)" }}>📍</div>
          <div>
            <h2 className="text-base font-extrabold leading-none" style={{ color: "#F2D479" }}>Aventures près de toi</h2>
            <p className="text-sm font-bold mt-0.5" style={{ color: "#6FAF4F", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>Découvre ce qui t&apos;entoure</p>
          </div>
        </div>

        {/* Boussole — toujours visible */}
        <div className="rounded-3xl mb-6 py-2"
          style={{ background: "rgba(61,26,16,0.6)", border: "1px solid rgba(242,212,121,0.2)" }}>
          <p className="text-center text-[10px] font-bold uppercase tracking-widest pt-3"
            style={{ color: "rgba(242,212,121,0.5)" }}>Direction du téléphone</p>
          <Compass heading={heading} targetBearing={targetBearing} targetEmoji={nearestAvailable?.emoji} />
          <p className="text-center text-[10px] pb-3" style={{ color: "rgba(242,212,121,0.4)" }}>
            📳 Vibration à moins de 20 m d&apos;une mission
          </p>
        </div>

        {geoStatus === "idle" && (
          <button onClick={requestGeo}
            className="w-full py-4 rounded-2xl font-extrabold text-sm flex flex-col items-center justify-center gap-1 shadow-lg active:scale-[0.98] transition-transform"
            style={{ background: "#F2D479", color: "#C44A3A" }}>
            <span className="text-center">Activer la localisation pour utiliser la boussole</span>
          </button>
        )}
        {geoStatus === "loading" && (
          <div className="w-full py-4 rounded-2xl flex items-center justify-center gap-3"
            style={{ background: "rgba(242,212,121,0.15)", border: "2px dashed rgba(242,212,121,0.4)" }}>
            <span className="text-xl animate-spin inline-block">🧭</span>
            <span className="text-sm font-bold" style={{ color: "#F2D479" }}>Localisation en cours…</span>
          </div>
        )}
        {geoStatus === "denied" && (
          <div className="py-3 px-4 rounded-2xl text-sm font-semibold text-center"
            style={{ background: "rgba(196,74,58,0.3)", color: "#F2D479" }}>
            📵 Localisation refusée — active-la dans les paramètres de ton navigateur
          </div>
        )}
        {geoStatus === "ok" && (
          <>
            {/* ── Debug position ── }
            {userPos && (
              <div className="rounded-2xl px-4 py-3 mb-4 space-y-1"
                style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(242,212,121,0.2)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(242,212,121,0.6)" }}>
                  📡 Ma position GPS
                </p>
                <p className="text-xs font-mono" style={{ color: "#F2D479" }}>
                  {userPos.lat.toFixed(6)}, {userPos.lng.toFixed(6)}
                </p>
                {ADVENTURES.map((meta, i) => {
                  const coords = adventures[i]?.point_depart?.coords;
                  if (!coords) return <p key={meta.file} className="text-[10px] font-mono" style={{ color: "rgba(242,212,121,0.5)" }}>{meta.emoji} Chargement…</p>;
                  const d = haversine(userPos.lat, userPos.lng, coords.lat, coords.lng) * 1000;
                  return (
                    <p key={meta.file} className="text-[10px] font-mono" style={{ color: "rgba(242,212,121,0.7)" }}>
                      {meta.emoji} {Math.round(d)} m — cible : {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                    </p>
                  );
                })}
              </div>
            )*/}

            <p className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: "white" }}>
              ✅ Missions à portée
            </p>
            {allLocations.filter((loc) => loc.dist !== null && loc.dist * 1000 <= 50).length === 0 && (
              <div className="py-4 px-4 rounded-2xl text-sm font-semibold text-center"
                style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.8)" }}>
                🧭 Aucune mission à moins de 50 m — continue à explorer !
              </div>
            )}
            <div className="space-y-2">
              {allLocations.filter((loc) => loc.dist !== null && loc.dist * 1000 <= 50).map((loc, idx) => {
                const isNear = loc.dist !== null && loc.dist * 1000 <= 20;
                return (
                  <div key={idx} className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${!loc.available ? "opacity-70" : ""}`}
                    style={{
                      background: isNear ? "rgba(111,175,79,0.9)" : "rgba(255,255,255,0.88)",
                      border: isNear ? "2px solid #6FAF4F" : "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}>
                    <span className={`text-2xl ${!loc.available ? "grayscale" : ""}`}>{loc.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: isNear ? "white" : "#3d1a10" }}>
                        {isNear && "📳 "}{loc.titre}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: isNear ? "rgba(255,255,255,0.8)" : "#8a5a2a" }}>📍 {loc.sector}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {loc.dist !== null && (
                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full"
                          style={{ background: isNear ? "rgba(255,255,255,0.3)" : "#D97A2B", color: "white" }}>
                          {formatDist(loc.dist)}
                        </span>
                      )}
                      {!loc.available
                        ? <span className="text-[9px] font-bold" style={{ color: "#8a5a2a" }}>🔒 Bientôt</span>
                        : <Link href={`/chasse?parcours=${loc.file}`} onClick={() => sessionStorage.removeItem(`islo-intro-seen-${loc.file}`)} className="text-[9px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: "#C44A3A", color: "white" }}>Jouer →</Link>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        </div>{/* fin contenu géoloc */}
      </section>

      {/* ══ BLOC 3 — Missions ══ */}
      <section className="relative overflow-hidden px-5 py-8"
        style={{ background: "#F2D479" }}>
        {/* Image boussole2 en fond */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "url('/icons/boussole2.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.55 }} />
        {/* Overlay doré semi-transparent pour lisibilité */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(160deg, rgba(242,212,121,0.82) 0%, rgba(242,195,80,0.82) 100%)" }} />
        <div className="relative z-10">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg" style={{ background: "rgba(196,74,58,0.15)" }}>🎯</div>
          <div>
            <h2 className="text-base font-extrabold leading-none" style={{ color: "#C44A3A" }}>Missions disponibles</h2>
          </div>
          <span className="ml-auto text-[10px] font-extrabold px-2 py-1 rounded-full"
            style={{ background: "#6FAF4F", color: "white" }}>{ADVENTURES.length} dispo</span>
        </div>

        {/* Wrapper pour les flèches sur grand écran */}
        <div className="relative">
          {/* Flèche gauche — visible uniquement md+ */}
          <button
            onClick={() => {
              const el = carouselRef.current;
              if (!el) return;
              const cardWidth = el.scrollWidth / ADVENTURES.length;
              el.scrollTo({ left: el.scrollLeft - cardWidth, behavior: "smooth" });
            }}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 w-10 h-10 items-center justify-center rounded-full shadow-lg transition-opacity active:opacity-70"
            style={{ background: "#C44A3A", color: "white" }}
            aria-label="Précédent">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </button>

          <div ref={carouselRef}
            className="flex overflow-x-auto gap-4 pb-2 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={(e) => {
              const el = e.currentTarget;
              const cardWidth = el.scrollWidth / ADVENTURES.length;
              setActiveCard(Math.round(el.scrollLeft / cardWidth));
            }}>
            {ADVENTURES.map((meta, i) => {
              const data = adventures[i];
              if (!data) return (
                <div key={meta.file} className="shrink-0 snap-center w-[80vw] max-w-sm h-64 rounded-3xl animate-pulse" style={{ background: "rgba(196,74,58,0.15)" }} />
              );
              const coords = data.point_depart?.coords;
              const distM = (userPos && coords) ? haversine(userPos.lat, userPos.lng, coords.lat, coords.lng) * 1000 : null;
              return (
                <div key={meta.file} className="shrink-0 snap-center w-[80vw] max-w-sm">
                  <MissionCard data={data} meta={meta} progress={progresses[i]} distM={distM} alwaysAccessible />
                </div>
              );
            })}
          </div>

          {/* Flèche droite — visible uniquement md+ */}
          <button
            onClick={() => {
              const el = carouselRef.current;
              if (!el) return;
              const cardWidth = el.scrollWidth / ADVENTURES.length;
              el.scrollTo({ left: el.scrollLeft + cardWidth, behavior: "smooth" });
            }}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 z-10 w-10 h-10 items-center justify-center rounded-full shadow-lg transition-opacity active:opacity-70"
            style={{ background: "#C44A3A", color: "white" }}
            aria-label="Suivant">
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638l-4.158-3.96a.75.75 0 011.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* ── Indicateurs de scroll ── */}
        <div className="flex items-center justify-center gap-3 mb-10 mt-3">
          <div className="flex gap-2">
            {ADVENTURES.map((_, i) => (
              <button key={i}
                onClick={() => carouselRef.current?.scrollTo({ left: carouselRef.current.scrollWidth / ADVENTURES.length * i, behavior: "smooth" })}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === activeCard ? 24 : 8,
                  height: 8,
                  background: i === activeCard ? "#C44A3A" : "rgba(196,74,58,0.3)",
                }} />
            ))}
          </div>
          {activeCard < ADVENTURES.length - 1 && (
            <div className="flex items-center gap-1 ml-2" style={{ color: "rgba(196,74,58,0.6)" }}>
              <style>{`@keyframes bounceX { 0%,100% { transform: translateX(0); } 50% { transform: translateX(6px); } }`}</style>
              <span className="text-[11px] font-bold">Fait défiler !</span>
              <svg className="w-4 h-4" style={{ animation: "bounceX 0.8s ease-in-out infinite" }} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638l-4.158-3.96a.75.75 0 011.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px" style={{ background: "rgba(196,74,58,0.2)" }} />
          <span className="text-lg">🔒</span>
          <div className="flex-1 h-px" style={{ background: "rgba(196,74,58,0.2)" }} />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg" style={{ background: "rgba(217,122,43,0.2)" }}>⏳</div>
          <div>
            <h2 className="text-base font-extrabold leading-none" style={{ color: "#D97A2B" }}>Prochainement</h2>
            <p className="text-[15px] mt-0.5" style={{ color: "rgba(217,122,43,0.7)" }}>De nouvelles aventures arrivent !</p>
          </div>
        </div>
        <div className="space-y-2">
          {COMING_SOON.map((a) => (
            <div key={a.titre} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "rgba(196,74,58,0.08)", border: "1px dashed rgba(196,74,58,0.25)" }}>
              <span className="text-2xl grayscale opacity-50">{a.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate" style={{ color: "rgba(61,26,16,0.7)" }}>{a.titre}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[9px]" style={{ color: "rgba(61,26,16,0.45)" }}>📍 {a.sector}</p>
                  {a.tags.map((t) => (
                    <span key={t} className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: "rgba(196,74,58,0.1)", color: "#C44A3A" }}>{t}</span>
                  ))}
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-1 rounded-full shrink-0"
                style={{ background: "rgba(217,122,43,0.2)", color: "#D97A2B" }}>Bientôt</span>
            </div>
          ))}
        </div>
        </div>{/* fin z-10 */}
      </section>

      {/* ══ BLOC 4 — Footer ══ */}
      <footer className="px-6 py-8 text-center" style={{ background: "#C44A3A" }}>
        <div className="text-3xl mb-3">🏝️</div>
        <p className="text-lg font-extrabold" style={{ color: "#F2D479" }}>L&apos;Isle aux Énigmes</p>
        <p className="text-xs mt-1" style={{ color: "rgba(242,212,121,0.6)" }}>L&apos;Isle-Jourdain · Gers · France</p>
        <div className="flex justify-center gap-4 mt-5">
          {["🗺️ Aventures", "📍 Géolocalisation", "🧩 Énigmes GPS"].map((item) => (
            <span key={item} className="text-[10px] font-semibold" style={{ color: "rgba(242,212,121,0.5)" }}>{item}</span>
          ))}
        </div>
        <p className="text-[9px] mt-4" style={{ color: "rgba(242,212,121,0.3)" }}>© 2026 — Tous droits réservés</p>
      </footer>
    </main>
  );
}
