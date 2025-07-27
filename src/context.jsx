import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "./db/apiAuth";
import { supabase } from "./db/supabase";

const UrlContext = createContext();

const UrlProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      
      // First, check if there's a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.log("No valid session found, clearing user state");
        setUser(null);
        setIsAuthenticated(false);
        return;
      }

      // Get the current user
      const currentUser = await getCurrentUser();
      
      if (currentUser && currentUser.email) {
        console.log("Setting authenticated user:", currentUser.email);
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        console.log("No valid user found, clearing state");
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log("Error fetching user:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        } else if (event === 'TOKEN_REFRESHED') {
          await fetchUser();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UrlContext.Provider value={{user, loading, isAuthenticated, fetchUser}}>
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => {
  return useContext(UrlContext);
};

export default UrlProvider;
