
export interface Song {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  cover_url?: string | null;
  duration: number;
}

export interface AudioPlayerContextType {
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
  stop: () => void;
}
