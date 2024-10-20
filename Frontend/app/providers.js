"use client";

import { ThemeProvider } from "next-themes";

export const Providers = ({ children }) => {
  return (
    <ThemeProvider attribute="data-mode" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
};
