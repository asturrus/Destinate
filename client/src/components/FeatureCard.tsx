import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, className = "" }: FeatureCardProps) {
  return (
    <Card className={`hover-elevate transition-all duration-200 ${className}`} data-testid={`card-feature-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-card-foreground mb-2" data-testid={`text-feature-title-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {title}
            </h3>
            <p className="text-muted-foreground" data-testid={`text-feature-description-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}