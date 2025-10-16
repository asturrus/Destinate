import { useEffect, useState }from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { ThemeProvider } from "@/components/ThemeProvider";
import{ supabase } from "@/lib/supabaseClient";
import Home from "@/pages/Home";
import Forum from "@/pages/Forum";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/forum" component={Forum} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/forgot-password" component={ForgotPassword} />
      {/* Future routes can be added here */}
    </Switch>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Restore session on refresh
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLocation("/signin");
  };

  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return "?";
    const parts = nameOrEmail.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials =
    user?.user_metadata?.full_name
      ? getInitials(user.user_metadata.full_name)
      : getInitials(user?.email);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header visible across all pages */}
        <header className="w-full border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <Link href="/">
              <span className="text-2xl font-bold text-primary cursor-pointer">
                Destinate
              </span>
            </Link>

            {user ? (
              <button
                onClick={handleSignOut}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold hover:opacity-80 transition"
                title="Sign Out"
              >
                {initials}
              </button>
            ) : (
              <Link href="/signin">
                <span className="text-sm font-medium text-primary hover:underline cursor-pointer">
                  Sign In
                </span>
              </Link>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <Router />
        </main>
      </div>
    </ThemeProvider>
  );
}