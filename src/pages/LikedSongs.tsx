
import { useState, useEffect } from "react";
import { Heart, Search as SearchIcon, Clock, PlayCircle } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAudioPlayer } from "@/components/Player/AudioPlayer";

const LikedSongs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { play } = useAudioPlayer();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: likedSongs, isLoading } = useQuery({
    queryKey: ["likedSongs", debouncedQuery],
    queryFn: async () => {
      try {
        // Fetch the liked songs with a join to the songs table
        const { data, error } = await supabase
          .from("liked_songs")
          .select(`
            song_id,
            liked_at,
            songs:song_id (
              id,
              title,
              artist,
              album,
              duration,
              audio_url,
              cover_url
            )
          `)
          .order("liked_at", { ascending: false });

        if (error) {
          console.error("Error fetching liked songs:", error);
          toast.error("Failed to fetch liked songs");
          return [];
        }

        // Filter by search query if provided
        let filteredData = data;
        if (debouncedQuery) {
          const lowerQuery = debouncedQuery.toLowerCase();
          filteredData = data.filter(
            (item) =>
              item.songs.title.toLowerCase().includes(lowerQuery) ||
              item.songs.artist.toLowerCase().includes(lowerQuery) ||
              (item.songs.album && item.songs.album.toLowerCase().includes(lowerQuery))
          );
        }

        return filteredData.map(item => ({
          id: item.songs.id,
          title: item.songs.title,
          artist: item.songs.artist,
          album: item.songs.album || "",
          duration: item.songs.duration,
          audio_url: item.songs.audio_url,
          cover_url: item.songs.cover_url,
          liked_at: item.liked_at
        }));
      } catch (error) {
        console.error("Error processing liked songs:", error);
        toast.error("Failed to process liked songs");
        return [];
      }
    }
  });

  const handlePlaySong = (song: any, index: number) => {
    // Create a playlist from the liked songs
    if (likedSongs && likedSongs.length > 0) {
      play(song, likedSongs);
      toast.success(`Now playing: ${song.title}`);
    } else {
      play(song);
      toast.success(`Now playing: ${song.title}`);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end gap-8 mb-8">
            <div className="flex-shrink-0 w-48 h-48 rounded-lg bg-gradient-to-br from-primary/20 to-purple-600/20 glass p-6 flex items-center justify-center">
              <Heart className="w-24 h-24 text-primary animate-pulse" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">PLAYLIST</h4>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Liked Songs
              </h1>
              <p className="text-muted-foreground">
                {likedSongs?.length || 0} songs
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative w-full md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search in liked songs..."
                className="w-full h-10 pl-10 pr-4 bg-card glass rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="glass rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading your liked songs...</p>
              </div>
            ) : likedSongs && likedSongs.length > 0 ? (
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left p-4">#</th>
                    <th className="text-left p-4">Title</th>
                    <th className="text-left p-4 hidden md:table-cell">Album</th>
                    <th className="text-right p-4">
                      <Clock size={16} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {likedSongs.map((song, index) => (
                    <tr
                      key={song.id}
                      className="hover:bg-white/5 transition-colors group cursor-pointer"
                      onClick={() => handlePlaySong(song, index)}
                    >
                      <td className="p-4 w-12">
                        <div className="flex items-center">
                          <span className="group-hover:hidden">{index + 1}</span>
                          <PlayCircle size={16} className="hidden group-hover:block text-primary" />
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {song.cover_url && (
                            <img
                              src={song.cover_url}
                              alt={song.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium">{song.title}</div>
                            <div className="text-sm text-muted-foreground">{song.artist}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{song.album}</td>
                      <td className="p-4 text-right text-muted-foreground">{formatDuration(song.duration)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  {debouncedQuery
                    ? "No matching songs found. Try a different search."
                    : "No liked songs yet. Start liking songs to see them here!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default LikedSongs;
