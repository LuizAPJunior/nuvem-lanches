import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined); 

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return null; 
  if (!session) return <Navigate to="/" replace />;
  return children;
}

export default ProtectedRoute;