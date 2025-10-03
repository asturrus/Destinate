import { Switch, Route } from "wouter";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/Home";
import Forum from "@/pages/Forum";
import SignIn from "@/pages/SignIn";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/forum" component={Forum} />
      <Route path="/signin" component={SignIn} />
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