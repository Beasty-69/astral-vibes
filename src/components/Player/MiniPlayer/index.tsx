
import { useState, useEffect } from "react";
import { useAudioPlayer } from "../AudioPlayerContext";
import ExpandedMobilePlayer from "./ExpandedMobilePlayer";
import CompactPlayer from "./CompactPlayer";

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
        <ExpandedMobilePlayer
          currentSong={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          progress={progress}
          volume={volume}
          liked={liked}
          onProgressChange={handleProgressChange}
          onVolumeChange={handleVolumeChange}
          onLikeToggle={handleLikeToggle}
          onCollapse={toggleExpandedView}
          onClose={closePlayer}
        />
      )}

      {/* Mini Player (Bottom bar) */}
      <CompactPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        progress={progress}
        volume={volume}
        liked={liked}
        onProgressChange={handleProgressChange}
        onVolumeChange={handleVolumeChange}
        onLikeToggle={handleLikeToggle}
        onExpand={toggleExpandedView}
      />
    </>
  );
};

export default MiniPlayer;
