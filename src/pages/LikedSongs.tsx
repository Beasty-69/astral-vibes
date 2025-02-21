
import { useState } from "react";
import { Heart, Search as SearchIcon, Clock, PlayCircle } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";

const LikedSongs = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const likedSongs = [
    { id: 1, name: "Starlight", artist: "Taylor Swift", duration: "3:45", album: "Red" },
    { id: 2, name: "Blinding Lights", artist: "The Weeknd", duration: "4:20", album: "After Hours" },
    { id: 3, name: "Circles", artist: "Post Malone", duration: "3:35", album: "Hollywood's Bleeding" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end gap-8 mb-8">
            <div className="flex-shrink-0 w-48 h-48 rounded-lg bg-gradient-to-br from-primary/20 to-purple-600/20 glass p-6 flex items-center justify-center">
              <Heart className="w-24 h-24 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">PLAYLIST</h4>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Liked Songs
              </h1>
              <p className="text-muted-foreground">
                {likedSongs.length} songs
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="relative w-full md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search in liked songs..."
                className="w-full h-10 pl-10 pr-4 bg-card glass rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="glass rounded-lg overflow-hidden">
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
                {likedSongs.map((song, index) => (
                  <tr
                    key={song.id}
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <td className="p-4 w-12">
                      <div className="flex items-center">
                        <span className="group-hover:hidden">{index + 1}</span>
                        <PlayCircle size={16} className="hidden group-hover:block text-primary" />
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{song.name}</div>
                        <div className="text-sm text-muted-foreground">{song.artist}</div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{song.album}</td>
                    <td className="p-4 text-right text-muted-foreground">{song.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default LikedSongs;
