import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface FavoritesContextType {
  favoriteIds: string[];
  isFavorite: (recipeId: string) => boolean;
  toggleFavorite: (recipeId: string) => Promise<void>;
  count: number;
  refresh: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const { status } = useSession();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const refresh = useCallback(async () => {
    if (status !== "authenticated") {
      setFavoriteIds([]);
      return;
    }
    try {
      const res = await fetch("/api/favorites");
      if (!res.ok) return;
      const data = (await res.json()) as { recipeId: string }[];
      setFavoriteIds(data.map((f) => f.recipeId));
    } catch {
      // fail silently — favorites are non-critical
    }
  }, [status]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isFavorite = useCallback(
    (recipeId: string) => favoriteIds.includes(recipeId),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (recipeId: string) => {
      // Optimistic update
      setFavoriteIds((prev) =>
        prev.includes(recipeId) ? prev.filter((id) => id !== recipeId) : [...prev, recipeId]
      );
      try {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeId }),
        });
      } catch {
        refresh(); // revert to server truth on error
      }
    },
    [refresh]
  );

  return (
    <FavoritesContext.Provider
      value={{ favoriteIds, isFavorite, toggleFavorite, count: favoriteIds.length, refresh }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
