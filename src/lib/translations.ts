// 🌍 Languages
export type Language = "en" | "me" | "ru";

// 🌐 Language list (Header üçün)
export const languages: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "me", label: "Crnogorski", flag: "🇲🇪" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

// 🧠 Translation type (yalnız string — problem çıxmasın deyə sadə saxladıq)
export type Translation = Record<string, string>;

// 🌎 Translations
export const translations: Record<Language, Translation> = {
  en: {
    banner: "Number one place for ads in Montenegro!",
    search_button: "Search",
    login: "Login",
    logout: "Logout",
    add_listing: "Post Ad",
    categories_title: "Categories",
    latest_ads: "Latest Ads",
    no_listings: "No listings yet",
    city_label: "City",
    price_label: "Price (€)",
    submit_btn: "Publish",
    loading: "Loading...",
    all_rights: "All rights reserved",
  },

  me: {
    banner: "Adresa broj jedan za oglase u Crnoj Gori!",
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
  },

  ru: {
    banner: "Лучшее место для объявлений в Черногории!",
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
  },
};