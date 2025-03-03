
import { useState, useEffect } from "react";
import { Search, Play } from "lucide-react";
import { Disc } from "lucide-react";
import { toast } from "sonner";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/ui/back-button";

const Music = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch new releases when the component mounts
    fetchNewReleases();
  }, []);

  const fetchNewReleases = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("deezer", {
        body: {
          action: "new-releases"
        }
      });

      if (error) throw error;
      
      if (data && Array.isArray(data.data)) {
        setNewReleases(data.data);
      }
    } catch (error) {
      console.error('Error fetching new releases:', error);
      toast.error("Failed to load new releases");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const { data, error } = await supabase.functions.invoke("deezer", {
        body: {
          action: "search",
          query: searchQuery
        }
      });

      if (error) throw error;
      
      if (data && Array.isArray(data.data)) {
        setTracks(data.data);
      }
    } catch (error) {
      console.error('Error searching tracks:', error);
      toast.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const handlePlayTrack = async (track) => {
    try {
      // First check if the track already exists in our database
      const { data: existingTracks, error: fetchError } = await supabase
        .from('songs')
        .select('*')
        .eq('external_id', `deezer:${track.id}`)
        .limit(1);
      
      if (fetchError) throw fetchError;
      
      let songId;
      
      // If the track doesn't exist, add it
      if (!existingTracks || existingTracks.length === 0) {
        // Add the track to our database
        const { data: newSong, error: insertError } = await supabase
          .from('songs')
          .insert({
            title: track.title,
            artist: track.artist.name,
            album: track.album.title,
            duration: track.duration,
            cover_image: track.album.cover_xl || track.album.cover,
            audio_url: track.preview,
            external_id: `deezer:${track.id}`
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        songId = newSong.id;
      } else {
        songId = existingTracks[0].id;
      }
      
      // Now play the track
      // This is a simplified version - in a real app, you'd update the audio player state
      toast.success(`Playing: ${track.title}`);
      
      // Example: dispatch event to audio player
      const event = new CustomEvent('play-track', { 
        detail: { id: songId }
      });
      window.dispatchEvent(event);
      
    } catch (error) {
      console.error('Error playing track:', error);
      toast.error("Failed to play track");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <BackButton />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Discover Music
            </h1>
          </div>

          <div className="glass p-6 rounded-lg mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search for songs, artists or albums..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery.trim()}
                className="w-full md:w-auto"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            {tracks.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tracks.slice(0, 8).map((track) => (
                    <div 
                      key={track.id}
                      className="glass p-4 rounded-lg hover:bg-card/60 transition-all duration-300 hover:scale-105"
                    >
                      <div className="aspect-square overflow-hidden rounded-md mb-4">
                        <img 
                          src={track.album.cover_medium || '/placeholder.svg'} 
                          alt={track.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold truncate">{track.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{track.artist.name}</p>
                      <div className="mt-2 flex justify-center">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handlePlayTrack(track)}
                        >
                          <Play size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">New Releases</h2>
            {loading ? (
              <div className="flex justify-center p-12">
                <span className="animate-spin h-12 w-12 text-primary">
                  <Disc size={48} />
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {newReleases.slice(0, 8).map((track) => (
                  <div 
                    key={track.id}
                    className="glass p-4 rounded-lg hover:bg-card/60 transition-all duration-300 hover:scale-105"
                  >
                    <div className="aspect-square overflow-hidden rounded-md mb-4">
                      <img 
                        src={track.album.cover_medium || '/placeholder.svg'} 
                        alt={track.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold truncate">{track.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{track.artist.name}</p>
                    <div className="mt-2 flex justify-center">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handlePlayTrack(track)}
                      >
                        <Play size={18} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Music;
