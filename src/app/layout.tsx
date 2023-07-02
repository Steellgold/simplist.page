import "./tailwind.css";

import type { Component } from "#/lib/utils/component";
import type { PropsWithChildren } from "react";
import { Weather } from "#/lib/components/atoms/weather";

export { metadata } from "#/lib/configs/metadata";

const RootLayout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body className="bg-blueDark">
        <Weather />

        {children}
      </body>
    </html>
  );
};

export default RootLayout;