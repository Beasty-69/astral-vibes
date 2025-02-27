
import { useState, useEffect } from "react";
import { UserPlus, Search as SearchIcon, MessageCircle, Music, Send, X } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndFriends = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        
        // Fetch friends with accepted status
        const { data: friendships, error: friendsError } = await supabase
          .from('friendships')
          .select(`
            id,
            friend:friend_id(id, raw_user_meta_data->username),
            status
          `)
          .eq('user_id', user.id)
          .eq('status', 'accepted');

        if (friendsError) {
          console.error('Error fetching friends:', friendsError);
          toast({
            title: "Error",
            description: "Could not fetch friends list",
            variant: "destructive",
          });
          return;
        }

        if (friendships) {
          setFriends(friendships.map(f => ({
            id: f.friend.id,
            name: f.friend.username || 'Unknown User',
            online: true, // We'll implement real presence later
          })));
        }
      }
    };

    fetchUserAndFriends();

    // Subscribe to real-time updates for new messages
    const channel = supabase
      .channel('chat-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChat && currentUserId) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${selectedChat}),and(sender_id.eq.${selectedChat},receiver_id.eq.${currentUserId})`)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          toast({
            title: "Error",
            description: "Could not fetch messages",
            variant: "destructive",
          });
          return;
        }

        setMessages(data || []);
      };

      fetchMessages();
    }
  }, [selectedChat, currentUserId]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || !currentUserId) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        content: messageInput,
        sender_id: currentUserId,
        receiver_id: selectedChat,
      });

    if (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Could not send message",
        variant: "destructive",
      });
      return;
    }

    setMessageInput("");
  };

  const addFriend = async (friendId: string) => {
    if (!currentUserId) return;

    const { error } = await supabase
      .from('friendships')
      .insert({
        user_id: currentUserId,
        friend_id: friendId,
        status: 'pending'
      });

    if (error) {
      console.error('Error adding friend:', error);
      toast({
        title: "Error",
        description: "Could not send friend request",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Friend request sent!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Friends
            </h1>
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
                    className={`glass p-4 rounded-lg flex items-center gap-4 transition-all duration-300 hover:scale-[1.02]
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
                      {friend.currentTrack && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Music size={14} />
                          <span>{friend.currentTrack}</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedChat(selectedChat === friend.id ? null : friend.id)}
                    >
                      <MessageCircle size={20} />
                    </Button>
                  </div>
                ))}
              </div>

              {selectedChat && (
                <div className="glass p-4 rounded-lg animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">
                      Chat with {friends.find(f => f.id === selectedChat)?.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedChat(null)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  <div className="h-64 overflow-y-auto mb-4 space-y-2 p-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender_id === currentUserId ? 'bg-primary/20 text-primary-foreground' : 'bg-white/5'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
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
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={handleSendMessage}
                    >
                      <Send size={20} />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="glass rounded-lg p-6 h-fit space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Friend Suggestions</h2>
                <p className="text-muted-foreground mb-6">
                  Find and add new friends to chat with.
                </p>
                <div className="space-y-4">
                  {/* We'll implement friend suggestions in a future update */}
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

