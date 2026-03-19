"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Parcours } from "@/lib/types";
import { useTheme } from "@/lib/ThemeContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { haversineDistance } from "@/lib/geo";

interface ExtendedDeviceOrientationEvent extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}
interface DeviceOrientationEventStatic extends EventTarget {
  requestPermission?: () => Promise<"granted" | "denied">;
}

function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function formatDist(m: number): string {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

/* ── Boussole ── */
function IntroCompass({ heading, targetBearing, distM, themeId }: {
  heading: number | null;
  targetBearing: number | null;
  distM: number | null;
  themeId: string;
}) {
  const rotation = heading !== null ? -heading : 0;
  const targetRotation = targetBearing !== null && heading !== null
    ? (targetBearing - heading + 360) % 360
    : null;

  const faceColors = {
    historic: { face: "radial-gradient(circle at 38% 32%, #f2dfa0 0%, #d8b96a 55%, #a87830 100%)", ring: "linear-gradient(135deg, #d4a820 0%, #8B6914 30%, #c9991a 55%, #6b4e10 80%, #d4a820 100%)", rivet: "radial-gradient(circle at 35% 30%, #f0d060, #8B6914)", northColor: "#8B1010", southColor: "#7a5010", cardinalColor: "#3d1a00", marker: "#c9991a" },
    spy:      { face: "radial-gradient(circle at 38% 32%, #1a2a1a 0%, #0d1a0d 55%, #050d05 100%)", ring: "linear-gradient(135deg, #D97A2B 0%, #7a3a10 30%, #D97A2B 55%, #5a2a08 80%, #D97A2B 100%)", rivet: "radial-gradient(circle at 35% 30%, #f0a050, #D97A2B)", northColor: "#D97A2B", southColor: "#4a6a4a", cardinalColor: "#4a8a4a", marker: "#D97A2B" },
    fairy:    { face: "radial-gradient(circle at 38% 32%, #fce8f8 0%, #e0b0e8 55%, #b070c0 100%)", ring: "linear-gradient(135deg, #c084fc 0%, #7a3a8a 30%, #c084fc 55%, #5a1a6e 80%, #c084fc 100%)", rivet: "radial-gradient(circle at 35% 30%, #f5c0ff, #9b4abf)", northColor: "#bf4abf", southColor: "#7a3a8a", cardinalColor: "#5a1a6e", marker: "#c084fc" },
  };
  const c = faceColors[themeId as keyof typeof faceColors] ?? faceColors.historic;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 200, height: 200 }}>
        {/* Anneau extérieur */}
        <div className="absolute inset-0 rounded-full" style={{ background: c.ring, boxShadow: "0 6px 24px rgba(0,0,0,0.45), inset 0 2px 6px rgba(255,220,80,0.15)" }} />
        {/* Face */}
        <div className="absolute rounded-full" style={{ inset: 10, background: c.face, boxShadow: "inset 0 3px 10px rgba(0,0,0,0.3)", border: `2px solid ${c.northColor}44` }} />

        {/* Graduations */}
        {Array.from({ length: 72 }).map((_, i) => (
          <div key={i} className="absolute" style={{
            top: "50%", left: "50%",
            width: i % 18 === 0 ? 3 : i % 6 === 0 ? 2 : 1,
            height: i % 18 === 0 ? 13 : i % 6 === 0 ? 8 : 5,
            background: i % 18 === 0 ? c.cardinalColor : `${c.cardinalColor}55`,
            borderRadius: 1,
            transform: `rotate(${i * 5}deg) translate(-50%, -88px)`,
            transformOrigin: "top center",
          }} />
        ))}

        {/* Rose (tourne avec le téléphone) */}
        <div className="absolute inset-0" style={{ transform: `rotate(${rotation}deg)`, transition: "transform 0.25s ease-out" }}>
          {[
            { label: "N", style: { top: 20, left: "50%", transform: "translateX(-50%)", color: c.northColor, fontSize: 16, fontWeight: 900, fontFamily: "Georgia, serif" } },
            { label: "S", style: { bottom: 20, left: "50%", transform: "translateX(-50%)", color: c.cardinalColor, fontSize: 12, fontWeight: 700, fontFamily: "Georgia, serif", opacity: 0.7 } },
            { label: "E", style: { right: 18, top: "50%", transform: "translateY(-50%)", color: c.cardinalColor, fontSize: 12, fontWeight: 700, fontFamily: "Georgia, serif", opacity: 0.7 } },
            { label: "O", style: { left: 18, top: "50%", transform: "translateY(-50%)", color: c.cardinalColor, fontSize: 12, fontWeight: 700, fontFamily: "Georgia, serif", opacity: 0.7 } },
          ].map(({ label, style }) => (
            <div key={label} className="absolute" style={style}>{label}</div>
          ))}
          {/* Aiguille N */}
          <div className="absolute left-1/2 top-1/2" style={{ marginLeft: -6, marginTop: -62 }}>
            <div style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: `56px solid ${c.northColor}`, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.3))" }} />
          </div>
          {/* Aiguille S */}
          <div className="absolute left-1/2 top-1/2" style={{ marginLeft: -5, marginTop: 5 }}>
            <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `46px solid ${c.southColor}`, filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.2))" }} />
          </div>
        </div>

        {/* Aiguille cible (point de départ) */}
        {targetRotation !== null && (
          <div className="absolute inset-0" style={{ transform: `rotate(${targetRotation}deg)`, transition: "transform 0.3s ease-out" }}>
            <div className="absolute left-1/2 top-1/2" style={{ marginLeft: -3, marginTop: -72 }}>
              <div style={{ width: 0, height: 0, borderLeft: "3px solid transparent", borderRight: "3px solid transparent", borderBottom: "62px solid rgba(111,175,79,0.95)", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }} />
            </div>
            <div className="absolute left-1/2" style={{ top: "calc(50% - 78px)", transform: "translateX(-50%)", fontSize: 13 }}>📍</div>
          </div>
        )}

        {/* Rivet central */}
        <div className="absolute top-1/2 left-1/2 rounded-full z-10" style={{ width: 14, height: 14, marginTop: -7, marginLeft: -7, background: c.rivet, boxShadow: "0 2px 5px rgba(0,0,0,0.4)", border: `1.5px solid ${c.northColor}66` }} />

        {/* Triangle repère haut */}
        <div className="absolute left-1/2" style={{ top: 4, transform: "translateX(-50%)" }}>
          <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: `9px solid ${c.marker}` }} />
        </div>
      </div>

      {/* Distance */}
      {distM !== null && (
        <div className="text-center">
          <p className="text-2xl font-black" style={{ fontFamily: "Georgia, serif", color: c.northColor }}>
            {formatDist(distM)}
          </p>
          <p className="text-xs mt-0.5" style={{ color: `${c.cardinalColor}99` }}>du point de départ</p>
        </div>
      )}
      {distM === null && (
        <p className="text-xs animate-pulse" style={{ color: `${c.cardinalColor}88`, fontFamily: "Georgia, serif" }}>Localisation en cours…</p>
      )}
    </div>
  );
}

