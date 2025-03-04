
import { Play, Pause, SkipBack, SkipForward, Heart, Volume2 } from "lucide-react";
import { Slider } from "../../ui/slider";
import { formatTime } from "../utils";
import { useAudioPlayer } from "../AudioPlayerContext";
import { Song } from "../types";
import { cn } from "@/lib/utils";

interface CompactPlayerProps {
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
  onExpand: () => void;
}

const CompactPlayer = ({
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
  onExpand
}: CompactPlayerProps) => {
  const { pause, resume } = useAudioPlayer();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 md:h-20 bg-card glass border-t border-white/10 z-40">
      <div className="container h-full mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-3 flex-1 md:flex-none" onClick={onExpand}>
          {currentSong?.cover_url ? (
            <img
              src={currentSong.cover_url}
              alt={currentSong.title}
              className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover"
            />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 bg-nebula-400/10 rounded-md" />
          )}
          <div className="truncate">
            <h4 className="text-sm font-medium truncate">{currentSong?.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{currentSong?.artist}</p>
          </div>
        </div>

        <div className="hidden md:flex flex-1 px-4 max-w-2xl">
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-6">
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => console.log("Previous track")}
              >
                <SkipBack size={20} />
              </button>
              <button
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                  isPlaying
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-primary hover:bg-primary/90"
                )}
                onClick={() => (isPlaying ? pause() : resume())}
              >
                {isPlaying ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" />
                )}
              </button>
              <button
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => console.log("Next track")}
              >
                <SkipForward size={20} />
              </button>
            </div>
            <div className="w-full flex items-center gap-2 text-xs text-muted-foreground">
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
        </div>

        <div className="flex items-center">
          <div className="md:flex items-center gap-4 hidden">
            <button 
              onClick={onLikeToggle}
              className={cn(
                "hover:scale-110 transition-transform",
                liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart size={20} fill={liked ? "currentColor" : "none"} />
            </button>
            <div className="flex items-center gap-2 min-w-32">
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
          
          {/* Mobile playback controls */}
          <div className="flex md:hidden items-center gap-3">
            <button
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                isPlaying
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-primary hover:bg-primary/90"
              )}
              onClick={() => (isPlaying ? pause() : resume())}
            >
              {isPlaying ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} fill="currentColor" />
              )}
            </button>
            <button 
              onClick={onLikeToggle}
              className={cn(
                "text-sm",
                liked ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactPlayer;
