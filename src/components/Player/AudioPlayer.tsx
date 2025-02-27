
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { toast } from "sonner";

interface AudioPlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
  progress: number;
  volume: number;
  play: (song: Song) => void;
  pause: () => void;
  resume: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  cover_url?: string | null;
  duration: number;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider");
  }
  return context;
};

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const progress = currentTime / (duration || 1);

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
    });

    audio.addEventListener("error", (e) => {
      console.error("Audio error:", e);
      toast.error("Failed to load audio");
      setIsPlaying(false);
    });

    return () => {
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

      audioRef.current.src = song.audio_url;
      audioRef.current.volume = volume;
      await audioRef.current.play();
      setCurrentSong(song);
      setIsPlaying(true);
    } catch (error) {
      console.error("Playback error:", error);
      toast.error("Failed to play song");
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
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
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

