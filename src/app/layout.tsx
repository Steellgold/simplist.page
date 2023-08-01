import "./tailwind.css";

import type { Component } from "#/lib/utils/component";
import type { PropsWithChildren } from "react";

export { metadata } from "#/lib/configs/metadata";

const RootLayout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-blueDark">
        {children}
      </body>
    </html>
  );
};

export default RootLayout;