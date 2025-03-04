
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSongLikes = () => {
  const toggleLike = async (songId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login to like songs");
        return;
      }
      
      const liked = await isLiked(songId);
      
      if (liked) {
        const { error } = await supabase
          .from("liked_songs")
          .delete()
          .eq("song_id", songId)
          .eq("user_id", user.id);
          
        if (error) {
          console.error("Error unliking song:", error);
          toast.error("Failed to unlike song");
          return;
        }
        
        toast.success("Removed from liked songs");
      } else {
        const { error } = await supabase
          .from("liked_songs")
          .insert({ 
            song_id: songId,
            user_id: user.id
          });
          
        if (error) {
          console.error("Error liking song:", error);
          toast.error("Failed to like song");
          return;
        }
        
        toast.success("Added to liked songs");
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update liked status");
    }
  };

  const isLiked = async (songId: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data, error } = await supabase
        .from("liked_songs")
        .select()
        .eq("song_id", songId)
        .eq("user_id", user.id)
        .maybeSingle();
        
      if (error) {
        console.error("Error checking like status:", error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error("Error checking like status:", error);
      return false;
    }
  };

  return { toggleLike, isLiked };
};