interface IntroScreenProps {
  parcours: Parcours;
  onStart: () => void;
}

export default function IntroScreen({ parcours, onStart }: IntroScreenProps) {
  const t = useTheme();
  const pd = parcours.point_depart!;
  const { position } = useGeolocation();
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    const DOE = DeviceOrientationEvent as unknown as DeviceOrientationEventStatic;
    const startListening = () => {
      const handler = (e: DeviceOrientationEvent) => {
        const ext = e as ExtendedDeviceOrientationEvent;
        let h: number | null = null;
        if (ext.webkitCompassHeading != null) h = ext.webkitCompassHeading;
        else if (e.alpha != null) h = (360 - e.alpha) % 360;
        if (h !== null) setHeading(Math.round(h));
      };
      window.addEventListener("deviceorientation", handler, true);
      return () => window.removeEventListener("deviceorientation", handler, true);
    };

    if (typeof DOE.requestPermission === "function") {
      DOE.requestPermission()
        .then((p) => { if (p === "granted") startListening(); })
        .catch(() => {});
      return;
    }
    return startListening();
  }, []);

  const targetCoords = pd.coords;
  const targetBearing = position && targetCoords
    ? calculateBearing(position.lat, position.lng, targetCoords.lat, targetCoords.lng)
    : null;
  const distM = position && targetCoords
    ? haversineDistance(position, targetCoords)
    : null;

  const photoMap: Record<string, string> = {
    "islo-hist-710-001": "/icons/livres.jpg",
    "islo-kids-lac-001": "/icons/fée.jpg",
    "islo-spy-007":      "/icons/top_secret.jpg",
  };
  const photo = photoMap[parcours.id];

  const overlayMap: Record<string, string> = {
    "islo-hist-710-001": "rgba(120, 80, 20, 0.72)",
    "islo-kids-lac-001": "rgba(160, 60, 160, 0.68)",
    "islo-spy-007":      "rgba(5, 20, 5, 0.78)",
  };
  const overlay = overlayMap[parcours.id] ?? "rgba(0,0,0,0.65)";

  return (
    <div className={`min-h-dvh flex flex-col ${t.fontClass} relative`}>
      {/* Photo de fond */}
      {photo && (
        <>
          <div className="absolute inset-0 z-0" style={{ backgroundImage: `url('${photo}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0 z-0" style={{ background: overlay }} />
        </>
      )}
      {!photo && <div className={`absolute inset-0 z-0 ${t.pageBg}`} />}
      {/* Header */}
      <div className="relative z-10 shrink-0 px-4 pt-3 pb-2 flex items-center gap-3">
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
      <div className="relative z-10 flex-1 overflow-y-auto flex flex-col items-center px-6 pt-4 pb-6 gap-6">
        {/* Title */}
        <div className="text-center">
          <p className={`text-xs uppercase tracking-widest mb-1 ${photo ? "text-white/60" : t.subtitleColor}`}>Point de départ</p>
          <h2 className={`text-xl font-bold ${photo ? "text-white" : t.titleColor}`} style={{ textShadow: photo ? "0 2px 8px rgba(0,0,0,0.6)" : undefined }}>{pd.nom}</h2>
        </div>

        {/* Boussole */}
        <IntroCompass
          heading={heading}
          targetBearing={targetBearing}
          distM={distM}
          themeId={t.id}
        />

        {/* Welcome text */}
        <p className={`text-sm leading-relaxed text-center max-w-xs rounded-xl px-4 py-3 italic ${photo ? "text-white/90 bg-black/30" : `${t.storyText} ${t.storyBg}`}`}>
          {pd.texte_bienvenue}
        </p>

        {/* Action instruction */}
        <p className={`text-sm font-medium text-center ${photo ? "text-white/80" : t.questionText}`}>
          {pd.consigne_action}
        </p>

        {/* Info tags */}
        <div className="flex flex-wrap justify-center gap-2">
          {[`${parcours.etapes.length} étapes`, parcours.temps_estime, parcours.age_conseille].filter(Boolean).map((tag) => (
            <span key={tag} className={`text-[10px] px-2.5 py-1 rounded-full border ${photo ? "bg-white/15 border-white/30 text-white/80" : `${t.enigmeCardBg} ${t.enigmeCardBorder} ${t.subtitleColor}`}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Start button */}
      <div className="relative z-10 shrink-0 px-6 pb-8 pt-4">
        <button
          onClick={onStart}
          className={`w-full ${t.submitBg} ${t.submitText} font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-transform`}
        >
          {t.id === "historic" ? "Débuter l'enquête" : t.id === "spy" ? "Lancer la mission" : t.id === "fairy" ? "C'est parti !" : "Commencer"}
        </button>
      </div>
    </div>
  );
}
