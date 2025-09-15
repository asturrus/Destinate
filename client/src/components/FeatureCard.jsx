import { Card, CardContent } from "@/components/ui/card";

export function FeatureCard({ icon: Icon, title, description, backgroundImage, className = "" }) {
  
  return (
    <Card className={`hover-elevate transition-all duration-200 relative overflow-hidden min-h-[200px] ${className}`} data-testid={`card-feature-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      {/* Background Image */}
      {backgroundImage ? (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700" />
      )}
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50" />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2" data-testid={`text-feature-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {title}
            </h3>
            <p className="text-gray-200" data-testid={`text-feature-description-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}