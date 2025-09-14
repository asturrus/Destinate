export default function Home() {
    return (
        <div className="flex flex-col items-center text-center">
            <section className="w-full bg-gradient-to-r from-blue-500 to purple-600 text-white py-20 px-6">
                <h1 className="text-4x1 md:text-6x1 font-bold mb-4">
                    Plan Your Next Trip
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-2x1 mx-auto">
                    Discover new destinations, create itineraries, and share your journey with other travelers.
                </p>
                <button className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg shadow hover:bg-yellow-500 transition">
                    Get Started
                </button>
            </section>

            <section className="py-16 px-6 max-w-6x1 w-full">
                <h2 className="text-3x1 font-semibold mb-8">
                    Popular Destinations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white shadow-lg rounded-x1 overflow-hidden">
                        <img src="/placeholder1.jpg" alt="Paris" className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="font-semibold text-xl">Paris</h3>
                            <p className="text-gray-600 text-sm">The city of lights and romance.</p>
                        </div>
                    </div>

                </div>
            </section>

        </div>

    );

}