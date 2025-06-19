"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthSignIn } from "@/components/OAuthSignIn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "@/utils/auth";
import { toast } from "sonner";
import { useState } from "react";
import { getAuthError } from "@/utils/auth-errors";
import { Icons } from "@/components/Icons";
import { AuthError } from "@supabase/supabase-js";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await auth.login(email, password);
      router.push("/projects");
      router.refresh();
    } catch (error) {
      console.error("Auth error:", error);
      const { message } = getAuthError(error as AuthError);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Card className="w-96">
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription className="text-xs">Welcome Back</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            Don&apos;t have an account?{" "}
            <Link href="/create-account" className="text-blue-500">
              Create acoount
            </Link>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs text-blue-500">
                Forgot Password
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button className="w-full" type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign in
          </Button>
        </CardContent>
        <CardFooter>
          <OAuthSignIn />
        </CardFooter>
      </form>
    </Card>
  );
};
