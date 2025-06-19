import type { AuthError as SupabaseAuthError } from "@supabase/supabase-js";
import { PostgrestError } from "@supabase/supabase-js";

export type AuthErrorType =
  | "InvalidCredentials"
  | "EmailNotConfirmed"
  | "InvalidEmail"
  | "WeakPassword"
  | "EmailInUse"
  | "DatabaseError"
  | "Default";

type CustomError = Error & {
  code?: string;
  error_description?: string;
  message?: string;
};

export const getAuthError = (
  error: SupabaseAuthError | PostgrestError | CustomError | null | undefined
): { type: AuthErrorType; message: string } => {
  if (!error) {
    return {
      type: "Default",
      message: "An error occurred. Please try again.",
    };
  }

  if ("code" in error) {
    switch (error.code) {
      case "23505":
      case "23503":
        return {
          type: "EmailInUse",
          message: "This email is already registered. Try signing in instead.",
        };
    }
  }

  if ("error_description" in error && error.error_description) {
    const errorMessage = error.error_description.toLowerCase();
    if (errorMessage.includes("user already registered")) {
      return {
        type: "EmailInUse",
        message: "This email is already registered. Try signing in instead.",
      };
    }
  }

  const errorMessage = ("message" in error ? error.message : "").toLowerCase();

  if (errorMessage.includes("invalid login credentials")) {
    return {
      type: "InvalidCredentials",
      message: "Invalid email or password. Please try again.",
    };
  }

  if (errorMessage.includes("email not confirmed")) {
    return {
      type: "EmailNotConfirmed",
      message: "Please verify your email before signing in.",
    };
  }

  if (errorMessage.includes("invalid email")) {
    return {
      type: "InvalidEmail",
      message: "Please enter a valid email address.",
    };
  }

  if (errorMessage.includes("password")) {
    return {
      type: "WeakPassword",
      message: "Password should be at least 6 characters long.",
    };
  }

  if (
    errorMessage.includes("email already registered") ||
    errorMessage.includes("email is already registered")
  ) {
    return {
      type: "EmailInUse",
      message: "This email is already registered. Try signing in instead.",
    };
  }

  return {
    type: "Default",
    message: "An error occurred. Please try again.",
  };
};
