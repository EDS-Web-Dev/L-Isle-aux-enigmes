"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Coords } from "@/lib/types";

interface GeolocationState {
  position: Coords | null;
  error: string | null;
  isTracking: boolean;
}

export function useGeolocation(): GeolocationState {
  const [position, setPosition] = useState<Coords | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const watchId = useRef<number | null>(null);

  const handleSuccess = useCallback((pos: GeolocationPosition) => {
    setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    setError(null);
    setIsTracking(true);
  }, []);

  const handleError = useCallback((err: GeolocationPositionError) => {
    setIsTracking(false);
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setError("Autorise la géolocalisation pour jouer !");
        break;
      case err.POSITION_UNAVAILABLE:
        setError("Position GPS indisponible.");
        break;
      case err.TIMEOUT:
        setError("Le GPS met trop de temps à répondre.");
        break;
      default:
        setError("Erreur de géolocalisation.");
    }
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Ton navigateur ne supporte pas la géolocalisation.");
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );

    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [handleSuccess, handleError]);

  return { position, error, isTracking };
}
