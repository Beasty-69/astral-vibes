
import { useState, useEffect } from "react";
import { Search as SearchIcon, PlayCircle } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAudioPlayer } from "@/components/Player/AudioPlayer";
import { Song } from "@/components/Player/types";

const Search = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const { play } = useAudioPlayer();

  // Debounce search query to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const categories = [
    { id: 1, name: "Hip Hop", color: "from-purple-500 to-pink-500" },
    { id: 2, name: "Rock", color: "from-red-500 to-orange-500" },
    { id: 3, name: "Jazz", color: "from-blue-500 to-teal-500" },
    { id: 4, name: "Electronic", color: "from-green-500 to-emerald-500" },
    { id: 5, name: "Classical", color: "from-yellow-500 to-amber-500" },
    { id: 6, name: "R&B", color: "from-pink-500 to-rose-500" },
  ];

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery, selectedCategory],
    queryFn: async () => {
      try {
        let query_builder = supabase.from("songs").select("*");

        if (debouncedQuery) {
          query_builder = query_builder.or(
            `title.ilike.%${debouncedQuery}%,artist.ilike.%${debouncedQuery}%`
          );
        }

        if (selectedCategory) {
          query_builder = query_builder.eq("genre", selectedCategory);
        }

        // If no search criteria, return empty array (avoid loading all songs)
        if (!debouncedQuery && !selectedCategory) {
          return [];
        }

        const { data, error } = await query_builder.limit(20);

        if (error) {
          console.error("Search error:", error);
          toast.error("Failed to search songs");
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to search songs");
        return [];
      }
    },
    enabled: debouncedQuery.length > 0 || selectedCategory !== null,
  });

  // Mock songs for demo purposes if the database is empty
  const mockSongs: Song[] = [
    {
      id: "mock-1",
      title: "Midnight Dreams",
      artist: "Cosmic Harmony",
      audio_url: "https://www.chosic.com/wp-content/uploads/2021/07/The-Podcast-Intro.mp3",
      cover_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
      duration: 180
    },
    {
      id: "mock-2", 
      title: "Stellar Journey",
      artist: "Galaxy Travelers",
      audio_url: "https://www.chosic.com/wp-content/uploads/2021/04/April-Showers.mp3",
      cover_url: "https://images.unsplash.com/photo-1614149162883-504ce4d13909",
      duration: 210
    },
    {
      id: "mock-3",
      title: "Nebula Waltz",
      artist: "Cosmic Symphony",
      audio_url: "https://www.chosic.com/wp-content/uploads/2021/07/purrple-cat-equinox.mp3",
      cover_url: "https://images.unsplash.com/photo-1545128485-c400e7702796",
      duration: 195
    }
  ];

  // Combine real and mock results when needed
  const displayResults = searchResults?.length ? searchResults : 
    (debouncedQuery || selectedCategory) ? mockSongs : [];

  const handlePlaySong = (song: Song) => {
    // Play song within the context of all current search results
    play(song, displayResults);
    toast.success(`Now playing: ${song.title}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-8">
            <SearchIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={20}
            />
            <input
              type="text"
              placeholder="What do you want to listen to?"
              className="w-full h-12 pl-12 pr-4 bg-card glass rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <h2 className="text-2xl font-bold mb-6">Browse All</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`aspect-square rounded-lg overflow-hidden card-hover cursor-pointer transition-transform 
                  ${
                    selectedCategory === category.name
                      ? "ring-2 ring-primary scale-[0.98]"
                      : ""
                  }`}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  )
                }
              >
                <div
                  className={`w-full h-full bg-gradient-to-br ${category.color} p-4 flex items-end`}
                >
                  <h3 className="text-lg font-bold">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>

          {(debouncedQuery || selectedCategory) && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                {isLoading
                  ? "Searching..."
                  : `Search Results (${displayResults?.length || 0})`}
              </h3>
              <div className="glass rounded-lg overflow-hidden">
                {isLoading ? (
                  <div className="p-8 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-t-2 border-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-muted-foreground">Searching for songs...</p>
                  </div>
                ) : displayResults.length > 0 ? (
                  <table className="w-full">
                    <thead className="border-b border-white/10">
                      <tr>
                        <th className="text-left p-4">#</th>
                        <th className="text-left p-4">Title</th>
                        <th className="text-left p-4 hidden md:table-cell">
                          Artist
                        </th>
                        <th className="text-left p-4 hidden md:table-cell">
                          Album
                        </th>
                        <th className="text-right p-4">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayResults.map((song, index) => (
                        <tr
                          key={song.id}
                          className="hover:bg-white/5 transition-colors group cursor-pointer"
                          onClick={() => handlePlaySong(song)}
                        >
                          <td className="p-4 w-12">
                            <div className="flex items-center">
                              <span className="group-hover:hidden">{index + 1}</span>
                              <PlayCircle
                                size={16}
                                className="hidden group-hover:block text-primary"
                              />
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
                              </div>
                            </div>
                          </td>
                          <td className="p-4 hidden md:table-cell text-muted-foreground">
                            {song.artist}
                          </td>
                          <td className="p-4 hidden md:table-cell text-muted-foreground">
                            {song.album || "-"}
                          </td>
                          <td className="p-4 text-right text-muted-foreground">
                            {Math.floor(song.duration / 60)}:
                            {(song.duration % 60).toString().padStart(2, "0")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">
                      No songs found matching your search. Try another query or category.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Search;
