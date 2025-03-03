
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import AuthButton from "@/components/auth/AuthButton";
import { Button } from "@/components/ui/button";

const FeaturedSection = () => {
  return (
    <div className="p-6 glass rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Featured Playlists</h2>
      <p className="mb-4">Explore our hand-picked playlists for every mood.</p>
      {/* Add featured playlists here */}
    </div>
  );
};

const RecentlyPlayed = () => {
  return (
    <div className="mt-8 p-6 glass rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
      <p className="mb-4">Your recently played tracks and albums.</p>
      {/* Add recently played tracks here */}
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Nebula - Home";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center justify-between w-full md:w-auto">
            <h1 className="text-3xl md:text-4xl font-bold">Welcome to Nebula</h1>
            <div className="block md:hidden">
              <AuthButton />
            </div>
          </div>
        </div>
        
        {/* Rest of the page content */}
        <div className="max-w-7xl mx-auto">
          <FeaturedSection />
          <RecentlyPlayed />
          <div className="mt-8 p-6 glass rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Discover More Music</h2>
            <p className="mb-4">Explore millions of tracks on Deezer through our music discovery page.</p>
            <Button onClick={() => navigate('/music')}>Browse Music</Button>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 glass rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Connect with Friends</h2>
              <p className="mb-4">Chat with friends and listen to music together.</p>
              <Button onClick={() => navigate('/friends')}>Friends</Button>
            </div>
            
            <div className="p-6 glass rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Invite Friends</h2>
              <p className="mb-4">Share referral codes and earn rewards when friends join.</p>
              <Button onClick={() => navigate('/referrals')}>Get Referral Code</Button>
            </div>
          </div>

          <div className="mt-8 p-6 glass rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Upgrade Your Experience</h2>
            <p className="mb-4">Get premium features and enjoy ad-free music.</p>
            <Button onClick={() => navigate('/subscription')}>View Plans</Button>
          </div>
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Index;
