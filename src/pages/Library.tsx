
import { useState } from "react";
import { Plus, Clock, Music, ListMusic } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";

const Library = () => {
  const [activeTab, setActiveTab] = useState<'playlists' | 'songs'>('playlists');

  const playlists = [
    { id: 1, name: "Favorite Songs", tracks: 123, imageUrl: null },
    { id: 2, name: "Workout Mix", tracks: 45, imageUrl: null },
    { id: 3, name: "Chill Vibes", tracks: 67, imageUrl: null },
  ];

  const songs = [
    { id: 1, name: "Song 1", artist: "Artist 1", duration: "3:45" },
    { id: 2, name: "Song 2", artist: "Artist 2", duration: "4:20" },
    { id: 3, name: "Song 3", artist: "Artist 3", duration: "3:15" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-4xl font-bold">Your Library</h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors">
              <Plus size={20} />
              <span>Create Playlist</span>
            </button>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'playlists'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              onClick={() => setActiveTab('playlists')}
            >
              <div className="flex items-center gap-2">
                <ListMusic size={16} />
                <span>Playlists</span>
              </div>
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'songs'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
              onClick={() => setActiveTab('songs')}
            >
              <div className="flex items-center gap-2">
                <Music size={16} />
                <span>Songs</span>
              </div>
            </button>
          </div>

          {activeTab === 'playlists' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="glass p-4 rounded-lg card-hover animate-fade-in"
                >
                  <div className="aspect-square bg-nebula-400/10 rounded-md mb-4" />
                  <h3 className="font-medium mb-1">{playlist.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {playlist.tracks} tracks
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="text-left p-4">#</th>
                    <th className="text-left p-4">Title</th>
                    <th className="text-left p-4 hidden md:table-cell">Artist</th>
                    <th className="text-right p-4">
                      <Clock size={16} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {songs.map((song, index) => (
                    <tr
                      key={song.id}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="p-4">{index + 1}</td>
                      <td className="p-4">{song.name}</td>
                      <td className="p-4 hidden md:table-cell">{song.artist}</td>
                      <td className="p-4 text-right">{song.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Library;
