import { useAuth } from "@/lib/auth";
import { Navigate } from "react-router-dom";
import Chat from "./Chat";
import { Loader2 } from "lucide-react";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return <Chat />;
}
