import { ThemeProvider } from '../ThemeProvider'
import { Header } from '../Header'

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 p-8">
          <h3 className="text-lg font-semibold">Header Component</h3>
          <p className="text-muted-foreground">Responsive navigation with mobile menu and theme toggle.</p>
        </div>
      </div>
    </ThemeProvider>
  )
}