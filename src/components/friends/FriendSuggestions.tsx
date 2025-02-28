
import { useState } from "react";
import { UserPlus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FriendSuggestion } from "@/types/friends";
import { useToast } from "@/hooks/use-toast";

const FriendSuggestions = () => {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([
    { id: "s1", name: "John Mayer", mutualFriends: 3 },
    { id: "s2", name: "Adele", mutualFriends: 1 },
    { id: "s3", name: "Drake", mutualFriends: 5 },
    { id: "s4", name: "Beyoncé", mutualFriends: 2 },
    { id: "s5", name: "Ed Sheeran", mutualFriends: 4 },
  ]);

  const handleAddFriend = (suggestion: FriendSuggestion) => {
    // Update the suggestion status to pending
    setSuggestions(prev => 
      prev.map(s => s.id === suggestion.id ? { ...s, status: 'pending' as const } : s)
    );
    
    // Show toast notification
    toast({
      title: "Friend request sent",
      description: `A friend request has been sent to ${suggestion.name}`,
    });
    
    // In a real app, we would send the request to the backend
    // For demo purposes, we'll automatically "accept" the request after 2 seconds
    setTimeout(() => {
      setSuggestions(prev => 
        prev.map(s => s.id === suggestion.id ? { ...s, status: 'accepted' as const } : s)
      );
      
      toast({
        title: "Friend request accepted",
        description: `${suggestion.name} accepted your friend request`,
      });
    }, 2000);
  };

  const handleRejectSuggestion = (suggestion: FriendSuggestion) => {
    // Remove the suggestion from the list
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    toast({
      title: "Suggestion dismissed",
      description: `You won't see ${suggestion.name} in suggestions anymore`,
    });
  };

  return (
    <div className="glass rounded-lg p-6 h-fit space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Friend Suggestions</h2>
        <p className="text-muted-foreground mb-6">
          Find and add new friends to chat with.
        </p>
        {suggestions.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No more suggestions at the moment.
          </div>
        ) : (
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
                <div className="flex gap-2">
                  {!suggestion.status ? (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddFriend(suggestion)}
                      >
                        <UserPlus size={16} />
                        <span className="ml-1">Add</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRejectSuggestion(suggestion)}
                      >
                        <X size={16} />
                      </Button>
                    </>
                  ) : suggestion.status === 'pending' ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled
                    >
                      <span className="ml-1">Pending</span>
                    </Button>
                  ) : suggestion.status === 'accepted' ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20"
                      disabled
                    >
                      <Check size={16} />
                      <span className="ml-1">Added</span>
                    </Button>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendSuggestions;
