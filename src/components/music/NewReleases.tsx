
import { Disc, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Track } from "@/types/music";

interface NewReleasesProps {
  newReleases: Track[];
  loading: boolean;
  handlePlayTrack: (track: Track) => void;
}

const NewReleases = ({ newReleases, loading, handlePlayTrack }: NewReleasesProps) => {
  return (
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
  );
};

export default NewReleases;
