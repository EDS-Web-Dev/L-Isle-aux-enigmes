export interface Theme {
  id: string;
  // Page
  pageBg: string;
  // Progress bar
  progressBg: string;
  progressFill: string;
  progressText: string;
  // Back arrow
  backColor: string;
  // Etape card
  titleColor: string;
  subtitleColor: string;
  storyBg: string;
  storyText: string;
  // Distance badge
  badgeInZone: string;
  badgeOutZone: string;
  badgeGps: string;
  // Enigme card
  enigmeCardBg: string;
  enigmeCardBorder: string;
  questionText: string;
  // Enigme form
  inputBorder: string;
  inputFocus: string;
  inputBg: string;
  inputText: string;
  submitBg: string;
  submitText: string;
  choiceBorder: string;
  choiceBg: string;
  choiceHover: string;
  choiceText: string;
  // Feedback
  successBg: string;
  successBorder: string;
  successText: string;
  errorBg: string;
  errorBorder: string;
  errorText: string;
  errorMsg: string;
  // Hint
  hintLink: string;
  hintBg: string;
  hintText: string;
  hintIcon: string;
  // Locked enigme
  lockedIcon: string;
  lockedText: string;
  lockedSubtext: string;
  // Geo error
  geoErrorBg: string;
  geoErrorBorder: string;
  geoErrorText: string;
  // Final screen
  finalBg: string;
  finalTitle: string;
  finalMessage: string;
  finalRecompense: string;
  finalCodeBg: string;
  finalCodeLabel: string;
  finalCodeText: string;
  finalBtnBg: string;
  finalBtnText: string;
  finalResetText: string;
  confettiColors: string[];
  // Font
  fontClass: string;
}

export const DEFAULT_THEME: Theme = {
  id: "default",
  pageBg: "bg-gray-50",
  progressBg: "bg-gray-200",
  progressFill: "bg-emerald-500",
  progressText: "text-gray-500",
  backColor: "text-gray-400",
  titleColor: "text-gray-900",
  subtitleColor: "text-gray-500",
  storyBg: "bg-emerald-50",
  storyText: "text-gray-700",
  badgeInZone: "bg-green-100 text-green-700",
  badgeOutZone: "bg-orange-100 text-orange-700",
  badgeGps: "bg-gray-100 text-gray-400",
  enigmeCardBg: "bg-white",
  enigmeCardBorder: "border-gray-100",
  questionText: "text-gray-800",
  inputBorder: "border-gray-200",
  inputFocus: "focus:border-orange-400",
  inputBg: "bg-white",
  inputText: "text-gray-900",
  submitBg: "bg-orange-500",
  submitText: "text-white",
  choiceBorder: "border-gray-200",
  choiceBg: "bg-white",
  choiceHover: "hover:border-orange-300",
  choiceText: "text-gray-800",
  successBg: "bg-green-100",
  successBorder: "border-green-400",
  successText: "text-green-800",
  errorBg: "bg-red-100",
  errorBorder: "border-red-400",
  errorText: "text-red-700",
  errorMsg: "Mauvaise réponse, essaie encore !",
  hintLink: "text-gray-400",
  hintBg: "bg-amber-50",
  hintText: "text-amber-600",
  hintIcon: "\u{1F4A1}",
  lockedIcon: "\u{1F4CD}",
  lockedText: "text-gray-400",
  lockedSubtext: "text-gray-300",
  geoErrorBg: "bg-red-50",
  geoErrorBorder: "border-red-200",
  geoErrorText: "text-red-700",
  finalBg: "bg-gradient-to-b from-emerald-600 to-emerald-800",
  finalTitle: "text-white",
  finalMessage: "text-emerald-100",
  finalRecompense: "text-amber-300",
  finalCodeBg: "bg-white/20",
  finalCodeLabel: "text-emerald-200",
  finalCodeText: "text-white",
  finalBtnBg: "bg-white",
  finalBtnText: "text-emerald-700",
  finalResetText: "text-emerald-200",
  confettiColors: ["#2ecc71", "#e67e22", "#3498db", "#e74c3c", "#f1c40f", "#9b59b6"],
  fontClass: "",
};

