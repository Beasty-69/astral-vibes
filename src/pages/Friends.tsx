
import { useState } from "react";
import { UserPlus, Search as SearchIcon, MessageCircle, Music, Send, X } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const friends = [
    { id: 1, name: "Alex Johnson", online: true, currentTrack: "Starlight - Taylor Swift", avatar: null, messages: [
      { id: 1, text: "Hey! Want to join my listening session?", sent: false, timestamp: "10:30 AM" },
      { id: 2, text: "Sure! Send me the code", sent: true, timestamp: "10:31 AM" },
    ]},
    { id: 2, name: "Sarah Williams", online: true, currentTrack: "Blinding Lights - The Weeknd", avatar: null, messages: [] },
    { id: 3, name: "Mike Brown", online: false, lastSeen: "2 hours ago", avatar: null, messages: [] },
  ];

  const suggestions = [
    { id: 4, name: "Emma Davis", mutualFriends: 3, avatar: null },
    { id: 5, name: "James Wilson", mutualFriends: 5, avatar: null },
  ];

  const generateSessionCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return code;
  };

  const handleSendMessage = (friendId: number) => {
    if (!messageInput.trim()) return;
    // Here you would typically send the message to a backend
    setMessageInput("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Friends</h1>
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
                    className={`glass p-4 rounded-lg flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] animate-fade-in 
                      ${selectedChat === friend.id ? 'bg-primary/10 border-primary/20' : ''}`}
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
                    <button 
                      className="p-2 hover:bg-white/5 rounded-full transition-colors"
                      onClick={() => setSelectedChat(selectedChat === friend.id ? null : friend.id)}
                    >
                      <MessageCircle size={20} />
                    </button>
                  </div>
                ))}
              </div>

              {selectedChat && (
                <div className="glass p-4 rounded-lg animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Chat with {friends.find(f => f.id === selectedChat)?.name}</h3>
                    <button 
                      className="p-1 hover:bg-white/5 rounded-full transition-colors"
                      onClick={() => setSelectedChat(null)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="h-64 overflow-y-auto mb-4 space-y-2">
                    {friends.find(f => f.id === selectedChat)?.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                          message.sent ? 'bg-primary/20 text-primary-foreground' : 'bg-white/5'
                        }`}>
                          <p className="text-sm">{message.text}</p>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 h-10 px-4 bg-card glass rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(selectedChat)}
                    />
                    <button
                      className="p-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-colors"
                      onClick={() => handleSendMessage(selectedChat)}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              )}

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

            <div className="glass rounded-lg p-6 h-fit space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Group Sessions</h2>
                <p className="text-muted-foreground mb-6">
                  Listen together with friends in real-time.
                </p>
                <button 
                  onClick={() => {
                    const code = generateSessionCode();
                    // Here you would typically create a new session
                  }}
                  className="w-full bg-gradient-to-r from-primary to-purple-600 text-primary-foreground font-medium py-3 rounded-lg transition-all hover:scale-[1.02]"
                >
                  Start a Session
                </button>
              </div>
              
              <div className="pt-6 border-t border-white/10">
                <h3 className="font-semibold mb-2">How to Join</h3>
                <p className="text-sm text-muted-foreground">
                  Ask your friend for their session code and enter it below to join their listening session.
                </p>
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Enter session code..."
                    className="w-full h-10 px-4 bg-card glass rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 mb-2"
                  />
                  <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-medium py-2 rounded-lg transition-colors">
                    Join Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Friends;
