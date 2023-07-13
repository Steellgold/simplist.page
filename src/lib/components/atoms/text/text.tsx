import type { Component } from "#/lib/utils/component";
import type { TextProps } from "./text.type";
import clsx from "clsx";

export const Text: Component<TextProps> = ({ className, children, ...props }) => {
  const styles = clsx("text-gray-100");

  return <p className={clsx(styles, className)} {...props}>{children}</p>;
};