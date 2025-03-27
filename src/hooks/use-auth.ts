import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export const useAuth = () => {
  const { user } = useUser();
  const [showSignIn, setShowSignIn] = useState(false);

  const requireAuth = (callback: () => void) => {
    if (!user) {
      setShowSignIn(true); // Show sign-in modal if not logged in
    } else {
      callback(); // Proceed if authenticated
    }
  };

  return { requireAuth, showSignIn, setShowSignIn };
};
