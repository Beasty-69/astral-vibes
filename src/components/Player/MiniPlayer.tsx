
import { Pause, Play, SkipBack, SkipForward, Volume2, Heart, Minimize2, X } from "lucide-react";
import { useAudioPlayer } from "./AudioPlayer";
import { Slider } from "../ui/slider";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

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
    stop
  } = useAudioPlayer();

  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

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

  const toggleExpandedView = () => {
    setExpanded(!expanded);
  };

  const closePlayer = () => {
    stop();
  };

  if (!currentSong) return null;

  return (
    <>
      {/* Expanded Player (Mobile) */}
      {expanded && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 md:hidden">
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="ghost" size="icon" onClick={toggleExpandedView}>
              <Minimize2 size={20} />
            </Button>
            <Button variant="ghost" size="icon" onClick={closePlayer}>
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
                onValueChange={handleProgressChange}
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
              onClick={handleLikeToggle}
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
                onValueChange={handleVolumeChange}
              />
            </div>
          </div>
        </div>
      )}

      {/* Mini Player (Bottom bar) */}
      <div className="fixed bottom-0 left-0 right-0 h-16 md:h-20 bg-card glass border-t border-white/10 z-40">
        <div className="container h-full mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-3 flex-1 md:flex-none" onClick={toggleExpandedView}>
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
                  onValueChange={handleProgressChange}
                />
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="md:flex items-center gap-4 hidden">
              <button 
                onClick={handleLikeToggle}
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
                  onValueChange={handleVolumeChange}
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
                onClick={handleLikeToggle}
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
    </>
  );
};

export default MiniPlayer;
