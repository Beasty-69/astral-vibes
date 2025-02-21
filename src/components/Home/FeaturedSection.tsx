
const FeaturedSection = () => {
  const playlists = [
    { id: 1, title: "Today's Top Hits", description: "The hottest tracks right now" },
    { id: 2, title: "Discover Weekly", description: "Your personal playlist" },
    { id: 3, title: "Chill Vibes", description: "Relaxing music for your day" },
    { id: 4, title: "Rap Caviar", description: "Best hip-hop tracks" },
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Featured Playlists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="glass p-4 rounded-lg card-hover animate-fade-in"
            style={{ animationDelay: `${playlist.id * 100}ms` }}
          >
            <div className="aspect-square bg-nebula-400/10 rounded-md mb-4" />
            <h3 className="font-medium mb-1">{playlist.title}</h3>
            <p className="text-sm text-muted-foreground">{playlist.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
