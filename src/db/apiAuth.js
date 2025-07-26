import { supabase } from "./supabase";

export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function signup(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentUser() {
  try {
    console.log("Getting current user...");
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.log("No authenticated user found:", error.message);
      return null;
    }

    console.log("Current user found:", user?.email);
    return user;
  } catch (error) {
    console.log("Error getting current user:", error.message);
    return null;
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}


