import type { Component } from "#/lib/utils/component";
import clsx from "clsx";
import type { TextProps } from "./text.type";

export const Text: Component<TextProps> = ({ className, children, ...props }) => {
  const styles = clsx("text-gray-100");

  return <p className={clsx(styles, className)} {...props}>{children}</p>;
};