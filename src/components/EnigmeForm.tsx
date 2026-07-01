"use client";

import { useState } from "react";
import { Enigme } from "@/lib/types";
import { useTheme } from "@/lib/ThemeContext";
import { hashAnswer } from "@/lib/hash";

interface EnigmeFormProps {
  enigme: Enigme;
  onCorrect: () => void;
}

export default function EnigmeForm({ enigme, onCorrect }: EnigmeFormProps) {
  const t = useTheme();
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"success" | "error" | null>(null);
  const [checking, setChecking] = useState(false);

  async function isCorrect(value: string) {
    const accepted = Array.isArray(enigme.reponse) ? enigme.reponse : [enigme.reponse];
    const hashed = await hashAnswer(value);
    return accepted.includes(hashed);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    const correct = await isCorrect(answer);
    setChecking(false);
    if (correct) {
      setFeedback("success");
      if (navigator.vibrate) navigator.vibrate(200);
    } else {
      setFeedback("error");
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      setTimeout(() => setFeedback(null), 1500);
    }
  }

  async function selectChoice(option: string) {
    setAnswer(option);
    setChecking(true);
    const correct = await isCorrect(option);
    setChecking(false);
    if (correct) {
      setFeedback("success");
      if (navigator.vibrate) navigator.vibrate(200);
    } else {
      setFeedback("error");
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
      setTimeout(() => setFeedback(null), 1500);
    }
  }

  /* ── Succès ───────────────────────────────────────── */
  if (feedback === "success") {
    return (
      <div className="space-y-4">
        <div className={`rounded-2xl p-4 ${t.successBg} border ${t.successBorder}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">✅</span>
            <span className={`text-sm font-bold ${t.successText}`}>Bonne réponse !</span>
          </div>
          <p className={`text-sm leading-relaxed ${t.successText} opacity-80`}>
            {enigme.message_succes}
          </p>
        </div>
        <button
          onClick={onCorrect}
          className={`w-full ${t.submitBg} ${t.submitText} font-bold text-sm py-4 rounded-2xl active:scale-95 transition-transform shadow-sm`}
        >
          Étape suivante →
        </button>
      </div>
    );
  }

  /* ── Formulaire ───────────────────────────────────── */
  return (
    <div className="space-y-4">

      {/* Question */}
      <div className="flex items-start gap-2.5">
        <span className="text-lg shrink-0 mt-0.5">🔍</span>
        <p className={`text-base font-semibold leading-snug ${t.questionText}`}>
          {enigme.question}
        </p>
      </div>

      {/* Erreur */}
      {feedback === "error" && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${t.errorBg} border ${t.errorBorder} ${t.errorText} flex items-center gap-2`}>
          <span>❌</span>
          <span>{t.errorMsg}</span>
        </div>
      )}

      {/* Choix multiples */}
      {enigme.type === "CHOICE" && enigme.options ? (
        <div className="grid grid-cols-2 gap-2.5">
          {enigme.options.map((opt) => (
            <button
              key={opt}
              onClick={() => selectChoice(opt)}
              disabled={checking}
              className={`py-4 px-3 rounded-2xl text-base font-semibold border-2 transition-all active:scale-95 text-center leading-snug disabled:opacity-40 ${
                answer === opt && feedback === "error"
                  ? `${t.errorBorder} ${t.errorBg} ${t.errorText}`
                  : `${t.choiceBorder} ${t.choiceBg} ${t.choiceText}`
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        /* Texte / Nombre */
        <form onSubmit={handleSubmit} className="space-y-2.5">
          <input
            type={enigme.type === "NUMBER" ? "number" : "text"}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={enigme.type === "NUMBER" ? "Entrez un nombre…" : "Votre réponse…"}
            className={`w-full border-2 ${t.inputBorder} ${t.inputBg} ${t.inputText} rounded-2xl px-4 py-4 text-lg
              ${t.inputFocus} focus:outline-none transition-colors placeholder:opacity-40`}
          />
          <button
            type="submit"
            disabled={!answer.trim() || checking}
            className={`w-full ${t.submitBg} ${t.submitText} py-4 rounded-2xl font-bold text-base
              disabled:opacity-40 active:scale-95 transition-all shadow-sm`}
          >
            Valider ma réponse
          </button>
        </form>
      )}

      {/* Indice */}
      <div className="pt-1">
        {!showHint ? (
          <button
            onClick={() => setShowHint(true)}
            className={`flex items-center gap-1.5 text-xs ${t.hintLink}`}
          >
            <span>{t.hintIcon}</span>
            <span className="underline underline-offset-2">Besoin d&apos;un indice ?</span>
          </button>
        ) : (
          <div className={`rounded-2xl px-4 py-3.5 text-base leading-relaxed ${t.hintBg} ${t.hintText} flex gap-2.5`}>
            <span className="shrink-0">{t.hintIcon}</span>
            <span>{enigme.indice}</span>
          </div>
        )}
      </div>

    </div>
  );
}
