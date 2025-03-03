import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";
import BackButton from "@/components/ui/back-button";

const Library = () => {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <BackButton />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Your Library
            </h1>
          </div>
          
          {/* Rest of the content */}
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Library;
