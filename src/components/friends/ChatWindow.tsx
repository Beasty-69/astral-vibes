
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Message, Friend } from "@/types/friends";

interface ChatWindowProps {
  selectedFriend: Friend | undefined;
  messages: Message[];
  messageInput: string;
  currentUserId: string | null;
  onClose: () => void;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
}

const ChatWindow = ({
  selectedFriend,
  messages,
  messageInput,
  currentUserId,
  onClose,
  onMessageChange,
  onSendMessage,
}: ChatWindowProps) => {
  return (
    <div className="glass p-4 rounded-lg animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">
          Chat with {selectedFriend?.name}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
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
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
        />
        <Button
          variant="secondary"
          size="icon"
          onClick={onSendMessage}
        >
          <Send size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
