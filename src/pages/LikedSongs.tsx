
import { useState, useEffect } from "react";
import { Heart, Search as SearchIcon, Clock, PlayCircle } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import BackButton from "@/components/ui/back-button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAudioPlayer } from "@/components/Player/AudioPlayer";
import PaginationControls from "@/components/ui/pagination-controls";

const ITEMS_PER_PAGE = 10; // Number of songs per page

const LikedSongs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { play } = useAudioPlayer();

  const { data: allLikedSongs, isLoading } = useQuery({
    queryKey: ["likedSongs", searchQuery],
    queryFn: async () => {
      try {
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

        let filteredData = data;
        if (searchQuery) {
          const lowerQuery = searchQuery.toLowerCase();
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

  // Calculate pagination values
  const likedSongs = allLikedSongs || [];
  const totalPages = Math.ceil(likedSongs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSongs = likedSongs.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const showPagination = likedSongs.length > ITEMS_PER_PAGE;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of results when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaySong = (song: any) => {
    play(song);
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
          <div className="flex items-center gap-2 mb-8">
            <BackButton />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Liked Songs
            </h1>
          </div>

          <div className="mb-6">
            <div className="relative w-full md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search in liked songs..."
                className="w-full h-10 pl-10 pr-4 bg-card glass rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
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
              <>
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left p-4">#</th>
                      <th className="text-left p-4">Title</th>
                      <th className="text-left p-4">Album</th>
                      <th className="text-right p-4">
                        <Clock size={16} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSongs.map((song, index) => (
                      <tr
                        key={song.id}
                        className="hover:bg-white/5 transition-colors group cursor-pointer"
                        onClick={() => handlePlaySong(song)}
                      >
                        <td className="p-4 w-12">
                          <div className="flex items-center">
                            <span className="group-hover:hidden">{startIndex + index + 1}</span>
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
                        <td className="p-4 text-muted-foreground">{song.album}</td>
                        <td className="p-4 text-right text-muted-foreground">{formatDuration(song.duration)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {showPagination && (
                  <div className="p-4 border-t border-white/10">
                    <PaginationControls
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  {searchQuery
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
