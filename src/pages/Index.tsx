
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import FeaturedSection from "@/components/Home/FeaturedSection";
import RecentlyPlayed from "@/components/Home/RecentlyPlayed";
import { useMediaQuery } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className={`${isMobile ? 'ml-0' : 'ml-60'} p-4 md:p-8 pb-24`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Welcome to Nebula</h1>
          <FeaturedSection />
          <RecentlyPlayed />
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Index;
