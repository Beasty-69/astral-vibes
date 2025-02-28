
const RecentlyPlayed = () => {
  const tracks = [
    { id: 1, title: "Track 1", artist: "Artist 1" },
    { id: 2, title: "Track 2", artist: "Artist 2" },
    { id: 3, title: "Track 3", artist: "Artist 3" },
    { id: 4, title: "Track 4", artist: "Artist 4" },
    { id: 5, title: "Track 5", artist: "Artist 5" },
  ];

  return (
    <section className="mb-8 md:mb-12">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Recently Played</h2>
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-3 md:gap-4 min-w-max">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="min-w-[140px] sm:min-w-[180px] md:min-w-[200px] glass p-3 md:p-4 rounded-lg card-hover animate-fade-in"
              style={{ animationDelay: `${track.id * 100}ms` }}
            >
              <div className="aspect-square bg-nebula-400/10 rounded-md mb-3 md:mb-4" />
              <h3 className="font-medium mb-1 text-sm md:text-base truncate">{track.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyPlayed;
