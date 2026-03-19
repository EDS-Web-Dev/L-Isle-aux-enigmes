"use client";

import { useTheme } from "@/lib/ThemeContext";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const t = useTheme();
  const pct = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 h-2.5 ${t.progressBg} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${t.progressFill} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-semibold ${t.progressText} whitespace-nowrap`}>
        {current}/{total}
      </span>
    </div>
  );
}
