
import { useState } from "react";
import { Search as SearchIcon, PlayCircle } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Search = () => {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 1, name: "Hip Hop", color: "from-purple-500 to-pink-500" },
    { id: 2, name: "Rock", color: "from-red-500 to-orange-500" },
    { id: 3, name: "Jazz", color: "from-blue-500 to-teal-500" },
    { id: 4, name: "Electronic", color: "from-green-500 to-emerald-500" },
    { id: 5, name: "Classical", color: "from-yellow-500 to-amber-500" },
    { id: 6, name: "R&B", color: "from-pink-500 to-rose-500" },
  ];

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", query, selectedCategory],
    queryFn: async () => {
      try {
        let query_builder = supabase
          .from("songs")
          .select("*");

        if (query) {
          query_builder = query_builder.or(`title.ilike.%${query}%,artist.ilike.%${query}%`);
        }

        if (selectedCategory) {
          query_builder = query_builder.eq("genre", selectedCategory);
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
    enabled: query.length > 0 || selectedCategory !== null,
  });

  const handlePlaySong = (songId: string) => {
    // This will be implemented in the next step with the audio playback feature
    console.log("Playing song:", songId);
    toast.info("Audio playback will be implemented in the next step!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-8">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
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
                  ${selectedCategory === category.name ? 'ring-2 ring-primary scale-[0.98]' : ''}`}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.name ? null : category.name
                )}
              >
                <div className={`w-full h-full bg-gradient-to-br ${category.color} p-4 flex items-end`}>
                  <h3 className="text-lg font-bold">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>

          {(query || selectedCategory) && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">
                {isLoading ? "Searching..." : `Search Results (${searchResults?.length || 0})`}
              </h3>
              <div className="glass rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="text-left p-4">#</th>
                      <th className="text-left p-4">Title</th>
                      <th className="text-left p-4 hidden md:table-cell">Artist</th>
                      <th className="text-left p-4 hidden md:table-cell">Album</th>
                      <th className="text-right p-4">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults?.map((song, index) => (
                      <tr
                        key={song.id}
                        className="hover:bg-white/5 transition-colors group cursor-pointer"
                        onClick={() => handlePlaySong(song.id)}
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
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">
                          {song.artist}
                        </td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">
                          {song.album}
                        </td>
                        <td className="p-4 text-right text-muted-foreground">
                          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
