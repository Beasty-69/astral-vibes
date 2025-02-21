
import { Play, SkipBack, SkipForward } from "lucide-react";

const MiniPlayer = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card glass border-t border-white/10">
      <div className="container h-full mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-nebula-400/10 rounded-md animate-pulse" />
          <div>
            <h4 className="text-sm font-medium">Select a track</h4>
            <p className="text-xs text-muted-foreground">Play your favorite music</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipBack size={20} />
          </button>
          <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors">
            <Play size={20} fill="currentColor" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
        
        <div className="w-48">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="w-0 h-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
