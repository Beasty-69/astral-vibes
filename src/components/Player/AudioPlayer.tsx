
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  toggleLike: (songId: string) => Promise<void>;
  isLiked: (songId: string) => Promise<boolean>;
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
  const playTimer = useRef<NodeJS.Timeout | null>(null);

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
      
      // Track completion when song ends
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

  // Track when user starts playing a song
  const trackPlayStart = async (songId: string) => {
    try {
      const { error } = await supabase.from("play_history").insert({
        song_id: songId,
        played_duration: 0,
        completed: false
      });
      
      if (error) {
        console.error("Error tracking play start:", error);
      }
    } catch (error) {
      console.error("Failed to track play start:", error);
    }
  };

  // Track when user completes a song
  const trackPlayCompletion = async (songId: string, duration: number) => {
    try {
      const { error } = await supabase.from("play_history").insert({
        song_id: songId,
        played_duration: Math.floor(duration),
        completed: true
      });
      
      if (error) {
        console.error("Error tracking play completion:", error);
      }
    } catch (error) {
      console.error("Failed to track play completion:", error);
    }
  };

  const play = async (song: Song) => {
    if (!audioRef.current) return;

    try {
      if (currentSong?.id === song.id) {
        await resume();
        return;
      }

      // If we're changing songs and were already playing something
      if (currentSong && isPlaying) {
        // Track how much of the previous song was played
        const playedDuration = currentTime;
        const completed = playedDuration >= duration * 0.9; // Consider it completed if 90% played
        
        trackPlayCompletion(currentSong.id, playedDuration);
      }

      audioRef.current.src = song.audio_url;
      audioRef.current.volume = volume;
      await audioRef.current.play();
      setCurrentSong(song);
      setIsPlaying(true);
      
      // Track new song started
      trackPlayStart(song.id);
      
      // Set up timer to track progress for longer plays
      if (playTimer.current) {
        clearTimeout(playTimer.current);
      }
      
      // Track progress every 30 seconds for longer songs
      playTimer.current = setInterval(() => {
        if (audioRef.current && currentSong && isPlaying) {
          const playedDuration = audioRef.current.currentTime;
          
          // Update play history with current progress
          supabase.from("play_history").insert({
            song_id: currentSong.id,
            played_duration: Math.floor(playedDuration),
            completed: false
          }).then(({ error }) => {
            if (error) {
              console.error("Error updating play progress:", error);
            }
          });
        }
      }, 30000); // Every 30 seconds
      
    } catch (error) {
      console.error("Playback error:", error);
      toast.error("Failed to play song");
    }
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    
    // When pausing, record the progress
    if (currentSong) {
      const playedDuration = currentTime;
      
      supabase.from("play_history").insert({
        song_id: currentSong.id,
        played_duration: Math.floor(playedDuration),
        completed: false
      }).then(({ error }) => {
        if (error) {
          console.error("Error recording pause progress:", error);
        }
      });
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

  // Toggle like status for a song
  const toggleLike = async (songId: string) => {
    try {
      const liked = await isLiked(songId);
      
      if (liked) {
        // Unlike the song
        const { error } = await supabase
          .from("liked_songs")
          .delete()
          .eq("song_id", songId);
          
        if (error) {
          console.error("Error unliking song:", error);
          toast.error("Failed to unlike song");
          return;
        }
        
        toast.success("Removed from liked songs");
      } else {
        // Like the song
        const { error } = await supabase
          .from("liked_songs")
          .insert({ song_id: songId });
          
        if (error) {
          console.error("Error liking song:", error);
          toast.error("Failed to like song");
          return;
        }
        
        toast.success("Added to liked songs");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update liked status");
    }
  };

  // Check if a song is liked
  const isLiked = async (songId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("liked_songs")
        .select()
        .eq("song_id", songId)
        .maybeSingle();
        
      if (error) {
        console.error("Error checking like status:", error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error("Error checking like status:", error);
      return false;
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
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
