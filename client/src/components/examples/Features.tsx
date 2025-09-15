import { ThemeProvider } from '../ThemeProvider'
import { Features } from '../Features'

export default function FeaturesExample() {
  return (
    <ThemeProvider>
      <div className="bg-background">
        <Features />
      </div>
    </ThemeProvider>
  )
}