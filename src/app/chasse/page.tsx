"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Parcours } from "@/lib/types";
import { getTheme } from "@/lib/themes";
import { ThemeProvider } from "@/lib/ThemeContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useProgression } from "@/hooks/useProgression";
import EtapeCard from "@/components/EtapeCard";
import ProgressBar from "@/components/ProgressBar";
import FinalScreen from "@/components/FinalScreen";
import IntroScreen from "@/components/IntroScreen";
import { Suspense } from "react";

const GameMap = dynamic(() => import("@/components/Map"), { ssr: false });

function ChasseContent() {
  const searchParams = useSearchParams();
  const parcoursFile = searchParams.get("parcours") || "mvp";

  const [parcours, setParcours] = useState<Parcours | null>(null);
  const [introDismissed, setIntroDismissed] = useState(false);
  const { position, error: geoError } = useGeolocation();

  const totalSteps = parcours?.etapes.length ?? 0;
  const storageKey = `islo-progression-${parcoursFile}`;
  const { currentStepIndex, completedSteps, advanceStep, reset, isLoaded } =
    useProgression(totalSteps, storageKey);

  useEffect(() => {
    fetch(`/${parcoursFile}.json`)
      .then((r) => r.json())
      .then((d: Parcours) => setParcours(d));
  }, [parcoursFile]);

  useEffect(() => {
    const key = `islo-intro-seen-${parcoursFile}`;
    if (sessionStorage.getItem(key)) {
      setIntroDismissed(true);
    }
  }, [parcoursFile]);


  if (!parcours || !isLoaded) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-emerald-50">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const theme = getTheme(parcours.id);
  const tid = theme.id;
  const isSpy = tid === "spy";
  const isHistoric = tid === "historic";
  const isFairy = tid === "fairy";
  const isFinished = currentStepIndex >= parcours.etapes.length;

  // Show intro screen if parcours has point_depart and it hasn't been dismissed
  if (parcours.point_depart && !introDismissed && currentStepIndex === 0) {
    return (
      <ThemeProvider theme={theme}>
        <IntroScreen
          parcours={parcours}
          onStart={() => {
            sessionStorage.setItem(`islo-intro-seen-${parcoursFile}`, "1");
            setIntroDismissed(true);
          }}
        />
      </ThemeProvider>
    );
  }

  if (isFinished) {
    return (
      <ThemeProvider theme={theme}>
        <FinalScreen final={parcours.final} onReset={reset} />
      </ThemeProvider>
    );
  }

  const currentEtape = parcours.etapes[currentStepIndex];

  return (
    <ThemeProvider theme={theme}>
      <div className={`min-h-dvh flex flex-col ${theme.pageBg} ${theme.fontClass}`}>
        {/* Title bar */}
        <div className={`shrink-0 px-4 pt-3 pb-2 flex items-center gap-3`}>
          <Link href="/" className={`${theme.backColor} active:opacity-70 transition-opacity`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className={`flex-1 text-sm font-bold truncate ${theme.titleColor}`}>
            {parcours.titre}
          </h1>
        </div>

        {/* Map */}
        <div className="h-[30dvh] relative shrink-0 mx-4 mt-1 mb-1 rounded-2xl overflow-hidden shadow-md">
          <GameMap
            etapes={parcours.etapes}
            currentIndex={currentStepIndex}
            completedSteps={completedSteps}
            userPosition={position}
          />
          {/* Gradient fade bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent pointer-events-none z-10" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-3">
          {/* Progress bar */}
          <ProgressBar current={completedSteps.length} total={parcours.etapes.length} />

          {/* Spy status bar */}
          {isSpy && (
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#00ff41]/30 border-b border-[#00ff41]/10 pb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] animate-pulse" />
              <span>AGENT_STATUS: ACTIF</span>
              <span className="ml-auto">
                {position ? `GPS: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : "GPS: ACQUISITION..."}
              </span>
            </div>
          )}

          {/* Historic chapter header */}
          {isHistoric && (
            <div className="text-center border-b border-amber-300/30 pb-2">
              <p className="text-[11px] text-amber-700/40 tracking-widest uppercase font-serif">
                Chapitre {currentStepIndex + 1} sur {parcours.etapes.length}
              </p>
            </div>
          )}

          {/* Fairy step header */}
          {isFairy && (
            <div className="text-center pb-1">
              <p className="text-[11px] text-purple-400/60 tracking-wider">
                &#10024; Ingr&#233;dient {currentStepIndex + 1} sur {parcours.etapes.length} &#10024;
              </p>
            </div>
          )}

          {/* Geo error */}
          {geoError && (
            <div className={`${theme.geoErrorBg} border ${theme.geoErrorBorder} ${theme.geoErrorText} text-sm rounded-xl p-3`}>
              {isSpy ? `[ERREUR SYSTÈME] ${geoError}` : geoError}
            </div>
          )}

          {/* Current step */}
          <EtapeCard
            etape={currentEtape}
            userPosition={position}
            onCorrect={() => advanceStep(currentEtape.id)}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default function ChassePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-dvh flex items-center justify-center bg-emerald-50">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
      }
    >
      <ChasseContent />
    </Suspense>
  );
}
