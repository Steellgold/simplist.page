"use client";

import "./tailwind.css";

import type { Component } from "#/lib/utils/component";
import type { PropsWithChildren } from "react";
import { Outfit } from "next/font/google";
import useTheme from "#/lib/hooks/theme/theme.hook";

export { metadata } from "#/lib/configs/metadata";

const outfit = Outfit({ subsets: ["latin"] });

const RootLayout: Component<PropsWithChildren> = ({ children }) => {
  const { theme, getThemeClass } = useTheme();

  return (
    <html lang="en" className={getThemeClass(theme)}>
      <body className={outfit.className}>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;