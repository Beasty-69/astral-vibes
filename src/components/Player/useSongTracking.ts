
import { supabase } from "@/integrations/supabase/client";

export const useSongTracking = () => {
  const trackPlayStart = async (songId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { error } = await supabase.from("play_history").insert({
        song_id: songId,
        played_duration: 0,
        completed: false,
        user_id: user.id
      });
      
      if (error) {
        console.error("Error tracking play start:", error);
      }
    } catch (error) {
      console.error("Failed to track play start:", error);
    }
  };

  const trackPlayCompletion = async (songId: string, duration: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { error } = await supabase.from("play_history").insert({
        song_id: songId,
        played_duration: Math.floor(duration),
        completed: true,
        user_id: user.id
      });
      
      if (error) {
        console.error("Error tracking play completion:", error);
      }
    } catch (error) {
      console.error("Failed to track play completion:", error);
    }
  };

  const trackPlayProgress = async (songId: string, duration: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { error } = await supabase.from("play_history").insert({
        song_id: songId,
        played_duration: Math.floor(duration),
        completed: false,
        user_id: user.id
      });
      
      if (error) {
        console.error("Error recording play progress:", error);
      }
    } catch (error) {
      console.error("Error tracking play progress:", error);
    }
  };

  return {
    trackPlayStart,
    trackPlayCompletion,
    trackPlayProgress
  };
};
