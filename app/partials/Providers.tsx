"use client";

import { settings } from '@root/config/config';
import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => {

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={settings.default_theme}
      enableColorScheme={false}
    >
      {children}
    </ThemeProvider>
  );
};

export default Providers;
