import { useState } from "react";
import { Home, Search, Library, Plus, Menu, Users, Crown, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Search", href: "/search", icon: Search },
    { name: "Your Library", href: "/library", icon: Library },
    { name: "Friends", href: "/friends", icon: Users },
    { name: "Referrals", href: "/referrals", icon: Gift },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card glass"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-60 p-6 bg-card glass transform transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-40`}
      >
        <div className="flex flex-col h-full">
          <div className="mb-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Nebula
            </h1>
          </div>
          
          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="sidebar-link"
                onClick={() => setIsOpen(false)}
              >
                {item.icon && <item.icon size={20} />}
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-white/10">
            <button className="sidebar-link w-full justify-start">
              <Plus size={20} />
              Create Playlist
            </button>
          </div>

          <div className="mt-auto">
            <Link
              to="/subscription"
              className="glass rounded-lg p-4 block hover:scale-[1.02] transition-transform"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <Crown size={18} className="text-primary" />
                <h3>Get Premium</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Listen without limits and ad-free.
              </p>
              <button className="mt-3 w-full bg-primary text-primary-foreground rounded-md py-2 text-sm font-medium transition-colors hover:bg-primary/90">
                Try Now
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
