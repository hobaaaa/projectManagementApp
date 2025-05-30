import { createClient } from "./supabase/client";
import { users } from "@/utils/users";

const supabase = createClient();

export const auth = {
  signUp: async (email: string, password: string) => {
    //check if the user already exists
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    //if exists, throw error. user already esists
    if (existingUser) {
      throw new Error(
        "This email is already registered. Try logging in instead."
      );
    }
    if (error) {
      throw error;
    }
    //if not, signup user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (signUpError) {
      throw new Error("Failed to create user account.");
    }
    //if no user data , something went wrong
    if (!data.user) {
      throw new Error("Failed to create user account.");
    }
    //save user details
    if (data.user.identities?.length === 0) {
      try {
        await users.captureUserDetails(data.user);
      } catch (profileError) {
        // If profile creation fails, clean up the auth user
        console.error(
          "Profile creation error:",
          JSON.stringify(profileError, null, 2)
        );
        await supabase.auth.admin.deleteUser(data.user.id);
        throw profileError;
      }
    }
    return data;
  },
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (data.session) {
      await users.captureUserDetails(data.user);
    }
  },
  signInWithOAuth: async (provider: "github" | "google", nextUrl?: string) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${nextUrl || "/"}`,
      },
    });
    if (error) {
      throw error;
    }
    return data;
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw { message: error.message, status: error.status };
    }
  },
  resetPasswordRequest: async (email: string) => {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, provider")
      .eq("email", email)
      .single();
    if (userError && userError.code !== "PGRST116") {
      throw userError;
    }
    if (!user || user.provider !== "email") {
      return {
        success: true,
        message: "If an account exists, a password reset link will be sent.",
      };
    }

    const resetLink = `${location.origin}/auth/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: resetLink,
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: "If an account exists, a password reset link will be sent.",
    };
  },

  resetPassword: async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw { message: error.message, status: error.status };
    return data;
  },
};
