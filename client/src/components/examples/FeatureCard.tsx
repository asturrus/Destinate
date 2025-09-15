import { ThemeProvider } from '../ThemeProvider'
import { FeatureCard } from '../FeatureCard'
import { Zap } from 'lucide-react'

export default function FeatureCardExample() {
  return (
    <ThemeProvider>
      <div className="p-8 bg-background">
        <FeatureCard 
          icon={Zap}
          title="Lightning Fast"
          description="Built with performance in mind for the best user experience."
        />
      </div>
    </ThemeProvider>
  )
}