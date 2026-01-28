import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertUser } from "@shared/routes";
import { useEffect } from "react";

// Hook for fetching game progress and settings
export function useGameProgress() {
  return useQuery({
    queryKey: [api.progress.get.path],
    queryFn: async () => {
      const res = await fetch(api.progress.get.path, { credentials: "include" });
      if (res.status === 404) return null; // New user
      if (!res.ok) throw new Error("Failed to fetch progress");
      return api.progress.get.responses[200].parse(await res.json());
    },
    staleTime: 1000 * 60, // Keep fresh for a minute, we update optimistically mainly
  });
}

// Hook for updating level progress
export function useUpdateLevel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (level: number) => {
      const res = await fetch(api.progress.update.path, {
        method: api.progress.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update progress");
      return api.progress.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.progress.get.path], data);
    },
  });
}

// Hook for updating settings (sound, dark mode)
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: { sound?: boolean; darkMode?: boolean }) => {
      const res = await fetch(api.progress.updateSettings.path, {
        method: api.progress.updateSettings.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return api.progress.updateSettings.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.setQueryData([api.progress.get.path], data);
      
      // Apply dark mode immediately
      if (data.settings.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
  });
}

// Helper hook to sync dark mode on initial load
export function useThemeSync() {
  const { data } = useGameProgress();
  
  useEffect(() => {
    if (data?.settings?.darkMode) {
      document.documentElement.classList.add('dark');
    } else if (data?.settings?.darkMode === false) {
      document.documentElement.classList.remove('dark');
    } else {
      // Default behavior if no setting: check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    }
  }, [data]);
}
