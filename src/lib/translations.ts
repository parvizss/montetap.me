// 🌍 Supported languages
export type Language = "en" | "me" | "ru";

// 🌐 Language list (Header üçün)
export const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "me", label: "Crnogorski", flag: "🇲🇪" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

// 🧠 Translation type (string + nested object dəstəyi)
export type Translation = {
  [key: string]: string | Record<string, string>;
};

// 🌎 Translations
export const translations: Record<Language, Translation> = {
  en: {
    banner: "Number one place for ads in Montenegro!",
    hero_title_1: "Buy, sell, find in",
    hero_title_accent: "Montenegro",
    hero_title_2: "!",

    search_placeholder: "Search...",
    search_button: "Search",

    login: "Login",
    logout: "Logout",
    add_listing: "Post Ad",

    categories_title: "Categories",
    latest_ads: "Latest Ads",
    no_listings: "No ads found",

    city_label: "City",
    price_label: "Price (€)",
    submit_btn: "Publish",

    loading: "Loading...",
    all_rights: "All rights reserved",

    cats: {
      neqliyyat: "Transport",
      dasinmaz_emlak: "Real Estate",
      elektronika: "Electronics",
      geyim: "Clothing",
    },
  },

  me: {
    banner: "Adresa broj jedan za oglase u Crnoj Gori!",
    hero_title_1: "U Crnoj Gori",
    hero_title_accent: "kupi, prodaj",
    hero_title_2: ", pronađi!",

    search_placeholder: "Pretraga...",
    search_button: "Traži",

    login: "Prijavi se",
    logout: "Odjava",
    add_listing: "Postavi oglas",

    categories_title: "Kategorije",
    latest_ads: "Najnoviji oglasi",
    no_listings: "Nema oglasa",

    city_label: "Grad",
    price_label: "Cijena (€)",
    submit_btn: "Objavi",

    loading: "Učitavanje...",
    all_rights: "Sva prava zadržana",

    cats: {
      neqliyyat: "Prevoz",
      dasinmaz_emlak: "Nekretnine",
      elektronika: "Elektronika",
      geyim: "Odjeća",
    },
  },

  ru: {
    banner: "Лучшее место для объявлений в Черногории!",
    hero_title_1: "В Черногории",
    hero_title_accent: "купи, продай",
    hero_title_2: ", найди!",

    search_placeholder: "Поиск...",
    search_button: "Поиск",

    login: "Войти",
    logout: "Выйти",
    add_listing: "Добавить объявление",

    categories_title: "Категории",
    latest_ads: "Последние объявления",
    no_listings: "Ничего не найдено",

    city_label: "Город",
    price_label: "Цена (€)",
    submit_btn: "Опубликовать",

    loading: "Загрузка...",
    all_rights: "Все права защищены",

    cats: {
      neqliyyat: "Транспорт",
      dasinmaz_emlak: "Недвижимость",
      elektronika: "Электроника",
      geyim: "Одежда",
    },
  },
};