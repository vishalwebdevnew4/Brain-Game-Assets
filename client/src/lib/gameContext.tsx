import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "./queryClient";
import { HINT_COST, SKIP_COST, LEVEL_REWARD, TOTAL_LEVELS } from "@shared/routes";

interface UserData {
  id: number;
  sessionId: string;
  coins: number;
  maxLevel: number;
  levelData: Record<number, { completed: boolean; hintsUsed: number }>;
  settings: { sound: boolean; music: boolean; darkMode: boolean };
}

interface GameContextType {
  user: UserData | null;
  isLoading: boolean;
  coins: number;
  maxLevel: number;
  settings: { sound: boolean; music: boolean; darkMode: boolean };
  completeLevel: (level: number) => Promise<void>;
  useHint: (level: number) => Promise<boolean>;
  skipLevel: (level: number) => Promise<boolean>;
  addCoins: (amount: number) => Promise<void>;
  updateSettings: (settings: Partial<{ sound: boolean; music: boolean; darkMode: boolean }>) => Promise<void>;
  resetProgress: () => Promise<void>;
  isLevelCompleted: (level: number) => boolean;
  isLevelUnlocked: (level: number) => boolean;
  getHintsUsed: (level: number) => number;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useQuery<UserData>({
    queryKey: ["/api/progress"],
  });

  const completeLevelMutation = useMutation({
    mutationFn: async (level: number) => {
      return apiRequest("/api/progress/complete", "POST", { level, completed: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  const useHintMutation = useMutation({
    mutationFn: async (level: number) => {
      return apiRequest("/api/hint", "POST", { level });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  const skipLevelMutation = useMutation({
    mutationFn: async (level: number) => {
      return apiRequest("/api/skip", "POST", { level });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  const addCoinsMutation = useMutation({
    mutationFn: async (amount: number) => {
      return apiRequest("/api/coins", "POST", { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<{ sound: boolean; music: boolean; darkMode: boolean }>) => {
      return apiRequest("/api/settings", "PATCH", settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  const resetProgressMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/reset", "POST", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  useEffect(() => {
    if (user?.settings?.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [user?.settings?.darkMode]);

  const completeLevel = useCallback(async (level: number) => {
    await completeLevelMutation.mutateAsync(level);
  }, [completeLevelMutation]);

  const useHint = useCallback(async (level: number): Promise<boolean> => {
    try {
      await useHintMutation.mutateAsync(level);
      return true;
    } catch {
      return false;
    }
  }, [useHintMutation]);

  const skipLevel = useCallback(async (level: number): Promise<boolean> => {
    try {
      await skipLevelMutation.mutateAsync(level);
      return true;
    } catch {
      return false;
    }
  }, [skipLevelMutation]);

  const addCoins = useCallback(async (amount: number) => {
    await addCoinsMutation.mutateAsync(amount);
  }, [addCoinsMutation]);

  const updateSettings = useCallback(async (settings: Partial<{ sound: boolean; music: boolean; darkMode: boolean }>) => {
    await updateSettingsMutation.mutateAsync(settings);
  }, [updateSettingsMutation]);

  const resetProgress = useCallback(async () => {
    await resetProgressMutation.mutateAsync();
  }, [resetProgressMutation]);

  const isLevelCompleted = useCallback((level: number): boolean => {
    return user?.levelData?.[level]?.completed || false;
  }, [user]);

  const isLevelUnlocked = useCallback((level: number): boolean => {
    return level <= (user?.maxLevel || 1);
  }, [user]);

  const getHintsUsed = useCallback((level: number): number => {
    return user?.levelData?.[level]?.hintsUsed || 0;
  }, [user]);

  return (
    <GameContext.Provider
      value={{
        user: user || null,
        isLoading,
        coins: user?.coins || 0,
        maxLevel: user?.maxLevel || 1,
        settings: user?.settings || { sound: true, music: true, darkMode: false },
        completeLevel,
        useHint,
        skipLevel,
        addCoins,
        updateSettings,
        resetProgress,
        isLevelCompleted,
        isLevelUnlocked,
        getHintsUsed,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}

export { HINT_COST, SKIP_COST, LEVEL_REWARD, TOTAL_LEVELS };
