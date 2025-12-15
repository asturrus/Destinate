import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useLocation } from "wouter";
import { supabase } from "@/lib/supabaseClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Map, LogOut } from "lucide-react";

export function Header() {
  const [user, setUser] = useState(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLocation("/");
  };

  const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return "?";
    const parts = nameOrEmail.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = user?.user_metadata?.full_name
    ? getInitials(user.user_metadata.full_name)
    : getInitials(user?.email);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Destinations', href: '#features' },
    { name: 'Forum', href: '/forum' },
    { name: 'Stocks', href: '/stock-management'},
    { name: 'About', href: '#about' },
  ];

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b z-50">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/">
              <span className="text-2xl font-bold text-primary cursor-pointer" data-testid="text-logo">
                Destinate
              </span>
            </Link>
          </div>

          <div className="flex items-baseline space-x-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors hover-elevate"
                data-testid={`link-nav-${item.name.toLowerCase()}`}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold hover:opacity-80 transition"
                    data-testid="button-account-menu"
                  >
                    {initials}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none" data-testid="text-user-name">
                        {user?.user_metadata?.full_name || user?.user_metadata?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground" data-testid="text-user-email">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/itineraries" className="flex items-center cursor-pointer" data-testid="link-my-itineraries">
                      <Map className="mr-2 h-4 w-4" />
                      <span>My Itineraries</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive cursor-pointer"
                    data-testid="button-sign-out"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/signin">
                <Button variant="ghost" data-testid="button-sign-in">
                  Sign In
                </Button>
              </Link>
            )}
            <Link href="/itineraries">
              <Button data-testid="button-get-started">
                Plan your trip
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
