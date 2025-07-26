import { supabase } from "./supabase";

export async function login(email, password) {
  console.log("Attempting login with:", { email, password: password ? "***" : "undefined" });
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("Supabase response:", { data, error });

  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentUser() {
  const {data: session, error} = await supabase.auth.getSession();
  if (!session.session) return null;
  if (error) throw new Error(error.message);
  return session.session?.user;
}

export async function signup(email, password) {
  console.log("Attempting signup with:", { email, password: password ? "***" : "undefined" });
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  console.log("Supabase signup response:", { data, error });

  if (error) throw new Error(error.message);
  return data;
}


