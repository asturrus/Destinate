import { Switch, Route } from "wouter";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/Home";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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