"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface FavoritesContextType {
  // `id` tipi `string` olaraq dəyişdirildi
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  // `id` tipi `string` olaraq dəyişdirildi
  const [favorites, setFavorites] = useState<string[]>([]);

  // LocalStorage-dan favoritləri yüklə
  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: string) => {
    // `id` tipi `string` olaraq dəyişdirildi
    const newFavorites = favorites.includes(id)
      ? favorites.filter((favId) => favId !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const isFavorite = (id: string) => favorites.includes(id); // `id` tipi `string` olaraq dəyişdirildi

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};
