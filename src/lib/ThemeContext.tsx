"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type FontSize = "normal" | "large";

interface ThemeContextType {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isTrueBlack: boolean;
  setIsTrueBlack: (val: boolean) => void;
  fontSize: FontSize;
  setFontSize: (val: FontSize) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTrueBlack, setIsTrueBlack] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("normal");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedDark =
      localStorage.getItem("darkMode") === "true" ||
      (!localStorage.getItem("darkMode") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    const savedTrueBlack = localStorage.getItem("trueBlack") === "true";
    const savedFontSize =
      (localStorage.getItem("fontSize") as FontSize) || "normal";

    setIsDarkMode(savedDark);
    setIsTrueBlack(savedTrueBlack);
    setFontSize(savedFontSize);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    if (isTrueBlack) root.classList.add("true-black");
    else root.classList.remove("true-black");
    if (fontSize === "large") root.classList.add("text-large");
    else root.classList.remove("text-large");

    localStorage.setItem("darkMode", isDarkMode.toString());
    localStorage.setItem("trueBlack", isTrueBlack.toString());
    localStorage.setItem("fontSize", fontSize);
  }, [isDarkMode, isTrueBlack, fontSize]);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        setIsDarkMode,
        isTrueBlack,
        setIsTrueBlack,
        fontSize,
        setFontSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};
