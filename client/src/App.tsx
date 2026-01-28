import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GameProvider } from "@/lib/gameContext";
import SplashScreen from "@/pages/splash";
import HomeScreen from "@/pages/home";
import LevelSelect from "@/pages/levels";
import PlayScreen from "@/pages/play";
import SettingsScreen from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={SplashScreen} />
      <Route path="/home" component={HomeScreen} />
      <Route path="/levels" component={LevelSelect} />
      <Route path="/play/:level" component={PlayScreen} />
      <Route path="/settings" component={SettingsScreen} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
          <div className="max-w-md mx-auto min-h-screen bg-background">
            <Router />
          </div>
          <Toaster />
        </GameProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
