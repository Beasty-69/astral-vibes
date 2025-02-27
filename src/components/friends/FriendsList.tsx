
import { UserPlus, Music, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Friend } from "@/types/friends";

interface FriendsListProps {
  friends: Friend[];
  selectedChat: string | null;
  onChatSelect: (friendId: string) => void;
}

const FriendsList = ({ friends, selectedChat, onChatSelect }: FriendsListProps) => {
  return (
    <div className="space-y-6">
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
              onClick={() => onChatSelect(friend.id)}
            >
              <MessageCircle size={20} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
