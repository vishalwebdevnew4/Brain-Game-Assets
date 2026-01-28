import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useThemeSync } from "@/hooks/use-game";

import NotFound from "@/pages/not-found";
import Splash from "@/pages/Splash";
import Home from "@/pages/Home";
import LevelSelect from "@/pages/LevelSelect";
import Level from "@/pages/Level";

function GameRouter() {
  // Sync theme based on user settings
  useThemeSync();

  return (
    <Switch>
      <Route path="/" component={Splash} />
      <Route path="/home" component={Home} />
      <Route path="/levels" component={LevelSelect} />
      <Route path="/level/:id" component={Level} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameRouter />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
