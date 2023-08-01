import "./tailwind.css";

import type { Component } from "#/lib/utils/component";
import { Analytics } from "@vercel/analytics/react";
import type { PropsWithChildren } from "react";
import Link from "next/link";
import Image from "next/image";

export { metadata } from "#/lib/configs/metadata";

export const revalidate = 0;

const RootLayout: Component<PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-blueDark">
        {children}
        <Analytics />

        <Link
          className="absolute top-0 right-0 mt-4 mr-4"
          href="https://www.producthunt.com/posts/simplist-3?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-simplist&#0045;3"
          target="_blank"
        >
          <Image
            src="https://api.producthunt.com/widgets/embed-image/v1/featured.png?post_id=407582&theme=neutral"
            alt="Simplist - Homepage&#0032;for&#0032;browsers&#0032;with&#0032;AI | Product Hunt"
            className="opacity-5 hover:opacity-100 transition-opacity duration-300 ease-in-out"
            width="250"
            height="54"
          />
        </Link>
      </body>
    </html>
  );
};

export default RootLayout;