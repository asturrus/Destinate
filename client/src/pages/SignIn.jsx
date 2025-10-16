import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "../lib/supabaseClient";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn() {
  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });


  const [, setLocation] = useLocation();
  const onSubmit = async (data) => {
    console.log("Sign in data:", data);

    const { email, password } = data;

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
if (error) {
  console.error("Error signing in:", error.message);
  alert(`Sign-in failed: ${error.message}`);
} else {
  console.log("Signed in successfully:", signInData);
  alert("Signed in successfully!");

  setLocation("/");
}
  };
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Logo and Theme Toggle */}
      <header className="w-full border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <Link href="/">
            <span className="text-2xl font-bold text-primary cursor-pointer" data-testid="text-logo">
              Destinate
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold" data-testid="text-title">Welcome back</h1>
            <p className="text-muted-foreground" data-testid="text-description">
              Sign in to your account to continue your journey
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        data-testid="input-email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        data-testid="input-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link href="/forgot-password">
                  <span className="text-sm text-primary hover:underline cursor-pointer" data-testid="link-forgot-password">
                    Forgot your password?
                  </span>
                </Link>
              </div>

              <Button type="submit" className="w-full" data-testid="button-submit">
                Sign In
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/signup">
              <span className="text-primary hover:underline cursor-pointer" data-testid="link-signup">
                Sign up
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
