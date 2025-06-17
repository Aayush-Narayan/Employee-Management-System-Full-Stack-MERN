import React, { useEffect, useState } from "react";

const DarkModeToggle: React.FC = () => {
const [isDark, setIsDark] = useState(false);

useEffect(() => {
  const storedTheme = localStorage.getItem("theme");
  setIsDark(storedTheme === "dark");
}, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
      <button
        aria-label="Toggle dark mode"
        onClick={() => setIsDark(!isDark)}
        className="fixed top-2 right-24 z-50 p-3 m-2 rounded-full border-2 dark:border-cyan/90 dark:bg-transparent dark:hover:bg-white dark:hover:border-card border-card bg-text hover:border-cyan hover:bg-card shadow-2xl dark:shadow-cyan transition-transform"
      >
        {isDark ? "🌙" : "☀️"}
      </button>
  );
};

export default DarkModeToggle;
