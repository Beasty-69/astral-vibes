
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { AudioPlayerContext } from "./AudioPlayerContext";
import { useSongTracking } from "./useSongTracking";
import { useSongLikes } from "./useSongLikes";
import { Song } from "./types";

export { useAudioPlayer } from "./AudioPlayerContext";

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playTimer = useRef<NodeJS.Timeout | null>(null);

  const progress = currentTime / (duration || 1);
  const { trackPlayStart, trackPlayCompletion, trackPlayProgress } = useSongTracking();
  const { toggleLike, isLiked } = useSongLikes();

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
      
      if (currentSong) {
        trackPlayCompletion(currentSong.id, audio.duration);
      }
    });

    audio.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      toast.error("Failed to load audio");
      setIsPlaying(false);
    });

    return () => {
      if (playTimer.current) {
        clearTimeout(playTimer.current);
      }
      audio.pause();
      audio.src = "";
      audio.remove();
    };
  }, []);

  const play = async (song: Song) => {
    if (!audioRef.current) return;

    try {
      if (currentSong?.id === song.id) {
        await resume();
        return;
      }

      if (currentSong && isPlaying) {
        const playedDuration = currentTime;
        const completed = playedDuration >= duration * 0.9;
        
        trackPlayCompletion(currentSong.id, playedDuration);
      }

      audioRef.current.src = song.audio_url;
      audioRef.current.volume = volume;
      await audioRef.current.play();
      setCurrentSong(song);
      setIsPlaying(true);
      
      trackPlayStart(song.id);
      
      if (playTimer.current) {
        clearTimeout(playTimer.current);
      }
      
      playTimer.current = setInterval(() => {
        if (audioRef.current && currentSong && isPlaying) {
          const playedDuration = audioRef.current.currentTime;
          trackPlayProgress(currentSong.id, playedDuration);
        }
      }, 30000);
    } catch (error) {
      console.error("Playback error:", error);
      toast.error("Failed to play song");
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    
    if (currentSong) {
      const playedDuration = currentTime;
      trackPlayProgress(currentSong.id, playedDuration);
    }
  };

  const resume = async () => {
    if (!audioRef.current) return;
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error("Resume error:", error);
      toast.error("Failed to resume playback");
    }
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const updateVolume = (newVolume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  const stop = () => {
    if (!audioRef.current) return;
    
    if (currentSong && isPlaying) {
      const playedDuration = currentTime;
      trackPlayCompletion(currentSong.id, playedDuration);
    }
    
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    setCurrentSong(null);
    setCurrentTime(0);
    setDuration(0);
    
    if (playTimer.current) {
      clearTimeout(playTimer.current);
      playTimer.current = null;
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        duration,
        currentTime,
        progress,
        volume,
        play,
        pause,
        resume,
        seek,
        setVolume: updateVolume,
        toggleLike,
        isLiked,
        stop,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
