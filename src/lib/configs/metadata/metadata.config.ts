import type { Metadata } from "next";

const data = {
  title: "Simplist",
  description: "A sample page for your browser's new tab page.",
  siteName: "Simplist"
};

export const metadata: Metadata = {
  metadataBase: new URL("https://simplist.page/"),

  title: {
    template: "%s - Simplist",
    default: "Simplist",
    absolute: data.title
  },
  description: data.description,
  applicationName: data.siteName,

  themeColor: "#0f172a",

  openGraph: {
    title: {
      template: "%s - Simplist",
      default: "Simplist",
      absolute: data.title
    },
    description: data.description,
    siteName: data.siteName,
    url: "https://simplist.page/",
    type: "website",
    images: ["images/og-image.png"]
  },

  twitter: {
    title: {
      template: "%s - Simplist",
      default: "Simplist",
      absolute: data.title
    },
    description: data.description
  }
};