import { FeatureCard } from "./FeatureCard";
import { Zap, Shield, Smartphone, Code, Palette, Globe } from "lucide-react";

export function Features() {
  // todo: remove mock functionality
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with Vite and modern React patterns for blazing fast development and runtime speed."
    },
    {
      icon: Shield,
      title: "Type Safe",
      description: "Built with TypeScript to catch errors early and provide excellent developer experience with full IDE support."
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description: "Responsive design that looks beautiful on all devices, from mobile phones to desktop computers."
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Clean, maintainable code with modern React hooks, components, and development tools."
    },
    {
      icon: Palette,
      title: "Customizable",
      description: "Easily customize colors, themes, and components with Tailwind CSS utility classes."
    },
    {
      icon: Globe,
      title: "Production Ready",
      description: "Optimized build process and deployment-ready configuration for modern web hosting platforms."
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4" data-testid="text-features-title">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-features-description">
            Everything you need to build modern, scalable web applications with confidence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}