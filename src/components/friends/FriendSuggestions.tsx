
import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FriendSuggestion } from "@/types/friends";
import { useToast } from "@/hooks/use-toast";

const FriendSuggestions = () => {
  const { toast } = useToast();
  const [suggestions] = useState<FriendSuggestion[]>([
    { id: "s1", name: "John Mayer", mutualFriends: 3 },
    { id: "s2", name: "Adele", mutualFriends: 1 },
    { id: "s3", name: "Drake", mutualFriends: 5 },
  ]);

  const handleAddFriend = (suggestion: FriendSuggestion) => {
    toast({
      title: "Friend request sent",
      description: `A friend request has been sent to ${suggestion.name}`,
    });
  };

  return (
    <div className="glass rounded-lg p-6 h-fit space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Friend Suggestions</h2>
        <p className="text-muted-foreground mb-6">
          Find and add new friends to chat with.
        </p>
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{suggestion.name}</p>
                {suggestion.mutualFriends && (
                  <p className="text-xs text-muted-foreground">
                    {suggestion.mutualFriends} mutual friend{suggestion.mutualFriends !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleAddFriend(suggestion)}
              >
                <UserPlus size={16} />
                <span className="ml-1">Add</span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendSuggestions;
