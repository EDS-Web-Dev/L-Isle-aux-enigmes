"use client";

import { useEffect, useState, useCallback } from "react";

interface Progression {
  currentStepIndex: number;
  completedSteps: string[];
}

interface UseProgressionReturn extends Progression {
  advanceStep: (stepId: string) => void;
  reset: () => void;
  isLoaded: boolean;
}

const INITIAL: Progression = { currentStepIndex: 0, completedSteps: [] };

function readProgression(storageKey: string): Progression {
  if (typeof window === "undefined") return INITIAL;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupted data
  }
  return INITIAL;
}

export function useProgression(
  totalSteps: number,
  storageKey = "islo-progression"
): UseProgressionReturn {
  const [state, setState] = useState<Progression>(() => readProgression(storageKey));
  const isLoaded = typeof window !== "undefined";

  // Persist to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [state, isLoaded, storageKey]);

  const advanceStep = useCallback(
    (stepId: string) => {
      setState((prev) => {
        const next = {
          completedSteps: [...prev.completedSteps, stepId],
          currentStepIndex: Math.min(prev.currentStepIndex + 1, totalSteps),
        };
        return next;
      });
    },
    [totalSteps]
  );

  const reset = useCallback(() => {
    setState(INITIAL);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return { ...state, advanceStep, reset, isLoaded };
}
