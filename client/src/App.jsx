import { Switch, Route } from "wouter";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/Home";
import Forum from "@/pages/Forum"

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/Forum" component={Forum} />
      {/* Future routes can be added here */}
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Router />
    </ThemeProvider>
  );
}

export default App;