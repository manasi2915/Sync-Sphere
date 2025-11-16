import { Navigate } from "react-router-dom";
import React from "react";

export default function AdminRoute({ children }) {
  const [user, setUser] = React.useState(undefined);

  React.useEffect(() => {
    const stored = localStorage.getItem("sync_user"); // << FIXED
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      setUser(null);
    }
  }, []);

  if (user === undefined) return null; // Wait for load

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
}