export const SPY_THEME: Theme = {
  id: "spy",
  pageBg: "bg-gray-950",
  progressBg: "bg-gray-800",
  progressFill: "bg-[#00ff41]",
  progressText: "text-[#00ff41]/60",
  backColor: "text-[#00ff41]/50",
  titleColor: "text-[#00ff41]",
  subtitleColor: "text-green-400/60",
  storyBg: "bg-[#00ff41]/5 border border-[#00ff41]/20",
  storyText: "text-green-300/80",
  badgeInZone: "bg-[#00ff41]/20 text-[#00ff41]",
  badgeOutZone: "bg-red-900/40 text-red-400",
  badgeGps: "bg-gray-800 text-gray-500",
  enigmeCardBg: "bg-gray-900",
  enigmeCardBorder: "border-[#00ff41]/20",
  questionText: "text-green-200",
  inputBorder: "border-[#00ff41]/30",
  inputFocus: "focus:border-[#00ff41]",
  inputBg: "bg-gray-950",
  inputText: "text-[#00ff41]",
  submitBg: "bg-[#00ff41]",
  submitText: "text-black",
  choiceBorder: "border-[#00ff41]/20",
  choiceBg: "bg-gray-900",
  choiceHover: "hover:border-[#00ff41]/60",
  choiceText: "text-green-200",
  successBg: "bg-[#00ff41]/10",
  successBorder: "border-[#00ff41]/40",
  successText: "text-[#00ff41]",
  errorBg: "bg-red-900/30",
  errorBorder: "border-red-500/40",
  errorText: "text-red-400",
  errorMsg: "ACCÈS REFUSÉ. Nouvelle tentative autorisée.",
  hintLink: "text-gray-500",
  hintBg: "bg-yellow-900/20 border border-yellow-500/20",
  hintText: "text-yellow-400/80",
  hintIcon: "\u{1F50D}",
  lockedIcon: "\u{1F512}",
  lockedText: "text-gray-500",
  lockedSubtext: "text-gray-600",
  geoErrorBg: "bg-red-950/50",
  geoErrorBorder: "border-red-800",
  geoErrorText: "text-red-400",
  finalBg: "bg-gradient-to-b from-gray-950 via-gray-900 to-black",
  finalTitle: "text-[#00ff41]",
  finalMessage: "text-green-300/80",
  finalRecompense: "text-yellow-400",
  finalCodeBg: "bg-[#00ff41]/10 border border-[#00ff41]/30",
  finalCodeLabel: "text-[#00ff41]/60",
  finalCodeText: "text-[#00ff41]",
  finalBtnBg: "bg-[#00ff41]",
  finalBtnText: "text-black",
  finalResetText: "text-gray-500",
  confettiColors: ["#00ff41", "#00cc33", "#33ff66", "#009926", "#66ff99", "#00ff41"],
  fontClass: "font-mono",
};

