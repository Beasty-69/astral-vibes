
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Track } from "@/types/music";

interface SearchResultsProps {
  tracks: Track[];
  handlePlayTrack: (track: Track) => void;
}

const SearchResults = ({ tracks, handlePlayTrack }: SearchResultsProps) => {
  if (!tracks.length) return null;

  return (
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
  );
};

export default SearchResults;
