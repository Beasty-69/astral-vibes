import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import BackButton from "@/components/ui/back-button";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setSearchResults([
        { id: 1, title: "Song 1", artist: "Artist 1" },
        { id: 2, title: "Song 2", artist: "Artist 2" },
        { id: 3, title: "Song 3", artist: "Artist 3" },
      ]);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <BackButton />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Search
            </h1>
          </div>
          
          <div className="glass p-6 rounded-lg mb-8">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                  type="text"
                  placeholder="Search for songs, artists, or albums..."
                  className="w-full h-10 pl-10 pr-4 bg-card glass rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors"
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
              >
                {isSearching ? "Searching..." : "Search"}
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Search Results</h2>
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="p-4 glass rounded-lg hover:bg-card/60 transition-colors"
                    >
                      <h3 className="font-medium">{result.title}</h3>
                      <p className="text-sm text-muted-foreground">{result.artist}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 glass rounded-lg">
              <h3 className="font-medium mb-2">Top Genres</h3>
              <div className="flex flex-wrap gap-2">
                {["Pop", "Rock", "Hip Hop", "Electronic", "Jazz", "Classical"].map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="p-4 glass rounded-lg">
              <h3 className="font-medium mb-2">Trending</h3>
              <ul className="space-y-2">
                {["Trending Song 1", "Trending Song 2", "Trending Song 3"].map((song, index) => (
                  <li key={index} className="text-sm">{song}</li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 glass rounded-lg">
              <h3 className="font-medium mb-2">New Releases</h3>
              <ul className="space-y-2">
                {["New Release 1", "New Release 2", "New Release 3"].map((release, index) => (
                  <li key={index} className="text-sm">{release}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Search;
