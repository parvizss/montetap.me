export type Language = "en" | "me" | "ru";

export const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "me", label: "Crnogorski", flag: "🇲🇪" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export type Translation = Record<string, string>;

export const translations: Record<Language, Translation> = {
  en: {
    banner: "Number one place for ads in Montenegro!",
    search_button: "Search",
  },
  me: {
    banner: "Najbolji oglasi u Crnoj Gori!",
    search_button: "Traži",
  },
  ru: {
    banner: "Лучшие объявления в Черногории!",
    search_button: "Поиск",
  },
};