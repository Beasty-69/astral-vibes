
import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import FriendsList from "@/components/friends/FriendsList";
import ChatWindow from "@/components/friends/ChatWindow";
import FriendSuggestions from "@/components/friends/FriendSuggestions";
import { Friend, Message } from "@/types/friends";

const Friends = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndFriends = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        
        const { data: friendships, error: friendsError } = await supabase
          .from('friendships')
          .select(`
            id,
            friend:profiles!friend_id(id, username)
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
  }, [toast]);

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUserId}`,
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  useEffect(() => {
    if (selectedChat && currentUserId) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from('messages')
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
  }, [selectedChat, currentUserId, toast]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || !currentUserId) return;

    const { error } = await supabase
      .from('messages')
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

  const selectedFriend = friends.find(f => f.id === selectedChat);

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
              <FriendsList
                friends={friends}
                selectedChat={selectedChat}
                onChatSelect={(friendId) => setSelectedChat(selectedChat === friendId ? null : friendId)}
              />

              {selectedChat && selectedFriend && (
                <ChatWindow
                  selectedFriend={selectedFriend}
                  messages={messages}
                  messageInput={messageInput}
                  currentUserId={currentUserId}
                  onClose={() => setSelectedChat(null)}
                  onMessageChange={setMessageInput}
                  onSendMessage={handleSendMessage}
                />
              )}
            </div>

            <FriendSuggestions />
          </div>
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Friends;
