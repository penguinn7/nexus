"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthResult {
  error?: string;
  needsVerification?: boolean;
}

function validateEmail(email: string) {
  const e = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
    return { email: null as string | null, error: "Enter a valid email address." };
  }
  return { email: e, error: null as string | null };
}

function validatePassword(password: string) {
  if (password.length < 8) {
    return { password: null as string | null, error: "Password must be at least 8 characters." };
  }
  return { password, error: null as string | null };
}

export async function loginAction(formData: FormData): Promise<AuthResult> {
  const rawEmail = formData.get("email")?.toString() ?? "";
  const { email, error: emailErr } = validateEmail(rawEmail);
  if (emailErr) return { error: emailErr };
  const password = formData.get("password")?.toString() ?? "";
  if (!password) return { error: "Enter your password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: email!, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      return { error: "Please verify your email address before signing in." };
    }
    if (error.message.toLowerCase().includes("invalid login credentials")) {
      return { error: "Incorrect email or password." };
    }
    return { error: error.message };
  }

  redirect("/workspace");
}

export async function signupAction(formData: FormData): Promise<AuthResult> {
  const rawEmail = formData.get("email")?.toString() ?? "";
  const fullName = formData.get("full_name")?.toString().trim() ?? null;
  const { email, error: emailErr } = validateEmail(rawEmail);
  if (emailErr) return { error: emailErr };
  const { password, error: passErr } = validatePassword(formData.get("password")?.toString() ?? "");
  if (passErr) return { error: passErr };

  const isLocal = process.env.NODE_ENV === "development";
  const origin = isLocal ? "http://localhost:3000" : process.env.NEXTAUTH_URL ?? "";

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: email!,
    password: password!,
    options: {
      data: { full_name: fullName ?? undefined },
      emailRedirectTo: `${origin}/auth/confirm`,
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "An account with this email already exists. Try signing in." };
    }
    return { error: error.message };
  }

  return { needsVerification: true };
}