
import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import MiniPlayer from "@/components/Player/MiniPlayer";

const Search = () => {
  const [query, setQuery] = useState("");

  const categories = [
    { id: 1, name: "Hip Hop", color: "from-purple-500 to-pink-500" },
    { id: 2, name: "Rock", color: "from-red-500 to-orange-500" },
    { id: 3, name: "Jazz", color: "from-blue-500 to-teal-500" },
    { id: 4, name: "Electronic", color: "from-green-500 to-emerald-500" },
    { id: 5, name: "Classical", color: "from-yellow-500 to-amber-500" },
    { id: 6, name: "R&B", color: "from-pink-500 to-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-0 md:ml-60 p-4 md:p-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative mb-8">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="What do you want to listen to?"
              className="w-full h-12 pl-12 pr-4 bg-card glass rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <h2 className="text-2xl font-bold mb-6">Browse All</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="aspect-square rounded-lg overflow-hidden card-hover"
              >
                <div className={`w-full h-full bg-gradient-to-br ${category.color} p-4 flex items-end`}>
                  <h3 className="text-lg font-bold">{category.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <MiniPlayer />
    </div>
  );
};

export default Search;
