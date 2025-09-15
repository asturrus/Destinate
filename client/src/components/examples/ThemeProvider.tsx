import { ThemeProvider } from '../ThemeProvider'

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-4 bg-background text-foreground">
        <h3 className="text-lg font-semibold">Theme Provider Active</h3>
        <p className="text-muted-foreground">This component provides theme context to the app.</p>
      </div>
    </ThemeProvider>
  )
}