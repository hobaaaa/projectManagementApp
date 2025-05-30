"use client";
import { Suspense, useState } from "react";
import { Icons } from "./Icons";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";
import { auth } from "@/utils/auth";
import { getAuthError } from "@/utils/auth-errors";
import { toast } from "sonner";

interface Props {
  redirectUrl?: string;
}
function OAuthButtons({ redirectUrl }: Props) {
  const [isloading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const nextUrl = redirectUrl || searchParams.get("next") || "/projects";
  const handleOauthSignIn = async (provider: "github" | "google") => {
    try {
      setIsLoading(true);
      await auth.signInWithOAuth(provider, nextUrl);
    } catch (error) {
      const { message } = getAuthError(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button
        variant="outline"
        type="button"
        onClick={() => handleOauthSignIn("github")}
        disabled={isloading}
      >
        <Icons.gitHub className="mr-2 h-4 w-4" />
        Github
      </Button>
      <Button
        variant="outline"
        type="button"
        onClick={() => handleOauthSignIn("google")}
        disabled={isloading}
      >
        <Icons.google className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
}

export function OAuthSignIn(props: Props) {
  return (
    <div className="w-full">
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center ">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" disabled>
              <Icons.gitHub className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button variant="outline" disabled>
              <Icons.google className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
        }
      >
        <OAuthButtons {...props} />
      </Suspense>
    </div>
  );
}
