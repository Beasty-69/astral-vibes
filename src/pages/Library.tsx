
import { useState } from "react";
import { Plus, Clock, Music, ListMusic, Edit2, Trash2, X } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Playlist {
  id: number;
  name: string;
  tracks: number;
  imageUrl: string | null;
}

const Library = () => {
  const [activeTab, setActiveTab] = useState<'playlists' | 'songs'>('playlists');
  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: 1, name: "Favorite Songs", tracks: 123, imageUrl: null },
    { id: 2, name: "Workout Mix", tracks: 45, imageUrl: null },
    { id: 3, name: "Chill Vibes", tracks: 67, imageUrl: null },
  ]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const { toast } = useToast();

  const songs = [
    { id: 1, name: "Song 1", artist: "Artist 1", duration: "3:45" },
    { id: 2, name: "Song 2", artist: "Artist 2", duration: "4:20" },
    { id: 3, name: "Song 3", artist: "Artist 3", duration: "3:15" },
  ];

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a playlist name",
        variant: "destructive",
      });
      return;
    }

    const newPlaylist: Playlist = {
      id: Date.now(),
      name: newPlaylistName,
      tracks: 0,
      imageUrl: null,
    };

    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName("");
    toast({
      title: "Success",
      description: "Playlist created successfully",
    });
  };

  const handleUpdatePlaylist = () => {
    if (!editingPlaylist || !editingPlaylist.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a playlist name",
        variant: "destructive",
      });
      return;
    }

    setPlaylists(playlists.map(p => 
      p.id === editingPlaylist.id ? editingPlaylist : p
    ));
    setEditingPlaylist(null);
    toast({
      title: "Success",
      description: "Playlist updated successfully",
    });
  };

  const handleDeletePlaylist = (playlistId: number) => {
    setPlaylists(playlists.filter(p => p.id !== playlistId));
    toast({
      title: "Success",
      description: "Playlist deleted successfully",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <h1 className="text-4xl font-bold">Your Library</h1>
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors">
                  <Plus size={20} />
                  <span>Create Playlist</span>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Playlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Playlist name"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                  />
                  <Button onClick={handleCreatePlaylist} className="w-full">
                    Create Playlist
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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
                  className="glass p-4 rounded-lg card-hover animate-fade-in group relative"
                >
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                          onClick={() => setEditingPlaylist(playlist)}
                        >
                          <Edit2 size={16} />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Playlist</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <Input
                            placeholder="Playlist name"
                            value={editingPlaylist?.name || ""}
                            onChange={(e) => setEditingPlaylist(editingPlaylist ? {
                              ...editingPlaylist,
                              name: e.target.value
                            } : null)}
                          />
                          <Button onClick={handleUpdatePlaylist} className="w-full">
                            Update Playlist
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <button
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      onClick={() => handleDeletePlaylist(playlist.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
