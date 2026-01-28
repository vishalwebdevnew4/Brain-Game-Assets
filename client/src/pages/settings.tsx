import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Volume2, VolumeX, Music, Moon, Sun, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGame } from "@/lib/gameContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SettingsScreen() {
  const [, setLocation] = useLocation();
  const { settings, updateSettings, resetProgress, coins, maxLevel } = useGame();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    await resetProgress();
    setIsResetting(false);
    setLocation("/home");
  };

  return (
    <div className="min-h-screen bg-background" data-testid="settings-screen">
      <header className="flex items-center gap-4 p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => setLocation("/home")} data-testid="button-back">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Audio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.sound ? (
                  <Volume2 className="w-5 h-5 text-foreground" />
                ) : (
                  <VolumeX className="w-5 h-5 text-muted-foreground" />
                )}
                <span className="text-foreground">Sound Effects</span>
              </div>
              <Switch
                checked={settings.sound}
                onCheckedChange={(checked) => updateSettings({ sound: checked })}
                data-testid="toggle-sound"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className={`w-5 h-5 ${settings.music ? "text-foreground" : "text-muted-foreground"}`} />
                <span className="text-foreground">Background Music</span>
              </div>
              <Switch
                checked={settings.music}
                onCheckedChange={(checked) => updateSettings({ music: checked })}
                data-testid="toggle-music"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Display</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.darkMode ? (
                  <Moon className="w-5 h-5 text-foreground" />
                ) : (
                  <Sun className="w-5 h-5 text-foreground" />
                )}
                <span className="text-foreground">Dark Mode</span>
              </div>
              <Switch
                checked={settings.darkMode}
                onCheckedChange={(checked) => updateSettings({ darkMode: checked })}
                data-testid="toggle-dark-mode"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{maxLevel - 1}</p>
                <p className="text-sm text-muted-foreground">Levels Completed</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{coins}</p>
                <p className="text-sm text-muted-foreground">Coins</p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full" data-testid="button-reset">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Progress
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all your progress, coins, and start you back at Level 1. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel data-testid="button-cancel-reset">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} disabled={isResetting} data-testid="button-confirm-reset">
                    {isResetting ? "Resetting..." : "Reset Everything"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
