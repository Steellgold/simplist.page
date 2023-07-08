import type { Provider } from "./provider.type";

export const providers: Provider[] = [
  { name: "Google", url: "https://www.google.com/search?q=", icon: "google.png" },
  { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=", icon: "duckduckgo.png" },
  { name: "Bing", url: "https://www.bing.com/search?q=", icon: "bing.png" },
  { name: "Yahoo", url: "https://search.yahoo.com/search?p=", icon: "yahoo.png" },
  { name: "Qwant", url: "https://www.qwant.com/?q=", icon: "qwant.png" },
  { name: "Ecosia", url: "https://www.ecosia.org/search?q=", icon: "ecosia.png" }
];