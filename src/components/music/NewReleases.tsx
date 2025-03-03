
import { Disc, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Track } from "@/types/music";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NewReleasesProps {
  newReleases: Track[];
  loading: boolean;
  handlePlayTrack: (track: Track) => void;
}

const NewReleases = ({ newReleases, loading, handlePlayTrack }: NewReleasesProps) => {
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  
  return (
    <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <h2 className="text-xl font-semibold mb-4">New Releases</h2>
      {loading ? (
        <div className="flex justify-center p-12">
          <span className="animate-spin h-12 w-12 text-primary">
            <Disc size={48} />
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {newReleases.slice(0, 8).map((track, index) => (
            <div 
              key={track.id}
              className={cn(
                "glass p-4 rounded-lg hover:bg-card/60 transition-all duration-300 transform",
                hoveredTrack === track.id ? "scale-105" : "scale-100",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
              onMouseEnter={() => setHoveredTrack(track.id)}
              onMouseLeave={() => setHoveredTrack(null)}
            >
              <div className="aspect-square overflow-hidden rounded-md mb-4 relative group">
                <img 
                  src={track.album.cover_medium || '/placeholder.svg'} 
                  alt={track.title} 
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handlePlayTrack(track)}
                    className="bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    <Play size={18} />
                  </Button>
                </div>
              </div>
              <h3 className="font-semibold truncate">{track.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{track.artist.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewReleases;
