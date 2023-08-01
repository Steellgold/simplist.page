import type { Provider } from "./provider.type";

export const providers: Provider[] = [
  { name: "Google", url: "https://www.google.com/search?q={search}", icon: "google.png" },
  { name: "DuckDuckGo", url: "https://duckduckgo.com/?q={search}", icon: "duckduckgo.png" },
  { name: "Bing", url: "https://www.bing.com/search?q={search}", icon: "bing.png" },
  { name: "Yahoo", url: "https://search.yahoo.com/search?p={search}", icon: "yahoo.png" },
  { name: "Qwant", url: "https://www.qwant.com/?q={search}", icon: "qwant.png" },
  { name: "Ecosia", url: "https://www.ecosia.org/search?q={search}", icon: "ecosia.png" },
  { name: "GPT", url: "local", icon: "gpt.png" }
];

export const randomMessages = [
  { question: "What is the capital of France?" },
  { question: "How many planets are in our solar system?" },
  { question: "Who wrote the play 'Romeo and Juliet'?" },
  { question: "What is the tallest mountain in the world?" },
  { question: "What is the currency of Japan?" },
  { question: "Who painted the Mona Lisa?" },
  { question: "What is the largest ocean on Earth?" },
  { question: "Who is the current President of the United States?" },
  { question: "What is the boiling point of water in Celsius?" },
  { question: "Who discovered gravity?" },
  { question: "What is the largest country in the world?" },
  { question: "Roughly how many languages are spoken in the world today?" },
  { question: "What is the most popular sport in the world?" },
  { question: "Roughly how many people live in the world today?" },
  { question: "What is the most popular food in the world?" },
  { question: "What is the most popular animal in the world?" },
  { question: "What is the most popular TV show in the world?" },
  { question: "From which country did the Titanic set sail from?" },
  { question: "Popularized by the movie 'Jaws', what is the scientific name for a Great White Shark?" },
  { question: "In which country would you find the Leaning Tower of Pisa?" }
];