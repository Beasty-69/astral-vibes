
import { Pause, Play, SkipBack, SkipForward, Volume2, Heart } from "lucide-react";
import { useAudioPlayer } from "./AudioPlayer";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

const MiniPlayer = () => {
  const {
    currentSong,
    isPlaying,
    duration,
    currentTime,
    progress,
    volume,
    pause,
    resume,
    seek,
    setVolume,
    toggleLike,
    isLiked,
  } = useAudioPlayer();

  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Check if current song is liked when it changes
    const checkLikeStatus = async () => {
      if (currentSong) {
        const songIsLiked = await isLiked(currentSong.id);
        setLiked(songIsLiked);
      } else {
        setLiked(false);
      }
    };
    
    checkLikeStatus();
  }, [currentSong, isLiked]);

  const handleProgressChange = (value: number[]) => {
    seek(value[0] * duration);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const handleLikeToggle = async () => {
    if (currentSong) {
      await toggleLike(currentSong.id);
      setLiked(!liked); // Optimistic update
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card glass border-t border-white/10">
      <div className="container h-full mx-auto flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {currentSong?.cover_url ? (
            <img
              src={currentSong.cover_url}
              alt={currentSong.title}
              className="w-12 h-12 rounded-md object-cover"
            />
          ) : (
            <div className="w-12 h-12 bg-nebula-400/10 rounded-md animate-pulse" />
          )}
          <div>
            <h4 className="text-sm font-medium">
              {currentSong?.title || "Select a track"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {currentSong?.artist || "Play your favorite music"}
            </p>
          </div>
        </div>

        <div className="flex-1 px-4 max-w-2xl">
          <div className="flex flex-col items-center gap-2">
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
                onValueChange={handleProgressChange}
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleLikeToggle}
            className={cn(
              "hover:scale-110 transition-transform",
              liked ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
            disabled={!currentSong}
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
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
