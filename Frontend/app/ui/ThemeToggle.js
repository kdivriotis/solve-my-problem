"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  if (!mounted) return <></>;

  const Icon = resolvedTheme === "dark" ? FiMoon : FiSun;

  return (
    <div
      className="fixed bottom-[16px] right-[16px] p-2 rounded-full shadow-lg z-10 cursor-pointer
      text-dark-background dark:text-background fill-dark-background dark:fill-background 
      bg-background dark:bg-dark-background 
      border border-solid border-surface dark:border-dark-surface"
      onClick={toggleTheme}
    >
      <Icon className="w-[24px] h-[24px]" />
    </div>
  );
};

export default ThemeToggle;
