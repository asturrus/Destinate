import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
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
import { CheckCircle2 } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Password reset requested for:", data.email);
    setIsSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center p-4 min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md space-y-6">
          {!isSubmitted ? (
            <>
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold" data-testid="text-title">Forgot your password?</h1>
                <p className="text-muted-foreground" data-testid="text-description">
                  No worries! Enter your email and we'll send you a reset link
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

                  <Button type="submit" className="w-full" data-testid="button-submit">
                    Send Reset Link
                  </Button>
                </form>
              </Form>

              <div className="text-center">
                <Link href="/signin">
                  <span className="text-sm text-primary hover:underline cursor-pointer" data-testid="link-back-to-signin">
                    Back to Sign In
                  </span>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-primary" data-testid="icon-success" />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold" data-testid="text-success-title">Check your email</h1>
                <p className="text-muted-foreground" data-testid="text-success-description">
                  We've sent a password reset link to <strong>{form.getValues("email")}</strong>
                </p>
              </div>
              <Link href="/signin">
                <Button className="w-full" data-testid="button-back-to-signin">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
  );
}
