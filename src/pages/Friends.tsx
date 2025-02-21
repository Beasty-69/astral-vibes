
import { useState } from "react";
import { UserPlus, Search as SearchIcon, MessageCircle, Music } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const friends = [
    { id: 1, name: "Alex Johnson", online: true, currentTrack: "Starlight - Taylor Swift", avatar: null },
    { id: 2, name: "Sarah Williams", online: true, currentTrack: "Blinding Lights - The Weeknd", avatar: null },
    { id: 3, name: "Mike Brown", online: false, lastSeen: "2 hours ago", avatar: null },
  ];

  const suggestions = [
    { id: 4, name: "Emma Davis", mutualFriends: 3, avatar: null },
    { id: 5, name: "James Wilson", mutualFriends: 5, avatar: null },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold">Friends</h1>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search friends..."
                className="w-full md:w-64 h-10 pl-10 pr-4 bg-card glass rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold mb-4">Online Friends</h2>
              <div className="space-y-4">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="glass p-4 rounded-lg flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-nebula-400/10" />
                      {friend.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{friend.name}</h3>
                      {friend.currentTrack ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Music size={14} />
                          <span>{friend.currentTrack}</span>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Last seen {friend.lastSeen}
                        </p>
                      )}
                    </div>
                    <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                      <MessageCircle size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold mb-4 mt-8">Friend Suggestions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="glass p-4 rounded-lg flex items-center gap-4 animate-fade-in"
                  >
                    <div className="w-12 h-12 rounded-full bg-nebula-400/10" />
                    <div className="flex-1">
                      <h3 className="font-medium">{suggestion.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.mutualFriends} mutual friends
                      </p>
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors">
                      <UserPlus size={16} />
                      <span className="text-sm font-medium">Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-lg p-6 h-fit">
              <h2 className="text-xl font-semibold mb-4">Group Sessions</h2>
              <p className="text-muted-foreground mb-6">
                Listen together with friends in real-time.
              </p>
              <button className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg transition-colors hover:bg-primary/90">
                Start a Session
              </button>
            </div>
          </div>
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Friends;
