
import { Minimize2, X, SkipBack, SkipForward, Play, Pause, Heart, Volume2 } from "lucide-react";
import { Button } from "../../ui/button";
import { Slider } from "../../ui/slider";
import { formatTime } from "../utils";
import { useAudioPlayer } from "../AudioPlayerContext";
import { Song } from "../types";
import { cn } from "@/lib/utils";

interface ExpandedMobilePlayerProps {
  currentSong: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  volume: number;
  liked: boolean;
  onProgressChange: (value: number[]) => void;
  onVolumeChange: (value: number[]) => void;
  onLikeToggle: () => void;
  onCollapse: () => void;
  onClose: () => void;
}

const ExpandedMobilePlayer = ({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  progress,
  volume,
  liked,
  onProgressChange,
  onVolumeChange,
  onLikeToggle,
  onCollapse,
  onClose
}: ExpandedMobilePlayerProps) => {
  const { pause, resume } = useAudioPlayer();

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 md:hidden animate-fade-in">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="stars-bg"></div>
        <div className="nebula-glow"></div>
      </div>
      
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="ghost" size="icon" onClick={onCollapse} className="hover:bg-white/10 transition-colors">
          <Minimize2 size={20} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 transition-colors">
          <X size={20} />
        </Button>
      </div>
      
      <div className="w-full max-w-xs aspect-square mb-8 relative z-10 group">
        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-purple-500/10 to-transparent rounded-full blur-xl opacity-70 group-hover:opacity-100 animate-pulse transition-opacity"></div>
        <img
          src={currentSong.cover_url}
          alt={currentSong.title}
          className="w-full h-full object-cover rounded-xl shadow-xl relative z-10 animate-float"
        />
        <div className="absolute inset-0 rounded-xl overflow-hidden z-20">
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
      </div>
      
      <div className="w-full max-w-xs text-center mb-6 relative z-10">
        <h3 className="text-xl font-bold truncate animate-glow">{currentSong.title}</h3>
        <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
      </div>
      
      <div className="w-full max-w-xs mb-4 relative z-10">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <div className="relative flex-1">
            <Slider
              value={[progress]}
              max={1}
              step={0.001}
              className="flex-1"
              onValueChange={onProgressChange}
            />
            <div className="absolute h-full w-full top-1 pointer-events-none opacity-30">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse"></div>
            </div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-8 mb-8 relative z-10">
        <button
          className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 transform"
          onClick={() => console.log("Previous track")}
        >
          <SkipBack size={28} />
        </button>
        <button
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 group relative overflow-hidden",
            isPlaying
              ? "bg-primary hover:bg-primary/90"
              : "bg-primary hover:bg-primary/90"
          )}
          onClick={() => (isPlaying ? pause() : resume())}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute -inset-3 bg-primary/20 rounded-full blur-xl animate-pulse opacity-0 group-hover:opacity-100"></div>
          {isPlaying ? (
            <Pause size={28} fill="currentColor" />
          ) : (
            <Play size={28} fill="currentColor" className="ml-1" />
          )}
        </button>
        <button
          className="text-muted-foreground hover:text-foreground transition-all hover:scale-110 transform"
          onClick={() => console.log("Next track")}
        >
          <SkipForward size={28} />
        </button>
      </div>
      
      <div className="flex items-center justify-between w-full max-w-xs relative z-10">
        <button 
          onClick={onLikeToggle}
          className={cn(
            "transition-transform hover:scale-110",
            liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Heart 
            size={24} 
            fill={liked ? "currentColor" : "none"} 
            className={liked ? "animate-pulse" : ""}
          />
        </button>
        
        <div className="flex items-center gap-2">
          <Volume2 size={20} className="text-muted-foreground" />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            className="w-24"
            onValueChange={onVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ExpandedMobilePlayer;
