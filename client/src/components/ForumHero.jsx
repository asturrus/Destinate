export function ForumHero() {
  {/*Static Destinations*/}
  const destinations = [
    {name: "Tokyo, Japan", img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80"},
    {name: "Venice, Italy", img: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80"},
    {name: "Paris, France", img: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&q=80"},
    {name: "London, England", img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80"},
    {name: "Amsterdam, Netherlands", img: "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80"},
    {name: "Santorini, Greece", img: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80"},
  ];
    return (
        <section className="bg-indigo-600 text-white py-20 px-6 text-center rounded-b-2xl shadow-md">
          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Search for Places
          </h2>
    
          {/* Search bar */}
          <div className="flex justify-center items-center gap-2 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Find a place"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-300 transition">
              Enter
            </button>
          </div>

          {/*Popular Destinations*/}
          <div className="">
            <h2 className="">
              Popular Destinations
            </h2>
          </div>
        </section>
      );
}