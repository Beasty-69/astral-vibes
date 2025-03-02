
import {
  Home as HomeIcon,
  Search as SearchIcon,
  Library as LibraryIcon,
  Heart as HeartIcon,
  Users as UsersIcon,
  Crown as CrownIcon,
  Gift as GiftIcon,
  MusicIcon
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import AuthButton from "@/components/auth/AuthButton";
import { useUser } from "@/contexts/UserContext";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useUser();

  const getNavClass = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-white/5 transition-colors ${
      isActive
        ? "bg-white/5 text-primary"
        : "text-muted-foreground hover:text-foreground"
    }`;
  };
  
  return (
    <aside className="fixed inset-y-0 left-0 w-60 bg-card glass border-r border-white/10 hidden md:block z-30">
      <div className="p-6 flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Nebula
        </h1>
        <AuthButton />
      </div>
      <nav className="px-3 py-2">
        <ul className="space-y-1">
          <li>
            <NavLink to="/" className={getNavClass}>
              <HomeIcon size={20} className="mr-3" />
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/search" className={getNavClass}>
              <SearchIcon size={20} className="mr-3" />
              <span>Search</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/library" className={getNavClass}>
              <LibraryIcon size={20} className="mr-3" />
              <span>Your Library</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/music" className={getNavClass}>
              <MusicIcon size={20} className="mr-3" />
              <span>Discover</span>
            </NavLink>
          </li>
          {user && (
            <>
              <li className="mt-6 pt-6 border-t border-white/10">
                <NavLink to="/liked-songs" className={getNavClass}>
                  <HeartIcon size={20} className="mr-3" />
                  <span>Liked Songs</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/friends" className={getNavClass}>
                  <UsersIcon size={20} className="mr-3" />
                  <span>Friends</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/subscription" className={getNavClass}>
                  <CrownIcon size={20} className="mr-3" />
                  <span>Subscription</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/referrals" className={getNavClass}>
                  <GiftIcon size={20} className="mr-3" />
                  <span>Referrals</span>
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
