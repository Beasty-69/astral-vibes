
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import { supabase } from "@/integrations/supabase/client";
import BackButton from "@/components/ui/back-button";
import SearchForm from "@/components/music/SearchForm";
import SearchResults from "@/components/music/SearchResults";
import NewReleases from "@/components/music/NewReleases";
import { Track } from "@/types/music";

const Music = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [newReleases, setNewReleases] = useState<Track[]>([]);
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

  const handlePlayTrack = async (track: Track) => {
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
      toast.success(`Playing: ${track.title}`);
      
      // Dispatch event to audio player
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent animate-pulse">
              Discover Music
            </h1>
          </div>

          <div className="glass p-6 rounded-lg mb-8 animate-fade-in">
            <SearchForm 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              isSearching={isSearching}
            />

            <SearchResults 
              tracks={tracks} 
              handlePlayTrack={handlePlayTrack} 
            />
          </div>

          <NewReleases 
            newReleases={newReleases}
            loading={loading}
            handlePlayTrack={handlePlayTrack}
          />
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Music;
