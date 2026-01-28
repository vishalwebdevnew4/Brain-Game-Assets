import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { useGameProgress, useUpdateSettings } from "@/hooks/use-game";
import { Volume2, VolumeX, Settings, X, RotateCcw } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface GameLayoutProps {
  children: ReactNode;
  level?: number;
  onReset?: () => void;
  className?: string;
}

export function GameLayout({ children, level, onReset, className = "" }: GameLayoutProps) {
  const { data: user } = useGameProgress();
  const { mutate: updateSettings } = useUpdateSettings();
  const [location] = useLocation();
  const isHome = location === "/home";
  const isLevel = location.startsWith("/level");

  const toggleSound = () => {
    updateSettings({ sound: !user?.settings?.sound });
  };

  const toggleDarkMode = (checked: boolean) => {
    updateSettings({ darkMode: checked });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background text-foreground flex flex-col no-tap-highlight select-none">
      {/* Header Area */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-50 pointer-events-none">
        <div className="pointer-events-auto">
           {/* Level Indicator or Back Button could go here */}
           {level && (
             <motion.div 
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-4xl font-bold opacity-20 font-mono tracking-tighter"
             >
               {String(level).padStart(2, '0')}
             </motion.div>
           )}
        </div>

        <div className="flex gap-4 pointer-events-auto">
          {level && onReset && (
             <button 
               onClick={onReset}
               className="p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
               aria-label="Reset Level"
             >
               <RotateCcw className="w-5 h-5" />
             </button>
          )}

          {level && (
            <Link href="/levels" className="p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
              <X className="w-6 h-6" />
            </Link>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col relative z-10 ${className}`}>
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>

      {/* Footer Controls (Only on Home/Levels) */}
      {!isLevel && (
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-0 left-0 right-0 p-8 flex justify-between items-end z-40"
        >
          <button 
            onClick={toggleSound}
            className="p-3 rounded-full bg-card shadow-sm border border-border/50 text-foreground/80 hover:text-primary transition-all hover:scale-105 active:scale-95"
          >
            {user?.settings?.sound ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          <Dialog>
            <DialogTrigger asChild>
              <button className="p-3 rounded-full bg-card shadow-sm border border-border/50 text-foreground/80 hover:text-primary transition-all hover:scale-105 active:scale-95">
                <Settings className="w-6 h-6" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
              <DialogHeader>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>Configure your experience.</DialogDescription>
              </DialogHeader>
              <div className="py-6 space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex flex-col gap-1">
                    <span>Dark Mode</span>
                    <span className="text-xs text-muted-foreground">Embrace the void.</span>
                  </Label>
                  <Switch 
                    id="dark-mode" 
                    checked={user?.settings?.darkMode ?? false}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-mode" className="flex flex-col gap-1">
                    <span>Sound Effects</span>
                    <span className="text-xs text-muted-foreground">Clicks, thuds, and chimes.</span>
                  </Label>
                  <Switch 
                    id="sound-mode" 
                    checked={user?.settings?.sound ?? true}
                    onCheckedChange={(checked) => updateSettings({ sound: checked })}
                  />
                </div>
                
                <div className="pt-4 border-t border-border/50">
                  <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 justify-start" onClick={() => {
                    // In a real app, this would reset progress via API
                    localStorage.clear();
                    window.location.reload();
                  }}>
                    Reset Progress
                  </Button>
                </div>
              </div>
              <DialogClose />
            </DialogContent>
          </Dialog>
        </motion.footer>
      )}
    </div>
  );
}
