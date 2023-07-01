"use client";

import useTheme from "#/lib/hooks/theme/theme.hook";
import type { Component } from "#/lib/utils/component";
import clsx from "clsx";
import type { TextProps } from "./text.type";

export const Text: Component<TextProps> = ({ className, children, ...props }) => {
  const { theme } = useTheme();

  const styles = clsx(
    {
      "text-blue-100": theme === "light",
      "text-gray-100": theme === "dark" || theme === "blue-dark"
    }
  );

  return <p className={clsx(styles, className)} {...props}>{children}</p>;
};