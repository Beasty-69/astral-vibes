
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
  hasNext: boolean;
  hasPrevious: boolean;
  onProgressChange: (value: number[]) => void;
  onVolumeChange: (value: number[]) => void;
  onLikeToggle: () => void;
  onPlayPrevious: () => void;
  onPlayNext: () => void;
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
  hasNext,
  hasPrevious,
  onProgressChange,
  onVolumeChange,
  onLikeToggle,
  onPlayPrevious,
  onPlayNext,
  onExpand
}: CompactPlayerProps) => {
  const { pause, resume } = useAudioPlayer();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 md:h-20 bg-card/80 glass backdrop-blur-xl border-t border-white/10 z-40 animate-fade-in">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="star-small"></div>
        <div className="star-medium"></div>
        <div className="star-large"></div>
      </div>
      <div className="container h-full mx-auto flex items-center justify-between px-4 relative z-10">
        <div className="flex items-center gap-3 flex-1 md:flex-none group" onClick={onExpand}>
          {currentSong?.cover_url ? (
            <div className="relative overflow-hidden rounded-md transition-transform group-hover:scale-105 duration-300">
              <img
                src={currentSong.cover_url}
                alt={currentSong.title}
                className="w-10 h-10 md:w-12 md:h-12 object-cover transform transition-transform hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 bg-nebula-400/10 rounded-md" />
          )}
          <div className="truncate">
            <h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">{currentSong?.title}</h4>
            <p className="text-xs text-muted-foreground truncate">{currentSong?.artist}</p>
          </div>
        </div>

        <div className="hidden md:flex flex-1 px-4 max-w-2xl">
          <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-6">
              <button
                className={cn(
                  "text-muted-foreground transition-colors hover:scale-110 transform",
                  hasPrevious ? "hover:text-foreground" : "opacity-50 cursor-not-allowed"
                )}
                onClick={onPlayPrevious}
                disabled={!hasPrevious}
              >
                <SkipBack size={20} />
              </button>
              <button
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 transform relative overflow-hidden group",
                  isPlaying
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-primary hover:bg-primary/90"
                )}
                onClick={() => (isPlaying ? pause() : resume())}
              >
                <div className="absolute inset-0 bg-nebula-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                {isPlaying ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" className="ml-1" />
                )}
              </button>
              <button
                className={cn(
                  "text-muted-foreground transition-colors hover:scale-110 transform",
                  hasNext ? "hover:text-foreground" : "opacity-50 cursor-not-allowed"
                )}
                onClick={onPlayNext}
                disabled={!hasNext}
              >
                <SkipForward size={20} />
              </button>
            </div>
            <div className="w-full flex items-center gap-2 text-xs text-muted-foreground">
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
              <Heart size={20} fill={liked ? "currentColor" : "none"} className={liked ? "animate-pulse" : ""} />
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
                "w-8 h-8 rounded-full flex items-center justify-center transition-colors relative overflow-hidden group",
                isPlaying
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-primary hover:bg-primary/90"
              )}
              onClick={() => (isPlaying ? pause() : resume())}
            >
              <div className="absolute inset-0 bg-nebula-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              {isPlaying ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} fill="currentColor" className="ml-0.5" />
              )}
            </button>
            <button 
              onClick={onLikeToggle}
              className={cn(
                "text-sm transition-transform",
                liked ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Heart size={16} fill={liked ? "currentColor" : "none"} className={liked ? "animate-pulse" : ""} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactPlayer;
