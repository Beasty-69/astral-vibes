
import { useState, useEffect } from "react";
import { Search as SearchIcon } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user ID for demo without authentication
    const demoUserId = "00000000-0000-0000-0000-000000000000";
    setCurrentUserId(demoUserId);
    
    // Load sample friends for demo
    const sampleFriends: Friend[] = [
      {
        id: "11111111-1111-1111-1111-111111111111",
        name: "Alex Johnson",
        online: true,
        currentTrack: "Billie Jean - Michael Jackson"
      },
      {
        id: "22222222-2222-2222-2222-222222222222",
        name: "Taylor Swift",
        online: true,
      },
      {
        id: "33333333-3333-3333-3333-333333333333",
        name: "Ed Sheeran",
        online: false,
      }
    ];
    
    setFriends(sampleFriends);
    setLoading(false);
  }, []);

  // Setup real-time message subscription
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

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChat && currentUserId) {
      const fetchMessages = async () => {
        try {
          // For demo, we'll create some mock messages
          const mockMessages: Message[] = [
            {
              id: "msg1",
              content: "Hey there! How's it going?",
              sender_id: selectedChat,
              receiver_id: currentUserId,
              created_at: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: "msg2",
              content: "I'm doing great! Just listening to some music.",
              sender_id: currentUserId,
              receiver_id: selectedChat,
              created_at: new Date(Date.now() - 3500000).toISOString()
            },
            {
              id: "msg3",
              content: "What are you listening to?",
              sender_id: selectedChat,
              receiver_id: currentUserId,
              created_at: new Date(Date.now() - 3400000).toISOString()
            }
          ];
          
          setMessages(mockMessages);
        } catch (error) {
          console.error('Error fetching messages:', error);
          toast({
            title: "Error",
            description: "Could not fetch messages",
            variant: "destructive",
          });
        }
      };

      fetchMessages();
    }
  }, [selectedChat, currentUserId, toast]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || !currentUserId) return;

    // Create a temporary message ID
    const tempId = `temp-${Date.now()}`;
    
    // Create a new message object
    const newMessage: Message = {
      id: tempId,
      content: messageInput,
      sender_id: currentUserId,
      receiver_id: selectedChat,
      created_at: new Date().toISOString()
    };
    
    // Optimistically add to UI
    setMessages(prev => [...prev, newMessage]);
    
    // Clear input
    setMessageInput("");
    
    try {
      // In a real app, we would save to Supabase here
      console.log("Message sent:", newMessage);
      
      // For demo, we don't need to do the actual API call
      // const { error } = await supabase
      //   .from('messages')
      //   .insert({
      //     content: messageInput,
      //     sender_id: currentUserId,
      //     receiver_id: selectedChat,
      //   });
      
      // if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Could not send message",
        variant: "destructive",
      });
      
      // Remove the temporary message
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const selectedFriend = friends.find(f => f.id === selectedChat);

  const filteredFriends = searchQuery 
    ? friends.filter(friend => 
        friend.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : friends;

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
                friends={filteredFriends}
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
