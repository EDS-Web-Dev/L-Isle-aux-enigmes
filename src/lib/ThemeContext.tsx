"use client";

import { createContext, useContext } from "react";
import { Theme, DEFAULT_THEME } from "./themes";

const ThemeContext = createContext<Theme>(DEFAULT_THEME);

export function ThemeProvider({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
