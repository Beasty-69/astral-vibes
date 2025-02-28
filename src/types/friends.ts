
export interface Friend {
  id: string;
  name: string;
  online: boolean;
  currentTrack?: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}

export interface FriendSuggestion {
  id: string;
  name: string;
  mutualFriends?: number;
}
