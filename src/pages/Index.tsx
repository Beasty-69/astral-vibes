
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import FeaturedSection from "@/components/Home/FeaturedSection";
import RecentlyPlayed from "@/components/Home/RecentlyPlayed";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-60 p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Welcome to Nebula</h1>
          <FeaturedSection />
          <RecentlyPlayed />
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Index;
