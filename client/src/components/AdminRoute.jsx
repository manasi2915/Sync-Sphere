import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const [user, setUser] = React.useState(undefined);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("AdminRoute localStorage error:", err);
      setUser(null);
    }
  }, []);

  // Wait for localStorage load
  if (user === undefined) return null;

  // Not logged in → send to login
  if (!user) return <Navigate to="/login" replace />;

  // Logged in but not admin → send home
  if (user.role !== "admin") return <Navigate to="/" replace />;

  // Admin → allow
  return children;
}
