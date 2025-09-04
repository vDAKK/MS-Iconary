import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'ms-iconary-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Charger les favoris depuis le localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const favArray = JSON.parse(stored);
        setFavorites(new Set(favArray));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  // Sauvegarder les favoris dans le localStorage
  const saveFavorites = (newFavorites: Set<string>) => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(newFavorites)));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = (iconName: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(iconName)) {
        newFavorites.delete(iconName);
      } else {
        newFavorites.add(iconName);
      }
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (iconName: string) => favorites.has(iconName);

  const clearFavorites = () => {
    setFavorites(new Set());
    localStorage.removeItem(FAVORITES_KEY);
  };

  return {
    favorites: Array.from(favorites),
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.size
  };
};