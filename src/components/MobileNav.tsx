
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Home, 
  Search, 
  Library, 
  Heart, 
  Users, 
  Crown, 
  Gift, 
  Music, 
  ArrowLeft
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  
  const goBack = () => {
    navigate(-1);
  };

  const getNavClass = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center gap-3 px-4 py-3 text-base font-medium rounded-md transition-colors ${
      isActive
        ? "bg-primary/10 text-primary"
        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
    }`;
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 bg-card glass border-b border-white/10 px-4 py-3 flex items-center justify-between md:hidden">
        {location.pathname !== "/" && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack} 
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
        )}
        
        <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          Nebula
        </h1>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleMenu} 
          className="text-foreground"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-background/95 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`} 
        onClick={toggleMenu}
      >
        <div 
          className="h-full w-full max-w-xs bg-card glass border-r border-white/10 p-4 pt-16 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <nav className="space-y-1">
            <NavLink to="/" className={getNavClass} onClick={toggleMenu}>
              <Home size={20} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/search" className={getNavClass} onClick={toggleMenu}>
              <Search size={20} />
              <span>Search</span>
            </NavLink>
            <NavLink to="/library" className={getNavClass} onClick={toggleMenu}>
              <Library size={20} />
              <span>Your Library</span>
            </NavLink>
            <NavLink to="/music" className={getNavClass} onClick={toggleMenu}>
              <Music size={20} />
              <span>Discover</span>
            </NavLink>
            <div className="border-t border-white/10 my-4 pt-4">
              <NavLink to="/liked-songs" className={getNavClass} onClick={toggleMenu}>
                <Heart size={20} />
                <span>Liked Songs</span>
              </NavLink>
              <NavLink to="/friends" className={getNavClass} onClick={toggleMenu}>
                <Users size={20} />
                <span>Friends</span>
              </NavLink>
              <NavLink to="/subscription" className={getNavClass} onClick={toggleMenu}>
                <Crown size={20} />
                <span>Subscription</span>
              </NavLink>
              <NavLink to="/referrals" className={getNavClass} onClick={toggleMenu}>
                <Gift size={20} />
                <span>Referrals</span>
              </NavLink>
            </div>
          </nav>
        </div>
      </div>

      {/* Spacer for fixed header */}
      <div className="h-14 md:h-0"></div>
    </>
  );
};

export default MobileNav;
