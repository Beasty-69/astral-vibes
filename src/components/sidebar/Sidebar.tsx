
import { Home, Search, Library, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-60 p-6 bg-card glass">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Nebula
          </h1>
        </div>
        
        <nav className="space-y-1">
          <Link to="/" className="sidebar-link">
            <Home size={20} />
            Home
          </Link>
          <Link to="/search" className="sidebar-link">
            <Search size={20} />
            Search
          </Link>
          <Link to="/library" className="sidebar-link">
            <Library size={20} />
            Your Library
          </Link>
        </nav>

        <div className="mt-8 pt-8 border-t border-white/10">
          <button className="sidebar-link w-full justify-start">
            <Plus size={20} />
            Create Playlist
          </button>
        </div>

        <div className="mt-auto">
          <div className="glass rounded-lg p-4">
            <h3 className="text-sm font-medium mb-2">Get Premium</h3>
            <p className="text-xs text-muted-foreground">
              Listen without limits and ad-free.
            </p>
            <button className="mt-3 w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium transition-colors hover:bg-primary/90">
              Try Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
