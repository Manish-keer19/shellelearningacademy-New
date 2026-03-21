import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "green";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "green",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("green");

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "green");
    root.classList.add("green");
    localStorage.setItem("theme", "green");
  }, []);

  const toggleTheme = () => {
    // No theme toggle - always green
  };

  return (
    <ThemeProviderContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
