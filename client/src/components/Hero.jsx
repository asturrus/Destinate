import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroBackground from "@assets/generated_images/Modern_hero_background_gradient_fbe282f2.png";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6" data-testid="text-hero-title">
          
          {" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            React & Tailwind
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto" data-testid="text-hero-description">
          Create beautiful, responsive web applications with the power of React and the flexibility of Tailwind CSS. 
          Start building your next project today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-white/90 text-black hover:bg-white backdrop-blur-sm border border-white/20"
            data-testid="button-hero-get-started"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            data-testid="button-hero-watch-demo"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>
        
        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
          <div className="text-center" data-testid="stat-developers">
            <div className="text-3xl font-bold">10K+</div>
            <div className="text-gray-300">Developers</div>
          </div>
          <div className="text-center" data-testid="stat-projects">
            <div className="text-3xl font-bold">50K+</div>
            <div className="text-gray-300">Projects Built</div>
          </div>
          <div className="text-center" data-testid="stat-companies">
            <div className="text-3xl font-bold">500+</div>
            <div className="text-gray-300">Companies</div>
          </div>
        </div>
      </div>
    </section>
  );
}