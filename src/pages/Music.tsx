
import { useState, useEffect } from "react";
import { Search as SearchIcon, MusicIcon, PlayCircle, ExternalLink } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAudioPlayer } from "@/components/Player/AudioPlayer";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
}

const Music = () => {
  const [query, setQuery] = useState("");
  const [showFeatured, setShowFeatured] = useState(true);
  const { play } = useAudioPlayer();

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ["spotify-search", query],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke("spotify/search", {
          body: { query }
        });

        if (error) {
          console.error("Search error:", error);
          toast.error("Failed to search Spotify");
          return { tracks: { items: [] } };
        }

        return data;
      } catch (error) {
        console.error("Search error:", error);
        toast.error("Failed to search Spotify");
        return { tracks: { items: [] } };
      }
    },
    enabled: query.length > 0,
  });

  const { data: newReleases, isLoading: newReleasesLoading } = useQuery({
    queryKey: ["spotify-new-releases"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.functions.invoke("spotify/new-releases", {
          body: { limit: 10 }
        });

        if (error) {
          console.error("New releases error:", error);
          toast.error("Failed to fetch new releases");
          return { albums: { items: [] } };
        }

        return data;
      } catch (error) {
        console.error("New releases error:", error);
        toast.error("Failed to fetch new releases");
        return { albums: { items: [] } };
      }
    },
  });

  const handlePlayTrack = (track: SpotifyTrack) => {
    if (!track.preview_url) {
      toast.error("No preview available for this track");
      return;
    }
    
    // Convert Spotify track to our app's Song format
    const song = {
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      album: track.album.name,
      audio_url: track.preview_url,
      cover_url: track.album.images[0]?.url,
      duration: Math.floor(track.duration_ms / 1000)
    };
    
    play(song);
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (query) {
      setShowFeatured(false);
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Discover Music
            </h1>
            <div className="relative w-full md:w-64">
              <SearchIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={20}
              />
              <input
                type="text"
                placeholder="Search Spotify..."
                className="w-full h-12 pl-12 pr-4 bg-card glass rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {showFeatured && !searchLoading && (
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">New Releases</h2>
              {newReleasesLoading ? (
                <div className="glass p-8 rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {newReleases?.albums?.items?.map((album: any) => (
                    <div key={album.id} className="glass rounded-lg overflow-hidden transition-all hover:scale-105">
                      <a href={album.external_urls.spotify} target="_blank" rel="noopener noreferrer" className="block">
                        <div className="relative aspect-square">
                          <img 
                            src={album.images[0]?.url} 
                            alt={album.name} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ExternalLink className="text-white" size={24} />
                          </div>
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium truncate">{album.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">
                            {album.artists.map((a: any) => a.name).join(", ")}
                          </p>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {query && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">
                {searchLoading
                  ? "Searching..."
                  : `Search Results for "${query}"`}
              </h2>
              <div className="glass rounded-lg overflow-hidden">
                {searchLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">Searching Spotify...</p>
                  </div>
                ) : searchResults?.tracks?.items?.length > 0 ? (
                  <table className="w-full">
                    <thead className="border-b border-white/10">
                      <tr>
                        <th className="text-left p-4">#</th>
                        <th className="text-left p-4">Title</th>
                        <th className="text-left p-4 hidden md:table-cell">Album</th>
                        <th className="text-right p-4">Duration</th>
                        <th className="text-right p-4">Listen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.tracks.items.map((track: SpotifyTrack, index: number) => (
                        <tr
                          key={track.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="p-4 w-12">{index + 1}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {track.album.images[0] && (
                                <img
                                  src={track.album.images[0].url}
                                  alt={track.name}
                                  className="w-10 h-10 rounded object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">{track.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {track.artists.map(a => a.name).join(", ")}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 hidden md:table-cell text-muted-foreground">
                            {track.album.name}
                          </td>
                          <td className="p-4 text-right text-muted-foreground">
                            {formatDuration(track.duration_ms)}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {track.preview_url ? (
                                <button
                                  onClick={() => handlePlayTrack(track)}
                                  className="text-primary hover:text-primary/80 transition-colors"
                                >
                                  <PlayCircle size={20} />
                                </button>
                              ) : (
                                <span className="text-muted-foreground text-xs">No preview</span>
                              )}
                              <a 
                                href={track.external_urls.spotify} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <ExternalLink size={16} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center">
                    <MusicIcon size={40} className="mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">
                      {query
                        ? "No matching tracks found. Try a different search."
                        : "Start searching for tracks on Spotify."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {!query && !showFeatured && (
            <div className="p-8 text-center glass rounded-lg">
              <MusicIcon size={40} className="mx-auto text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">
                Start searching for music on Spotify
              </p>
            </div>
          )}
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Music;
