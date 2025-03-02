
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";
import { useUser } from '@/contexts/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AuthButton = () => {
  const { user, signOut, isLoading } = useUser();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className="opacity-50">
        <User size={20} />
      </Button>
    );
  }

  if (!user) {
    return (
      <Button 
        onClick={() => navigate('/auth')}
        variant="secondary"
        size="sm"
        className="mr-2"
      >
        <LogIn className="mr-2 h-4 w-4" />
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full">
          <User size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="px-3 py-2 text-sm font-medium">
          {user.email}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/library')}>
          Your Library
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/liked-songs')}>
          Liked Songs
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/subscription')}>
          Subscription
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={signOut}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AuthButton;
