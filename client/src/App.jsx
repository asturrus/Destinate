import { Switch, Route } from "wouter";
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
  return <Router />;
}

export default App;