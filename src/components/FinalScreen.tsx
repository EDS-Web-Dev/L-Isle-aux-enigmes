"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Final } from "@/lib/types";
import { useTheme } from "@/lib/ThemeContext";

interface FinalScreenProps {
  final: Final;
  onReset: () => void;
}

function useConfetti(canvasRef: React.RefObject<HTMLCanvasElement | null>, colors: string[]) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      drift: (Math.random() - 0.5) * 2,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
    }));

    let raf: number;
    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      for (const p of particles) {
        ctx!.save();
        ctx!.translate(p.x, p.y);
        ctx!.rotate((p.rot * Math.PI) / 180);
        ctx!.fillStyle = p.color;
        ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx!.restore();
        p.y += p.speed;
        p.x += p.drift;
        p.rot += p.rotSpeed;
        if (p.y > canvas!.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas!.width;
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => cancelAnimationFrame(raf);
  }, [canvasRef, colors]);
}

export default function FinalScreen({ final, onReset }: FinalScreenProps) {
  const t = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useConfetti(canvasRef, t.confettiColors);

  const id = t.id;

  const emoji = { spy: "🕵️", historic: "🔔", fairy: "🧚", default: "🏆" }[id] ?? "🏆";
  const codeLabel = { spy: "Code agent", historic: "Sceau de validation", fairy: "Mot magique", default: "Code de validation" }[id] ?? "Code de validation";
  const btnLabel = { spy: "Retour au QG", historic: "Retour aux parcours", fairy: "Retour aux aventures", default: "Retour à l'accueil" }[id] ?? "Retour à l'accueil";
  const resetLabel = { spy: "Relancer la mission", historic: "Refaire l'enquête", fairy: "Rejouer la balade", default: "Recommencer l'aventure" }[id] ?? "Recommencer l'aventure";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${t.finalBg}`}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className={`relative z-10 text-center px-6 max-w-sm space-y-6 ${t.fontClass}`}>
        <div className="text-6xl">{emoji}</div>

        {id === "spy" && (
          <p className="text-[#00ff41]/40 text-xs font-mono tracking-widest uppercase">
            // mission_status: complete
          </p>
        )}

        {id === "historic" && (
          <p className="text-amber-400/50 text-xs tracking-widest uppercase font-serif">
            &mdash; Fin du parcours &mdash;
          </p>
        )}

        {id === "fairy" && (
          <p className="text-pink-200/60 text-xs tracking-widest">
            {"✨ La magie opère ✨"}
          </p>
        )}

        <h1 className={`text-2xl font-extrabold ${t.finalTitle}`}>{final.titre}</h1>
        <p className={`leading-relaxed ${t.finalMessage}`}>{final.message}</p>

        {final.recompense && (
          <p className={`text-lg font-semibold ${t.finalRecompense}`}>{final.recompense}</p>
        )}

        <div className={`${t.finalCodeBg} backdrop-blur rounded-2xl p-4`}>
          <p className={`${t.finalCodeLabel} text-xs uppercase tracking-wider mb-1`}>
            {codeLabel}
          </p>
          <p className={`text-2xl font-mono font-bold ${t.finalCodeText} tracking-widest`}>
            {final.code_validation}
          </p>
        </div>

        <Link
          href="/"
          className={`block ${t.finalBtnBg} ${t.finalBtnText} font-bold text-lg px-8 py-4 rounded-2xl
            shadow-lg active:scale-95 transition-transform`}
        >
          {btnLabel}
        </Link>

        <button
          onClick={onReset}
          className={`${t.finalResetText} underline text-sm`}
        >
          {resetLabel}
        </button>
      </div>
    </div>
  );
}
