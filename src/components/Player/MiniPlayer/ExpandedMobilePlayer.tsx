
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
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 md:hidden">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="ghost" size="icon" onClick={onCollapse}>
          <Minimize2 size={20} />
        </Button>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>
      
      <div className="w-full max-w-xs aspect-square mb-8">
        <img
          src={currentSong.cover_url}
          alt={currentSong.title}
          className="w-full h-full object-cover rounded-xl shadow-xl"
        />
      </div>
      
      <div className="w-full max-w-xs text-center mb-6">
        <h3 className="text-xl font-bold truncate">{currentSong.title}</h3>
        <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
      </div>
      
      <div className="w-full max-w-xs mb-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <Slider
            value={[progress]}
            max={1}
            step={0.001}
            className="flex-1"
            onValueChange={onProgressChange}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-8 mb-8">
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => console.log("Previous track")}
        >
          <SkipBack size={28} />
        </button>
        <button
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
            isPlaying
              ? "bg-primary hover:bg-primary/90"
              : "bg-primary hover:bg-primary/90"
          )}
          onClick={() => (isPlaying ? pause() : resume())}
        >
          {isPlaying ? (
            <Pause size={28} fill="currentColor" />
          ) : (
            <Play size={28} fill="currentColor" />
          )}
        </button>
        <button
          className="text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => console.log("Next track")}
        >
          <SkipForward size={28} />
        </button>
      </div>
      
      <div className="flex items-center justify-between w-full max-w-xs">
        <button 
          onClick={onLikeToggle}
          className={cn(
            "transition-transform hover:scale-110",
            liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Heart size={24} fill={liked ? "currentColor" : "none"} />
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
