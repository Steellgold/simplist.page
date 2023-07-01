import { useState, useEffect } from "react";

type Theme = "light" | "blue-dark" | "dark";
type ThemeReturn = {
  theme: Theme;
  toggleTheme: () => void;
  getThemeClass: (selectedTheme: Theme) => string;
  getImageFromTheme: (selectedTheme: Theme) => string;
};

const useTheme = (): ThemeReturn => {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const toggleTheme = (): void => {
    const newTheme: Theme = theme === "light" ? "blue-dark" : theme === "blue-dark" ? "dark" : "light";

    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  const getThemeClass = (selectedTheme: Theme): string => {
    switch (selectedTheme) {
      case "light":
        return "bg-light";
      case "blue-dark":
        return "bg-blueDark";
      case "dark":
        return "bg-dark";
      default:
        return "bg-light";
    }
  };

  const getImageFromTheme = (selectedTheme: Theme): string => {
    switch (selectedTheme) {
      case "light":
        return "simplist-dark.png";
      default:
        return "simplist-light.png";
    }
  };

  return { theme, toggleTheme, getThemeClass, getImageFromTheme };
};

export default useTheme;