export const HISTORIC_THEME: Theme = {
  id: "historic",
  pageBg: "bg-amber-50",
  progressBg: "bg-amber-200/50",
  progressFill: "bg-amber-700",
  progressText: "text-amber-800/60",
  backColor: "text-amber-700/50",
  titleColor: "text-amber-900",
  subtitleColor: "text-amber-700/60",
  storyBg: "bg-amber-100/60 border border-amber-300/40",
  storyText: "text-amber-900/80",
  badgeInZone: "bg-amber-700/15 text-amber-800",
  badgeOutZone: "bg-orange-100 text-orange-700",
  badgeGps: "bg-amber-100 text-amber-400",
  enigmeCardBg: "bg-white",
  enigmeCardBorder: "border-amber-200",
  questionText: "text-amber-950",
  inputBorder: "border-amber-300",
  inputFocus: "focus:border-amber-600",
  inputBg: "bg-amber-50/50",
  inputText: "text-amber-950",
  submitBg: "bg-amber-700",
  submitText: "text-white",
  choiceBorder: "border-amber-300",
  choiceBg: "bg-amber-50/50",
  choiceHover: "hover:border-amber-600",
  choiceText: "text-amber-900",
  successBg: "bg-amber-100",
  successBorder: "border-amber-500",
  successText: "text-amber-800",
  errorBg: "bg-red-50",
  errorBorder: "border-red-300",
  errorText: "text-red-700",
  errorMsg: "Ce n'est point la bonne réponse, cherchez encore !",
  hintLink: "text-amber-500/70",
  hintBg: "bg-amber-100/80 border border-amber-300/50",
  hintText: "text-amber-800",
  hintIcon: "\u{1F4DC}",
  lockedIcon: "\u{1F510}",
  lockedText: "text-amber-600/60",
  lockedSubtext: "text-amber-500/40",
  geoErrorBg: "bg-red-50",
  geoErrorBorder: "border-red-200",
  geoErrorText: "text-red-700",
  finalBg: "bg-gradient-to-b from-amber-800 via-amber-900 to-stone-900",
  finalTitle: "text-amber-200",
  finalMessage: "text-amber-100/80",
  finalRecompense: "text-yellow-300",
  finalCodeBg: "bg-amber-200/15 border border-amber-400/30",
  finalCodeLabel: "text-amber-300/60",
  finalCodeText: "text-amber-100",
  finalBtnBg: "bg-amber-200",
  finalBtnText: "text-amber-900",
  finalResetText: "text-amber-400/60",
  confettiColors: ["#92400e", "#b45309", "#d97706", "#f59e0b", "#fbbf24", "#854d0e"],
  fontClass: "font-serif",
};

export const FAIRY_THEME: Theme = {
  id: "fairy",
  pageBg: "bg-pink-50",
  progressBg: "bg-pink-200/50",
  progressFill: "bg-pink-400",
  progressText: "text-pink-500",
  backColor: "text-pink-400",
  titleColor: "text-purple-800",
  subtitleColor: "text-pink-500/70",
  storyBg: "bg-purple-100/50 border border-purple-200/40",
  storyText: "text-purple-700",
  badgeInZone: "bg-pink-200/60 text-pink-700",
  badgeOutZone: "bg-purple-100 text-purple-600",
  badgeGps: "bg-pink-100 text-pink-300",
  enigmeCardBg: "bg-white",
  enigmeCardBorder: "border-pink-200",
  questionText: "text-purple-900",
  inputBorder: "border-pink-300",
  inputFocus: "focus:border-pink-500",
  inputBg: "bg-pink-50/50",
  inputText: "text-purple-900",
  submitBg: "bg-pink-400",
  submitText: "text-white",
  choiceBorder: "border-pink-200",
  choiceBg: "bg-pink-50/30",
  choiceHover: "hover:border-pink-400",
  choiceText: "text-purple-800",
  successBg: "bg-pink-100",
  successBorder: "border-pink-400",
  successText: "text-pink-700",
  errorBg: "bg-red-50",
  errorBorder: "border-red-300",
  errorText: "text-red-500",
  errorMsg: "Oups, ce n'est pas ça ! Essaie encore ✨",
  hintLink: "text-purple-400",
  hintBg: "bg-purple-50 border border-purple-200/50",
  hintText: "text-purple-600",
  hintIcon: "✨",
  lockedIcon: "\u{1F9DA}",
  lockedText: "text-purple-400/70",
  lockedSubtext: "text-purple-300/50",
  geoErrorBg: "bg-red-50",
  geoErrorBorder: "border-red-200",
  geoErrorText: "text-red-500",
  finalBg: "bg-gradient-to-b from-pink-400 via-purple-400 to-purple-600",
  finalTitle: "text-white",
  finalMessage: "text-pink-100",
  finalRecompense: "text-yellow-200",
  finalCodeBg: "bg-white/20 border border-white/30",
  finalCodeLabel: "text-pink-200",
  finalCodeText: "text-white",
  finalBtnBg: "bg-white",
  finalBtnText: "text-purple-600",
  finalResetText: "text-pink-200",
  confettiColors: ["#ff9ff3", "#f368e0", "#c44dff", "#ff6b81", "#feca57", "#48dbfb"],
  fontClass: "",
};

