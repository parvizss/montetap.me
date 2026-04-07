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
    hero_subtitle: "From cars to real estate, everything is here.",
    search_placeholder: "Ex: iPhone 15, Mercedes, Apartment...",
    search_button: "Search",
    login: "Login",
    add_listing: "Post Ad",
    logout: "Logout",
    categories_title: "Categories",
    latest_ads: "Latest Ads",
    similar_ads: "Similar Ads",
    no_listings: "No ads found",
    change_params: "Please change your search parameters",
    view_all: "View all",
    stats_active: "Active ads",
    footer_desc: "Montenegro's largest free classifieds site.",
    about_us: "About us",
    support: "Support",
    footer_about_company: "About company",
    footer_rules: "Rules",
    footer_privacy: "Privacy policy",
    footer_ads: "Advertising",
    footer_contact: "Contact",
    footer_help: "Help center",
    footer_security: "Security",
    footer_faq: "FAQ",
    cats: {
      neqliyyat: "Transport",
      dasinmaz_emlak: "Real Estate",
    },
    success_logout_message: "Logged out successfully!",
    success_login_message: "Welcome!",
    success_profile_update_message: "Profile updated!",
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
    success_logout_message: "Uspješno ste se odjavili!",
    success_login_message: "Dobrodošli!",
    success_profile_update_message: "Profil je ažuriran!",
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
    success_logout_message: "Вы успешно вышли!",
    success_login_message: "Добро пожаловать!",
    success_profile_update_message: "Профиль обновлен!",
  },
};