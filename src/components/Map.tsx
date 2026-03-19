"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { Etape, Coords } from "@/lib/types";
import "leaflet/dist/leaflet.css";

function makeStepIcon(label: string, state: "done" | "active" | "locked") {
  const colors = {
    done:   { bg: "#10b981", border: "#fff", text: "#fff" },
    active: { bg: "#f97316", border: "#fff", text: "#fff" },
    locked: { bg: "#d1d5db", border: "#fff", text: "#9ca3af" },
  };
  const c = colors[state];
  const pulse = state === "active"
    ? `<div style="position:absolute;inset:-5px;border-radius:50%;background:${c.bg};opacity:.25;animation:ping 1.5s ease-in-out infinite;"></div>`
    : "";

  return L.divIcon({
    className: "",
    html: `
      <style>@keyframes ping{0%,100%{transform:scale(1);opacity:.25}50%{transform:scale(1.5);opacity:0}}</style>
      <div style="position:relative;width:32px;height:32px;">
        ${pulse}
        <div style="
          position:absolute;inset:0;
          width:32px;height:32px;border-radius:50%;
          background:${c.bg};border:2.5px solid ${c.border};
          box-shadow:0 2px 8px rgba(0,0,0,.2);
          display:flex;align-items:center;justify-content:center;
          font-size:11px;font-weight:700;color:${c.text};
          font-family:system-ui,sans-serif;
        ">${state === "done" ? "✓" : label}</div>
      </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

const USER_ICON = L.divIcon({
  className: "",
  html: `
    <div style="position:relative;width:20px;height:20px;">
      <div style="position:absolute;inset:-4px;border-radius:50%;background:#3b82f6;opacity:.2;animation:ping2 2s ease-in-out infinite;"></div>
      <style>@keyframes ping2{0%,100%{transform:scale(1);opacity:.2}50%{transform:scale(1.6);opacity:0}}</style>
      <div style="
        width:20px;height:20px;border-radius:50%;
        background:#3b82f6;border:3px solid white;
        box-shadow:0 2px 8px rgba(59,130,246,.5);
      "></div>
    </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 0.8 });
  }, [center, map]);
  return null;
}

interface MapProps {
  etapes: Etape[];
  currentIndex: number;
  completedSteps: string[];
  userPosition: Coords | null;
}

export default function GameMap({ etapes, currentIndex, completedSteps, userPosition }: MapProps) {
  const activeEtape = etapes[Math.min(currentIndex, etapes.length - 1)];
  const center: [number, number] = [activeEtape.coords.lat, activeEtape.coords.lng];

  return (
    <MapContainer
      center={center}
      zoom={17}
      className="h-full w-full z-0"
      zoomControl={false}
      attributionControl={false}
    >
      {/* Tuiles CartoDB Positron — plus propres et modernes */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <RecenterMap center={center} />

      {etapes.map((etape, i) => {
        const isDone = completedSteps.includes(etape.id);
        const isActive = i === currentIndex;
        const state = isDone ? "done" : isActive ? "active" : "locked";
        const icon = makeStepIcon(String(i + 1), state);

        return (
          <div key={etape.id}>
            <Marker position={[etape.coords.lat, etape.coords.lng]} icon={icon} />
            {isActive && (
              <Circle
                center={[etape.coords.lat, etape.coords.lng]}
                radius={etape.validation_radius}
                pathOptions={{
                  color: "#f97316",
                  fillColor: "#f97316",
                  fillOpacity: 0.08,
                  weight: 1.5,
                  dashArray: "5 5",
                }}
              />
            )}
          </div>
        );
      })}

      {userPosition && (
        <Marker position={[userPosition.lat, userPosition.lng]} icon={USER_ICON} />
      )}
    </MapContainer>
  );
}