export const MEDIEVAL_THEME: Theme = {
  id: "medieval",
  pageBg: "bg-[#f2ece0]",
  progressBg: "bg-[#d4b896]/40",
  progressFill: "bg-[#8b1a1a]",
  progressText: "text-[#8b1a1a]/60",
  backColor: "text-[#8b1a1a]/60",
  titleColor: "text-[#3b1f0e]",
  subtitleColor: "text-[#7a5c3a]/70",
  storyBg: "bg-[#e8dcc8] border border-[#c4a97a]/40",
  storyText: "text-[#4a3020]/80",
  badgeInZone: "bg-[#8b1a1a]/15 text-[#8b1a1a]",
  badgeOutZone: "bg-[#c47a1a]/15 text-[#c47a1a]",
  badgeGps: "bg-[#d4b896]/30 text-[#9a7a5a]/60",
  enigmeCardBg: "bg-[#faf6ed]",
  enigmeCardBorder: "border-[#c4a97a]/50",
  questionText: "text-[#3b1f0e]",
  inputBorder: "border-[#c4a97a]/60",
  inputFocus: "focus:border-[#8b1a1a]",
  inputBg: "bg-[#faf6ed]",
  inputText: "text-[#3b1f0e]",
  submitBg: "bg-[#8b1a1a]",
  submitText: "text-[#f5e6c8]",
  choiceBorder: "border-[#c4a97a]/50",
  choiceBg: "bg-[#faf6ed]",
  choiceHover: "hover:border-[#8b1a1a]/60",
  choiceText: "text-[#3b1f0e]",
  successBg: "bg-[#d4edda]",
  successBorder: "border-[#6a9e6a]",
  successText: "text-[#2d5a2d]",
  errorBg: "bg-[#fce8e8]",
  errorBorder: "border-[#c47a7a]",
  errorText: "text-[#8b1a1a]",
  errorMsg: "Point de bonne réponse, chevalier ! Cherchez encore.",
  hintLink: "text-[#9a7a5a]/70",
  hintBg: "bg-[#e8dcc8] border border-[#c4a97a]/40",
  hintText: "text-[#7a5c3a]",
  hintIcon: "📜",
  lockedIcon: "⚔️",
  lockedText: "text-[#9a7a5a]/70",
  lockedSubtext: "text-[#9a7a5a]/40",
  geoErrorBg: "bg-[#fce8e8]",
  geoErrorBorder: "border-[#c47a7a]",
  geoErrorText: "text-[#8b1a1a]",
  finalBg: "bg-gradient-to-b from-[#3b1f0e] via-[#5a2d0e] to-[#1a0a00]",
  finalTitle: "text-[#f5d78e]",
  finalMessage: "text-[#e8c98a]/80",
  finalRecompense: "text-[#f5d78e]",
  finalCodeBg: "bg-[#f5d78e]/15 border border-[#f5d78e]/30",
  finalCodeLabel: "text-[#f5d78e]/60",
  finalCodeText: "text-[#f5d78e]",
  finalBtnBg: "bg-[#f5d78e]",
  finalBtnText: "text-[#3b1f0e]",
  finalResetText: "text-[#c4a97a]/60",
  confettiColors: ["#8b1a1a", "#c4971a", "#f5d78e", "#4a7a4a", "#c4a97a", "#3b1f0e"],
  fontClass: "font-serif",
};

export function getTheme(parcoursId: string): Theme {
  if (parcoursId === "islo-spy-007" || parcoursId === "islo-spy-lac-001") return SPY_THEME;
  if (parcoursId === "islo-hist-002") return HISTORIC_THEME;
  if (parcoursId === "islo-hist-710-001") return MEDIEVAL_THEME;
  if (parcoursId === "islo-kids-lac-001") return FAIRY_THEME;
  return DEFAULT_THEME;
}
