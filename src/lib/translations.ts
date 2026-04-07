export type Language = "en" | "me" | "ru";

export const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "me", label: "Crnogorski", flag: "🇲🇪" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

export type Translation = Record<string, any>;

export const translations: Record<Language, Translation> = {
  en: {
    banner: "Number one place for ads in Montenegro!",
    hero_title_1: "Buy, sell, find in",
    hero_title_accent: "Montenegro",
    hero_title_2: "!",
    search_button: "Search",
    cats: {
      neqliyyat: "Transport",
      dasinmaz_emlak: "Real Estate",
    },
    // Əgər aşağıda başqa açarlar (success_login_message və s.) varsa, onları da bura əlavə edin
  },
  me: {
    banner: "Adresa broj jedan za oglase u Crnoj Gori!",
    hero_title_1: "U Crnoj Gori",
    hero_title_accent: "kupi, prodaj",
    hero_title_2: ", pronađi!",
    search_button: "Traži",
    cats: {
      neqliyyat: "Prevoz",
      dasinmaz_emlak: "Nekretnine",
    },
  },
  ru: {
    banner: "Новые объявления каждый день!",
    hero_title_1: "В Черногории",
    hero_title_accent: "купи, продай",
    hero_title_2: ", найди!",
    search_button: "Поиск",
    cats: {
      neqliyyat: "Транспорт",
      dasinmaz_emlak: "Недвижимость",
    },
  },
};