
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioPlayerProvider } from "./components/Player/AudioPlayer";
import Index from "./pages/Index";
import Search from "./pages/Search";
import Library from "./pages/Library";
import Friends from "./pages/Friends";
import Subscription from "./pages/Subscription";
import LikedSongs from "./pages/LikedSongs";
import Referrals from "./pages/Referrals";
import Music from "./pages/Music";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AudioPlayerProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/friends" element={<Friends />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/liked-songs" element={<LikedSongs />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/music" element={<Music />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AudioPlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
