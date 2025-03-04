
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { AudioPlayerContext } from "./AudioPlayerContext";
import { useSongTracking } from "./useSongTracking";
import { useSongLikes } from "./useSongLikes";
import { Song, Playlist } from "./types";

export { useAudioPlayer } from "./AudioPlayerContext";

export const AudioPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playlist, setPlaylist] = useState<Playlist | null>(null);
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
      
      // Auto-play next song when current song ends
      if (playlist && playlist.currentIndex < playlist.songs.length - 1) {
        const nextIndex = playlist.currentIndex + 1;
        const nextSong = playlist.songs[nextIndex];
        
        // Small delay before playing next song
        setTimeout(() => {
          playFromPlaylist(nextSong, playlist.songs, nextIndex);
        }, 500);
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

  const playFromPlaylist = (song: Song, songs: Song[], index: number) => {
    if (!audioRef.current) return;
    
    setPlaylist({
      songs,
      currentIndex: index
    });
    
    audioRef.current.src = song.audio_url;
    audioRef.current.volume = volume;
    audioRef.current.play()
      .then(() => {
        setCurrentSong(song);
        setIsPlaying(true);
        trackPlayStart(song.id);
      })
      .catch((error) => {
        console.error("Playback error:", error);
        toast.error("Failed to play song");
      });
      
    if (playTimer.current) {
      clearTimeout(playTimer.current);
    }
    
    playTimer.current = setInterval(() => {
      if (audioRef.current && currentSong && isPlaying) {
        trackPlayProgress(currentSong.id, audioRef.current.currentTime);
      }
    }, 30000);
  };

  const play = async (song: Song, playlistSongs?: Song[]) => {
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
      
      // If a playlist is provided, update the playlist state
      if (playlistSongs) {
        const songIndex = playlistSongs.findIndex(s => s.id === song.id);
        if (songIndex !== -1) {
          playFromPlaylist(song, playlistSongs, songIndex);
          return;
        }
      }

      // Single song play
      audioRef.current.src = song.audio_url;
      audioRef.current.volume = volume;
      await audioRef.current.play();
      setCurrentSong(song);
      setIsPlaying(true);
      
      // Reset playlist when playing a single song
      setPlaylist(null);
      
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

  const playNext = () => {
    if (!playlist || !hasNext()) return;
    
    const nextIndex = playlist.currentIndex + 1;
    const nextSong = playlist.songs[nextIndex];
    playFromPlaylist(nextSong, playlist.songs, nextIndex);
  };
  
  const playPrevious = () => {
    if (!playlist || !hasPrevious()) return;
    
    const prevIndex = playlist.currentIndex - 1;
    const prevSong = playlist.songs[prevIndex];
    playFromPlaylist(prevSong, playlist.songs, prevIndex);
  };
  
  const hasNext = () => {
    return !!playlist && playlist.currentIndex < playlist.songs.length - 1;
  };
  
  const hasPrevious = () => {
    return !!playlist && playlist.currentIndex > 0;
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
    setPlaylist(null);
    
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
        playlist,
        play,
        pause,
        resume,
        seek,
        setVolume: updateVolume,
        toggleLike,
        isLiked,
        stop,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
